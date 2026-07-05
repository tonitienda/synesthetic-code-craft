# Containers: image to running process

Motion Canvas implementation folder for `content/videos/containers-image-to-running-process/`.

The implementation follows the ready Markdown phases and keeps the visual model focused on:

```text
image -> runtime setup -> process with boundaries
container = process + filesystem view + namespaces + cgroups
```

## Structure

- `theme.ts` keeps the calm dark palette local to this video.
- `components.tsx` provides only the diagram primitives used by the first implementation pass.
- Scene files live in `src/scenes/containersAct*.tsx` and intentionally map one-to-one to the implementation scenes in `06-implementation-plan.md`.
- `src/scenes/containersAliveStory.tsx` is an alternative implementation that favors more dynamic visual continuity inside each conceptual section instead of mostly static scene cards.
- Each scene uses small timing constants and a simple reveal/hold/fade rhythm so narration alignment can be tuned without changing the visual model.

## Alternative alive implementation

The alternative project is intentionally more dynamic and aesthetic-first:

```bash
npm run start:containers:alive
npm run build:containers:alive
npm run screenshots:containers:alive
```

Use it to explore the same approved conceptual chain with more motion, transformation, and visual continuity. Cuts or fresh compositions can make sense at act boundaries; the important constraint is to avoid resetting the entire screen every few seconds while the same concept is still being explained.

## Project commands

```bash
npm run start:containers
npm run build:containers
npm run screenshots:containers
npm run narration:containers
```

Generated screenshots, videos, and narration audio belong under `artifacts/` and should not be committed.
