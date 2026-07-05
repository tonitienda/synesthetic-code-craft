# synesthetic-code-craft

Motion Canvas project for building multiple YouTube-ready educational videos with reusable scenes.

## Available videos

- `youtube-intro`
- `youtube-deep-dive`
- `backpropagation-basics` — a beautiful first explainer covering perceptrons, deeper networks, and backpropagation.
- `containers-image-to-running-process` — explains how container images become bounded running processes.
- `containers-image-to-running-process-alive` — alternative containers implementation focused on more dynamic, visually continuous container explanations.

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

## Preview screenshots

Binary screenshots are not committed. Pull requests that touch Motion Canvas projects, scenes, or video folders run the `Motion Canvas previews` workflow, which builds the project, generates PNG preview frames for changed video folders, and uploads them as the `motion-canvas-screenshots` artifact.

To generate the same previews locally for the backpropagation and containers videos:

```bash
npm run screenshots:backpropagation
npm run screenshots:containers
npm run screenshots:containers:alive
```

Generated files are written to `artifacts/screenshots/`, which is ignored by Git.

## Video folders

Each substantial video should include a dedicated folder under `src/videos/<slug>/` with timestamped narration, production notes, and representative screenshots. For examples, see `src/videos/backpropagation-basics/` and `src/videos/containers-image-to-running-process/`.

## Motion design direction

Educational videos should feel alive, not like static slide decks. Prefer visual continuity inside a conceptual section: components should enter, move, unfold, split, merge, pulse, and change state as the idea develops. Hard cuts are welcome when they clarify a new act, chapter, metaphor, or spatial setup.

Avoid the rhythm where every few seconds a complete new set of elements appears and replaces the previous one. When the same idea continues, evolve the existing elements. When the act changes, a fresh composition is allowed, but it should still feel intentionally staged rather than like a reset caused by implementation convenience.

Clean implementation is not enough. The Motion Canvas code should also protect the aesthetic intent: balanced composition, generous negative space, tasteful color, purposeful motion, and moments of visual delight that make the explanation memorable without becoming noisy.
