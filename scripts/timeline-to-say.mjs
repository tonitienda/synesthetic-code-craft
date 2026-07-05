#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';

const DEFAULT_TIMELINE = 'content/videos/backpropagation/04-timeline.md';
const DEFAULT_OUT = 'artifacts/narration/backpropagation.say.txt';

function usage() {
  console.log(`Usage: node scripts/timeline-to-say.mjs [timeline.md] [options]

Converts Markdown timeline narration cues into a macOS say-compatible file.

Options:
  --out <path>            Output say text file. Default: ${DEFAULT_OUT}
  --audio <path>          Optional AIFF output generated with macOS say.
  --voice <name>          macOS voice name. Default: Samantha
  --rate <number>         Speech rate for macOS say. Default: 160
  --speak                 Play the generated narration with macOS say.
  --no-timeline-pauses    Do not infer pauses from timeline cue spacing.
  --help                  Show this help.

Examples:
  npm run narration:backpropagation
  npm run narration:backpropagation:audio
  say -v Samantha -r 160 -f artifacts/narration/backpropagation.say.txt
`);
}

function parseArgs(argv) {
  const args = {
    timeline: DEFAULT_TIMELINE,
    out: DEFAULT_OUT,
    audio: null,
    voice: 'Samantha',
    rate: '160',
    speak: false,
    timelinePauses: true,
  };

  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }

    if (arg === '--speak') {
      args.speak = true;
      continue;
    }

    if (arg === '--no-timeline-pauses') {
      args.timelinePauses = false;
      continue;
    }

    if (['--out', '--audio', '--voice', '--rate'].includes(arg)) {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }

      args[arg.slice(2)] = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positional.push(arg);
  }

  if (positional.length > 1) {
    throw new Error(`Expected at most one timeline path, got: ${positional.join(', ')}`);
  }

  if (positional.length === 1) {
    args.timeline = positional[0];
  }

  return args;
}

function stripNarrationSyntax(raw) {
  let text = raw.trim();

  if (!text || /^\[silent\]$/i.test(text)) {
    return null;
  }

  text = text.replace(/^Narration:\s*/i, '').trim();

  // Remove one wrapping pair of straight or curly quotes.
  text = text.replace(/^["“](.*)["”]$/s, '$1');

  // Lightweight Markdown cleanup, so the spoken text sounds natural.
  text = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim();

  return text || null;
}

function parseTimeline(markdown) {
  const lines = markdown.split(/\r?\n/);
  const scenes = [];
  let currentScene = null;
  let currentCue = null;

  function ensureScene(title = 'Untitled scene') {
    if (!currentScene) {
      currentScene = {title, duration: null, cues: []};
      scenes.push(currentScene);
    }

    return currentScene;
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    const sceneMatch = trimmed.match(/^#\s+Scene\s+(.+)$/i);
    if (sceneMatch) {
      currentScene = {
        title: sceneMatch[1].trim(),
        duration: null,
        cues: [],
      };
      scenes.push(currentScene);
      currentCue = null;
      continue;
    }

    const durationMatch = trimmed.match(/^Duration:\s*(\d+(?:\.\d+)?)s\s*$/i);
    if (durationMatch) {
      ensureScene().duration = Number.parseFloat(durationMatch[1]);
      continue;
    }

    const cueMatch = trimmed.match(/^##\s+(\d+(?:\.\d+)?)s\s*$/i);
    if (cueMatch) {
      const scene = ensureScene();
      currentCue = {
        at: Number.parseFloat(cueMatch[1]),
        narration: null,
      };
      scene.cues.push(currentCue);
      continue;
    }

    if (/^Narration:\s*$/i.test(trimmed)) {
      if (!currentCue) {
        const scene = ensureScene();
        currentCue = {at: 0, narration: null};
        scene.cues.push(currentCue);
      }

      const narrationLines = [];

      for (let j = i + 1; j < lines.length; j += 1) {
        const next = lines[j];
        const nextTrimmed = next.trim();

        if (
          !nextTrimmed ||
          /^#{1,6}\s+/.test(nextTrimmed) ||
          /^---+$/.test(nextTrimmed) ||
          /^(Animation|Narration):\s*$/i.test(nextTrimmed)
        ) {
          break;
        }

        narrationLines.push(nextTrimmed);
        i = j;
      }

      currentCue.narration = stripNarrationSyntax(narrationLines.join(' '));
    }
  }

  return scenes.filter(scene => scene.cues.length > 0);
}

function escapeForSay(text) {
  return text.replace(/<break\s+time=["']([\d.]+)\s*(ms|s)["']\s*\/?>/gi, (_, value, unit) => {
    const amount = Number.parseFloat(value);
    const milliseconds = unit.toLowerCase() === 'ms' ? amount : amount * 1000;
    return `[[slnc ${Math.round(milliseconds)}]]`;
  });
}

function silence(milliseconds) {
  return `[[slnc ${Math.max(0, Math.round(milliseconds))}]]`;
}

function buildSayText(scenes, {timelinePauses}) {
  const output = [];

  function pushText(text) {
    output.push(text);
  }

  function pushSilence(milliseconds) {
    const match = output[output.length - 1]?.match(/^\[\[slnc (\d+)\]\]$/);
    if (match) {
      const combined = Number.parseInt(match[1], 10) + Math.round(milliseconds);
      output[output.length - 1] = silence(combined);
      return;
    }

    output.push(silence(milliseconds));
  }

  for (const scene of scenes) {
    const cues = [...scene.cues].sort((a, b) => a.at - b.at);

    for (let i = 0; i < cues.length; i += 1) {
      const cue = cues[i];
      const nextCue = cues[i + 1];

      if (cue.narration) {
        pushText(escapeForSay(cue.narration));
      }

      if (!timelinePauses) {
        continue;
      }

      const nextAt = nextCue?.at ?? scene.duration;
      if (typeof nextAt === 'number') {
        const pauseSeconds = nextAt - cue.at;
        if (pauseSeconds > 0.05) {
          pushSilence(pauseSeconds * 1000);
        }
      }
    }
  }

  return `${output.filter(Boolean).join('\n\n')}\n`;
}

function runSay(args) {
  if (process.platform !== 'darwin') {
    console.warn('Skipping macOS say command: this command is only available on macOS.');
    return;
  }

  const sayArgs = ['-v', args.voice, '-r', args.rate, '-f', args.out];

  if (args.audio) {
    mkdirSync(dirname(args.audio), {recursive: true});
    sayArgs.push('-o', args.audio);
  }

  const result = spawnSync('say', sayArgs, {stdio: 'inherit'});
  if (result.status !== 0) {
    throw new Error(`say failed with exit code ${result.status}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!existsSync(args.timeline)) {
    throw new Error(`Timeline file not found: ${args.timeline}`);
  }

  const timeline = readFileSync(args.timeline, 'utf8');
  const scenes = parseTimeline(timeline);

  if (scenes.length === 0) {
    throw new Error(`No timeline narration cues found in ${args.timeline}`);
  }

  const sayText = buildSayText(scenes, args);

  mkdirSync(dirname(args.out), {recursive: true});
  writeFileSync(args.out, sayText, 'utf8');

  const spokenCueCount = scenes.reduce(
    (count, scene) => count + scene.cues.filter(cue => cue.narration).length,
    0,
  );

  console.log(`Wrote ${args.out}`);
  console.log(`Extracted ${spokenCueCount} spoken narration cues from ${scenes.length} scenes.`);

  if (args.audio || args.speak) {
    runSay(args);
    if (args.audio) {
      console.log(`Wrote ${args.audio}`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
