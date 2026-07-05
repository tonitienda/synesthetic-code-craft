---
type: specs
status: in-progress
depends_on: []
---

# 00 — Specs: Containers from image to running process

## Working title

Containers: from image to running process

Alternative titles to consider later:

- Containers are not tiny VMs
- What actually runs when you run a container?
- From OCI image layers to a container process

## Purpose

Create a practical explainer that gives viewers a useful mental model for containers without starting from Docker commands alone.

The video should connect the everyday container workflow with the lower-level ideas that make containers work: images, layers, registries, copy-on-write, processes, namespaces, and cgroups.

The goal is not to turn the video into a kernel deep dive. The goal is to make the common words “image”, “container”, “registry”, and “runtime” feel precise.

## Core thesis

A container is not a tiny virtual machine.

A container is a process started from an image, with an isolated view of the system, resource controls, and a filesystem assembled from image layers plus a writable layer.

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

Target: 5–7 minutes.

Acceptable range: 4–8 minutes.

This video can be slightly longer than the Git one because there are more architectural layers to connect.

## Scope

The video should explain, at a high level:

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
- why containers are lighter than full virtual machines, without claiming they are the same thing

## Non-goals

Do not explain in detail:

- every Dockerfile instruction
- Kubernetes
- container networking in depth
- overlay filesystem internals beyond the copy-on-write mental model
- OCI specification details in depth
- rootless containers
- security hardening details such as seccomp, AppArmor, SELinux, and capabilities beyond a brief mention if needed
- multi-stage builds unless they naturally fit as a small note
- Docker vs containerd vs runc in detail

The video should not become a comprehensive “what is Docker?” course.

## Tone

Calm, precise, practical.

The viewer should finish feeling that containers are less magical and more mechanical.

Preferred feeling:

- “An image is packaged filesystem plus metadata.”
- “A registry stores images; it does not run them.”
- “A container is a process with boundaries.”
- “Copy-on-write explains why many containers can share the same image.”

Avoid:

- saying containers are “just processes” in a way that hides isolation and filesystem setup
- going too deep into Linux internals too early
- treating Docker as the whole container ecosystem
- turning the video into a command tutorial

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
- `CommandCallout`
- `ComparisonFrame`

Useful visual contrasts:

- image vs running container
- registry vs runtime
- read-only image layers vs writable container layer
- normal process vs containerized process
- shared host kernel vs full VM guest kernel
- build/push/pull/run as separate steps

## Framework goals

This video should test whether the framework can handle:

- stacked/layered diagrams
- architecture boundaries
- command-to-state transitions
- build and runtime flows
- copy-on-write animation
- comparison between related but different concepts
- reusable infrastructure diagram components

## Ready checklist

Before marking this specs file `ready`, decide:

- Should the video say “Docker containers” or “OCI containers” in the title?
- How much Docker branding should appear visually?
- How much should Linux-specific terms such as namespaces and cgroups be introduced?
- Should VM comparison be included briefly, or saved for the Firecracker/microVM video?
- Should copy-on-write be central, or one part of the image/container explanation?
- Is the target duration closer to 5 minutes or 7 minutes?
