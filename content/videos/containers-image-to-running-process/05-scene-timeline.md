---
type: scene-timeline
status: ready
depends_on:
  - 03-beats.md
  - 04-narration.md
---

# 05 — Scene timeline: Docker containers from image to running process

## Purpose

This file turns the ready narration segments in `04-narration.md` into implementation-ready acts, scenes, and timed moments.

The timeline should guide Motion Canvas work without inventing a new story structure. It keeps the approved act structure from `03-beats.md`, then lets each act group one or more implementation scenes. Those scenes preserve the core model:

```text
image -> runtime setup -> process with boundaries
```

And the final memory:

```text
container = process + filesystem view + namespaces + cgroups
```

## Status notes

- Status is `ready`.
- Acts are story containers from the approved beats; scenes are implementation units inside acts.
- Timed moment headings are relative to the start of their scene, not the full act or video.
- Timings are budgets, not frame-perfect edit points.
- The narration IDs from `04-narration.md` are stable references for future TTS and implementation.
- The optional `docker commit` loop remains secondary and must not become the final memory.

## Global visual language

- Dark background with high-contrast type and minimal geometry.
- Calm motion, generous spacing, and restrained on-screen copy.
- Prefer diagram transformations over cuts when the same concept evolves.
- Use soft glow only to direct attention, not as a decorative style.
- Keep Docker as the doorway, but avoid making the scene feel like a command tutorial.
- Do not show the registry as a place where containers run.
- Do not show containers as tiny virtual machines.

## Reusable visual components

These are implementation names, not requirements to over-abstract immediately:

- `CommandCallout` — large monospace command or focused command fragment.
- `VocabularyCard` — calm labeled card with a short role label.
- `ImageBox` — package-like box that can open into layers and config.
- `RegistryBox` — shelf/storage visual for image artifacts.
- `RuntimeBox` — transformer/preparation box that receives inputs and emits a container instance.
- `LayerStack` — ordered transparent filesystem sheets.
- `WritableLayer` — per-container top layer, visually distinct from image layers.
- `ProcessBox` — the real running process.
- `ContainerInstance` — process plus filesystem view plus boundary frames.
- `CopyOnWriteAnimation` — read/write file trace between shared layers and writable layers.
- `KernelLayer` — stable host kernel foundation below processes.
- `NamespaceView` — frame or split-view showing what the process can see.
- `CgroupLimit` — budget ring or meters for what the process can use.

## Act, scene, and timing rules

- Use `Act N` for story-level structure inherited from the beats and narration.
- Use `Scene N.M` for Motion Canvas-sized implementation units inside an act.
- A short act can contain one scene; a denser act can contain several scenes.
- Use `Moment:` labels inside scenes for timed animation/narration cues.
- Do not name an entire act as a scene unless it is deliberately implemented as one continuous scene.

## Timing rules

- Target video duration: 7–10 minutes.
- Keep Act 5 as the longest visual section because it carries the copy-on-write payoff.
- Prefer short silent holds after important corrections:
  - `An image does not run. A process runs.`
  - `Push and pull move images. Run creates containers.`
  - `Namespaces shape the view. Cgroups shape the budget.`
- If narration recording is slower than the budget, extend holds rather than crowding diagrams.

---

# Act 1 — The familiar command, corrected

Act duration budget: 55–70s

Narration: `n001`–`n003`

Beats: `b001`–`b003`

## Scene 1.1 — Command doorway and core correction

Scene duration budget: 55–70s


### Moment: 0.0s — Command doorway

Animation:
- Fade in a dark, empty frame.
- Bring in a single `CommandCallout` at center:

```bash
docker run nginx
```

- Keep the command large and quiet, as if typed into a terminal but without a full terminal UI.

Narration: `n001`

On-screen copy:
- `docker run nginx`

### Moment: 11.0s — What is actually running?

Animation:
- Slightly dim `docker` and `nginx`.
- Highlight the word `run`.
- Pull a thin question line out of `run`: `what runs?`

Narration: continuation of `n001`

On-screen copy:
- `what runs?`

### Moment: 20.0s — Image does not equal process

Animation:
- Transform the command into a split composition:

```text
IMAGE  ≠  RUNNING PROCESS
```

- Use an `ImageBox` on the left and a simple pulsing `ProcessBox` on the right.
- The not-equals mark should be clear but not aggressive.

Narration: `n002`

On-screen copy:
- `image`
- `running process`
- `An image does not run.`
- `A process runs.`

### Moment: 42.0s — Thesis chain

Animation:
- Replace the split with a left-to-right chain:

```text
image -> runtime -> container process
```

- The `RuntimeBox` appears as preparation machinery, not as a brand-specific product.
- The output is a `ContainerInstance` with a small `ProcessBox` inside.

Narration: `n003`

On-screen copy:
- `image`
- `runtime`
- `container process`

Transition:
- Pull back to reveal space for four vocabulary cards.

---

# Act 2 — Four nouns, four roles

Act duration budget: 75–95s

Narration: `n004`–`n008`

Beats: `b004`–`b008`

## Scene 2.1 — Vocabulary map

Scene duration budget: 45–55s


### Moment: 0.0s — Vocabulary map

Animation:
- Fade in four `VocabularyCard`s arranged as a clean map:
  - `Image`
  - `Registry`
  - `Runtime`
  - `Container`
- Add one short role label under each card.

Narration: `n004`

On-screen copy:
- `Image — packaged starting point`
- `Registry — stores images`
- `Runtime — prepares and starts`
- `Container — running instance`

### Moment: 18.0s — Image definition

Animation:
- Enlarge `Image` card.
- Split its inside into two compartments:
  - `filesystem layers`
  - `config / metadata`

Narration: `n005`

On-screen copy:
- `filesystem layers`
- `config / metadata`
- `default command`
- `environment`

### Moment: 34.0s — Registry definition

Animation:
- Move the `ImageBox` toward the `RegistryBox` shelf.
- Show image artifacts sitting on the shelf.
- Keep the shelf static: no process pulse, no runtime glow.

Narration: `n006`

On-screen copy:
- `registry = image storage + distribution`
- `not where containers run`

## Scene 2.2 — Workflow verbs and Docker doorway

Scene duration budget: 30–40s

### Moment: 0.0s — Workflow verbs

Animation:
- Re-arrange the vocabulary into a left-to-right pipeline:

```text
build -> image -> push -> registry -> pull -> local image -> run -> container
```

- Animate `build` producing an `ImageBox`.
- Animate `push` and `pull` as motion arrows carrying image artifacts.
- Highlight `run` as the only verb that creates a pulsing `ContainerInstance`.

Narration: `n007`

On-screen copy:
- `build produces an image`
- `push / pull move images`
- `run creates a container`

### Moment: 28.0s — Docker doorway, OCI note

Animation:
- Add a small side label near the pipeline:
  - `Docker interface`
  - `model maps broadly to OCI-style images and runtimes`
- Keep the note small and secondary.

Narration: `n008`

On-screen copy:
- `Docker is the familiar doorway`
- `broader model: OCI-style images and runtimes`

Transition:
- Fade the note.
- Zoom into the `ImageBox`.

---

# Act 3 — Open the image

Act duration budget: 80–105s

Narration: `n009`–`n011`

Beats: `b009`–`b011`

## Scene 3.1 — Image internals as layers plus config

Scene duration budget: 80–105s


### Moment: 0.0s — Image is not a blob

Animation:
- Center the `ImageBox`.
- Open it like a package into a vertical `LayerStack` plus a small config card.

Narration: `n009`

On-screen copy:
- `image = layers + config`
- `not one mysterious blob`

### Moment: 22.0s — Ordered filesystem changes

Animation:
- Separate the `LayerStack` into transparent sheets.
- Label the sheets from bottom to top:
  - `base filesystem`
  - `packages`
  - `runtime dependencies`
  - `application files`
- Restack them in order into one composed filesystem view.

Narration: `n010`

On-screen copy:
- `ordered filesystem changes`
- `stacked in order`
- `filesystem view`

### Moment: 58.0s — Shared and read-only

Animation:
- Add a subtle lock/fixed-frame treatment to each image layer.
- Add a stable label across the stack: `shared read-only image layers`.
- Show two faint future container outlines reading from the same lower stack, but do not fully introduce Act 5 yet.

Narration: `n011`

On-screen copy:
- `read-only`
- `reusable`
- `shared by multiple containers`

Transition:
- Collapse layers and config into inputs flowing toward a `RuntimeBox`.

---

# Act 4 — What run prepares

Act duration budget: 95–120s

Narration: `n012`–`n016`

Beats: `b012`–`b016`

## Scene 4.1 — Runtime preparation pipeline

Scene duration budget: 60–75s


### Moment: 0.0s — Runtime inputs

Animation:
- Show the `RuntimeBox` receiving three inputs:
  - image layers
  - image config
  - run options
- Keep this as a conceptual preparation diagram, not a strict implementation sequence.

Narration: `n012`

On-screen copy:
- `image layers`
- `image config`
- `run options`
- `runtime prepares an environment`

### Moment: 24.0s — Filesystem view

Animation:
- The `LayerStack` aligns into a single panel labeled `filesystem view`.
- The separate layer seams remain faintly visible to preserve the layered origin.

Narration: `n013`

On-screen copy:
- `one filesystem view`

### Moment: 44.0s — Private writable layer

Animation:
- Add a distinct `WritableLayer` above the shared read-only layers.
- Use a restrained accent color so the private layer is visible but not neon.

Narration: `n014`

On-screen copy:
- `private writable layer`
- `image layers stay read-only`

## Scene 4.2 — Startup configuration and boundaries

Scene duration budget: 35–45s

### Moment: 0.0s — Startup configuration

Animation:
- Bring in small config cards that attach to a waiting `ProcessBox`:
  - `command`
  - `env`
  - `workdir`
  - `user`
- Show them shaping the process without overcrowding the frame.

Narration: `n015`

On-screen copy:
- `command`
- `environment`
- `working directory`
- `user`

### Moment: 22.0s — Process starts inside boundaries

Animation:
- Start the `ProcessBox` with a gentle pulse.
- Wrap it with three calm frames:
  - `filesystem view`
  - `namespace views`
  - `cgroup budget`
- The resulting group becomes a `ContainerInstance`.

Narration: `n016`

On-screen copy:
- `process starts`
- `filesystem view`
- `namespace views`
- `cgroup budget`

Transition:
- Duplicate the `ContainerInstance` into A and B while keeping shared layers below.

---

# Act 5 — Same image, two containers

Act duration budget: 125–155s

Narration: `n017`–`n022`

Beats: `b017`–`b022`

## Scene 5.1 — Shared read-only layers and private writable layers

Scene duration budget: 65–80s


### Moment: 0.0s — Two runs from one image

Animation:
- Place one shared `LayerStack` at the bottom center.
- Branch upward into `Container A` and `Container B`.
- Each container has its own `ProcessBox` and a placeholder top layer.

Narration: `n017`

On-screen copy:
- `same image`
- `Container A`
- `Container B`

### Moment: 24.0s — Shared part stays shared

Animation:
- Draw read arrows from both containers to the same shared read-only layers.
- Do not duplicate the lower layer stack.
- Keep the read-only lock visible.

Narration: `n018`

On-screen copy:
- `shared read-only layers`
- `neither container changes the image`

### Moment: 48.0s — Private writable layers

Animation:
- Add `Writable A` above Container A's view.
- Add `Writable B` above Container B's view.
- Use two related but distinct muted accent colors.

Narration: `n019`

On-screen copy:
- `Writable A`
- `Writable B`
- `runtime changes are private`

## Scene 5.2 — Copy-on-write file trace

Scene duration budget: 60–75s

### Moment: 0.0s — Read from shared original

Animation:
- Introduce a small file token in the shared layer: `/etc/app.conf`.
- Container A reads it from the shared layer.
- Container B also reads the same original file.
- No new file token appears in either writable layer.

Narration: `n020`

On-screen copy:
- `/etc/app.conf`
- `read: shared original`

### Moment: 22.0s — Write records a private change

Animation:
- Container A edits `/etc/app.conf`.
- The original file remains in the shared layer.
- A modified file token appears in `Writable A`.
- Label this as the copy-on-write mental model without explaining storage-driver internals.

Narration: `n021`

On-screen copy:
- `write: record change in Writable A`
- `shared original unchanged`
- `copy-on-write mental model`

### Moment: 50.0s — Different views, independent containers

Animation:
- Split the upper frame into two filesystem views:
  - Container A sees modified `/etc/app.conf`.
  - Container B sees original `/etc/app.conf`.
- Hold long enough for the independence idea to land.

Narration: `n022`

On-screen copy:
- `A sees: modified`
- `B sees: original`
- `independent writable layers`

Transition:
- Pull back from filesystem layers.
- Slide a `KernelLayer` under the containers.

---

# Act 6 — The host sees a process with boundaries

Act duration budget: 100–125s

Narration: `n023`–`n027`

Beats: `b023`–`b027`

## Scene 6.1 — Host process and boundary frames

Scene duration budget: 45–55s


### Moment: 0.0s — Host kernel foundation

Animation:
- Add a broad `KernelLayer` beneath a `ContainerInstance`.
- Connect the process pulse to the host kernel foundation.
- Avoid any boot animation or VM-shaped box.

Narration: `n023`

On-screen copy:
- `host kernel`
- `process / process group`
- `not a tiny machine booting from scratch`

### Moment: 28.0s — Not just a casual process

Animation:
- Start from a plain `ProcessBox`.
- Add three labeled frames around it:
  - `filesystem view`
  - `namespace views`
  - `cgroup budget`

Narration: `n024`

On-screen copy:
- `container = process with prepared boundaries`

## Scene 6.2 — Namespaces and cgroups

Scene duration budget: 55–70s

### Moment: 0.0s — Namespaces shape the view

Animation:
- Zoom into the `namespace views` frame.
- Use a split view:
  - left: larger host resources
  - right: smaller container-visible view
- Show simple icons for processes, mounts, network, and hostname as optional small labels.

Narration: `n025`

On-screen copy:
- `namespaces`
- `what the process can see`
- `processes`
- `mounts`
- `network`
- `hostname`

### Moment: 28.0s — Cgroups shape the budget

Animation:
- Transition to a `CgroupLimit` ring around the `ProcessBox`.
- Add small resource meters for `CPU`, `memory`, and `I/O`.
- Keep the ring calm, not alarm-like.

Narration: `n026`

On-screen copy:
- `cgroups`
- `what the process can use`
- `CPU`
- `memory`
- `I/O`

### Moment: 50.0s — View plus budget

Animation:
- Show the process above the host kernel inside two clear frames:
  - `view`
  - `budget`
- Then expand the labels back to `namespaces` and `cgroups`.

Narration: `n027`

On-screen copy:
- `Namespaces shape the view.`
- `Cgroups shape the budget.`

Transition:
- Reassemble the full workflow diagram from left to right.

---

# Act 7 — Reassemble the model

Act duration budget: 80–105s

Narration: `n028`–`n031`

Beats: `b028`–`b031`

## Scene 7.1 — Final workflow and compact model

Scene duration budget: 25–35s


### Moment: 0.0s — Workflow returns with sharper words

Animation:
- Bring back the Act 2 pipeline:

```text
build -> image -> push -> registry -> pull -> local image -> run -> container
```

- Add small annotations from the earlier acts:
  - `image = layers + config`
  - `run = runtime setup`
  - `container = bounded process`

Narration: `n028`

On-screen copy:
- `build produces an image`
- `push stores it`
- `pull retrieves it`
- `run creates a container process`

## Scene 7.2 — Final formula and optional commit loop

Scene duration budget: 55–70s

### Moment: 0.0s — Final formula

Animation:
- Condense the right side into a final equation:

```text
container = process + filesystem view + namespaces + cgroups
```

- Build the formula piece by piece from existing diagram parts.

Narration: `n029`

On-screen copy:
- `container = process + filesystem view + namespaces + cgroups`
- `the process is real`
- `the boundaries make it a container`

### Moment: 26.0s — Optional commit loop

Animation:
- If duration allows, show a small secondary loop off to the side:

```text
writable changes -> commit -> new image layer
```

- Keep this note visually smaller than the final formula.
- Return focus immediately to the running-container model.

Narration: `n030`

On-screen copy:
- `optional loop: commit`
- `usually rebuild from source + Dockerfile`

### Moment: 44.0s — Stable final diagram

Animation:
- Settle into the final diagram:

```text
Registry -> Image = layers + config -> Runtime -> Container = process + writable layer + namespaces + cgroups
```

- End by briefly highlighting:
  - `image`
  - `runtime`
  - `bounded running process`

Narration: `n031`

On-screen copy:
- `The image is the packaged source.`
- `The runtime prepares the environment.`
- `The container is the bounded running process.`
- `An image does not run. A process runs.`

End state:
- Hold the final diagram for a quiet beat, then fade out.
