# synesthetic-code-craft

Motion Canvas project for building multiple YouTube-ready educational videos with reusable scenes.

## Available videos

- `youtube-intro`
- `youtube-deep-dive`
- `backpropagation-basics` — a beautiful first explainer covering perceptrons, deeper networks, and backpropagation.
- `containers-image-to-running-process` — explains how container images become bounded running processes.

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
```

## Build

```bash
npm run build
npm run build:intro
npm run build:deep-dive
npm run build:backpropagation
npm run build:containers
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

To generate the same previews locally for the backpropagation video:

```bash
npm run screenshots:backpropagation
npm run screenshots:containers
```

Generated files are written to `artifacts/screenshots/`, which is ignored by Git.

## Video folders

Each substantial video should include a dedicated folder under `src/videos/<slug>/` with timestamped narration, production notes, and representative screenshots. For examples, see `src/videos/backpropagation-basics/` and `src/videos/containers-image-to-running-process/`.
