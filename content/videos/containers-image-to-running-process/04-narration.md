---
type: narration
status: in-progress
depends_on:
  - 00-specs.md
  - 02-treatment.md
  - 03-beats.md
---

# 04 — Narration: Docker containers from image to running process

## Human notes

- Draft narration follows the ready beat IDs from `03-beats.md`.
- Keep the recurring lines stable unless a reviewer asks for a different emphasis.
- `b030` is included as a short optional loop, but it should remain visually and narratively secondary.
- The script avoids storage-driver internals and treats the runtime sequence as a conceptual model.

```narration-yaml
segments:
  - id: n001
    act: act-1
    beat: b001
    speaker: narrator
    text: |
      You have probably typed a command like this before.

      Docker run nginx.

      It feels like we are running the image.

      But that is not quite what happens.
    pause_after: 0.7
    delivery: calm
    notes: "Open from the familiar command and set up the question."

  - id: n002
    act: act-1
    beat: b002
    speaker: narrator
    text: |
      An image does not run.

      A process runs.

      The image is the packaged starting point.

      The running thing is a process on the host.
    pause_after: 0.8
    delivery: precise
    notes: "Preserve the strongest correction line."

  - id: n003
    act: act-1
    beat: b003
    speaker: narrator
    text: |
      So when we run an image, the system creates a container.

      A container is a process instance, based on that image, with an environment prepared around it.

      The short version is: image, runtime, container process.
    pause_after: 0.9
    delivery: calm
    notes: "State the thesis without mechanics yet."

  - id: n004
    act: act-2
    beat: b004
    speaker: narrator
    text: |
      To make that precise, separate four words that often blur together.

      Image.

      Registry.

      Runtime.

      Container.

      Each one has a different job.
    pause_after: 0.6
    delivery: measured

  - id: n005
    act: act-2
    beat: b005
    speaker: narrator
    text: |
      An image is a packaged filesystem, plus configuration.

      It contains the files the process should see.

      It also contains startup metadata, like the default command and environment.
    pause_after: 0.6
    delivery: clear

  - id: n006
    act: act-2
    beat: b006
    speaker: narrator
    text: |
      A registry stores and distributes images.

      It is a shelf for image artifacts.

      It is not where your containers are running.
    pause_after: 0.7
    delivery: precise

  - id: n007
    act: act-2
    beat: b007
    speaker: narrator
    text: |
      Build produces an image.

      Push sends an image to a registry.

      Pull brings an image back to a machine.

      Run is the step that creates a container.

      Push and pull move images.

      Run creates containers.
    pause_after: 0.8
    delivery: emphatic-but-calm
    notes: "Preserve recurring line."

  - id: n008
    act: act-2
    beat: b008
    speaker: narrator
    text: |
      We are saying Docker because that is the doorway most developers know.

      But this mental model is broader than one product.

      It maps to OCI-style images and runtimes as well.
    pause_after: 0.8
    delivery: calm

  - id: n009
    act: act-3
    beat: b009
    speaker: narrator
    text: |
      Now open the image.

      It is not one mysterious blob.

      It is an ordered set of filesystem layers, plus a small amount of configuration.
    pause_after: 0.7
    delivery: explanatory

  - id: n010
    act: act-3
    beat: b010
    speaker: narrator
    text: |
      Each layer represents a filesystem change.

      One layer might start from a base system.

      Another might add packages.

      Another might add runtime dependencies.

      Another might add application files.

      Stacked in order, they create the filesystem view the container will use.
    pause_after: 0.8
    delivery: steady

  - id: n011
    act: act-3
    beat: b011
    speaker: narrator
    text: |
      These image layers are read-only.

      That is what makes them reusable.

      Multiple containers can share the same image layers without each one copying the whole image.
    pause_after: 0.8
    delivery: clear

  - id: n012
    act: act-4
    beat: b012
    speaker: narrator
    text: |
      So what does run do?

      Conceptually, the runtime takes the image, the image configuration, and the options from the run command.

      Then it prepares an environment before starting the process.
    pause_after: 0.7
    delivery: calm

  - id: n013
    act: act-4
    beat: b013
    speaker: narrator
    text: |
      First, the runtime presents the image layers as one filesystem view.

      The process does not need to think about separate layers.

      It sees a filesystem.
    pause_after: 0.7
    delivery: simple

  - id: n014
    act: act-4
    beat: b014
    speaker: narrator
    text: |
      Then the container gets a private writable layer on top.

      The image layers stay shared and read-only.

      The writable layer is where this container can record its own changes.
    pause_after: 0.8
    delivery: clear

  - id: n015
    act: act-4
    beat: b015
    speaker: narrator
    text: |
      Files are only part of the setup.

      The command, environment variables, working directory, user, and other settings help shape what process starts and how it starts.
    pause_after: 0.7
    delivery: measured

  - id: n016
    act: act-4
    beat: b016
    speaker: narrator
    text: |
      Finally, the process starts inside those prepared boundaries.

      It has a filesystem view.

      It has isolated views of parts of the system.

      And it can have resource accounting or limits.
    pause_after: 0.9
    delivery: calm

  - id: n017
    act: act-5
    beat: b017
    speaker: narrator
    text: |
      Now start two containers from the same image.

      They do not need two complete copies of the image.

      They can share the same read-only layers underneath.
    pause_after: 0.7
    delivery: explanatory

  - id: n018
    act: act-5
    beat: b018
    speaker: narrator
    text: |
      The shared part stays shared.

      Both containers can read from the same image layers.

      Those layers are still read-only, so neither container changes the original image.
    pause_after: 0.8
    delivery: clear

  - id: n019
    act: act-5
    beat: b019
    speaker: narrator
    text: |
      The private part is separate.

      Container A has its own writable layer.

      Container B has its own writable layer.

      Runtime changes go into the container that made them.
    pause_after: 0.8
    delivery: precise

  - id: n020
    act: act-5
    beat: b020
    speaker: narrator
    text: |
      If Container A reads a file from the image, it can use the shared version.

      Container B can read that same original file too.

      Reading does not create a private change.
    pause_after: 0.7
    delivery: calm

  - id: n021
    act: act-5
    beat: b021
    speaker: narrator
    text: |
      But if Container A changes that file, the shared image layer is not edited.

      The changed version is recorded in Container A's writable layer.

      This is the useful copy-on-write mental model.
    pause_after: 0.8
    delivery: explanatory
    notes: "Keep this conceptual; do not imply every implementation copies a whole file in every case."

  - id: n022
    act: act-5
    beat: b022
    speaker: narrator
    text: |
      Container A now sees its modified version.

      Container B still sees the original.

      The containers feel independent because their writable layers are independent.
    pause_after: 0.9
    delivery: clear

  - id: n023
    act: act-6
    beat: b023
    speaker: narrator
    text: |
      Under all of this is the host kernel.

      From the host's point of view, the container is a process, or a group of processes.

      It is not a small machine being booted from scratch.
    pause_after: 0.8
    delivery: grounded

  - id: n024
    act: act-6
    beat: b024
    speaker: narrator
    text: |
      But saying it is just a process is too casual.

      The useful definition includes the boundaries around the process.

      A container is a process with a filesystem view, namespace views, and a cgroup budget.
    pause_after: 0.8
    delivery: precise

  - id: n025
    act: act-6
    beat: b025
    speaker: narrator
    text: |
      Namespaces shape what the process can see.

      They can give the process its own view of things like processes, mounts, networking, and hostnames.

      The host has the larger system.

      The container sees a shaped view inside it.
    pause_after: 0.8
    delivery: calm

  - id: n026
    act: act-6
    beat: b026
    speaker: narrator
    text: |
      Cgroups shape what the process can use.

      They let the host account for, and often limit, resources such as memory, CPU, and input-output.
    pause_after: 0.8
    delivery: clear

  - id: n027
    act: act-6
    beat: b027
    speaker: narrator
    text: |
      So the boundary has two important sides.

      Namespaces shape the view.

      Cgroups shape the budget.
    pause_after: 0.9
    delivery: emphatic-but-calm
    notes: "Preserve recurring line."

  - id: n028
    act: act-7
    beat: b028
    speaker: narrator
    text: |
      Now rebuild the whole workflow with sharper words.

      Build produces an image.

      Push stores it in a registry.

      Pull retrieves it locally.

      Run asks the runtime to create a container process from it.
    pause_after: 0.8
    delivery: recap

  - id: n029
    act: act-7
    beat: b029
    speaker: narrator
    text: |
      The compact model is this.

      A container is a process, plus a filesystem view, plus namespaces, plus cgroups.

      The process is real.

      The boundaries are what make it a container.
    pause_after: 0.9
    delivery: measured

  - id: n030
    act: act-7
    beat: b030
    speaker: narrator
    text: |
      There is one optional loop in the model.

      A container's writable changes can be captured into a new image layer.

      Docker calls this commit.

      But most production workflows rebuild images from source and Dockerfiles instead.
    pause_after: 0.8
    delivery: secondary-note
    notes: "Optional if duration allows; do not end on this idea."

  - id: n031
    act: act-7
    beat: b031
    speaker: narrator
    text: |
      So when you see docker run nginx, remember the machinery underneath.

      The image is the packaged source.

      The runtime prepares the environment.

      The container is the bounded running process.

      An image does not run.

      A process runs.
    pause_after: 1.0
    delivery: calm-close
```
