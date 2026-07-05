---
type: implementation-plan
status: deprecated
depends_on:
  - 05-scene-timeline.md
---

# 06 — Implementation plan: Docker containers from image to running process

## Purpose

This document translates the ready scene timeline in `05-scene-timeline.md` into a bounded Motion Canvas implementation plan.

The implementation must preserve the approved visual and conceptual chain:

```text
image -> runtime setup -> process with boundaries
```

And the final memory:

```text
container = process + filesystem view + namespaces + cgroups
```

This is a plan for implementation, not Motion Canvas code.

## Source of truth

Use ready sources in this order:

1. `05-scene-timeline.md` — visual structure, act/scene grouping, timing budgets, and component intent.
2. `04-narration.md` — narration IDs and pacing references.
3. `03-beats.md` — stable story beat IDs and transitions.
4. `02-treatment.md` and `01-research.md` — conceptual guardrails when a scene is ambiguous.
5. `content/language/animation-spec-v0.md` — shared animation vocabulary.

Do not invent new scenes, story beats, jokes, or technical detours in Motion Canvas.

## Timing contract

The scene timeline is a timing contract, not just visual inspiration.

A heading such as `Moment: 20.0s — Image does not equal process` means that the cue must happen around 20 seconds after the start of that implementation scene. Moment times are relative to the scene where they appear.

A scene with a `55–70s` duration budget must not be compressed into a 10–20 second summary. The complete video should remain in the approved 7–10 minute range, with small drift allowed for transition polish and narration alignment.

Use explicit timing helpers, scene-local clocks, or narration-driven waits. Do not rely only on arbitrary short `hold` values. If a generated implementation is dramatically shorter than the timeline, it is incomplete even if all concepts appear on screen.

Recommended helper shape:

```ts
let clock = 0;
function* waitUntil(target: number) {
  if (target > clock) {
    yield* waitFor(target - clock);
    clock = target;
  }
}
```

If pacing must change, update the content phase intentionally in a separate review instead of silently compressing the video in code.

## Implementation scope

Implement the full seven-act video described by `05-scene-timeline.md`.

Expected total duration budget: **7–10 minutes**.

The coding pass may be split into smaller PRs, but each split must keep scene boundaries and timing budgets intact. If the first coding pass needs to be reduced, the safest incremental scope is:

1. project scaffolding and reusable components,
2. Act 1,
3. Acts 2–3,
4. Acts 4–5,
5. Acts 6–7.

Do not implement scenes from any other video folder as part of this work.

## Files to create or update

Baseline project entry point:

```text
src/projects/containers-image-to-running-process.ts
src/projects/containers-image-to-running-process.meta
```

Dynamic alternative entry point:

```text
src/projects/containers-image-to-running-process-alive.ts
src/scenes/containersAliveTimelinePaced.tsx
```

The `containers:alive` version may use act-level cuts or a smaller number of implementation scenes, but it must still honor the timeline cues and duration budgets. It must not collapse the full story into a short demo.

Preferred baseline implementation: one Motion Canvas scene file per implementation scene from the timeline:

```text
src/scenes/containersAct1CommandDoorway.tsx
src/scenes/containersAct2VocabularyMap.tsx
src/scenes/containersAct2WorkflowVerbs.tsx
src/scenes/containersAct3ImageInternals.tsx
src/scenes/containersAct4RuntimePreparation.tsx
src/scenes/containersAct4StartupBoundaries.tsx
src/scenes/containersAct5SharedLayers.tsx
src/scenes/containersAct5CopyOnWrite.tsx
src/scenes/containersAct6HostBoundaries.tsx
src/scenes/containersAct6NamespacesCgroups.tsx
src/scenes/containersAct7WorkflowReturn.tsx
src/scenes/containersAct7FinalFormula.tsx
```

## Reusable visual components

Create or maintain a focused component module for this video first:

```text
src/videos/containers-image-to-running-process/components.tsx
src/videos/containers-image-to-running-process/theme.ts
```

Suggested components:

- `CommandCallout` — centered monospace command or focused fragment.
- `VocabularyCard` — labeled concept card with a short role line.
- `ImageBox` — package-like image artifact that can reveal layers and config.
- `RegistryBox` — shelf/storage visual with no process pulse.
- `RuntimeBox` — neutral preparation box that accepts image/config/options and emits a container instance.
- `LayerStack` — ordered transparent filesystem sheets.
- `WritableLayer` — per-container top layer, visually distinct from image layers.
- `ProcessBox` — pulsing running process marker.
- `ContainerInstance` — grouped process, filesystem view, namespaces, and cgroup frame.
- `KernelLayer` — stable host kernel foundation below bounded processes.
- `NamespaceView` — split or framed view of host-visible vs container-visible resources.
- `CgroupLimit` — budget ring or meters for CPU, memory, and I/O.
- `FileToken` — small labeled file token for the copy-on-write scene.
- `FlowArrow` — restrained arrows for build, push, pull, run, and read/write traces.

Avoid a large generic framework. A simple video-local component file is enough for the first pass.

## Scene implementation checklist

### Act 1 — The familiar command, corrected

Timing references: `n001`–`n003`, `b001`–`b003`, 55–70s.

Must show `docker run nginx`, the question `what runs?`, `IMAGE ≠ RUNNING PROCESS`, and the thesis chain `image -> runtime -> container process` at the approved moment times.

### Act 2 — Four nouns, four roles

Timing references: `n004`–`n008`, `b004`–`b008`, 75–95s.

Must show Image, Registry, Runtime, and Container roles; image layers plus config; registry as storage only; workflow verbs; `run` as the only verb that creates a container; and the small Docker/OCI note.

### Act 3 — Open the image

Timing references: `n009`–`n011`, `b009`–`b011`, 80–105s.

Must show `image = layers + config`, ordered transparent layers, restacking into one filesystem view, and shared read-only treatment.

### Act 4 — What run prepares

Timing references: `n012`–`n016`, `b012`–`b016`, 95–120s.

Must show runtime inputs, one filesystem view, a private writable layer, startup configuration cards, and the process starting inside filesystem, namespace, and cgroup frames.

### Act 5 — Same image, two containers

Timing references: `n017`–`n022`, `b017`–`b022`, 125–155s.

Must show one shared lower layer stack, Container A and Container B, shared reads, `Writable A`, `Writable B`, and the `/etc/app.conf` copy-on-write mental model. This is the longest visual section and must not be rushed.

### Act 6 — The host sees a process with boundaries

Timing references: `n023`–`n027`, `b023`–`b027`, 100–125s.

Must show the host kernel, a real process or process group, filesystem/namespace/cgroup frames, namespace views, cgroup budget, and the hold line `Namespaces shape the view. Cgroups shape the budget.`

### Act 7 — Reassemble the model

Timing references: `n028`–`n031`, `b028`–`b031`, 80–105s.

Must show the returned workflow chain, the final equation, the optional small commit loop only if timing allows, the stable final diagram, and the final correction `An image does not run. A process runs.`

## Visual and technical conventions

- Use TypeScript and TSX.
- Use two-space indentation and semicolons.
- Keep scenes readable and timings easy to tune.
- Dark background, high contrast, generous spacing.
- Minimal geometry and calm motion.
- Soft glow is acceptable only to direct attention.
- Avoid neon excess, crowded screens, and hype aesthetics.
- Use restrained on-screen copy from the timeline.
- Prefer diagram transformations over hard cuts when the same concept evolves.
- Act-level cuts and fresh compositions are allowed when they improve clarity.
- Do not show the registry as a place where containers run.
- Do not show containers as tiny virtual machines.
- Do not turn the video into a Docker command tutorial.

## Narration handling

Initial implementation can use unobtrusive text markers or comments keyed to narration IDs.

Do not paste full narration text into scene files unless needed for temporary timing review. Prefer IDs such as `n017` in comments or helper labels.

Generated narration output belongs under:

```text
artifacts/narration/
```

Do not commit generated audio or binary exports.

## Preview and test commands

Before committing implementation changes, run:

```bash
npm run build
npm run build:containers
npm run build:containers:alive
```

When practical for preview changes, run:

```bash
npm run screenshots:containers
npm run screenshots:containers:alive
```

Generated screenshots must stay under `artifacts/screenshots/` and must not be committed.

## Risks and simplifications

- **Duration risk:** The full timeline is long. Split by act ranges if needed, while preserving source scene boundaries and duration budgets.
- **Compression risk:** Agents may create a visually complete but far-too-short demo. Reject this unless it is explicitly labeled as a timing prototype, not an implementation.
- **Component risk:** The component list is intentionally video-local. Do not generalize into a shared framework until reuse is proven.
- **Accuracy risk:** Keep copy-on-write conceptual. Do not explain storage-driver internals unless the ready source files are updated first.
- **Visual metaphor risk:** Container boundary frames must not imply virtual machines. Keep the host kernel visible in Act 6.
- **Optional commit risk:** The commit loop must remain secondary and must not replace the final mental model.

## Acceptance criteria

A viewer should understand, visually and without final TTS, that:

1. `docker run nginx` does not mean an image runs by itself.
2. An image is a packaged starting point made of layers and config.
3. A registry stores and distributes images; it does not run containers.
4. A runtime prepares the filesystem view, startup config, writable layer, and boundaries.
5. A container is a real process or process group with prepared boundaries.
6. Multiple containers can share image layers while keeping private writable changes.
7. Namespaces shape what the process can see.
8. Cgroups shape what the process can use.
9. The final model is `container = process + filesystem view + namespaces + cgroups`.
10. The implementation duration respects the approved timeline instead of collapsing it into a short concept demo.

## Must not change

- Do not change ready narration IDs from `04-narration.md`.
- Do not change ready beat IDs from `03-beats.md`.
- Do not rewrite `05-scene-timeline.md` as part of implementation unless a clear defect is found and explicitly documented.
- Do not add future technical topics such as Kubernetes, image signing, containerd internals, or OCI spec details beyond the small approved note.
- Do not commit rendered videos, screenshots, or generated audio.
