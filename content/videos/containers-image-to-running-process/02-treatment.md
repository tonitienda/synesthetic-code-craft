---
type: treatment
status: ready
depends_on:
  - 00-specs.md
  - 01-research.md
---

# 02 — Treatment: Docker containers from image to running process

## Central thesis

A Docker container is not the image itself, and it is not a tiny machine being booted. It is a real process started from an image, inside a prepared environment: filesystem layers, a private writable layer, isolated views through namespaces, and resource boundaries through cgroups.

The video should turn the viewer’s vague Docker vocabulary into a mechanical mental model:

```text
image  -> packaged filesystem + config
registry -> stores and distributes images
runtime -> prepares the environment
container -> running process instance
```

The final memory should be:

```text
container = process + filesystem view + namespaces + cgroups
```

Or, more narratively:

```text
docker run = image + runtime setup -> process with boundaries
```

## Treatment summary

The story starts with a command most developers recognize:

```bash
docker run nginx
```

Instead of explaining Docker through commands, the video uses that command as a doorway into the model underneath.

The viewer first learns that an image does not run; a process runs. The image is the packaged source of the filesystem and startup configuration. Then the video separates the workflow into build, push, pull, and run, showing that only `run` creates a container.

The middle of the video makes the image concrete: layers plus configuration. Layers are shown as reusable read-only filesystem changes. When a container starts, those shared layers are combined into a filesystem view and topped with a private writable layer.

The visual payoff is two containers created from the same image. They share the same read-only image layers but each has its own writable layer. A change in one container appears only in that container’s writable layer. This makes copy-on-write useful and memorable without turning the episode into storage-driver internals.

The final section zooms down to the host kernel. The container is a process, but not “just” a process in the casual sense. It is a process whose view of the system is shaped by namespaces and whose resource usage can be accounted for or limited by cgroups.

The video ends by reassembling the full model from left to right:

```text
registry -> image -> runtime -> process with boundaries
```

Optionally, a short closing loop can mention `docker commit`: container writable changes can be captured into a new image layer, although normal workflows usually rebuild from Dockerfiles.

## Viewer journey

### Starting state

The viewer probably uses Docker through recipes:

- build this image
- push it somewhere
- pull it somewhere else
- run it
- exec into it
- delete it when it breaks

They may know the words image, container, registry, and runtime, but those words may blur together.

The likely misconceptions are:

- an image is like a stopped container
- a registry is where containers live
- a container is like a small VM
- Docker is the whole container world
- layers are an implementation detail with no practical meaning
- two containers from the same image somehow duplicate the whole image

### Desired ending state

The viewer should be able to say:

- “An image is a packaged filesystem plus config.”
- “A registry stores images; it does not run containers.”
- “Running an image creates a container process.”
- “The image layers are shared and read-only.”
- “Each container gets a private writable layer.”
- “Namespaces control what the process can see.”
- “Cgroups control or account for what the process can use.”
- “Docker is the familiar interface, but the model maps to OCI-style containers more broadly.”

### Emotional journey

The video should feel like moving from fog to machinery:

1. Familiar but vague: “I know this command, but what actually starts?”
2. Clean separation: “Ah, image, registry, runtime, and container are different things.”
3. Mechanical clarity: “The filesystem is assembled from layers.”
4. Payoff: “That explains why two containers do not overwrite each other.”
5. Grounding: “It is a host process with boundaries, not magic.”

The tone should stay calm and precise. The goal is confidence, not surprise.

## Act structure

## Act 1 — The command is familiar, the model is not

### Purpose

Open with the everyday Docker command and create the central question: what actually runs?

### Core idea

`docker run nginx` does not run “the image” as if the image were an executable machine. It creates a container: a running process instance based on the image.

### What this act must achieve

- Establish the practical entry point: `docker run`.
- Separate “image” from “running thing”.
- Introduce the main thesis without overwhelming the viewer.
- Signal that Docker vocabulary is being used because it is familiar, but the mental model is broader.

### Conceptual movement

```text
familiar command -> question -> image does not run -> process runs
```

### Visual direction

Start with a single large command callout:

```bash
docker run nginx
```

Then split the screen:

```text
IMAGE ≠ RUNNING PROCESS
```

Transform the command into a simple chain:

```text
image -> runtime -> container process
```

### Avoid

- Opening with OCI terminology.
- Opening with Linux namespaces/cgroups.
- Saying “containers are just processes” too early.
- Making this feel like a command tutorial.

## Act 2 — Four nouns that should not be mixed

### Purpose

Give the viewer a vocabulary map before diving into layers and runtime mechanics.

### Core idea

Image, registry, runtime, and container are different roles in the system.

### What this act must achieve

Define the four core nouns:

```text
Image     = packaged filesystem layers + config
Registry  = image storage/distribution
Runtime   = creates the process environment
Container = running process instance
```

Also place Docker and OCI correctly:

- Docker is the familiar interface and ecosystem name most viewers recognize.
- OCI is the broader standard/model that makes images and runtimes interoperable.
- The video should not become a Docker vs containerd vs runc diagram.

### Conceptual movement

```text
one blurred Docker workflow -> four distinct responsibilities
```

### Visual direction

Use four labeled boxes. Keep them visually distinct:

- `ImageBox`: a sealed package with layers and config.
- `RegistryBox`: a storage/distribution shelf, not a running server.
- `RuntimeBox`: a machine/transformer that prepares the environment.
- `ProcessBox`: the thing actually running.

Then show the workflow:

```text
build -> image -> push -> registry -> pull -> local image -> run -> container
```

The key visual contrast:

```text
push/pull move images
run creates a container
```

### Avoid

- Drawing the registry as if it hosts running containers.
- Explaining every Dockerfile instruction.
- Listing runtime components in depth.
- Turning OCI into a separate tangent.

## Act 3 — The image is layers plus configuration

### Purpose

Make the image concrete enough that the later writable-layer explanation feels natural.

### Core idea

An image is not a single opaque blob. It is a stack of reusable filesystem layers plus metadata/configuration that tells the runtime how to start the process.

### What this act must achieve

- Explain image layers as filesystem changes.
- Show that layers are reusable and ordered.
- Introduce config/metadata as the non-filesystem part of the image.
- Prepare the viewer for copy-on-write.

### Conceptual movement

```text
image as black box -> image as layer stack + config
```

### Visual direction

Open the `ImageBox` into two compartments:

```text
Image
├─ config / metadata
└─ filesystem layers
```

Show the layer stack as transparent sheets:

```text
app files
runtime dependencies
installed packages
base filesystem
```

Then collapse the stack back into a single image artifact.

A small label can say:

```text
read-only shared layers
```

### Avoid

- Explaining layer digests, manifests, compression, media types, or exact OCI file structure.
- Saying that layers are always created exactly one-to-one with Dockerfile lines.
- Using “template” as the main definition for image.

## Act 4 — Run means preparing a process environment

### Purpose

Turn `docker run` into a sequence of conceptual setup steps.

### Core idea

The runtime uses the image and run options to prepare the filesystem, process configuration, isolation boundaries, and resource controls, then starts the process.

### What this act must achieve

Show the conceptual runtime moment:

```text
image + run options -> prepared environment -> process starts
```

Include these setup ideas, but keep them lightweight:

- resolve/pull image if needed
- mount/assemble filesystem layers
- add private writable layer
- set command, env, working directory, user, etc.
- create namespace views
- attach cgroup accounting/limits
- start the process

### Conceptual movement

```text
run as magic verb -> run as environment preparation + process start
```

### Visual direction

The `RuntimeBox` receives:

```text
image layers
image config
run options
```

It outputs:

```text
container process
filesystem view
namespace views
cgroup budget
```

This should be a clean transformation, not a low-level implementation diagram.

### Avoid

- Claiming these are exact chronological steps for every runtime/platform.
- Diving into Docker Engine internals.
- Explaining Docker Desktop VM caveats unless needed as a small note later.
- Overexplaining security features.

## Act 5 — Why two containers from the same image do not overwrite each other

### Purpose

Deliver the central visual payoff of the episode.

### Core idea

The image layers are shared and read-only. Each container gets its own writable layer. When a container changes something, that change goes into its private writable layer, not into the shared image.

### What this act must achieve

- Explain writable layer.
- Explain copy-on-write as a mental model.
- Show two containers sharing image layers but not writable state.
- Make container independence feel mechanical rather than magical.

### Conceptual movement

```text
same image -> two containers -> shared read-only layers -> separate writable layers
```

### Visual direction

Show one image stack at the bottom. Then fork into two container instances:

```text
Container A process       Container B process
Writable A                Writable B
Shared image layers       Shared image layers
```

Or, visually better:

```text
          shared image layers
             /          \
writable A + process   writable B + process
```

Animate a file modification:

1. A file exists in the shared image layer.
2. Container A reads it.
3. Container A changes it.
4. The changed file appears in Writable A.
5. Container B still sees the original file.

This is the moment where the viewer should think:

> Ah, that is why containers from the same image are independent.

### Avoid

- Going into OverlayFS internals.
- Saying every write literally copies the whole file in every implementation.
- Treating copy-on-write as the whole definition of containers.
- Spending too long on `docker commit` here.

## Act 6 — The kernel view: a process with boundaries

### Purpose

Ground the container in the host operating system without making the video a Linux internals lecture.

### Core idea

From the host kernel’s point of view, the container is a process or group of processes. What makes it container-like is the prepared environment around it: namespaces shape what it can see, and cgroups shape what it can use.

### What this act must achieve

- Explain namespaces in one memorable sentence.
- Explain cgroups in one memorable sentence.
- Make the “process with boundaries” idea precise.
- Avoid the misleading simplicity of “just a process”.

### Conceptual movement

```text
container instance -> host process -> boundaries around view and budget
```

### Visual direction

Place the host kernel as a base layer beneath the running process.

Around the process, draw three kinds of boundaries:

```text
filesystem view
namespace view
cgroup budget
```

For namespaces:

```text
what the process can see
```

For cgroups:

```text
how much the process can use
```

The strongest line for the act:

```text
Namespaces shape the view. Cgroups shape the budget.
```

### Avoid

- Listing every namespace in narration.
- Explaining cgroup v1 vs v2.
- Discussing seccomp, capabilities, AppArmor, SELinux, or rootless containers beyond a tiny “there can be more boundaries too” aside.
- Turning this into a VM comparison.

## Act 7 — Reassemble the full model

### Purpose

Close by rebuilding the whole explanation into one compact mental model.

### Core idea

The container workflow becomes clear once each word has a role.

### What this act must achieve

Restate the complete flow:

```text
build produces an image
push stores it in a registry
pull retrieves it locally
run creates a container process
```

Then restate the running model:

```text
container = process + filesystem view + namespaces + cgroups
```

Optional closing loop:

```text
container writable changes -> commit -> new image layer -> new image
```

But only include `docker commit` if it can be explained as a conceptual loop, not as recommended workflow.

### Conceptual movement

```text
many Docker words -> one mechanical model
```

### Visual direction

Bring back all boxes from Act 2, now connected with the deeper meaning from Acts 3–6.

Final image:

```text
Registry
  ↓ pull
Image = layers + config
  ↓ run/runtime
Container = process + writable layer + namespaces + cgroups
```

End on a stable diagram, not on a command.

### Avoid

- Introducing new concepts in the ending.
- Ending with too many caveats.
- Making the optional `docker commit` detail the final memory.

## Pacing intent

Target length: 7–10 minutes.

Suggested pacing:

```text
Act 1 — Hook / question: 45–60s
Act 2 — Vocabulary map: 60–90s
Act 3 — Image layers + config: 90–120s
Act 4 — Runtime setup: 90–120s
Act 5 — Writable layer / copy-on-write payoff: 120–150s
Act 6 — Process, namespaces, cgroups: 90–120s
Act 7 — Reassembled model: 45–75s
```

The treatment should favor clarity over speed. If the video needs to land closer to 10 minutes to make layers, writable state, namespaces, and cgroups feel precise, that is acceptable.

The longest section should be Act 5, because container independence is the most visual and probably the most satisfying explanation.

## Visual metaphor system

The video should use a consistent architecture vocabulary rather than random diagrams.

### Primary metaphor: packaging to process

The story moves from artifact to execution:

```text
package -> storage -> runtime preparation -> process
```

This gives the video a left-to-right flow.

### Secondary metaphor: layers

Filesystem state is shown vertically:

```text
writable layer
read-only layer
read-only layer
read-only layer
```

This gives the image/container filesystem a top-to-bottom structure.

### Tertiary metaphor: boundaries

Isolation/resource control is shown as rings or frames around the process:

```text
process
inside namespace boundary
inside cgroup/resource boundary
using filesystem view
```

This makes the kernel primitives feel like environment boundaries instead of abstract Linux trivia.

## Major visual components

Likely reusable components for the next phases:

- `CommandCallout`
- `ImageBox`
- `LayerStack`
- `RegistryBox`
- `RuntimeBox`
- `ProcessBox`
- `ContainerInstance`
- `WritableLayer`
- `CopyOnWriteLayer`
- `CopyOnWriteAnimation`
- `NamespaceView`
- `CgroupLimit`
- `KernelLayer`
- `IsolationBoundary`
- `BuildPipeline`

Component design should stay simple and iconic. The video is about mental model clarity, not realistic infrastructure diagrams.

## Explanatory constraints

### Docker first, OCI second

Use Docker as the language of the story because the title and audience are Docker-facing. Introduce OCI only after the basic Docker nouns are clear.

Suggested placement:

- Act 1 or Act 2: “We will say Docker because that is the interface most developers know.”
- Act 2: “The same model also maps to OCI images and OCI-style runtimes.”

Do not open with OCI.

### Avoid VM comparison

One phrase like “not a tiny machine being booted” is acceptable because it clarifies the thesis. But do not build a VM/container comparison section. Save that for the Firecracker/microVM video.

### Stay implementation-aware but not implementation-bound

The video can mention commonly used mechanisms like copy-on-write storage and Linux primitives, but it should avoid implying one exact runtime/storage-driver path is universal.

Good wording:

> Conceptually, the runtime assembles a filesystem view and adds a writable layer.

Risky wording:

> Docker always performs these exact steps in this exact order.

### Keep security as a background note

Security mechanisms are not the story. Namespaces and cgroups are enough for this video’s level. If security comes up, mention it as:

> Real container setups can add more boundaries, but the core mental model here is filesystem, namespaces, cgroups, and process.

## What the beats phase should do next

The beats phase should turn this treatment into small explanatory units with stable IDs.

Recommended beat groups:

1. Hook: `docker run nginx`.
2. Correction: the image does not run; a process runs.
3. Four nouns: image, registry, runtime, container.
4. Workflow: build/push/pull/run.
5. Image opened: layers plus config.
6. Runtime setup: filesystem, config, writable layer.
7. Two containers: shared image, separate writable layers.
8. Copy-on-write file change.
9. Kernel view: process.
10. Namespaces: what it can see.
11. Cgroups: how much it can use.
12. Final reassembled model.
13. Optional commit loop.

Each beat should keep one idea and one visual shift. The next phase should avoid writing final narration too early.

## Gate status

This treatment is `ready` for the beats phase.
