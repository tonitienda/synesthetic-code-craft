---
type: scene-timeline
status: ready
depends_on:
  - 03-beats.md
  - 04-narration.md
---

# 05 — Scene timeline: Docker containers from image to running process

## Purpose

This file maps the ready narration segments in `04-narration.md` to acts, scenes, timing budgets, teaching jobs, and required conceptual moments.

It is the edit map for the video. It answers:

- what happens
- in what order
- which narration and beat IDs are involved
- roughly how much time each section should receive
- what idea each scene must land

It deliberately does **not** specify final animation choreography, camera movement, layout, reusable components, or Motion Canvas implementation details. Those belong in `06-motion-design.md` and later implementation phases.

The timeline preserves the core model:

```text
image -> runtime setup -> process with boundaries
```

And the final memory:

```text
container = process + filesystem view + namespaces + cgroups
```

## Status notes

- Acts are story containers inherited from the approved beats and narration.
- Scenes are edit/timing units, not final Motion Canvas scenes.
- Timing values are budgets, not frame-perfect edit points.
- Narration IDs from `04-narration.md` are stable references for TTS, subtitles, motion design, and implementation.
- The optional `docker commit` loop remains secondary and must not become the final memory.

## What belongs here

Each scene should contain:

- scene title
- duration budget
- narration references
- beat references
- teaching job
- required conceptual moments
- required on-screen terms
- transition intent

## What does not belong here

Keep the following out of this file:

- final screen layouts
- ASCII key frames
- camera moves
- detailed choreography
- component names or component APIs
- Motion Canvas implementation notes
- detailed transition mechanics
- low-level drawing instructions

Those decisions are made in `06-motion-design.md`.

## Timing rules

- Target video duration: 7–10 minutes.
- Keep Act 5 as the longest explanatory section because it carries the copy-on-write payoff.
- Prefer short silent holds after important corrections:
  - `An image does not run. A process runs.`
  - `Push and pull move images. Run creates containers.`
  - `Namespaces shape the view. Cgroups shape the budget.`
- If narration recording is slower than the budget, extend holds rather than crowding concepts.

---

# Act 1 — The familiar command, corrected

Act duration budget: 55–70s

Narration: `n001`–`n003`

Beats: `b001`–`b003`

## Scene 1.1 — Command doorway and core correction

Scene duration budget: 55–70s

Teaching job:
Introduce the familiar `docker run nginx` command, then correct the misleading intuition that the image itself runs.

Required conceptual moments:
- Start from the command as the doorway into the topic.
- Ask what actually runs.
- Separate image from running process.
- Introduce the thesis chain: image, runtime, container process.

Required on-screen terms:
- `docker run nginx`
- `what runs?`
- `image`
- `running process`
- `An image does not run.`
- `A process runs.`
- `image -> runtime -> container process`

Transition intent:
Move from the thesis chain into the four nouns that need to be separated.

---

# Act 2 — Four nouns, four roles

Act duration budget: 75–95s

Narration: `n004`–`n008`

Beats: `b004`–`b008`

## Scene 2.1 — Vocabulary map

Scene duration budget: 45–55s

Teaching job:
Separate image, registry, runtime, and container so the viewer stops treating them as interchangeable Docker words.

Required conceptual moments:
- Introduce the four words as different roles.
- Define an image as packaged filesystem plus configuration.
- Define a registry as storage and distribution for image artifacts.
- Correct the misconception that the registry is where containers run.

Required on-screen terms:
- `Image — packaged starting point`
- `Registry — stores images`
- `Runtime — prepares and starts`
- `Container — running instance`
- `filesystem layers`
- `config / metadata`
- `default command`
- `environment`
- `registry = image storage + distribution`
- `not where containers run`

Transition intent:
Move from static nouns to the verbs that connect them.

## Scene 2.2 — Workflow verbs and Docker doorway

Scene duration budget: 30–40s

Teaching job:
Clarify what `build`, `push`, `pull`, and `run` do, with `run` as the only step that creates a container.

Required conceptual moments:
- Build produces an image.
- Push moves an image to a registry.
- Pull moves an image back to a machine.
- Run creates a container.
- Docker is the familiar doorway, but the model is broader than Docker.

Required on-screen terms:
- `build produces an image`
- `push / pull move images`
- `run creates a container`
- `Docker is the familiar doorway`
- `broader model: OCI-style images and runtimes`

Transition intent:
Zoom conceptually into the image so the next act can open it.

---

# Act 3 — Open the image

Act duration budget: 80–105s

Narration: `n009`–`n011`

Beats: `b009`–`b011`

## Scene 3.1 — Image internals as layers plus config

Scene duration budget: 80–105s

Teaching job:
Replace the idea of an image as one mysterious blob with the idea of ordered filesystem layers plus configuration.

Required conceptual moments:
- Open the image.
- Show that it is layers plus configuration.
- Explain that each layer is an ordered filesystem change.
- Combine layers into the filesystem view the container will use.
- Establish that image layers are read-only, reusable, and shared.

Required on-screen terms:
- `image = layers + config`
- `not one mysterious blob`
- `base filesystem`
- `packages`
- `runtime dependencies`
- `application files`
- `ordered filesystem changes`
- `stacked in order`
- `filesystem view`
- `read-only`
- `reusable`
- `shared by multiple containers`

Transition intent:
Send the image layers and configuration toward the runtime setup step.

---

# Act 4 — What run prepares

Act duration budget: 95–120s

Narration: `n012`–`n016`

Beats: `b012`–`b016`

## Scene 4.1 — Runtime preparation pipeline

Scene duration budget: 60–75s

Teaching job:
Explain `run` as environment preparation before process startup, not as the image magically becoming alive.

Required conceptual moments:
- Runtime receives image layers, image configuration, and run options.
- Runtime presents image layers as one filesystem view.
- Runtime adds a private writable layer on top.
- Image layers remain shared and read-only.

Required on-screen terms:
- `image layers`
- `image config`
- `run options`
- `runtime prepares an environment`
- `one filesystem view`
- `private writable layer`
- `image layers stay read-only`

Transition intent:
Move from filesystem setup into startup configuration and process boundaries.

## Scene 4.2 — Startup configuration and boundaries

Scene duration budget: 35–45s

Teaching job:
Show that files are only part of the setup; configuration determines what process starts, and the process starts inside prepared boundaries.

Required conceptual moments:
- Startup configuration shapes the process.
- The process starts.
- The process has a filesystem view.
- The process has isolated system views.
- The process can have resource accounting or limits.
- The combined result is the container instance.

Required on-screen terms:
- `command`
- `environment`
- `working directory`
- `user`
- `process starts`
- `filesystem view`
- `namespace views`
- `cgroup budget`

Transition intent:
Duplicate the conceptual container into two independent containers that share one image underneath.

---

# Act 5 — Same image, two containers

Act duration budget: 125–155s

Narration: `n017`–`n022`

Beats: `b017`–`b022`

## Scene 5.1 — Shared read-only layers and private writable layers

Scene duration budget: 65–80s

Teaching job:
Show that two containers started from the same image can share the same read-only image layers while keeping separate writable layers.

Required conceptual moments:
- Start two containers from one image.
- Both containers share the same underlying image layers.
- The shared layers stay read-only.
- Neither container changes the original image.
- Each container gets its own writable layer.
- Runtime changes are private to the container that made them.

Required on-screen terms:
- `same image`
- `Container A`
- `Container B`
- `shared read-only layers`
- `neither container changes the image`
- `Writable A`
- `Writable B`
- `runtime changes are private`

Transition intent:
Move from the layer structure into a concrete file read/write example.

## Scene 5.2 — Copy-on-write file trace

Scene duration budget: 60–75s

Teaching job:
Make the copy-on-write mental model visible: reads can use the shared original, while a write records a private changed version for only the writing container.

Required conceptual moments:
- Introduce `/etc/app.conf` in the shared image layer.
- Container A reads the shared original.
- Container B reads the same shared original.
- Reading does not create a private change.
- Container A writes a change.
- The shared original remains unchanged.
- Container A sees its modified version.
- Container B still sees the original.
- Independent writable layers explain the independence of the containers.

Required on-screen terms:
- `/etc/app.conf`
- `read: shared original`
- `write: record change in Writable A`
- `shared original unchanged`
- `copy-on-write mental model`
- `A sees: modified`
- `B sees: original`
- `independent writable layers`

Transition intent:
Pull back from the filesystem view and introduce the host/kernel point of view.

---

# Act 6 — The host sees a process with boundaries

Act duration budget: 100–125s

Narration: `n023`–`n027`

Beats: `b023`–`b027`

## Scene 6.1 — Host process and boundary frames

Scene duration budget: 45–55s

Teaching job:
Ground the container in the host: from the host's point of view, it is a process or process group, not a tiny machine booting from scratch.

Required conceptual moments:
- Reveal the host kernel underneath the container.
- Connect the running process to the host point of view.
- Reject the tiny-VM mental model.
- Refine “just a process” into “process with prepared boundaries.”

Required on-screen terms:
- `host kernel`
- `process / process group`
- `not a tiny machine booting from scratch`
- `container = process with prepared boundaries`
- `filesystem view`
- `namespace views`
- `cgroup budget`

Transition intent:
Move from the container as a bounded process to the two most important boundary concepts: namespaces and cgroups.

## Scene 6.2 — Namespaces and cgroups

Scene duration budget: 55–70s

Teaching job:
Distinguish the two sides of the boundary: namespaces shape what the process can see; cgroups shape what the process can use.

Required conceptual moments:
- Namespaces shape the process view.
- The host has the larger system.
- The container sees a shaped subset view.
- Cgroups shape the process budget.
- CPU, memory, and I/O are examples of resources.
- The final boundary memory is view plus budget.

Required on-screen terms:
- `namespaces`
- `what the process can see`
- `processes`
- `mounts`
- `network`
- `hostname`
- `cgroups`
- `what the process can use`
- `CPU`
- `memory`
- `I/O`
- `Namespaces shape the view.`
- `Cgroups shape the budget.`

Transition intent:
Reassemble the whole workflow from the sharper terms introduced across the video.

---

# Act 7 — Reassemble the model

Act duration budget: 80–105s

Narration: `n028`–`n031`

Beats: `b028`–`b031`

## Scene 7.1 — Final workflow with sharper words

Scene duration budget: 25–35s

Teaching job:
Rebuild the familiar workflow with the corrected vocabulary: build produces, push stores, pull retrieves, run creates a container process.

Required conceptual moments:
- Return to the full workflow.
- Attach the corrected meaning to each verb.
- Reuse earlier concepts as brief annotations.
- Prepare the viewer for the compact final model.

Required on-screen terms:
- `build produces an image`
- `push stores it`
- `pull retrieves it`
- `run creates a container process`
- `image = layers + config`
- `run = runtime setup`
- `container = bounded process`

Transition intent:
Condense the reassembled workflow into the final formula.

## Scene 7.2 — Final formula and optional commit loop

Scene duration budget: 55–70s

Teaching job:
End on the compact definition of a container, while keeping `docker commit` as a small optional loop rather than the main idea.

Required conceptual moments:
- Build the final formula from previously introduced parts.
- State that the process is real.
- State that boundaries make it a container.
- Optionally show the commit loop as a secondary note.
- Return focus to the running-container model.
- End with the stable final memory.

Required on-screen terms:
- `container = process + filesystem view + namespaces + cgroups`
- `the process is real`
- `the boundaries make it a container`
- `optional loop: commit`
- `usually rebuild from source + Dockerfile`
- `The image is the packaged source.`
- `The runtime prepares the environment.`
- `The container is the bounded running process.`
- `An image does not run. A process runs.`

End state:
Hold the final model for a quiet beat, then fade out.
