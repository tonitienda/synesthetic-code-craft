#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, dirname, join, relative} from 'node:path';

const DEFAULT_OUT_DIR = 'artifacts/narration/openai-audio/audio';
const DEFAULT_MODEL = 'gpt-4o-mini-tts';
const DEFAULT_VOICE = 'alloy';
const DEFAULT_FORMAT = 'wav';
const DEFAULT_SPEED = 1;
const DEFAULT_ENDPOINT = 'https://api.openai.com/v1/audio/speech';

function usage() {
  console.log(`Usage: node scripts/openai-tts.mjs <narrations.json> [options]

Generates one OpenAI TTS audio file per narration item and writes a manifest with durations.

Input shape:
  [
    {"id": "intro_command", "text": "If you've spent any time around Docker..."}
  ]

Options:
  --out-dir <path>          Directory for audio files. Default: ${DEFAULT_OUT_DIR}
  --manifest <path>         Output manifest JSON. Default: <out-dir>/../narrations-audio.json when out-dir is named audio.
  --api-key <key>           API key. Prefer OPENAI_API_KEY in the environment.
  --model <name>            Speech model for all narrations. Default: ${DEFAULT_MODEL}
  --voice <name>            Voice for all narrations. Default: ${DEFAULT_VOICE}
  --format <format>         Audio format. Default: ${DEFAULT_FORMAT}. Duration parsing currently requires wav.
  --speed <number>          Speech speed for all narrations, 0.25 to 4.0. Default: ${DEFAULT_SPEED}
  --tone <text>             Tone/instructions for all narrations.
  --limit <number>          Generate only the first N narrations for testing.
  --dry-run                 Print planned API calls without contacting OpenAI or writing audio.
  --help                    Show this help.

Example:
  OPENAI_API_KEY=... node scripts/openai-tts.mjs content/videos/example/narrations.json --out-dir artifacts/narration/example/audio --manifest artifacts/narration/example/narrations-audio.json --tone "Calm, precise, friendly." --speed 0.95
`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    outDir: DEFAULT_OUT_DIR,
    manifest: null,
    apiKey: process.env.OPENAI_API_KEY ?? '',
    model: null,
    voice: null,
    format: null,
    speed: null,
    tone: null,
    limit: null,
    dryRun: false,
  };
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }

    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (['--out-dir', '--manifest', '--api-key', '--model', '--voice', '--format', '--speed', '--tone', '--limit'].includes(arg)) {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }
      const key = arg === '--out-dir' ? 'outDir' : arg.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      args[key] = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positional.push(arg);
  }

  if (positional.length !== 1) {
    throw new Error('Expected exactly one narrations JSON input path.');
  }

  args.input = positional[0];
  args.limit = args.limit === null ? null : Number.parseInt(args.limit, 10);
  if (args.limit !== null && (!Number.isFinite(args.limit) || args.limit < 1)) {
    throw new Error('--limit must be a positive integer.');
  }

  args.speed = args.speed === null ? null : Number.parseFloat(args.speed);
  if (args.speed !== null && (!Number.isFinite(args.speed) || args.speed < 0.25 || args.speed > 4)) {
    throw new Error('--speed must be a number from 0.25 to 4.0.');
  }

  args.format = (args.format ?? DEFAULT_FORMAT).toLowerCase();
  if (args.format !== 'wav') {
    throw new Error('Duration manifest generation currently requires --format wav.');
  }

  args.manifest = args.manifest ?? defaultManifestPath(args.outDir);

  return args;
}

function defaultManifestPath(outDir) {
  if (basename(outDir) === 'audio') {
    return join(dirname(outDir), 'narrations-audio.json');
  }

  return join(outDir, 'narrations-audio.json');
}

function getSettings(data, args) {
  const settings = data && !Array.isArray(data) && typeof data === 'object' ? data.settings ?? {} : {};
  const speed = args.speed ?? numberSetting(settings.speed, DEFAULT_SPEED);

  if (!Number.isFinite(speed) || speed < 0.25 || speed > 4) {
    throw new Error('settings.speed must be a number from 0.25 to 4.0.');
  }

  const responseFormat = (args.format ?? settings.format ?? settings.response_format ?? DEFAULT_FORMAT).toLowerCase();
  if (responseFormat !== 'wav') {
    throw new Error('Duration manifest generation currently requires wav output.');
  }

  return {
    endpoint: settings.endpoint ?? DEFAULT_ENDPOINT,
    model: args.model ?? settings.model ?? DEFAULT_MODEL,
    voice: args.voice ?? settings.voice ?? DEFAULT_VOICE,
    response_format: responseFormat,
    speed,
    instructions: args.tone ?? settings.tone ?? settings.instructions ?? '',
  };
}

function numberSetting(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return Number.parseFloat(value);
}

function getNarrationItems(data) {
  const rawItems = Array.isArray(data) ? data : data?.narrations;

  if (!Array.isArray(rawItems)) {
    throw new Error('Input must be an array of {id, text} narration objects or an object with a narrations array.');
  }

  const seenIds = new Set();

  return rawItems.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Narration item ${index + 1} must be an object with id and text.`);
    }

    const id = String(item.id ?? '').trim();
    const text = normalizeText(item.text ?? '');

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
    return {id, text};
  });
}

function normalizeText(value) {
  return String(value)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

function sanitizeFilePart(value) {
  return String(value).trim().replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-|-$/g, '') || 'narration';
}

function outputPath(outDir, item, format) {
  return join(outDir, `${sanitizeFilePart(item.id)}.${format}`);
}

function manifestPath(manifestFile, audioFile) {
  return relative(dirname(manifestFile), audioFile).replace(/\\/g, '/');
}

function requestBody(settings, narration) {
  return {
    model: settings.model,
    voice: settings.voice,
    input: narration.text,
    response_format: settings.response_format,
    speed: settings.speed,
    ...(settings.instructions ? {instructions: settings.instructions} : {}),
  };
}

async function callOpenAi(endpoint, apiKey, body) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI speech API failed (${response.status}): ${text}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function wavDurationSeconds(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('Generated audio is not a WAV file, so duration could not be read.');
  }

  let offset = 12;
  let byteRate = null;
  let dataSize = null;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkDataOffset = offset + 8;

    if (chunkId === 'fmt ') {
      byteRate = buffer.readUInt32LE(chunkDataOffset + 8);
    }

    if (chunkId === 'data') {
      dataSize = chunkSize;
      break;
    }

    offset = chunkDataOffset + chunkSize + (chunkSize % 2);
  }

  if (!byteRate || !dataSize) {
    throw new Error('Could not find WAV fmt/data chunks for duration calculation.');
  }

  return Math.round((dataSize / byteRate) * 1000) / 1000;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!existsSync(args.input)) {
    throw new Error(`Input file not found: ${args.input}`);
  }

  const data = JSON.parse(readFileSync(args.input, 'utf8'));
  const settings = getSettings(data, args);
  const narrations = getNarrationItems(data).slice(0, args.limit ?? undefined);

  if (!args.dryRun && !args.apiKey) {
    throw new Error('Missing OpenAI API key. Set OPENAI_API_KEY or pass --api-key.');
  }

  if (args.dryRun) {
    for (const narration of narrations) {
      const out = outputPath(args.outDir, narration, settings.response_format);
      const body = requestBody(settings, narration);
      console.log(`[dry-run] ${narration.id} -> ${out}`);
      console.log(JSON.stringify({...body, input: previewText(body.input)}, null, 2));
    }
    console.log(`[dry-run] manifest -> ${args.manifest}`);
    return;
  }

  mkdirSync(args.outDir, {recursive: true});
  mkdirSync(dirname(args.manifest), {recursive: true});

  const manifestItems = [];

  for (const narration of narrations) {
    const body = requestBody(settings, narration);
    const audioPath = outputPath(args.outDir, narration, settings.response_format);
    const audio = await callOpenAi(settings.endpoint, args.apiKey, body);
    const duration = wavDurationSeconds(audio);

    writeFileSync(audioPath, audio);
    manifestItems.push({
      id: narration.id,
      text: narration.text,
      duration,
      path: manifestPath(args.manifest, audioPath),
    });
    console.log(`Wrote ${audioPath}`);
  }

  writeFileSync(args.manifest, `${JSON.stringify(manifestItems, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${args.manifest}`);
}

function previewText(text) {
  return `${text.slice(0, 100)}${text.length > 100 ? '…' : ''}`;
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
