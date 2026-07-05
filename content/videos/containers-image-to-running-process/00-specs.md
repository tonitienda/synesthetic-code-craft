---
type: specs
status: ready
depends_on: []
---

# 00 — Specs: Docker containers from image to running process

## Working title

Docker containers: from image to running process

Alternative titles to consider later:

- What actually runs when you run a Docker container?
- From Docker image layers to a running container
- Docker containers, explained from image to process

## Purpose

Create a practical explainer that gives viewers a useful mental model for Docker containers without starting from Docker commands alone.

Docker should be used as the public-facing vocabulary because it is what most viewers recognize. The video should also include a small clarification that the core ideas apply more broadly to OCI images and OCI-style container runtimes, not only to Docker as a product.

The video should connect the everyday container workflow with the lower-level ideas that make containers work: images, layers, registries, copy-on-write, processes, namespaces, and cgroups.

The goal is not to turn the video into a kernel deep dive. The goal is to make the common words “image”, “container”, “registry”, and “runtime” feel precise.

## Core thesis

A Docker container is a process started from an image, with an isolated view of the system, resource controls, and a filesystem assembled from image layers plus a writable layer.

Docker is the familiar entry point, but the mental model should also make sense for OCI containers in general.

## Audience

Primary audience:

- software developers who use Docker or containers but mostly through recipes
- developers who know `docker build`, `docker run`, `docker pull`, and `docker push`, but are not sure what is happening underneath
- backend, DevOps, and platform-curious developers

Secondary audience:

- technically curious viewers who want a mental bridge from Docker commands to OCI/container internals

## Language

English for now.

The wording should remain simple enough to translate or rewrite in Spanish later.

## Target duration

Target: 7–10 minutes.

Acceptable range: 6–10 minutes.

Clarity is more important than keeping this artificially short. If the required concepts need more room, the video can be closer to 10 minutes.

## Scope

The video should explain, at a high level:

- Docker as the familiar interface for the explanation
- OCI as the broader standard/model behind many container tools
- image vs container
- image layers
- OCI image as layers plus configuration/metadata
- build as producing an image
- registry as image distribution/storage
- pull and push as registry operations
- run as creating a container from an image
- container as a normal process from the host kernel’s point of view
- namespaces as isolated views
- cgroups as resource limits/accounting
- copy-on-write writable layer
- why two containers started from the same image do not modify each other’s writable state
- `docker commit` as an optional closing loop: turning a container’s writable changes into a new image

## Required concepts to make clear

The video should make these concepts clear enough to be useful:

- **Image:** packaged filesystem layers plus configuration/metadata.
- **Container:** a running process created from an image, with boundaries around what it can see and use.
- **Registry:** a place to store and distribute images; it does not run containers.
- **Layer:** a reusable filesystem change that can be shared by many images or containers.
- **Writable layer:** per-container state placed on top of read-only image layers.
- **Copy-on-write:** when a container changes a file from the image, the change goes to that container’s writable layer instead of changing the shared image.
- **Namespace:** an isolated view of part of the system, such as processes, mounts, or networking.
- **Cgroup:** resource accounting and limits, such as CPU or memory.

## Non-goals

Do not explain in detail:

- every Dockerfile instruction
- Kubernetes
- container networking in depth
- virtual machines or microVMs
- overlay filesystem internals beyond the copy-on-write mental model
- OCI specification details in depth
- rootless containers
- security hardening details such as seccomp, AppArmor, SELinux, and capabilities beyond a brief mention if needed
- multi-stage builds unless they naturally fit as a small note
- Docker vs containerd vs runc in detail

The video should not become a comprehensive “what is Docker?” course.

VM and microVM comparisons should be saved for the later Firecracker/microVM video.

## Tone

Calm, precise, practical.

The viewer should finish feeling that containers are less magical and more mechanical.

Preferred feeling:

- “Docker is the familiar interface, but the model is broader than Docker.”
- “An image is packaged filesystem plus metadata.”
- “A registry stores images; it does not run them.”
- “A container is a process with boundaries.”
- “Copy-on-write explains why containers started from the same image do not change each other.”

Avoid:

- saying containers are “just processes” in a way that hides isolation and filesystem setup
- going too deep into Linux internals too early
- treating Docker as the whole container ecosystem
- turning the video into a command tutorial
- introducing VM comparisons in this video

## Visual direction

The video should be architecture-first and layer-first.

Likely reusable visual components:

- `LayerStack`
- `ImageBox`
- `RegistryBox`
- `BuildPipeline`
- `RuntimeBox`
- `ProcessBox`
- `KernelLayer`
- `IsolationBoundary`
- `NamespaceView`
- `CgroupLimit`
- `CopyOnWriteLayer`
- `WritableLayer`
- `ContainerInstance`
- `CommandCallout`
- `ComparisonFrame`

Useful visual contrasts:

- Docker CLI command vs underlying container model
- Docker-branded entry point vs OCI-compatible model note
- image vs running container
- registry vs runtime
- read-only image layers vs writable container layer
- two containers from the same image with separate writable layers
- normal process vs containerized process
- build/push/pull/run as separate steps
- container writable changes vs committing those changes into a new image

## Framework goals

This video should test whether the framework can handle:

- stacked/layered diagrams
- architecture boundaries
- command-to-state transitions
- build and runtime flows
- copy-on-write animation
- multiple runtime instances sharing one image
- reusable infrastructure diagram components
- a small brand-vs-standard clarification without derailing the visual story

## Decisions already taken

- Use Docker in the title and visible branding because it is more recognizable.
- Add a short explanation that the same mental model applies broadly to OCI containers.
- Do not include VM or microVM comparison in this video.
- Keep only the required Linux/container primitives, but make them clear.
- Treat copy-on-write as one important part of explaining container independence, not the whole video.
- `docker commit` can be mentioned as a nice-to-have closing loop if it fits naturally.
- The video may be closer to 10 minutes if clarity requires it.

## Gate status

This specs file is `ready` for the research phase.
