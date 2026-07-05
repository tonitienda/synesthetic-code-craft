# Containers: image to running process

Motion Canvas implementation folder for `content/videos/containers-image-to-running-process/`.

The implementation follows the ready Markdown phases and keeps the visual model focused on:

```text
image -> runtime setup -> process with boundaries
container = process + filesystem view + namespaces + cgroups
```

## Structure

- `theme.ts` keeps the calm dark palette local to this video.
- `components.tsx` provides only the diagram primitives used by this first implementation pass.
- Scene files live in `src/scenes/containersAct*.tsx` and intentionally map one-to-one to the implementation scenes in `06-implementation-plan.md`.
- Each scene uses small timing constants and a simple reveal/hold/fade rhythm so narration alignment can be tuned without changing the visual model.

## Project commands

```bash
npm run start:containers
npm run build:containers
npm run screenshots:containers
npm run narration:containers
```

Generated screenshots, videos, and narration audio belong under `artifacts/` and should not be committed.
