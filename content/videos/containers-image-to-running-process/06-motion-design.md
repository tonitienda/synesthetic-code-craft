---
type: motion-design
status: in-progress
depends_on:
  - 05-scene-timeline.md
---

# 06 — Motion design: Docker containers from image to running process

## Purpose

This file translates the scene timeline into visual explanation.

It answers:

- what the viewer sees
- what persists between scenes
- what transforms into what
- where attention goes
- which visual metaphor carries each idea
- which text is allowed on screen
- what a reviewer should evaluate before implementation

It does **not** define Motion Canvas APIs, file structure, component props, or final code. Those decisions belong in the next phase, `07-motion-components.md`.

## Source timeline

- Timeline: `05-scene-timeline.md`
- Narration: `04-narration.md`
- Beats: `03-beats.md`

The central visual promise is:

```text
command -> image artifact -> runtime setup -> bounded host process
```

The viewer should feel that a container is not a little machine. It is a real host process with a prepared filesystem view, shaped visibility, and resource budget.

## Status notes

- Status is `in-progress` because this is the first motion-design pass and needs human review.
- ASCII key frames are communication sketches, not final layouts.
- Component candidates are design vocabulary only; the approved component/API plan belongs in `07-motion-components.md`.
- The motion itself must teach. A scene fails if the narration carries the whole explanation while the visuals merely decorate it.

## Global motion language

### Direction of travel

The main explanatory direction is left-to-right:

```text
source / image side  ->  runtime preparation  ->  running process side
```

For filesystem-layer explanations, the direction becomes bottom-to-top:

```text
read-only image layers
    +
private writable layer
    =
container filesystem view
```

For host/kernel explanations, the direction becomes top-to-bottom:

```text
container view
    ↓
real host process
    ↓
host kernel
```

### Persistence rules

- The command from Act 1 should visually echo in the final recap.
- The image box from Act 2 should be the same object that opens in Act 3.
- The layer stack from Act 3 should persist into Acts 4 and 5.
- The process pulse introduced in Act 4 should persist into Acts 6 and 7.
- The final formula should be assembled from existing visual objects, not typed as a disconnected slide.

### Text policy

Use text as labels attached to objects. Avoid paragraphs.

Prefer:

```text
[shared read-only layers]
[Writable A]
[process]
[view]
[budget]
```

Avoid:

```text
Long explanatory captions that repeat the narration.
```

### Visual quality bar

Each scene should pass at least one of these tests:

- An object transforms into the next idea.
- The camera reveals a hidden relationship.
- A persistent object gains a new meaning.
- Motion shows cause and effect.
- A misconception is corrected visually.

## ASCII key frame notation

These sketches use rough symbols:

```text
[box]          concept object
{frame}        boundary / view / namespace
≋≋≋            filesystem layers
●              running process
→              flow / transformation
⇢              read trace
⇡              write / copied change
═══            host kernel
```

---

# Act 1 — The familiar command, corrected

## Scene 1.1 — Command doorway and core correction

Source:
- Timeline scene: `Scene 1.1`
- Narration: `n001`–`n003`
- Beats: `b001`–`b003`

Scene promise:
The viewer starts from a familiar command and leaves with the corrected idea that the image does not run; a process runs.

Visual metaphor:
The command is a doorway. The word `run` is treated like a hinge that opens the rest of the mental model.

Key frames:

```text
docker run nginx
       ^
       |
    what runs?
```

```text
[ IMAGE ]     ≠     [ ● RUNNING PROCESS ]
```

```text
[ IMAGE ]  ->  [ RUNTIME SETUP ]  ->  [ { ● CONTAINER PROCESS } ]
```

Choreography:
- Let the command breathe before anything else appears.
- Pull attention into `run`.
- Split the command into two ideas: image and process.
- Make the process visibly alive with a restrained pulse.
- Build the thesis chain from left to right.

Camera / attention:
Start static and centered. Use a slight push-in on `run`, then widen into the image/process split.

Allowed copy:
- `docker run nginx`
- `what runs?`
- `image`
- `running process`
- `An image does not run.`
- `A process runs.`
- `image -> runtime -> container process`

Avoid:
- Do not create a full fake terminal.
- Do not show the image box pulsing like a process.
- Do not make the runtime feel like a Docker-branded product.

Component candidates:
- `CommandCallout`
- `ImageArtifact`
- `ProcessPulse`
- `RuntimeStep`
- `ContainerProcess`

Quality gate:
The viewer should visually understand that the animated/alive thing is the process, not the image.

---

# Act 2 — Four nouns, four roles

## Scene 2.1 — Vocabulary map

Source:
- Timeline scene: `Scene 2.1`
- Narration: `n004`–`n006`
- Beats: `b004`–`b006`

Scene promise:
The viewer sees image, registry, runtime, and container as separate roles.

Visual metaphor:
A vocabulary map that becomes a working system. The four nouns are not four slides; they are four stations in one spatial model.

Key frames:

```text
[ Image ]        [ Registry ]

[ Runtime ]      [ Container ]
```

```text
[ Image ]
   ├─ filesystem layers
   └─ config / metadata
```

```text
[ Image Artifact ]  ->  [ Registry Shelf ]
                          not where containers run
```

Choreography:
- Place the four nouns with enough spacing that each feels distinct.
- Open only the `Image` card when defining it.
- Move the image artifact toward the registry shelf, but keep the registry inert.
- Make the lack of process pulse in the registry noticeable.

Camera / attention:
Use a stable wide view for the map. Push in only when opening the image card.

Allowed copy:
- `Image — packaged starting point`
- `Registry — stores images`
- `Runtime — prepares and starts`
- `Container — running instance`
- `filesystem layers`
- `config / metadata`
- `registry = image storage + distribution`
- `not where containers run`

Avoid:
- Do not make the registry look like a server running the container.
- Do not over-explain OCI here.
- Do not create four unrelated cards that vanish between definitions.

Component candidates:
- `VocabularyMap`
- `VocabularyCard`
- `RegistryShelf`
- `ImageArtifact`

Quality gate:
The registry should feel like storage/distribution, not runtime.

## Scene 2.2 — Workflow verbs and Docker doorway

Source:
- Timeline scene: `Scene 2.2`
- Narration: `n007`–`n008`
- Beats: `b007`–`b008`

Scene promise:
The verbs become precise: build creates, push/pull move, run starts.

Visual metaphor:
The vocabulary map becomes a conveyor of artifacts. Only `run` creates life.

Key frames:

```text
build -> [ Image ] -> push -> [ Registry ]
```

```text
[ Registry ] -> pull -> [ Local Image ] -> run -> [ { ● Container } ]
```

```text
push / pull move images
run creates containers
```

Choreography:
- Rearrange the four nouns into a horizontal workflow.
- Let `build` produce an image artifact.
- Let `push` and `pull` move the same artifact without changing it.
- Let `run` produce the first living process pulse.
- Keep the Docker/OCI note visually small and secondary.

Camera / attention:
Track gently along the workflow from left to right.

Allowed copy:
- `build produces an image`
- `push / pull move images`
- `run creates a container`
- `Docker is the familiar doorway`
- `broader model: OCI-style images and runtimes`

Avoid:
- Do not animate `push` or `pull` as if they start processes.
- Do not let the OCI note steal attention from the verb distinction.

Component candidates:
- `WorkflowRail`
- `ArtifactMotion`
- `VerbLabel`
- `SecondaryNote`

Quality gate:
The viewer should be able to point to the only verb that creates the container: `run`.

---

# Act 3 — Open the image

## Scene 3.1 — Image internals as layers plus config

Source:
- Timeline scene: `Scene 3.1`
- Narration: `n009`–`n011`
- Beats: `b009`–`b011`

Scene promise:
The image stops being a blob and becomes ordered filesystem changes plus configuration.

Visual metaphor:
A sealed artifact opens into transparent sheets. The sheets can separate, show their order, and restack into one filesystem view.

Key frames:

```text
       [ IMAGE ]
          |
          v
  +----------------+
  | layers + config |
  +----------------+
```

```text
   config
    [cmd/env]

   application files
   runtime dependencies
   packages
   base filesystem
```

```text
read-only image layers
   ≋ application files     🔒
   ≋ runtime dependencies  🔒
   ≋ packages              🔒
   ≋ base filesystem       🔒
```

Choreography:
- Open the image artifact slowly enough that it feels like revealing structure, not switching slides.
- Separate the layers vertically.
- Label layers only after the viewer sees the stack.
- Restack the sheets into one composed filesystem view.
- Add the read-only/shared idea as a property of the stack, not as a separate fact.

Camera / attention:
Push in on the image as it opens. Shift slightly down the stack to make ordering legible.

Allowed copy:
- `image = layers + config`
- `not one mysterious blob`
- `ordered filesystem changes`
- `stacked in order`
- `filesystem view`
- `read-only`
- `reusable`
- `shared by multiple containers`

Avoid:
- Do not show layers as random decorative rectangles.
- Do not imply layers are processes.
- Do not introduce copy-on-write yet beyond the shared/read-only setup.

Component candidates:
- `ImageArtifact`
- `LayerStack`
- `LayerSheet`
- `ConfigCard`
- `ReadOnlyBadge`

Quality gate:
The layer stack should become a persistent object that can be reused later, not a temporary illustration.

---

# Act 4 — What run prepares

## Scene 4.1 — Runtime preparation pipeline

Source:
- Timeline scene: `Scene 4.1`
- Narration: `n012`–`n014`
- Beats: `b012`–`b014`

Scene promise:
The viewer understands `run` as preparation: layers, config, and run options are assembled into a filesystem view with a private writable layer.

Visual metaphor:
Runtime is a preparation table, not magic. Inputs enter, align, and produce a ready environment.

Key frames:

```text
[image layers] \
[image config]  >  [ RUNTIME SETUP ]
[run options]  /
```

```text
read-only image layers  ->  one filesystem view
   ≋ app
   ≋ deps
   ≋ pkg
   ≋ base
```

```text
[ private writable layer ]
[ shared read-only view  ]
[ shared read-only view  ]
[ shared read-only view  ]
```

Choreography:
- Bring inputs into a central preparation area.
- Align layer sheets into one view rather than replacing them with a new object.
- Add the writable layer as a distinct top layer.
- Keep the shared layers visibly locked or stable underneath.

Camera / attention:
Start wide enough to show inputs. Push slightly into the assembled filesystem view when the writable layer appears.

Allowed copy:
- `image layers`
- `image config`
- `run options`
- `runtime prepares an environment`
- `one filesystem view`
- `private writable layer`
- `image layers stay read-only`

Avoid:
- Do not make this look like a strict runtime implementation sequence.
- Do not imply the runtime mutates the image.
- Do not turn the writable layer into an image layer.

Component candidates:
- `RuntimeSetup`
- `InputBundle`
- `FilesystemView`
- `WritableLayer`

Quality gate:
The writable layer must clearly sit on top of, not replace, the read-only image layers.

## Scene 4.2 — Startup configuration and boundaries

Source:
- Timeline scene: `Scene 4.2`
- Narration: `n015`–`n016`
- Beats: `b015`–`b016`

Scene promise:
The filesystem is only part of the setup; configuration shapes the process, and boundaries make the process a container.

Visual metaphor:
A process ignition inside prepared frames. The environment is built before the pulse starts.

Key frames:

```text
[command] [env] [workdir] [user]
       \    |      |      /
        \   |      |     /
            [ ● process waiting ]
```

```text
{ filesystem view
  { namespace views
    { cgroup budget
      ● process
    }
  }
}
```

Choreography:
- Let config cards attach to the waiting process shape.
- Start the process only after setup is visible.
- Add boundary frames one by one around the process.
- Let the combined group become the first complete container instance.

Camera / attention:
Push in on the waiting process as configuration attaches. Widen slightly when boundary frames appear.

Allowed copy:
- `command`
- `environment`
- `working directory`
- `user`
- `process starts`
- `filesystem view`
- `namespace views`
- `cgroup budget`

Avoid:
- Do not show a boot sequence.
- Do not imply a guest OS starts.
- Do not let the boundary frames feel decorative; they must mean something.

Component candidates:
- `StartupConfig`
- `ProcessPulse`
- `BoundaryFrame`
- `ContainerInstance`

Quality gate:
The viewer should see the process start inside prepared boundaries, not before them.

---

# Act 5 — Same image, two containers

## Scene 5.1 — Shared read-only layers and private writable layers

Source:
- Timeline scene: `Scene 5.1`
- Narration: `n017`–`n019`
- Beats: `b017`–`b019`

Scene promise:
Two containers can share the same read-only image layers while having separate writable layers.

Visual metaphor:
One foundation, two living views. The lower stack remains shared; the upper writable surfaces are private.

Key frames:

```text
      { Container A }       { Container B }
          ●                     ●

              shared image layers
              ≋ application
              ≋ dependencies
              ≋ base
```

```text
      { A } ⇢              ⇠ { B }
            \\            //
             \\          //
              shared read-only layers 🔒
```

```text
    [ Writable A ]       [ Writable B ]
    { Container A }      { Container B }
          ●                    ●
           \\                  //
            shared read-only layers 🔒
```

Choreography:
- Duplicate the container instance upward, not the image stack.
- Keep the shared layer stack centered and stable.
- Draw reads from both containers to the same stack.
- Add separate writable layers above each container view.
- Make privacy visible through separation, not through heavy text.

Camera / attention:
Pull back from a single container to a two-container composition.

Allowed copy:
- `same image`
- `Container A`
- `Container B`
- `shared read-only layers`
- `neither container changes the image`
- `Writable A`
- `Writable B`
- `runtime changes are private`

Avoid:
- Do not duplicate the lower image stack.
- Do not imply the shared layers become writable.
- Do not overcomplicate this with storage-driver names.

Component candidates:
- `SharedLayerFoundation`
- `ContainerPair`
- `ReadTrace`
- `WritableLayer`

Quality gate:
A reviewer should immediately see one shared base and two private tops.

## Scene 5.2 — Copy-on-write file trace

Source:
- Timeline scene: `Scene 5.2`
- Narration: `n020`–`n022`
- Beats: `b020`–`b022`

Scene promise:
The viewer understands that writes do not mutate the shared image; they create a private changed version for the writing container's view.

Visual metaphor:
A shared file token is read by both containers. A write from Container A cannot alter the locked original, so the changed token rises into Writable A.

Key frames:

```text
    [ Writable A ]       [ Writable B ]
    { Container A }      { Container B }
          ⇢                  ⇠
              /etc/app.conf
              shared original 🔒
```

```text
    A writes /etc/app.conf
          |
          v
    shared original 🔒   stays fixed
```

```text
    [ Writable A: /etc/app.conf* ]    [ Writable B ]
    { A sees: modified }              { B sees: original }
              \\                        //
               shared original 🔒
```

Choreography:
- Introduce `/etc/app.conf` as a small stable token in the shared layer.
- Show A and B reading the same token.
- When A writes, make the shared original resist mutation by remaining locked and fixed.
- Lift a modified copy into `Writable A`.
- Split the view so A resolves to the modified copy and B resolves to the original.
- Hold the final contrast long enough for the independence idea to land.

Camera / attention:
Push in during the file write, then widen into the A/B comparison.

Allowed copy:
- `/etc/app.conf`
- `read: shared original`
- `write: record change in Writable A`
- `shared original unchanged`
- `copy-on-write mental model`
- `A sees: modified`
- `B sees: original`
- `independent writable layers`

Avoid:
- Do not imply every implementation copies a whole file exactly this way.
- Do not show the shared image layer changing.
- Do not explain storage-driver internals.
- Do not reduce this to arrows and labels only; the file token movement must teach the model.

Component candidates:
- `FileToken`
- `CopyOnWriteTrace`
- `FileResolutionView`
- `LockedOriginal`

Quality gate:
The scene fails if the viewer only understands copy-on-write from the narration. The token movement itself must explain it.

---

# Act 6 — The host sees a process with boundaries

## Scene 6.1 — Host process and boundary frames

Source:
- Timeline scene: `Scene 6.1`
- Narration: `n023`–`n024`
- Beats: `b023`–`b024`

Scene promise:
The container is grounded in the host as a real process with prepared boundaries, not a tiny machine.

Visual metaphor:
The camera pulls the container facade away and reveals the host process anchored to the kernel.

Key frames:

```text
      { Container }
          ● process

═════════ host kernel ═════════
```

```text
      not a tiny machine
          ✕ [mini VM box]

      real host process
          ✓ ●
```

```text
{ filesystem view
  { namespace views
    { cgroup budget
      ● process
    }
  }
}

═════════ host kernel ═════════
```

Choreography:
- Slide or reveal the host kernel foundation beneath the process.
- Let the process pulse connect downward to the host.
- Briefly reject the mini-VM silhouette if useful, then remove it.
- Add the three boundaries around the real process.

Camera / attention:
Pull down or widen vertically to reveal what was under the container view.

Allowed copy:
- `host kernel`
- `process / process group`
- `not a tiny machine booting from scratch`
- `container = process with prepared boundaries`
- `filesystem view`
- `namespace views`
- `cgroup budget`

Avoid:
- Do not draw a full VM comparison.
- Do not show an operating system booting.
- Do not say “just a process” visually without showing the boundary frames.

Component candidates:
- `KernelLayer`
- `HostProcessView`
- `BoundaryFrame`
- `MisconceptionCrossout`

Quality gate:
The viewer should feel the process is real on the host, while the boundaries are what make it a container.

## Scene 6.2 — Namespaces and cgroups

Source:
- Timeline scene: `Scene 6.2`
- Narration: `n025`–`n027`
- Beats: `b025`–`b027`

Scene promise:
Namespaces and cgroups become two different dimensions of the boundary: view and budget.

Visual metaphor:
Namespaces are a shaped window. Cgroups are a resource budget ring.

Key frames:

```text
HOST VIEW                         CONTAINER VIEW
[proc][proc][net][mounts]   ->    [proc][net][mounts]
[many things visible]             [shaped view]
```

```text
       CPU
        |
memory--●--I/O
        |
     budget ring
```

```text
    { view: namespaces }
    { budget: cgroups  }
          ● process
```

Choreography:
- Zoom into the namespace frame first.
- Split host-visible resources from container-visible resources.
- Avoid making namespaces look like security walls only; they shape perception.
- Transition from the view frame to the budget ring.
- Bring both back around the process for the final line.

Camera / attention:
Push into the namespace frame, then rotate/transition around the process into the budget frame. Return to a centered composition for the recurring line.

Allowed copy:
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

Avoid:
- Do not imply namespaces are resource limits.
- Do not imply cgroups change what the process can see.
- Do not make the cgroup ring look like an error alarm.

Component candidates:
- `NamespaceSplitView`
- `ResourceBudgetRing`
- `ResourceMeter`
- `BoundarySummary`

Quality gate:
A reviewer should be able to summarize the distinction as “view versus budget” from the visuals alone.

---

# Act 7 — Reassemble the model

## Scene 7.1 — Final workflow with sharper words

Source:
- Timeline scene: `Scene 7.1`
- Narration: `n028`
- Beats: `b028`

Scene promise:
The original workflow returns, but now every verb has a corrected meaning.

Visual metaphor:
The whole video collapses back into the command workflow as a cleaned-up mental model.

Key frames:

```text
build -> image -> push -> registry -> pull -> local image -> run -> container
```

```text
image = layers + config
run   = runtime setup
container = bounded process
```

Choreography:
- Reassemble the full workflow from existing objects.
- Add compact annotations from earlier acts.
- Keep the pace brisk; this is a recap, not a new explanation.
- Let `run` connect to the bounded process from Act 6.

Camera / attention:
Pull back to show the full workflow in one composition.

Allowed copy:
- `build produces an image`
- `push stores it`
- `pull retrieves it`
- `run creates a container process`
- `image = layers + config`
- `run = runtime setup`
- `container = bounded process`

Avoid:
- Do not introduce new visual objects.
- Do not make the recap feel like a static summary slide.

Component candidates:
- `WorkflowRecap`
- `ConceptAnnotation`
- `FinalPipeline`

Quality gate:
The recap should feel earned because the objects came from prior scenes.

## Scene 7.2 — Final formula and optional commit loop

Source:
- Timeline scene: `Scene 7.2`
- Narration: `n029`–`n031`
- Beats: `b029`–`b031`

Scene promise:
The final compact definition lands and stays in memory.

Visual metaphor:
Existing objects compress into a formula. The formula is not typed from nowhere; it is assembled from the visual system.

Key frames:

```text
[ ● process ] + [ filesystem view ] + [ namespaces ] + [ cgroups ]
                              |
                              v
container = process + filesystem view + namespaces + cgroups
```

```text
      optional side loop

   writable changes -> commit -> new image layer

      smaller, secondary, not the ending
```

```text
Registry -> Image -> Runtime -> Container

The image is the packaged source.
The runtime prepares the environment.
The container is the bounded running process.

An image does not run. A process runs.
```

Choreography:
- Pull the process, filesystem view, namespace view, and cgroup budget out of the existing container.
- Arrange them into the final formula.
- Let the optional commit loop appear as a small side note, then visually demote it.
- Return to the final workflow and the corrected memory.
- End with the process pulse, not the image artifact.

Camera / attention:
Center on the formula, then settle into the final workflow. The last hold should be quiet and stable.

Allowed copy:
- `container = process + filesystem view + namespaces + cgroups`
- `the process is real`
- `the boundaries make it a container`
- `optional loop: commit`
- `usually rebuild from source + Dockerfile`
- `The image is the packaged source.`
- `The runtime prepares the environment.`
- `The container is the bounded running process.`
- `An image does not run. A process runs.`

Avoid:
- Do not end on `docker commit`.
- Do not make the final formula a disconnected title card.
- Do not let the final memory collapse into “container equals image.”

Component candidates:
- `FormulaAssembler`
- `SecondaryLoop`
- `FinalModelHold`

Quality gate:
The final formula should feel like the inevitable compression of everything the viewer just saw.
