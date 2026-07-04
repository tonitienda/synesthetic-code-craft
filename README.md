# synesthetic-code-craft

Motion Canvas project for building multiple YouTube-ready educational videos with reusable scenes.

## Available videos

- `youtube-intro`
- `youtube-deep-dive`
- `backpropagation` — Markdown-first Act I implementation introducing the perceptron and its one-line limitation.
- `backpropagation-basics` — previous first explainer covering perceptrons, deeper networks, and backpropagation.

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
npm run start:backpropagation-basics
```

## Build

```bash
npm run build
npm run build:intro
npm run build:deep-dive
npm run build:backpropagation
npm run build:backpropagation-basics
```

## Preview screenshots

Binary screenshots are not committed. Pull requests that touch Motion Canvas projects, scenes, or video folders run the `Motion Canvas previews` workflow, which builds the project, generates PNG preview frames for changed video folders, and uploads them as the `motion-canvas-screenshots` artifact.

To generate the same previews locally for the Markdown-first backpropagation video:

```bash
npm run screenshots:backpropagation
```

Generated files are written to `artifacts/screenshots/`, which is ignored by Git.

## Video folders

Each substantial video should include a dedicated folder under `src/videos/<slug>/` with timestamped narration, production notes, and representative screenshots. For example, see `src/videos/backpropagation/` and `src/videos/backpropagation-basics/`.
