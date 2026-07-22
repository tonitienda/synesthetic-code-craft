# synesthetic-code-craft

Motion Canvas project for building multiple YouTube-ready educational videos with reusable scenes.

## Available videos

- `youtube-intro`
- `youtube-deep-dive`
- `backpropagation-basics` — a beautiful first explainer covering perceptrons, deeper networks, and backpropagation.
- `containers-image-to-running-process` — explains how container images become bounded running processes. The implementation is paced as a multi-act animated explainer rather than a short static slide deck.
- `containers-image-to-running-process-alive` — alternative containers implementation focused on more dynamic, visually continuous container explanations while respecting the approved scene-timeline duration.
- `showcase-experiments` — a silent material and motion lab covering surfaces, integrated combinations, neural graphs, token caches, propulsion, liquid flow, authored-versus-Matter.js physical interactions, and a Motion Canvas/Three.js hybrid study.

## Quick start

```bash
npm install
npm run start:intro
```

## Run a specific video

```bash
npm run start:intro
npm run start:deep-dive
npm run start:backpropagation
npm run start:containers
npm run start:containers:alive
npm run start:showcase-experiments
```

## Build

```bash
npm run build
npm run build:intro
npm run build:deep-dive
npm run build:backpropagation
npm run build:containers
npm run build:containers:alive
npm run build:showcase-experiments
```

## Narration exports

Narration text and temporary audio exports are generated under `artifacts/narration/` and are not committed. The narration helper accepts both legacy timeline files and the fenced `narration-yaml` segments used by newer content phases.

```bash
npm run narration:backpropagation
npm run narration:containers
npm run narration:containers:audio
```

The `:audio` scripts call the macOS `say` command when available. On non-macOS environments, the helper still writes the `.say.txt` file and skips audio generation with a warning.

### OpenAI narration TTS

For OpenAI-generated narration, provide a JSON array of `{id, text}` objects. The generator writes one `.wav` file per narration ID and a companion manifest JSON containing each item’s `id`, `text`, audio `duration`, and relative `path`, so Motion Canvas can play clips at the right moments.

```bash
npm run narration:openai-tts -- path/to/narrations.json --dry-run
OPENAI_API_KEY=... npm run narration:openai-tts -- path/to/narrations.json --out-dir artifacts/narration/video/audio --manifest artifacts/narration/video/narrations-audio.json --tone "Calm, precise, friendly." --speed 0.95
```

When narration flow matters more than raw iteration speed, use the cohesive variant instead. It generates one full narration pass first, writes the master WAV and stitched text, then splits the result back into per-segment files. It tries to align the cuts from a transcription pass and falls back to target durations when needed.

```bash
npm run narration:openai-tts:cohesive -- path/to/narrations.json --dry-run
OPENAI_API_KEY=... npm run narration:openai-tts:cohesive -- path/to/narrations.json --out-dir artifacts/narration/video/audio --manifest artifacts/narration/video/narrations-audio.json --master artifacts/narration/video/narration-master.wav
```

See `docs/openai-sentence-tts.md` for the expected narration JSON shape, output manifest shape, and global voice settings.

## Scripts reference

The repository also includes a set of direct Node scripts under `scripts/`. Some of them are general-purpose tools used by the current workflow; a few older ones are still useful for experiments but are hard-coded to the legacy `src/videos/containers-toni/` setup.

### Current workflow scripts

- `scripts/timeline-to-say.mjs`
  Converts a Markdown timeline or fenced `narration-yaml` block into a macOS `say`-compatible text file.
  Usage:
  `node scripts/timeline-to-say.mjs [timeline.md] --out <say.txt> [--audio <out.aiff>] [--voice Samantha] [--rate 160] [--speak] [--no-timeline-pauses]`
  Typical use:
  `npm run narration:containers`

- `scripts/openai-tts.mjs`
  Generates one OpenAI TTS `.wav` per narration item and writes a `narrations-audio.json` manifest with durations and relative paths.
  Usage:
  `OPENAI_API_KEY=... node scripts/openai-tts.mjs <narrations.json> --out-dir <audio-dir> --manifest <narrations-audio.json> [--model gpt-4o-mini-tts] [--voice alloy] [--speed 1] [--tone "..."] [--limit N] [--dry-run]`
  Use this when per-segment iteration speed matters more than perfect cross-segment flow.

- `scripts/openai-tts-cohesive.mjs`
  Generates a full stitched narration pass first, then splits it back into per-segment files. This gives more natural pacing across adjacent lines than fully independent segment generation.
  Usage:
  `OPENAI_API_KEY=... node scripts/openai-tts-cohesive.mjs <narrations.json> --out-dir <audio-dir> --manifest <narrations-audio.json> [--master <master.wav>] [--full-text <master.txt>] [--reuse-master] [--no-transcribe] [--transcribe-model gpt-4o-mini-transcribe] [--limit N] [--dry-run]`
  Use this when narration flow matters more than raw iteration speed.

- `scripts/extract-narration-segment.mjs`
  Cuts one segment back out of a master narration file using the `start` and `duration` fields from a manifest.
  Usage:
  `node scripts/extract-narration-segment.mjs <narrations-audio.json> <narration-master.wav> <segment-id> [output-dir]`
  Useful for repairing a single segment after a cohesive narration run.

- `scripts/capture-motion-canvas-frame.mjs`
  Starts a Vite preview server for a specific Motion Canvas project, seeks Studio to a timestamp, and captures a PNG with headless Chromium.
  Usage:
  `node scripts/capture-motion-canvas-frame.mjs <project-file> <timestamp-seconds> [output.png]`
  Example:
  `npm run screenshot:frame -- src/projects/containers-image-to-running-process.ts 35 artifacts/screenshots/containers/035s.png`
  Requirements:
  Chromium or Chrome installed, or `CHROME=/path/to/browser`.

- `scripts/generate-video-screenshots.mjs`
  Generates placeholder preview PNGs for one or more video slugs under `artifacts/screenshots/<slug>/`.
  Usage:
  `node scripts/generate-video-screenshots.mjs <video-slug> [...]`
  Typical use:
  `npm run screenshots:backpropagation`
  Note:
  This script generates synthetic preview images, not true rendered Motion Canvas frames.

### Legacy or experimental narration helpers

These scripts still work, but they are currently hard-coded to the older `src/videos/containers-toni/narrations.json` and `public/narrations/` paths. Treat them as utilities for experiments or migration work unless you first generalize their inputs.

- `scripts/generate-narration-simple.mjs`
  Creates silent `.wav` placeholders with the target durations from the legacy narrations file.
  Usage:
  `node scripts/generate-narration-simple.mjs`
  Use this for timing tests when you want silence, not speech.

- `scripts/generate-narration-audio.mjs`
  Generates legacy narration audio either as silence placeholders or with `espeak`.
  Usage:
  `node scripts/generate-narration-audio.mjs [--use-espeak]`
  Without `--use-espeak`, it creates silent placeholders.

- `scripts/generate-narration-say.mjs`
  Uses macOS `say` to generate one `.wav` file per legacy narration segment.
  Usage:
  `node scripts/generate-narration-say.mjs [--voice Samantha] [--rate 150]`
  Requirements:
  macOS `say` and `ffmpeg`.

- `scripts/generate-narration-say-timed.mjs`
  Uses macOS `say`, then pads each file with silence so it matches the configured target duration.
  Usage:
  `node scripts/generate-narration-say-timed.mjs [--voice Alex] [--rate 160]`
  Requirements:
  macOS `say` and `ffmpeg`.

- `scripts/mux-narration-audio.mjs`
  Concatenates the legacy narration files and muxes them into an `.mp4`.
  Usage:
  `node scripts/mux-narration-audio.mjs <input.mp4> [output.mp4]`
  Requirements:
  `ffmpeg`.

- `scripts/debug-narration-audio.mjs`
  Checks the legacy narration directory for missing files, reports durations, and tests whether concatenation works.
  Usage:
  `node scripts/debug-narration-audio.mjs`
  Requirements:
  `ffmpeg`.

### Which script to use

- For Markdown or phase content to `say` text:
  use `scripts/timeline-to-say.mjs`
- For current OpenAI per-segment narration generation:
  use `scripts/openai-tts.mjs`
- For current OpenAI cohesive narration generation:
  use `scripts/openai-tts-cohesive.mjs`
- For extracting or repairing one cohesive segment:
  use `scripts/extract-narration-segment.mjs`
- For real frame captures from a Motion Canvas project:
  use `scripts/capture-motion-canvas-frame.mjs`
- For quick placeholder preview PNGs:
  use `scripts/generate-video-screenshots.mjs`
- For older `containers-toni` narration experiments:
  use the legacy scripts only after confirming their hard-coded paths match what you want

## Preview screenshots

Binary screenshots are not committed. Pull requests that touch Motion Canvas projects, scenes, or video folders run the `Motion Canvas previews` workflow, which builds the project, generates PNG preview frames for changed video folders, and uploads them as the `motion-canvas-screenshots` artifact.

To generate the same previews locally for the backpropagation and containers videos:

```bash
npm run screenshots:backpropagation
npm run screenshots:containers
npm run screenshots:containers:alive
```

Generated files are written to `artifacts/screenshots/`, which is ignored by Git.

## Agent-friendly Motion Canvas previews

This repo adds a lightweight Studio plugin for timestamp-driven visual checks. While a project dev server is running, open Studio with `?ts=<seconds>` or `?frame=<frame>` to pause and render that moment, or add `?agentPreview=1` to sync the URL during manual navigation, for example `http://localhost:9000/?ts=35`. When opened with a seek parameter or `?agentPreview=1`, the URL is kept in sync as the timeline moves.

A headless capture helper is also available when Chromium is installed:

```bash
npm run screenshot:frame -- src/projects/containers-image-to-running-process.ts 35 artifacts/screenshots/containers/035s.png
```

See `docs/agent-motion-canvas-preview.md` for the full agent preview loop.

## Video folders

Each substantial video should include a dedicated folder under `src/videos/<slug>/` with timestamped narration, production notes, and representative screenshots. For examples, see `src/videos/backpropagation-basics/` and `src/videos/containers-image-to-running-process/`.

## Motion design direction

Educational videos should feel alive, not like static slide decks. Prefer visual continuity inside a conceptual section: components should enter, move, unfold, split, merge, pulse, and change state as the idea develops. Hard cuts are welcome when they clarify a new act, chapter, metaphor, or spatial setup.

Avoid the rhythm where every few seconds a complete new set of elements appears and replaces the previous one. When the same idea continues, evolve the existing elements. When the act changes, a fresh composition is allowed, but it should still feel intentionally staged rather than like a reset caused by implementation convenience.

Clean implementation is not enough. The Motion Canvas code should also protect the aesthetic intent: balanced composition, generous negative space, tasteful color, purposeful motion, and moments of visual delight that make the explanation memorable without becoming noisy.

## Timeline pacing requirements

The approved `05-scene-timeline.md` for a video is a timing contract, not just visual inspiration. `Moment: 20.0s` means the implementation must reserve time so that cue appears around second 20 relative to that scene. Agents must not collapse a 55–70 second scene into a few short transitions because the concepts are visually present.

A Motion Canvas implementation is incomplete if it does not preserve the scene duration budgets from the timeline. Use explicit timing helpers, scene-local clocks, or narration-driven waits so the total duration remains in the approved range. If pacing must change, update the content phase intentionally in a separate review instead of silently compressing the video in code.
