# synesthetic-code-craft

Motion Canvas project for building multiple YouTube-ready educational videos with reusable scenes.

## Available videos

- `youtube-intro`
- `youtube-deep-dive`
- `backpropagation-basics` — a beautiful first explainer covering perceptrons, deeper networks, and backpropagation.
- `backpropagation` — Act I of the Markdown-driven backpropagation video, implemented from `content/videos/backpropagation/04-timeline.md` (introduces the perceptron; ends on "What if one line is not enough?").

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
npm run start:backprop        # Act I, Markdown-driven backpropagation video
```

## Build

```bash
npm run build
npm run build:intro
npm run build:deep-dive
npm run build:backpropagation
npm run build:backprop
```

## Preview screenshots

Binary screenshots are not committed. Pull requests that touch Motion Canvas projects, scenes, or video folders run the `Motion Canvas previews` workflow, which builds the project, generates PNG preview frames for changed video folders, and uploads them as the `motion-canvas-screenshots` artifact.

To generate the same previews locally for the backpropagation video:

```bash
npm run screenshots:backpropagation
npm run screenshots:backprop
```

Generated files are written to `artifacts/screenshots/`, which is ignored by Git.

## Video folders

Each substantial video should include a dedicated folder under `src/videos/<slug>/` with timestamped narration, production notes, and representative screenshots. For example, see `src/videos/backpropagation-basics/`.
