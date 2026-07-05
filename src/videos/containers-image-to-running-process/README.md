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
- Implementations must preserve the timing budgets and `Moment:` cues from `05-scene-timeline.md`.
- `src/scenes/containersAliveTimelinePaced.tsx` is the current `containers:alive` implementation. It uses explicit timeline cues and lasts about 610 seconds so the approved 7–10 minute pacing is represented in code.
- `src/scenes/containersAliveStory.tsx` remains as an earlier dynamic sketch, but it is not the timeline-paced version.

## Alternative alive implementation

The alternative project is intentionally more dynamic and aesthetic-first, while still respecting the approved scene timing:

```bash
npm run start:containers:alive
npm run build:containers:alive
npm run screenshots:containers:alive
```

Use it to explore the same approved conceptual chain with more motion, transformation, and visual continuity. Cuts or fresh compositions can make sense at act boundaries; the important constraints are to keep continuity inside a concept and to preserve the approved duration budget.

## Project commands

```bash
npm run start:containers
npm run build:containers
npm run screenshots:containers
npm run narration:containers
```

Generated screenshots, videos, and narration audio belong under `artifacts/` and should not be committed.
