---
type: implementation-plan
status: in-progress
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

## Implementation scope

Implement the full seven-act video described by `05-scene-timeline.md`.

Expected total duration budget: **7–10 minutes**.

The coding pass may be split into smaller PRs, but each split must keep scene boundaries intact. If the first coding pass needs to be reduced, the safest incremental scope is:

1. project scaffolding and reusable components,
2. Act 1,
3. Acts 2–3,
4. Acts 4–5,
5. Acts 6–7.

Do not implement scenes from any other video folder as part of this work.

## Files to create or update

### Project entry point

Create:

```text
src/projects/containers-image-to-running-process.ts
src/projects/containers-image-to-running-process.meta
```

The project should register the scenes for Acts 1–7 in timeline order.

### Scene files

Create one Motion Canvas scene file per implementation scene from the timeline:

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

Create matching `.meta` files only if required by Motion Canvas conventions in the existing project.

### Video implementation folder

Create:

```text
src/videos/containers-image-to-running-process/README.md
src/videos/containers-image-to-running-process/script.md
src/videos/containers-image-to-running-process/screenshots/README.md
```

Use this folder for implementation notes, narration exports, and screenshot guidance. Do not duplicate the content-phase Markdown into `src/`.

### Reusable components

Create a focused component module for this video first:

```text
src/videos/containers-image-to-running-process/components.tsx
src/videos/containers-image-to-running-process/theme.ts
```

Move components to a shared folder only after another video needs them.

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

### Documentation and scripts

Update:

```text
package.json
README.md
content/videos/containers-image-to-running-process/README.md
```

Add scripts:

```json
{
  "start:containers": "MOTION_CANVAS_PROJECT=./src/projects/containers-image-to-running-process.ts vite",
  "build:containers": "tsc && MOTION_CANVAS_PROJECT=./src/projects/containers-image-to-running-process.ts vite build",
  "screenshots:containers": "node scripts/generate-video-screenshots.mjs containers-image-to-running-process",
  "narration:containers": "node scripts/timeline-to-say.mjs content/videos/containers-image-to-running-process/04-narration.md --out artifacts/narration/containers-image-to-running-process.say.txt",
  "narration:containers:audio": "node scripts/timeline-to-say.mjs content/videos/containers-image-to-running-process/04-narration.md --out artifacts/narration/containers-image-to-running-process.say.txt --audio artifacts/narration/containers-image-to-running-process.aiff",
  "narration:containers:speak": "node scripts/timeline-to-say.mjs content/videos/containers-image-to-running-process/04-narration.md --out artifacts/narration/containers-image-to-running-process.say.txt --speak"
}
```

`scripts/timeline-to-say.mjs` supports the fenced `narration-yaml` shape used by `04-narration.md`; use these scripts to generate temporary `.say.txt` and macOS `say` audio outputs under `artifacts/narration/`.

## Scene implementation checklist

### Act 1 — The familiar command, corrected

Scene: `containersAct1CommandDoorway.tsx`

Must show:

- `docker run nginx` as the doorway.
- `run` highlighted with the question `what runs?`.
- `IMAGE ≠ RUNNING PROCESS` with an `ImageBox` and pulsing `ProcessBox`.
- Thesis chain: `image -> runtime -> container process`.

Timing references: `n001`–`n003`, `b001`–`b003`, 55–70s.

### Act 2 — Four nouns, four roles

Scenes:

- `containersAct2VocabularyMap.tsx`
- `containersAct2WorkflowVerbs.tsx`

Must show:

- Cards for `Image`, `Registry`, `Runtime`, and `Container` with their roles.
- Image internals as `filesystem layers` plus `config / metadata`.
- Registry as storage/distribution only, with no running-process styling.
- Workflow chain: `build -> image -> push -> registry -> pull -> local image -> run -> container`.
- `run` as the only verb that creates a container.
- Small secondary Docker/OCI note.

Timing references: `n004`–`n008`, `b004`–`b008`, 75–95s.

### Act 3 — Open the image

Scene: `containersAct3ImageInternals.tsx`

Must show:

- `image = layers + config`.
- Ordered transparent layers: base filesystem, packages, runtime dependencies, application files.
- Layers restacking into one filesystem view.
- Shared read-only treatment with faint future container outlines.

Timing references: `n009`–`n011`, `b009`–`b011`, 80–105s.

### Act 4 — What run prepares

Scenes:

- `containersAct4RuntimePreparation.tsx`
- `containersAct4StartupBoundaries.tsx`

Must show:

- Runtime receiving image layers, image config, and run options.
- A single filesystem view with layer seams faintly preserved.
- A private writable layer above read-only image layers.
- Startup configuration cards: command, environment, working directory, user.
- Process starting inside filesystem, namespace, and cgroup frames.

Timing references: `n012`–`n016`, `b012`–`b016`, 95–120s.

### Act 5 — Same image, two containers

Scenes:

- `containersAct5SharedLayers.tsx`
- `containersAct5CopyOnWrite.tsx`

Must show:

- One shared lower `LayerStack` branching into Container A and Container B.
- Both containers reading from the same shared read-only layers.
- Distinct `Writable A` and `Writable B` layers.
- `/etc/app.conf` read from the shared original.
- Container A writing a private changed copy while Container B still sees the original.

Timing references: `n017`–`n022`, `b017`–`b022`, 125–155s.

This is the longest visual section and should not be rushed.

### Act 6 — The host sees a process with boundaries

Scenes:

- `containersAct6HostBoundaries.tsx`
- `containersAct6NamespacesCgroups.tsx`

Must show:

- Host kernel foundation under a real process or process group.
- No VM-shaped boot sequence.
- Filesystem, namespace, and cgroup frames around the process.
- Namespace split-view for what the process can see.
- Cgroup budget ring/meters for CPU, memory, and I/O.
- The hold line: `Namespaces shape the view. Cgroups shape the budget.`

Timing references: `n023`–`n027`, `b023`–`b027`, 100–125s.

### Act 7 — Reassemble the model

Scenes:

- `containersAct7WorkflowReturn.tsx`
- `containersAct7FinalFormula.tsx`

Must show:

- Return of the workflow chain with sharper labels.
- Final equation: `container = process + filesystem view + namespaces + cgroups`.
- Optional small commit loop only if timing allows.
- Final stable diagram: `Registry -> Image = layers + config -> Runtime -> Container = process + writable layer + namespaces + cgroups`.
- Final correction: `An image does not run. A process runs.`

Timing references: `n028`–`n031`, `b028`–`b031`, 80–105s.

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
- Do not show the registry as a place where containers run.
- Do not show containers as tiny virtual machines.
- Do not turn the video into a Docker command tutorial.

## Timing implementation notes

Use named timing constants per scene, for example:

```ts
const timings = {
  commandDoorway: 0,
  question: 11,
  correction: 20,
  thesis: 42,
};
```

The values can guide animation ordering without requiring frame-perfect sync.

If recorded narration is slower than expected, extend holds rather than crowding diagrams. Prioritize readability over exact scene budgets.

## Narration handling

Initial implementation can use unobtrusive text markers or comments keyed to narration IDs.

Do not paste full narration text into scene files unless needed for temporary timing review. Prefer IDs such as `n017` in comments or helper labels.

If adding narration tooling, generate output under:

```text
artifacts/narration/
```

Do not commit generated audio or binary exports.

## Preview and test commands

Before committing implementation changes, run:

```bash
npm run build
```

When the project entry point exists, also run:

```bash
npm run build:containers
```

When practical for preview changes, run:

```bash
npm run screenshots:containers
```

Generated screenshots must stay under `artifacts/screenshots/` and must not be committed.

## Risks and simplifications

- **Duration risk:** The full timeline is long. If Motion Canvas implementation becomes too large for one pass, split by act ranges while preserving source scene boundaries.
- **Component risk:** The component list is intentionally video-local. Do not generalize into a shared framework until reuse is proven.
- **Narration parser risk:** Existing narration tooling may expect a different Markdown shape. Update the parser only if adding narration scripts in the implementation PR.
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

## Must not change

- Do not change ready narration IDs from `04-narration.md`.
- Do not change ready beat IDs from `03-beats.md`.
- Do not rewrite `05-scene-timeline.md` as part of implementation unless a clear defect is found and explicitly documented.
- Do not add future technical topics such as Kubernetes, Docker networking deep dives, image signing, containerd internals, or OCI spec details beyond the small approved note.
- Do not commit rendered videos, screenshots, or generated audio.
