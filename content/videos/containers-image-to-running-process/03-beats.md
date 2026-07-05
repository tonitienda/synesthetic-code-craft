---
type: beats
status: in-progress
depends_on:
  - 00-specs.md
  - 01-research.md
  - 02-treatment.md
---

# 03 — Beats: Docker containers from image to running process

## Beat intent

Turn the approved treatment into focused explanatory units that can become narration segments and scene timeline references.

The sequence should preserve the main thesis:

```text
image -> runtime setup -> process with boundaries
```

And the final memory:

```text
container = process + filesystem view + namespaces + cgroups
```

## Beat list

```yaml
beats:
  - id: b001
    act: act-1
    title: "The familiar command"
    purpose: "Open from a command most Docker users recognize."
    key_idea: "`docker run nginx` is familiar, but the interesting question is what actually starts."
    visual_hint: "A single command callout appears on a dark background: `docker run nginx`."
    transition_to_next: "Zoom from the command into the word `run` and ask what is running."

  - id: b002
    act: act-1
    title: "The image does not run"
    purpose: "Correct the first misconception before introducing more nouns."
    key_idea: "An image is not the running thing; a process is the running thing."
    visual_hint: "Split the screen into `IMAGE` and `RUNNING PROCESS`; place a clear not-equals mark between them."
    transition_to_next: "Replace the not-equals contrast with a directional flow from image toward process."

  - id: b003
    act: act-1
    title: "Run creates a container instance"
    purpose: "State the thesis in compact form without going into mechanics yet."
    key_idea: "Running an image creates a container: a process instance based on the image and prepared by runtime machinery."
    visual_hint: "A simple chain forms: `image -> runtime -> container process`."
    transition_to_next: "Pull back from the simple chain to reveal the vocabulary map that will make each role precise."

  - id: b004
    act: act-2
    title: "Four nouns, four roles"
    purpose: "Give viewers a clean map for the core vocabulary."
    key_idea: "Image, registry, runtime, and container name different responsibilities."
    visual_hint: "Four calm labeled boxes appear: `Image`, `Registry`, `Runtime`, `Container`. Each gets a short role label."
    transition_to_next: "Animate the boxes into a workflow order."

  - id: b005
    act: act-2
    title: "Image means packaged filesystem plus config"
    purpose: "Define image at the level needed for later layer and runtime beats."
    key_idea: "An image packages filesystem layers and startup metadata/configuration."
    visual_hint: "The ImageBox shows two compartments: `filesystem layers` and `config / metadata`."
    transition_to_next: "Move the ImageBox toward a shelf-like registry."

  - id: b006
    act: act-2
    title: "Registry means image distribution"
    purpose: "Prevent the misconception that registries host running containers."
    key_idea: "A registry stores and distributes images; it does not run containers."
    visual_hint: "The RegistryBox looks like a storage shelf receiving and serving ImageBoxes, with no running process icon inside it."
    transition_to_next: "Introduce build, push, pull, and run as verbs attached to the boxes."

  - id: b007
    act: act-2
    title: "Push and pull move images; run creates containers"
    purpose: "Separate common Docker workflow verbs by what they produce or move."
    key_idea: "Build produces an image, push and pull move images, and run creates a container."
    visual_hint: "A left-to-right pipeline appears: `build -> image -> push -> registry -> pull -> local image -> run -> container`. Highlight `run` as the only step that creates a running instance."
    transition_to_next: "Focus back onto the image artifact and open it up."

  - id: b008
    act: act-2
    title: "Docker is the familiar doorway"
    purpose: "Place Docker and OCI without derailing into ecosystem internals."
    key_idea: "The video says Docker because that is the interface most developers know, but the mental model also maps to OCI-style images and runtimes."
    visual_hint: "A small side label near the workflow reads `Docker interface` with a softer note underneath: `model maps broadly to OCI containers`."
    transition_to_next: "Fade the note and enlarge the ImageBox for the image internals act."

  - id: b009
    act: act-3
    title: "Open the image"
    purpose: "Move from image as black box to image as structured artifact."
    key_idea: "An image is not one opaque blob; it contains ordered filesystem layers plus configuration."
    visual_hint: "The ImageBox opens into a vertical LayerStack and a small config card."
    transition_to_next: "Separate the LayerStack into individual transparent sheets."

  - id: b010
    act: act-3
    title: "Layers are filesystem changes"
    purpose: "Explain layers in a visual way without storage-driver detail."
    key_idea: "Each layer represents a reusable filesystem change, and the ordered stack creates the filesystem view."
    visual_hint: "Transparent sheets stack from base filesystem to packages, runtime dependencies, and app files."
    transition_to_next: "Add a read-only label across the stacked sheets."

  - id: b011
    act: act-3
    title: "Image layers are shared and read-only"
    purpose: "Prepare for the writable-layer and copy-on-write payoff."
    key_idea: "The image layers can be reused by multiple containers because they are shared and read-only."
    visual_hint: "The LayerStack gets a calm `read-only shared layers` label and a subtle lock or fixed-frame treatment."
    transition_to_next: "Collapse layers and config back into an image that moves into the runtime."

  - id: b012
    act: act-4
    title: "Run is preparation, not magic"
    purpose: "Turn the `run` verb into a concrete but high-level runtime moment."
    key_idea: "The runtime uses the image and run options to prepare an environment before starting the process."
    visual_hint: "RuntimeBox receives `image layers`, `image config`, and `run options` as inputs."
    transition_to_next: "Show outputs emerging from the RuntimeBox one by one."

  - id: b013
    act: act-4
    title: "The runtime assembles a filesystem view"
    purpose: "Connect image layers to the filesystem seen by the container."
    key_idea: "The runtime presents the read-only image layers as one filesystem view."
    visual_hint: "The LayerStack visually aligns into a single combined filesystem panel labeled `filesystem view`."
    transition_to_next: "Place a new private layer on top of that view."

  - id: b014
    act: act-4
    title: "A private writable layer is added"
    purpose: "Introduce per-container state before showing two containers."
    key_idea: "A container gets its own writable layer above the shared image layers."
    visual_hint: "A distinct `writable layer` sheet appears above the shared read-only layers."
    transition_to_next: "Add process configuration and boundary cards around the prepared filesystem."

  - id: b015
    act: act-4
    title: "Config and run options shape the process"
    purpose: "Show that runtime setup includes more than files."
    key_idea: "Command, environment variables, working directory, user, and similar settings help define what process starts and how."
    visual_hint: "Small config cards attach to the ProcessBox: `command`, `env`, `workdir`, `user`."
    transition_to_next: "Surround the ProcessBox with namespace and cgroup placeholders."

  - id: b016
    act: act-4
    title: "The process starts inside prepared boundaries"
    purpose: "Bridge from runtime setup to the later kernel explanation."
    key_idea: "The runtime starts a real process inside a prepared filesystem view, namespace views, and cgroup budget."
    visual_hint: "RuntimeBox outputs a ContainerInstance made of process, filesystem view, namespace frame, and cgroup frame."
    transition_to_next: "Duplicate the container instance to show two runs from the same image."

  - id: b017
    act: act-5
    title: "Same image, two containers"
    purpose: "Set up the central independence question."
    key_idea: "Two containers can be started from the same image without duplicating or changing the whole image."
    visual_hint: "One shared image LayerStack branches upward into Container A and Container B."
    transition_to_next: "Highlight the shared read-only layers under both containers."

  - id: b018
    act: act-5
    title: "The shared part stays shared"
    purpose: "Make reuse mechanical and visible."
    key_idea: "Both containers read from the same image layers, which remain read-only."
    visual_hint: "Read arrows from both containers point to the same lower image layers. The shared layers do not split or duplicate."
    transition_to_next: "Highlight the separate writable layers above each container."

  - id: b019
    act: act-5
    title: "The private part is separate"
    purpose: "Show where per-container changes live."
    key_idea: "Each container has its own writable layer for runtime changes."
    visual_hint: "Writable A and Writable B appear as separate top sheets, with distinct but restrained colors."
    transition_to_next: "Choose one file in the shared layer and trace a read from Container A."

  - id: b020
    act: act-5
    title: "Reading can use the shared file"
    purpose: "Start the copy-on-write sequence with a non-mutating operation."
    key_idea: "If a container only reads a file from the image, it can use the shared read-only version."
    visual_hint: "Container A reads `/etc/app.conf` from the shared image layer; Container B can see the same original file."
    transition_to_next: "Container A edits the file."

  - id: b021
    act: act-5
    title: "Writing records the change privately"
    purpose: "Explain copy-on-write as the payoff mechanism."
    key_idea: "When Container A changes the file, the changed version appears in Writable A instead of modifying the shared image layer."
    visual_hint: "The file icon rises from the shared layer into Writable A and becomes a modified version, while the shared original remains in place."
    transition_to_next: "Compare Container A's view with Container B's view."

  - id: b022
    act: act-5
    title: "Container B still sees the original"
    purpose: "Land the practical explanation of container independence."
    key_idea: "Container B is unaffected because its writable layer is separate and the shared image layer did not change."
    visual_hint: "Split view: Container A sees modified `/etc/app.conf`; Container B sees original `/etc/app.conf`."
    transition_to_next: "Pull back from filesystem layers and move down to the host kernel."

  - id: b023
    act: act-6
    title: "From the host, this is a process"
    purpose: "Ground the model in operating system reality."
    key_idea: "The container is a process, or process group, running on the host kernel."
    visual_hint: "A Host Kernel layer appears beneath the ContainerInstance; the ProcessBox is visually connected to it."
    transition_to_next: "Add a caution that this process has a prepared environment around it."

  - id: b024
    act: act-6
    title: "Not just a casual process"
    purpose: "Avoid oversimplifying the container definition."
    key_idea: "The useful definition is not `just a process`; it is a process with filesystem, namespace, and cgroup boundaries."
    visual_hint: "The plain ProcessBox gains three labeled frames: `filesystem view`, `namespace views`, `cgroup budget`."
    transition_to_next: "Zoom into the namespace frame."

  - id: b025
    act: act-6
    title: "Namespaces shape what it can see"
    purpose: "Explain namespaces in one memorable unit."
    key_idea: "Namespaces give the process isolated views of parts of the system."
    visual_hint: "A split view shows host-level resources on one side and a smaller container-visible view on the other. Label: `what the process can see`."
    transition_to_next: "Switch from view boundaries to resource meters."

  - id: b026
    act: act-6
    title: "Cgroups shape what it can use"
    purpose: "Explain cgroups in one memorable unit."
    key_idea: "Cgroups let the host account for or limit resources such as CPU and memory."
    visual_hint: "A soft budget ring or meter wraps the process with labels like `memory`, `CPU`, and `I/O`. Label: `how much the process can use`."
    transition_to_next: "Place namespace and cgroup labels together as a compact phrase."

  - id: b027
    act: act-6
    title: "View plus budget"
    purpose: "Make the kernel-boundary idea memorable before closing."
    key_idea: "Namespaces shape the view; cgroups shape the budget."
    visual_hint: "The process sits inside two clear frames: `view` and `budget`, above the host kernel."
    transition_to_next: "Reassemble the full left-to-right model from registry to running container."

  - id: b028
    act: act-7
    title: "Rebuild the workflow"
    purpose: "Restate the command workflow with precise nouns."
    key_idea: "Build produces an image, push stores it in a registry, pull retrieves it locally, and run creates a container process."
    visual_hint: "The Act 2 pipeline returns, now annotated with the deeper meanings learned in Acts 3 through 6."
    transition_to_next: "Condense the running side into the final formula."

  - id: b029
    act: act-7
    title: "Final container formula"
    purpose: "Give the viewer the compact mental model to remember."
    key_idea: "A container is a process plus a filesystem view, namespaces, and cgroups."
    visual_hint: "Final equation appears: `container = process + filesystem view + namespaces + cgroups`."
    transition_to_next: "Optionally show how writable changes can become a new image layer, without making it the main ending."

  - id: b030
    act: act-7
    title: "Optional commit loop"
    purpose: "Close the model loop if time allows while avoiding workflow advice."
    key_idea: "A container's writable changes can be captured as a new image layer, though normal workflows usually rebuild from source and Dockerfiles."
    visual_hint: "Writable layer flows through a small `commit` arrow into a new image layer; keep this visually secondary."
    transition_to_next: "Return to the stable final model rather than ending on `commit`."

  - id: b031
    act: act-7
    title: "Stable final diagram"
    purpose: "End on one calm, complete model instead of new information."
    key_idea: "The image is the packaged source; the runtime prepares the environment; the container is the bounded running process."
    visual_hint: "Final diagram: `Registry -> Image = layers + config -> Runtime -> Container = process + writable layer + namespaces + cgroups`."
    transition_to_next: "End."
```

## Act coverage notes

- Act 1 establishes the question and the core correction without introducing Linux internals too early.
- Act 2 gives the vocabulary map and separates Docker workflow verbs.
- Act 3 makes image internals concrete enough for later copy-on-write reasoning.
- Act 4 explains `run` as environment preparation plus process start.
- Act 5 is intentionally the longest and most visual beat group because it delivers the central payoff: two containers from one image do not overwrite each other.
- Act 6 grounds the model in the host kernel while avoiding a full Linux internals lecture.
- Act 7 reassembles the model and treats `docker commit` as optional and secondary.

## Downstream guidance

For narration:

- Keep each beat to one spoken idea.
- Avoid final-script polish that adds new concepts not present here.
- Use `b030` only if the target duration allows a short conceptual loop.
- Preserve the strongest recurring lines:
  - "An image does not run. A process runs."
  - "Push and pull move images. Run creates containers."
  - "Namespaces shape the view. Cgroups shape the budget."

For scene timeline:

- Prefer high-level components named in the treatment: `CommandCallout`, `ImageBox`, `LayerStack`, `RegistryBox`, `RuntimeBox`, `ProcessBox`, `ContainerInstance`, `WritableLayer`, `CopyOnWriteAnimation`, `NamespaceView`, `CgroupLimit`, and `KernelLayer`.
- Treat visual hints here as intent, not final animation timing.
- Keep the optional commit loop visually subordinate to the final container model.

## Gate status

This beats file is `in-progress` for human review before narration.
