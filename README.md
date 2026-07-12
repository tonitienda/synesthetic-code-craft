# synesthetic-code-craft

Motion Canvas project for building multiple YouTube-ready educational videos with reusable scenes.

## Available videos

- `youtube-intro`
- `youtube-deep-dive`
- `backpropagation-basics` — a beautiful first explainer covering perceptrons, deeper networks, and backpropagation.
- `containers-image-to-running-process` — explains how container images become bounded running processes. The implementation is paced as a multi-act animated explainer rather than a short static slide deck.
- `containers-image-to-running-process-alive` — alternative containers implementation focused on more dynamic, visually continuous container explanations while respecting the approved scene-timeline duration.

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
```

## Build

```bash
npm run build
npm run build:intro
npm run build:deep-dive
npm run build:backpropagation
npm run build:containers
npm run build:containers:alive
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

See `docs/openai-sentence-tts.md` for the expected narration JSON shape, output manifest shape, and global voice settings.

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
