#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import {basename, dirname, join, relative} from "node:path";
import {spawnSync} from "node:child_process";

const DEFAULT_OUT_DIR = "artifacts/narration/openai-cohesive/audio";
const DEFAULT_MODEL = "gpt-4o-mini-tts";
const DEFAULT_VOICE = "alloy";
const DEFAULT_FORMAT = "wav";
const DEFAULT_SPEED = 1;
const DEFAULT_ENDPOINT = "https://api.openai.com/v1/audio/speech";
const DEFAULT_TRANSCRIBE_MODEL = "gpt-4o-mini-transcribe";
const DEFAULT_TRANSCRIBE_ENDPOINT =
  "https://api.openai.com/v1/audio/transcriptions";
const DEFAULT_MASTER_NAME = "narration-master.wav";
const DEFAULT_TEXT_NAME = "narration-master.txt";

const PROMPT = `Voice Affect: Calm, low-key, self-assured — a senior engineer explaining at a whiteboard to a respected colleague. Quiet confidence, no presenter energy.

Tone: Matter-of-fact and friendly, with dry understatement. Opinions stated plainly and owned personally. Approval sounds like a nod, not applause ("This works really well").

Pacing: Measured and even, on the slower side of conversational. Short sentences, one idea at a time; never rush. Slow down slightly on definitions and key terms.

Emotion: Restrained; steady interest, not excitement. Mild warmth on praise, calm flatness on problems.

Pronunciation: Clear and deliberate. Technical terms (docker run, copy-on-write, PID 1, cgroup, namespace) articulated precisely, with slight emphasis on first mention.

Pauses: Treat each paragraph as a segment. Leave a natural, audible pause between paragraphs so the narration can be split back into scene clips later. Pauses, not intonation, carry the emphasis.`;

function usage() {
  console.log(`Usage: node scripts/openai-tts-cohesive.mjs <narrations.json> [options]

Generates one cohesive OpenAI TTS pass for the full script, then splits it back
into per-segment files and writes a manifest.

Input shape:
  [
    {"id": "intro_command", "text": "If you've spent any time around Docker..."}
  ]

Options:
  --out-dir <path>            Directory for split audio files. Default: ${DEFAULT_OUT_DIR}
  --manifest <path>           Output manifest JSON. Default: <out-dir>/../narrations-audio.json when out-dir is named audio.
  --master <path>             Output path for the full stitched narration WAV.
  --full-text <path>          Output path for the stitched narration text file.
  --api-key <key>             API key. Prefer OPENAI_API_KEY in the environment.
  --model <name>              Speech model for the master narration. Default: ${DEFAULT_MODEL}
  --voice <name>              Voice for the master narration. Default: ${DEFAULT_VOICE}
  --format <format>           Audio format. Default: ${DEFAULT_FORMAT}. Split generation currently requires wav.
  --speed <number>            Speech speed, 0.25 to 4.0. Default: ${DEFAULT_SPEED}
  --tone <text>               Tone/instructions for the full narration.
  --transcribe-model <name>   Model used to align split points. Default: ${DEFAULT_TRANSCRIBE_MODEL}
  --transcribe-endpoint <url> Override the transcription endpoint.
  --reuse-master              Skip TTS generation and reuse the existing master WAV at --master.
  --no-transcribe             Skip transcript alignment and split only from target durations in the input.
  --limit <number>            Use only the first N narrations for testing.
  --dry-run                   Print planned API calls without contacting OpenAI or writing audio.
  --help                      Show this help.

Notes:
  - Best results come from input items that also include totalDuration values.
  - When transcript alignment fails, the script falls back to totalDuration-based
    splitting if those durations are available.
  - ffmpeg must be installed to split the master WAV into per-segment files.
`)
}

function parseArgs(argv) {
  const args = {
    input: null,
    outDir: DEFAULT_OUT_DIR,
    manifest: null,
    master: null,
    fullText: null,
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: null,
    voice: null,
    format: null,
    speed: null,
    tone: null,
    transcribeModel: null,
    transcribeEndpoint: null,
    reuseMaster: false,
    noTranscribe: false,
    limit: null,
    dryRun: false,
  };
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (arg === "--no-transcribe") {
      args.noTranscribe = true;
      continue;
    }

    if (arg === "--reuse-master") {
      args.reuseMaster = true;
      continue;
    }

    if (
      [
        "--out-dir",
        "--manifest",
        "--master",
        "--full-text",
        "--api-key",
        "--model",
        "--voice",
        "--format",
        "--speed",
        "--tone",
        "--transcribe-model",
        "--transcribe-endpoint",
        "--limit",
      ].includes(arg)
    ) {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      const key =
        arg === "--out-dir"
          ? "outDir"
          : arg
              .slice(2)
              .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      args[key] = value;
      i += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positional.push(arg);
  }

  if (positional.length !== 1) {
    throw new Error("Expected exactly one narrations JSON input path.");
  }

  args.input = positional[0];
  args.limit = args.limit === null ? null : Number.parseInt(args.limit, 10);
  if (args.limit !== null && (!Number.isFinite(args.limit) || args.limit < 1)) {
    throw new Error("--limit must be a positive integer.");
  }

  args.speed = args.speed === null ? null : Number.parseFloat(args.speed);
  if (
    args.speed !== null &&
    (!Number.isFinite(args.speed) || args.speed < 0.25 || args.speed > 4)
  ) {
    throw new Error("--speed must be a number from 0.25 to 4.0.");
  }

  args.format = (args.format ?? DEFAULT_FORMAT).toLowerCase();
  if (args.format !== "wav") {
    throw new Error("Split generation currently requires --format wav.");
  }

  args.manifest = args.manifest ?? defaultManifestPath(args.outDir);
  args.master = args.master ?? join(dirname(args.manifest), DEFAULT_MASTER_NAME);
  args.fullText =
    args.fullText ?? join(dirname(args.manifest), DEFAULT_TEXT_NAME);

  return args;
}

function defaultManifestPath(outDir) {
  if (basename(outDir) === "audio") {
    return join(dirname(outDir), "narrations-audio.json");
  }

  return join(outDir, "narrations-audio.json");
}

function getSettings(data, args) {
  const settings =
    data && !Array.isArray(data) && typeof data === "object"
      ? (data.settings ?? {})
      : {};
  const speed = args.speed ?? numberSetting(settings.speed, DEFAULT_SPEED);

  if (!Number.isFinite(speed) || speed < 0.25 || speed > 4) {
    throw new Error("settings.speed must be a number from 0.25 to 4.0.");
  }

  const responseFormat = (
    args.format ??
    settings.format ??
    settings.response_format ??
    DEFAULT_FORMAT
  ).toLowerCase();
  if (responseFormat !== "wav") {
    throw new Error("Split generation currently requires wav output.");
  }

  return {
    endpoint: settings.endpoint ?? DEFAULT_ENDPOINT,
    transcribeEndpoint:
      args.transcribeEndpoint ??
      settings.transcribe_endpoint ??
      DEFAULT_TRANSCRIBE_ENDPOINT,
    model: args.model ?? settings.model ?? DEFAULT_MODEL,
    voice: args.voice ?? settings.voice ?? DEFAULT_VOICE,
    responseFormat,
    speed,
    instructions: args.tone ?? settings.tone ?? settings.instructions ?? PROMPT,
    transcribeModel:
      args.transcribeModel ??
      settings.transcribe_model ??
      settings.transcription_model ??
      DEFAULT_TRANSCRIBE_MODEL,
  };
}

function numberSetting(value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return Number.parseFloat(value);
}

function getNarrationItems(data) {
  const rawItems = Array.isArray(data) ? data : data?.narrations;

  if (!Array.isArray(rawItems)) {
    throw new Error(
      "Input must be an array of narration objects or an object with a narrations array.",
    );
  }

  const seenIds = new Set();

  return rawItems.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(
        `Narration item ${index + 1} must be an object with id and text.`,
      );
    }

    const id = String(item.id ?? "").trim();
    const text = normalizeText(item.text ?? "");
    const totalDuration = readOptionalDuration(item);

    if (!id) {
      throw new Error(`Narration item ${index + 1} is missing id.`);
    }

    if (!text) {
      throw new Error(`Narration item ${id} is missing text.`);
    }

    if (seenIds.has(id)) {
      throw new Error(`Duplicate narration id: ${id}`);
    }

    seenIds.add(id);
    return {id, text, totalDuration};
  });
}

function readOptionalDuration(item) {
  const value = item.totalDuration ?? item.duration ?? null;
  if (value === null || value === "") {
    return null;
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      `Narration item ${item.id ?? "<unknown>"} has an invalid duration value.`,
    );
  }

  return parsed;
}

function normalizeText(value) {
  return String(value)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .trim();
}

function buildMasterText(narrations) {
  return narrations.map((narration) => narration.text).join("\n\n");
}

function sanitizeFilePart(value) {
  return (
    String(value)
      .trim()
      .replace(/[^A-Za-z0-9._-]+/g, "-")
      .replace(/^-|-$/g, "") || "narration"
  );
}

function outputPath(outDir, item, format) {
  return join(outDir, `${sanitizeFilePart(item.id)}.${format}`);
}

function manifestPath(manifestFile, audioFile) {
  return relative(dirname(manifestFile), audioFile).replace(/\\/g, "/");
}

function requestBody(settings, input) {
  return {
    model: settings.model,
    voice: settings.voice,
    input,
    response_format: settings.responseFormat,
    speed: settings.speed,
    ...(settings.instructions ? {instructions: settings.instructions} : {}),
  };
}

async function callOpenAi(endpoint, apiKey, body) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI speech API failed (${response.status}): ${text}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function transcribeAudio(
  endpoint,
  apiKey,
  audioBuffer,
  fileName,
  model,
) {
  const form = new FormData();
  form.set("model", model);
  form.set("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  form.set(
    "file",
    new Blob([audioBuffer], {type: "audio/wav"}),
    basename(fileName),
  );

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `OpenAI transcription API failed (${response.status}): ${text}`,
    );
  }

  return await response.json();
}

function wavDurationSeconds(buffer) {
  if (
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WAVE"
  ) {
    throw new Error(
      "Generated audio is not a WAV file, so duration could not be read.",
    );
  }

  let offset = 12;
  let byteRate = null;
  let dataSize = null;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkDataOffset = offset + 8;

    if (chunkId === "fmt ") {
      byteRate = buffer.readUInt32LE(chunkDataOffset + 8);
    }

    if (chunkId === "data") {
      dataSize = chunkSize;
      break;
    }

    offset = chunkDataOffset + chunkSize + (chunkSize % 2);
  }

  if (!byteRate || !dataSize) {
    throw new Error(
      "Could not find WAV fmt/data chunks for duration calculation.",
    );
  }

  return Math.round((dataSize / byteRate) * 1000) / 1000;
}

function probeAudioDurationSeconds(audioPath) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      audioPath,
    ],
    {encoding: "utf8"},
  );

  if (result.status !== 0) {
    throw new Error(
      `ffprobe failed to read duration for ${audioPath}: ${result.stderr || result.stdout}`,
    );
  }

  const duration = Number.parseFloat(result.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`ffprobe returned an invalid duration for ${audioPath}.`);
  }

  return Math.round(duration * 1000) / 1000;
}

function normalizeToken(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

function tokenizeForAlignment(text) {
  return text
    .split(/\s+/)
    .map((token) => normalizeToken(token))
    .filter(Boolean);
}

function normalizeTranscriptWordTimes(words, masterDuration) {
  const maxEnd = words.reduce((max, word) => Math.max(max, word.end), 0);

  if (!Number.isFinite(maxEnd) || maxEnd <= 0) {
    throw new Error("Transcript word timestamps were not usable.");
  }

  if (maxEnd <= masterDuration * 1.5) {
    return words;
  }

  const ratio = maxEnd / masterDuration;

  if (ratio > 100 && ratio < 10000) {
    const scale = 1000;
    return words.map((word) => ({
      ...word,
      start: word.start / scale,
      end: word.end / scale,
    }));
  }

  return words;
}

function alignSegmentsFromTranscript(narrations, transcript, masterDuration) {
  const transcriptWords = Array.isArray(transcript?.words) ? transcript.words : [];
  const rawWords = transcriptWords
    .map((word, index) => ({
      index,
      raw: String(word.word ?? ""),
      token: normalizeToken(word.word ?? ""),
      start: Number(word.start),
      end: Number(word.end),
    }))
    .filter(
      (word) =>
        word.token &&
        Number.isFinite(word.start) &&
        Number.isFinite(word.end),
    );

  const words = normalizeTranscriptWordTimes(rawWords, masterDuration);

  if (words.length === 0) {
    throw new Error("Transcript did not contain word timestamps.");
  }

  const aligned = [];
  let cursor = 0;

  for (const narration of narrations) {
    const tokens = tokenizeForAlignment(narration.text);
    if (tokens.length === 0) {
      throw new Error(`Narration ${narration.id} has no alignable words.`);
    }

    let start = null;
    let end = null;
    let localCursor = cursor;
    let totalSkipped = 0;

    for (const token of tokens) {
      let matched = false;

      while (localCursor < words.length) {
        if (words[localCursor].token === token) {
          if (start === null) {
            start = words[localCursor].start;
          }
          end = words[localCursor].end;
          localCursor += 1;
          matched = true;
          break;
        }

        totalSkipped += 1;
        localCursor += 1;
      }

      if (!matched) {
        throw new Error(
          `Could not align narration ${narration.id} against the transcript.`,
        );
      }
    }

    if (start === null || end === null) {
      throw new Error(`Could not determine timing for narration ${narration.id}.`);
    }

    if (totalSkipped > Math.max(4, Math.floor(tokens.length * 0.35))) {
      throw new Error(
        `Transcript alignment drifted too far while matching narration ${narration.id}.`,
      );
    }

    aligned.push({id: narration.id, start, end});
    cursor = localCursor;
  }

  return finalizeTranscriptSegments(aligned, narrations, masterDuration);
}

function fallbackSegmentsFromDurations(narrations, masterDuration) {
  if (narrations.some((narration) => narration.totalDuration === null)) {
    throw new Error(
      "Duration fallback requires every narration item to define totalDuration or duration.",
    );
  }

  const totalTargetDuration = narrations.reduce(
    (sum, narration) => sum + narration.totalDuration,
    0,
  );

  if (!Number.isFinite(totalTargetDuration) || totalTargetDuration <= 0) {
    throw new Error("Duration fallback requires a positive total duration.");
  }

  const scale = masterDuration / totalTargetDuration;
  let cursor = 0;
  const segments = narrations.map((narration) => {
    const duration = narration.totalDuration * scale;
    const segment = {
      id: narration.id,
      start: cursor,
      end: cursor + duration,
    };
    cursor = segment.end;
    return segment;
  });

  if (segments.length > 0) {
    segments[segments.length - 1].end = masterDuration;
  }

  return segments;
}

function finalizeTranscriptSegments(segments, narrations, masterDuration) {
  const trailingPad = 0.12;
  let timelineCursor = 0;

  return segments.map((segment, index) => {
    const narration = narrations[index];
    const speechStart = Math.max(0, segment.start);
    const speechEnd = Math.min(masterDuration, segment.end + trailingPad);
    const totalDuration = narration.totalDuration ?? speechEnd - speechStart;
    const timelineStart = timelineCursor;
    const timelineEnd = timelineStart + totalDuration;
    timelineCursor = timelineEnd;

    return {
      id: segment.id,
      start: speechStart,
      end: Math.max(speechStart, speechEnd),
      timelineStart,
      timelineEnd,
      totalDuration,
    };
  });
}

function ensureFfmpegAvailable() {
  const check = spawnSync("ffmpeg", ["-version"], {stdio: "ignore"});
  if (check.error || check.status !== 0) {
    throw new Error(
      "ffmpeg is required to split cohesive narration audio into segment files.",
    );
  }
}

function splitAudio(masterPath, outPath, start, end) {
  const duration = Math.max(0, end - start);
  const command = [
    "-y",
    "-i",
    masterPath,
    "-ss",
    start.toFixed(3),
    "-t",
    duration.toFixed(3),
    "-c:a",
    "pcm_s16le",
    outPath,
  ];
  const result = spawnSync("ffmpeg", command, {encoding: "utf8"});
  if (result.status !== 0) {
    throw new Error(
      `ffmpeg failed while splitting ${basename(outPath)}: ${result.stderr || result.stdout}`,
    );
  }
}

function previewText(text) {
  return `${text.slice(0, 100)}${text.length > 100 ? "..." : ""}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!existsSync(args.input)) {
    throw new Error(`Input file not found: ${args.input}`);
  }

  const data = JSON.parse(readFileSync(args.input, "utf8"));
  const settings = getSettings(data, args);
  const narrations = getNarrationItems(data).slice(0, args.limit ?? undefined);
  const masterText = buildMasterText(narrations);

  if (!args.dryRun && !args.apiKey && !args.noTranscribe && args.reuseMaster) {
    throw new Error(
      "Missing OpenAI API key. Set OPENAI_API_KEY or pass --api-key to transcribe the reused master, or add --no-transcribe to use duration-only splitting.",
    );
  }

  if (!args.dryRun && !args.apiKey && !args.reuseMaster) {
    throw new Error(
      "Missing OpenAI API key. Set OPENAI_API_KEY or pass --api-key.",
    );
  }

  if (args.dryRun) {
    console.log(`[dry-run] master text -> ${args.fullText}`);
    console.log(`[dry-run] master audio -> ${args.master}`);
    if (args.reuseMaster) {
      console.log("[dry-run] reusing existing master audio; no TTS request");
    } else {
      console.log(
        JSON.stringify(
          {
            ...requestBody(settings, masterText),
            input: previewText(masterText),
          },
          null,
          2,
        ),
      );
    }
    console.log(`[dry-run] split audio dir -> ${args.outDir}`);
    console.log(`[dry-run] manifest -> ${args.manifest}`);
    console.log(
      `[dry-run] alignment -> ${args.noTranscribe ? "durations only" : `transcribe with ${settings.transcribeModel}`}`,
    );
    return;
  }

  mkdirSync(args.outDir, {recursive: true});
  mkdirSync(dirname(args.manifest), {recursive: true});
  mkdirSync(dirname(args.master), {recursive: true});
  mkdirSync(dirname(args.fullText), {recursive: true});

  writeFileSync(args.fullText, `${masterText}\n`, "utf8");

  let masterAudio;
  let masterDuration;

  if (args.reuseMaster) {
    if (!existsSync(args.master)) {
      throw new Error(`Master audio not found for --reuse-master: ${args.master}`);
    }
    masterAudio = readFileSync(args.master);
    masterDuration = probeAudioDurationSeconds(args.master);
    console.log(`Reused ${args.master}`);
    console.log(`Wrote ${args.fullText}`);
  } else {
    masterAudio = await callOpenAi(
      settings.endpoint,
      args.apiKey,
      requestBody(settings, masterText),
    );
    writeFileSync(args.master, masterAudio);
    masterDuration = probeAudioDurationSeconds(args.master);
    console.log(`Wrote ${args.master}`);
    console.log(`Wrote ${args.fullText}`);
  }

  let segments = null;

  if (!args.noTranscribe) {
    try {
      const transcript = await transcribeAudio(
        settings.transcribeEndpoint,
        args.apiKey,
        masterAudio,
        args.master,
        settings.transcribeModel,
      );
      segments = alignSegmentsFromTranscript(
        narrations,
        transcript,
        masterDuration,
      );
      console.log("Aligned split points from transcript word timestamps.");
    } catch (error) {
      console.warn(
        `Transcript alignment failed. Falling back to target durations. ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  if (segments === null) {
    segments = fallbackSegmentsFromDurations(narrations, masterDuration);
    console.warn(
      "Aligned split points from target durations. These cuts include any intentional hold time baked into totalDuration values.",
    );
  }

  ensureFfmpegAvailable();

  const manifestItems = [];

  for (let i = 0; i < narrations.length; i += 1) {
    const narration = narrations[i];
    const segment = segments[i];
    const audioPath = outputPath(args.outDir, narration, settings.responseFormat);
    splitAudio(args.master, audioPath, segment.start, segment.end);
    const clipDuration = Math.round((segment.end - segment.start) * 1000) / 1000;
    const totalDuration =
      Math.round(
        ((segment.totalDuration ?? narration.totalDuration ?? clipDuration) ?? clipDuration) *
          1000,
      ) / 1000;
    const timelineStart =
      segment.timelineStart === undefined
        ? null
        : Math.round(segment.timelineStart * 1000) / 1000;
    const timelineEnd =
      segment.timelineEnd === undefined
        ? null
        : Math.round(segment.timelineEnd * 1000) / 1000;
    manifestItems.push({
      id: narration.id,
      text: narration.text,
      duration: clipDuration,
      totalDuration,
      start: Math.round(segment.start * 1000) / 1000,
      end: Math.round(segment.end * 1000) / 1000,
      ...(timelineStart === null ? {} : {timelineStart}),
      ...(timelineEnd === null ? {} : {timelineEnd}),
      path: manifestPath(args.manifest, audioPath),
    });
    console.log(`Wrote ${audioPath}`);
  }

  writeFileSync(
    args.manifest,
    `${JSON.stringify(manifestItems, null, 2)}\n`,
    "utf8",
  );
  console.log(`Wrote ${args.manifest}`);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
