---
type: research
status: ready
depends_on:
  - 00-specs.md
---

# 01 — Research: Docker containers from image to running process

## Research goal

Support the video with enough technical accuracy to explain what happens when a Docker image becomes a running container, without turning the episode into a kernel or OCI specification deep dive.

The research should help the later outline/script phases keep these ideas precise:

- Docker is the familiar interface, but the underlying model is broader than Docker.
- An image is a packaged filesystem plus configuration/metadata.
- A registry stores and distributes images; it does not run containers.
- A container is a process started from an image, with a prepared filesystem, isolated views, and resource controls.
- Image layers are shared/read-only; each container gets its own writable layer.
- Namespaces answer “what can the process see?”
- cgroups answer “how much can the process use?”

## Primary sources

Use these as the authoritative sources for the video.

### Docker: image, container, registry, layers

- Docker Docs — What is a container?
  - URL: https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/
  - Useful for the audience-facing definition that containers are isolated processes, self-contained, isolated, independent, and portable.
  - Key teaching point: Docker’s own beginner docs say a container is “an isolated process” and later clarify that it has the files it needs to run.

- Docker Docs — What is an image?
  - URL: https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/
  - Useful for defining an image as a standardized package containing files, binaries, libraries, and configuration.
  - Key teaching point: images are immutable and composed of layers; each layer represents filesystem changes.

- Docker Docs — What is a registry?
  - URL: https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-registry/
  - Useful for keeping the registry role simple.
  - Key teaching point: a registry is a distribution/storage system for images. It is not where the container runs.

- Docker Docs — Understanding image layers
  - URL: https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/
  - Useful for explaining layers visually.
  - Key teaching point: image layers stack; when a container starts, a writable layer is added on top.

- Docker Docs — OverlayFS storage driver
  - URL: https://docs.docker.com/engine/storage/drivers/overlayfs-driver/
  - Useful for copy-on-write and writable layer accuracy.
  - Key teaching points:
    - OverlayFS presents multiple directories as one unified view.
    - Lower layers are image layers.
    - The upper layer is where container writes go.
    - Docker Engine 29.0+ notes that `overlay2` is a legacy storage driver superseded by the `overlayfs` containerd snapshotter, so avoid wording that implies `overlay2` is the universal current mechanism.

### OCI standards

- OCI Image Specification
  - URL: https://github.com/opencontainers/image-spec/blob/main/spec.md
  - Useful for the “broader than Docker” clarification.
  - Key teaching point: the OCI image spec defines how to create an interoperable image. The video can summarize this as: “an OCI image is not just a tarball of files; it includes layers and metadata/configuration that runtimes can understand.”

- OCI Runtime Specification
  - URL: https://github.com/opencontainers/runtime-spec/blob/main/spec.md
  - Useful for connecting images to running containers without explaining every runtime.
  - Key teaching point: the runtime spec describes container configuration, execution environment, and lifecycle. This supports the line: “The image is not the running thing; a runtime uses configuration and filesystem content to create a process environment.”

### Linux primitives

- Linux man-pages — namespaces(7)
  - URL: https://man7.org/linux/man-pages/man7/namespaces.7.html
  - Useful for explaining namespaces as isolated views.
  - Key teaching point: a namespace wraps a global system resource so processes inside the namespace appear to have their own isolated instance.
  - Relevant namespace examples for the video:
    - PID namespace: process IDs / process tree view.
    - Mount namespace: filesystem mount points.
    - Network namespace: network devices, stacks, ports, routing tables.
    - UTS namespace: hostname/domain name.
    - IPC namespace: IPC objects.
    - User namespace: user/group IDs.
    - Cgroup namespace: cgroup root directory view.

- Linux Kernel Docs — cgroup v2
  - URL: https://docs.kernel.org/admin-guide/cgroup-v2.html
  - Useful for explaining cgroups as resource organization and control.
  - Key teaching point: cgroups organize processes hierarchically and distribute system resources in a controlled/configurable way.
  - For the video, avoid internal controller detail. Say: “cgroups let the host account for and limit resources like memory, CPU, and IO.”

## Mental model to preserve

### One-sentence version

A container is a host process launched from an image, with a filesystem assembled from image layers plus a writable layer, and with kernel boundaries around what the process can see and how much it can use.

### Slightly expanded version

When you run a container, Docker does not “boot an image.” It asks the container stack to create a process environment:

1. Resolve an image reference, possibly pulling it from a registry.
2. Unpack/mount the image’s read-only filesystem layers.
3. Add a per-container writable layer on top.
4. Prepare the process configuration: command, environment variables, working directory, user, entrypoint, mounts, etc.
5. Create isolated views using namespaces.
6. Attach resource accounting/limits using cgroups.
7. Start the configured process.

Important nuance: these steps describe the conceptual model, not a promise about one exact implementation path for every platform/runtime/version.

## Concept notes

### Image

Audience-facing definition:

> An image is a packaged application environment: filesystem layers plus metadata/configuration that tells the runtime how the container should start.

Avoid saying:

> An image is a container that is not running.

Why avoid it:

That phrase is common but sloppy. It hides the fact that the image is a packaged artifact, while the container is a runtime instance with state, identity, isolation, and a writable layer.

Better phrasing:

> An image is the recipe and packaged filesystem. A container is one running instance created from it.

### Image layers

Audience-facing definition:

> A layer is a reusable filesystem change. Images are made by stacking these changes.

Useful analogy:

- Transparent sheets stacked on top of each other.
- Each sheet adds/removes/modifies files.
- The viewer sees the combined picture.

Nuance:

Layer order matters. Later layers can hide or replace files from earlier layers.

Visual idea:

```
app code layer
runtime deps layer
package install layer
base OS files layer
```

Then collapse into:

```
IMAGE = layers + config
```

### Registry

Audience-facing definition:

> A registry is where images are stored and distributed.

Important correction:

The registry does not run containers. It is closer to a package repository than to a server hosting your running app.

Flow:

```text
build -> image
push -> registry
pull -> local image store
run  -> container process
```

Potential line:

> `docker pull` gets the packaged environment. `docker run` creates a process from it.

### Container

Audience-facing definition:

> A container is a running process, or group of processes, created from an image and placed inside a prepared environment.

Important nuance:

Do not say “just a process” too strongly. It is a process from the host kernel’s perspective, but not merely an ordinary process from the user’s perspective, because the runtime has prepared its filesystem, namespaces, cgroups, mounts, environment, and configuration.

Better line:

> A container is not a tiny computer booting inside your computer. It is a real host process with a carefully prepared view of the host.

But avoid VM comparison in this video unless it is one brief sentence, because the spec says VM/microVM comparison belongs elsewhere.

### Writable layer

Audience-facing definition:

> The writable layer is the private filesystem layer added for one container instance.

Why it matters:

Two containers can start from the same image but not overwrite each other’s changes because their writes go to different writable layers.

Visual:

```text
container A writable layer
--------------------------
shared image layer 3
shared image layer 2
shared image layer 1

container B writable layer
--------------------------
shared image layer 3
shared image layer 2
shared image layer 1
```

### Copy-on-write

Audience-facing definition:

> Copy-on-write means shared image data can stay shared until a container needs to change something. The change is copied or recorded into that container’s writable layer instead of modifying the original image layer.

Potential animation:

1. File exists in shared read-only image layer.
2. Container A reads it directly from the shared layer.
3. Container A modifies it.
4. The changed version appears in Container A’s writable layer.
5. Container B still sees the original file.

Avoid overclaiming:

- Do not imply every filesystem write is literally copied byte-for-byte in all storage drivers.
- Use copy-on-write as a mental model, not a storage-driver implementation lecture.

### Namespaces

Audience-facing definition:

> Namespaces give the process its own view of parts of the system.

Good simple framing:

- PID namespace: “inside, this process can look like PID 1.”
- Network namespace: “inside, it can have its own network interfaces and ports.”
- Mount namespace: “inside, it sees the mounted container filesystem.”
- UTS namespace: “inside, it can have its own hostname.”

Potential line:

> Namespaces are not about limiting CPU or memory. They are about what the process can see.

### Cgroups

Audience-facing definition:

> Cgroups let the host group processes and account for or limit their resource usage.

Good simple framing:

- “This container can use at most this much memory.”
- “This process group gets this CPU share.”
- “The host can account for usage per container.”

Potential line:

> If namespaces shape the container’s view of the world, cgroups shape its budget.

### Runtime

Audience-facing definition:

> The runtime is the machinery that creates and manages the container process environment.

Avoid going too deep:

The video should not become Docker vs containerd vs runc. Mention only if needed:

> Docker is the interface most developers use, but modern container stacks often involve lower-level runtimes under the hood. The exact components can vary; the mental model remains the same.

## Suggested video structure from research

### 1. Start with the familiar command

```bash
docker run nginx
```

Question:

> What actually starts running?

Immediate answer:

> Not the image. A process starts. The image is the packaged source of its filesystem and startup configuration.

### 2. Separate four nouns

Introduce the vocabulary as four boxes:

```text
Image     -> packaged filesystem + config
Registry  -> stores/distributes images
Runtime   -> creates the process environment
Container -> running process instance
```

### 3. Build/push/pull/run flow

Use a simple pipeline:

```text
Dockerfile/source -> build -> image -> push -> registry -> pull -> local image -> run -> container
```

Important line:

> Push and pull move images. Run creates containers.

### 4. Image internals: layers + config

Show image as:

```text
config: command, entrypoint, env, working dir, exposed ports, etc.
layers: filesystem changes
```

Keep it simple. No need to explain every Dockerfile instruction.

### 5. Runtime moment: image becomes process environment

Show `run` expanding into:

```text
mount filesystem view
add writable layer
set env / command / working dir
create namespaces
attach cgroups
start process
```

### 6. Container independence: shared image, private writable layer

This is probably the central visual payoff.

Show two containers from the same image:

```text
container A process -> writable A -> shared image layers
container B process -> writable B -> shared image layers
```

Then modify `/etc/app.conf` in A and show B unchanged.

### 7. Kernel view: process with boundaries

Show the host kernel below everything.

```text
container process
  |-- namespace views
  |-- cgroup budget
  |-- mounted filesystem view
host kernel
```

Potential line:

> The host kernel is still the kernel. The container is a process with boundaries, not a separate machine being booted.

### 8. Optional closing loop: docker commit

If time allows:

```text
container writable changes -> commit -> new image layer -> new image
```

Keep this short. The point is to close the conceptual loop, not recommend `docker commit` as normal workflow.

Potential line:

> In day-to-day work we usually rebuild images from Dockerfiles, but `docker commit` reveals the model: container changes can be captured as a new image layer.

## Accuracy guardrails

Use these to avoid subtle mistakes in the script.

### Do not say “Docker image is a container template” without qualification

It is understandable, but “template” hides the filesystem/config nature. Prefer:

> packaged filesystem layers plus startup configuration

### Do not say “containers are just processes” as the final explanation

Better:

> containers are processes, but processes started inside a prepared environment with filesystem, namespace, and cgroup boundaries

### Do not imply Docker invented the lower-level primitives

Docker made the workflow popular and approachable. The underlying Linux primitives include namespaces, cgroups, and union/copy-on-write filesystems. The portable packaging model is standardized through OCI.

### Do not imply the registry runs anything

Registry = image distribution/storage.
Runtime/engine = creates/runs containers.

### Do not make OverlayFS equal to all containers

OverlayFS/overlay2 is a common Linux implementation detail and a useful mental model, but different platforms/runtimes/storage drivers can vary. Present it as “commonly implemented with union/copy-on-write storage such as OverlayFS on Linux,” not as the definition of containers.

### Do not go into VM comparison

This video can say “not a booted machine” once, but full VM/microVM comparison should remain out of scope.

### Do not over-explain security

Capabilities, seccomp, AppArmor, SELinux, user namespaces, and rootless containers are important, but not part of this episode’s core story. Mention only as “additional boundaries may also be applied” if absolutely necessary.

## Possible narration lines

These are not final script, only research-backed phrasing candidates.

- “An image does not run. A process runs.”
- “The image is the packaged environment. The container is one live instance created from it.”
- “A registry is not a place where containers live. It is a place where images are stored and distributed.”
- “When you run a container, the runtime assembles a filesystem view, adds a private writable layer, applies isolation and resource controls, and starts a process.”
- “The shared image layers stay read-only. The container’s changes go into its own writable layer.”
- “Namespaces decide what the process can see. Cgroups decide how much it can use.”
- “From the host kernel’s point of view, this is still a process. From inside the container, it feels like a small, self-contained environment.”
- “Docker is the word most developers know, but the model is bigger: OCI images and OCI-style runtimes let many tools speak a compatible container language.”

## Suggested visual components

These should map well to reusable Motion Canvas components.

### `CommandCallout`

Shows a command like:

```bash
docker run nginx
```

Then decomposes it into model actions.

### `ImageBox`

A box with two compartments:

```text
Image
├─ config / metadata
└─ filesystem layers
```

### `LayerStack`

Stacked rectangles with labels:

```text
app files
runtime
packages
base
```

### `RegistryBox`

A storage/distribution box. Avoid server/running-process imagery.

Labels:

- stores images
- serves pull requests
- receives push requests

### `RuntimeBox`

A transition box between image and process.

Inputs:

- image layers
- config
- run options

Outputs:

- process
- filesystem view
- namespaces
- cgroups

### `ContainerInstance`

Composition:

```text
process
namespace boundary
cgroup budget
writable layer
shared image layers
```

### `CopyOnWriteAnimation`

Frames:

1. Shared file in image layer.
2. Container A reads file.
3. Container A writes file.
4. Modified file appears in writable A.
5. Container B still sees original file.

### `NamespaceView`

A split-screen visual:

- Host sees many processes.
- Container sees a smaller process list.

Use with care; no need for exact `ps` output.

### `CgroupLimit`

A budget meter around a process:

- memory limit
- CPU share/quota
- IO accounting

Keep generic.

## Recommended tiny demo commands

These can be used for research, B-roll, or visual inspiration. The video does not need to become a tutorial.

### Show image layers

```bash
docker image history nginx:latest
```

Purpose:

Show that images have a layer/history structure.

Caveat:

`history` shows build history/layer-ish output, but it is not a perfect OCI internals viewer.

### Show a container is a process

```bash
docker run -d --name web nginx
docker inspect --format '{{.State.Pid}}' web
ps -p $(docker inspect --format '{{.State.Pid}}' web)
```

Purpose:

Connect container to host process.

Caveat:

On Docker Desktop for macOS/Windows, the process is inside Docker’s Linux VM, not directly on the host OS. If recording on macOS, avoid presenting the host `ps` result as if it were native Linux.

### Show separate writable state

```bash
docker run -d --name a nginx
docker run -d --name b nginx
docker exec a sh -c 'echo A > /tmp/whoami'
docker exec b sh -c 'cat /tmp/whoami || echo not-here'
```

Purpose:

Demonstrate that two containers from the same image do not share writable filesystem state.

### Show namespace IDs on Linux

```bash
PID=$(docker inspect --format '{{.State.Pid}}' web)
sudo ls -l /proc/$PID/ns
```

Purpose:

Visual reference for namespace handles.

Caveat:

This is too low-level for the main script, but useful for confidence and maybe a quick visual.

### Show cgroup association on Linux

```bash
PID=$(docker inspect --format '{{.State.Pid}}' web)
cat /proc/$PID/cgroup
```

Purpose:

Visual reference that the process belongs to cgroup hierarchy.

Caveat:

Output varies by distro, Docker version, cgroup v1/v2, systemd, rootless mode, and Docker Desktop.

## Research-backed final explanation candidate

Use this as a north star for the outline/script:

> When you type `docker run`, Docker is not booting an image. The image is a packaged filesystem and configuration. Docker resolves that image, pulls it from a registry if needed, and asks the container runtime to create a process environment. That environment gets a filesystem view made from the image’s read-only layers plus a private writable layer. The process starts with isolated views of parts of the system through namespaces, and resource accounting or limits through cgroups. So a container is a real process on the host kernel, but one running inside a carefully prepared set of boundaries.

## Open questions for outline phase

- Should the video show one real command demo, or keep commands as visual callouts only?
- Should Docker Desktop/macOS be mentioned as a caveat, or avoided to keep the mental model Linux-first?
- Should `docker commit` be included as a 20-second closing loop, or saved for a later “image lifecycle” episode?
- Should OCI be introduced before or after Docker vocabulary? Recommended: after Docker vocabulary, as a short clarification.
- Should the final visual be “container = process + filesystem + namespaces + cgroups”, or “run = image + runtime options -> process environment”? Both are useful; pick one as the final memory image.
