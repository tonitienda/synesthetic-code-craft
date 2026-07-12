#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';

const DEFAULT_OUT_DIR = 'artifacts/narration/openai-audio';
const DEFAULT_MODEL = 'gpt-4o-mini-tts';
const DEFAULT_VOICE = 'alloy';
const DEFAULT_FORMAT = 'mp3';
const DEFAULT_SPEED = 1;
const DEFAULT_ENDPOINT = 'https://api.openai.com/v1/audio/speech';

function usage() {
  console.log(`Usage: node scripts/openai-tts.mjs <sentences.json> [options]

Generates one OpenAI TTS audio file per sentence.

Options:
  --out-dir <path>          Directory for audio files. Default: ${DEFAULT_OUT_DIR}
  --api-key <key>           API key. Prefer OPENAI_API_KEY in the environment.
  --model <name>            Speech model for all sentences. Default: ${DEFAULT_MODEL}
  --voice <name>            Voice for all sentences. Default: ${DEFAULT_VOICE}
  --format <format>         Audio format: mp3, opus, aac, flac, wav, or pcm. Default: ${DEFAULT_FORMAT}
  --speed <number>          Speech speed for all sentences, 0.25 to 4.0. Default: ${DEFAULT_SPEED}
  --tone <text>             Tone/instructions for all sentences.
  --limit <number>          Generate only the first N sentences for testing.
  --dry-run                 Print planned API calls without contacting OpenAI.
  --help                    Show this help.

Accepted input shapes:
  ["Sentence one.", "Sentence two."]
  {"sentences": ["Sentence one.", "Sentence two."], "settings": {"voice": "marin", "speed": 0.95, "tone": "Calm technical explainer."}}
  {"sentences": [{"id": "intro-01", "text": "Sentence one."}]}

Example:
  OPENAI_API_KEY=... node scripts/openai-tts.mjs content/videos/example/narrations.json --out-dir artifacts/narration/example-audio --tone "Calm, precise, friendly." --speed 0.95
`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    outDir: DEFAULT_OUT_DIR,
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

    if (['--out-dir', '--api-key', '--model', '--voice', '--format', '--speed', '--tone', '--limit'].includes(arg)) {
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
    throw new Error('Expected exactly one sentences JSON input path.');
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

  return args;
}

function getSettings(data, args) {
  const settings = data && !Array.isArray(data) && typeof data === 'object' ? data.settings ?? {} : {};
  const speed = args.speed ?? numberSetting(settings.speed, DEFAULT_SPEED);

  if (!Number.isFinite(speed) || speed < 0.25 || speed > 4) {
    throw new Error('settings.speed must be a number from 0.25 to 4.0.');
  }

  return {
    endpoint: settings.endpoint ?? DEFAULT_ENDPOINT,
    model: args.model ?? settings.model ?? DEFAULT_MODEL,
    voice: args.voice ?? settings.voice ?? DEFAULT_VOICE,
    response_format: args.format ?? settings.format ?? settings.response_format ?? DEFAULT_FORMAT,
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

function getSentenceItems(data) {
  const rawItems = Array.isArray(data) ? data : data?.sentences ?? data?.narrations ?? data?.segments;

  if (!Array.isArray(rawItems)) {
    throw new Error('Input must be an array of sentences or an object with a sentences array.');
  }

  return rawItems
    .map((item, index) => normalizeSentenceItem(item, index))
    .filter(item => item.text.length > 0);
}

function normalizeSentenceItem(item, index) {
  if (typeof item === 'string') {
    return {
      id: `sentence-${String(index + 1).padStart(3, '0')}`,
      text: normalizeText(item),
    };
  }

  if (item && typeof item === 'object') {
    return {
      id: sanitizeFilePart(item.id ?? item.name ?? item.slug ?? `sentence-${String(index + 1).padStart(3, '0')}`),
      text: normalizeText(item.text ?? item.sentence ?? item.narration ?? ''),
    };
  }

  return {
    id: `sentence-${String(index + 1).padStart(3, '0')}`,
    text: '',
  };
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
  return String(value).trim().replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-|-$/g, '') || 'sentence';
}

function outputPath(outDir, item, index, format) {
  return join(outDir, `${String(index + 1).padStart(3, '0')}-${sanitizeFilePart(item.id)}.${format}`);
}

function requestBody(settings, sentence) {
  return {
    model: settings.model,
    voice: settings.voice,
    input: sentence.text,
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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!existsSync(args.input)) {
    throw new Error(`Input file not found: ${args.input}`);
  }

  const data = JSON.parse(readFileSync(args.input, 'utf8'));
  const settings = getSettings(data, args);
  const sentences = getSentenceItems(data).slice(0, args.limit ?? undefined);

  if (sentences.length === 0) {
    throw new Error(`No sentences found in ${args.input}.`);
  }

  if (!args.dryRun && !args.apiKey) {
    throw new Error('Missing OpenAI API key. Set OPENAI_API_KEY or pass --api-key.');
  }

  mkdirSync(args.outDir, {recursive: true});

  for (let index = 0; index < sentences.length; index += 1) {
    const sentence = sentences[index];
    const body = requestBody(settings, sentence);
    const out = outputPath(args.outDir, sentence, index, settings.response_format);

    if (args.dryRun) {
      console.log(`[dry-run] ${sentence.id} -> ${out}`);
      console.log(JSON.stringify({...body, input: previewText(body.input)}, null, 2));
      continue;
    }

    const audio = await callOpenAi(settings.endpoint, args.apiKey, body);
    mkdirSync(dirname(out), {recursive: true});
    writeFileSync(out, audio);
    console.log(`Wrote ${out}`);
  }
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
