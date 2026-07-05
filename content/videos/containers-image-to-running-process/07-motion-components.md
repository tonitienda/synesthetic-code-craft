---
type: motion-components
status: in-progress
depends_on:
  - 06-motion-design.md
---

# 07 — Motion components: Docker containers from image to running process

## Purpose

This file turns the approved motion direction into a concrete Motion Canvas implementation handoff.

It defines:

- how to grow a reusable component library from the existing Motion Canvas code under `src`
- the initial shared and domain component model
- scene-to-component mapping
- implementation order
- acceptance checks

It does not change the story, narration, or motion design.

## Source documents

- `05-scene-timeline.md`
- `06-motion-design.md`
- `04-narration.md`
- `content/language/animation-spec-v0.md`

## Status notes

- Status is `in-progress` because this is the first component handoff draft.
- The user has approved the direction of `05` and `06` in conversation, but agents should not transition documents to `ready`. The human should update statuses directly when reviewing.
- There is already Motion Canvas code under `src`; this phase should extend that codebase rather than invent a separate project shape.
- There is not yet a stable component library. This video should create the first useful shared components, with the expectation that later videos about containers, packages, filesystems, bounded contexts, and related topics will reuse and refine them.

## Implementation strategy

Do not try to build a complete visual framework before the first render.

Build a thin reusable component layer inside the existing Motion Canvas `src` structure:

```text
existing Motion Canvas code
  -> small shared primitives extracted only when needed
  -> containers/filesystems domain components
  -> scene assemblies for this video
  -> rendered video for review
```

The goal is not a compiler yet. The goal is a hand-authored Motion Canvas video whose components are clean enough to reuse and iterate.

## Existing-code rule

Before coding, inspect the existing `src` layout and follow its conventions for:

- project entry point
- scene registration
- component location
- theme/style utilities
- asset imports
- render/preview scripts
- naming style

Do not move or rename existing code unless it is necessary for this video and called out explicitly.

If the existing layout conflicts with any path below, preserve the existing layout and treat the paths as conceptual names.

## Proposed component organization

The exact directories should match the current `src` conventions, but the conceptual split should be:

```text
shared primitives:
  VideoShell, Label, ConceptBox, FlowArrow, TraceLine, FocusFrame, PulseDot

containers/filesystems domain components:
  CommandCallout, ImageArtifact, RegistryShelf, WorkflowRail, RuntimeSetup,
  LayerStack, WritableLayer, FileToken, ProcessPulse, BoundaryFrame,
  ContainerInstance, ContainerPair, KernelLayer, NamespaceSplitView,
  ResourceBudgetRing, FormulaAssembler, SecondaryLoop

containers video scenes:
  01-command-correction, 02-vocabulary-and-workflow, 03-open-the-image,
  04-runtime-preparation, 05-two-containers-copy-on-write,
  06-host-boundaries, 07-final-model
```

Preferred placement, if compatible with the existing repo:

```text
src/components/shared/
src/components/containers/
src/videos/containers-image-to-running-process/scenes/
src/videos/containers-image-to-running-process/data/
```

Alternative placement is acceptable if the existing codebase already uses another convention.

## Component-library growth rule

Create a reusable component only when at least one of these is true:

- the concept appears in multiple scenes in this video
- the concept is likely to recur in future videos
- the component protects an important visual rule
- the component prevents copy/paste animation logic

Examples:

- `LayerStack` is worth extracting because it appears in image internals, runtime setup, and copy-on-write.
- `ProcessPulse` is worth extracting because it protects the rule that only running processes look alive.
- `RegistryShelf` can be simple, but should still protect the rule that a registry is inert storage.
- `FormulaAssembler` may start as scene-local if extracting it slows the first render.

## Core component responsibilities

### Shared primitives

- `VideoShell`: background, safe margins, typography defaults, camera framing.
- `Label`: attached object labels; avoid detached explanatory paragraphs.
- `ConceptBox`: generic visual box/card for conceptual objects.
- `FlowArrow`: workflow movement such as build, push, pull, run.
- `TraceLine`: read/write/resolve traces for filesystem explanations.
- `FocusFrame`: restrained attention guidance.
- `PulseDot`: aliveness/running-process signal.

### Containers and filesystems components

- `CommandCallout`: command text with fragment focus, especially `run`.
- `ImageArtifact`: inert packaged image; can open into layers/config.
- `RegistryShelf`: inert image storage/distribution; never runtime.
- `WorkflowRail`: corrected build/push/pull/run workflow.
- `RuntimeSetup`: conceptual preparation table.
- `LayerStack`: ordered read-only filesystem layers.
- `WritableLayer`: private writable layer above shared image layers.
- `FileToken`: movable/resolvable file token for copy-on-write.
- `ProcessPulse`: real running process; only alive object.
- `BoundaryFrame`: filesystem, namespace, and cgroup boundaries.
- `ContainerInstance`: process plus prepared boundaries.
- `ContainerPair`: two containers sharing one foundation with private tops.
- `KernelLayer`: stable host kernel foundation.
- `NamespaceSplitView`: host-visible view versus shaped container view.
- `ResourceBudgetRing`: cgroup budget around the process.
- `FormulaAssembler`: final formula assembled from existing objects.
- `SecondaryLoop`: visually secondary commit loop.

## Scene assembly plan

### Scene file 01 — `01-command-correction`

Timeline scenes:
- `Scene 1.1`

Primary components:
- `CommandCallout`
- `ImageArtifact`
- `ProcessPulse`
- `RuntimeSetup`
- `ContainerInstance`

Main sequence:

```text
CommandCallout.enter
CommandCallout.highlightFragment('run')
CommandCallout.askQuestion('what runs?')
ImageArtifact.enterClosed + ProcessPulse.enterWaiting
ImageArtifact.highlightAsInert
ProcessPulse.start
RuntimeSetup.enter
ContainerInstance.enterFromRuntime
```

Acceptance:
The image remains inert; the process becomes alive.

### Scene file 02 — `02-vocabulary-and-workflow`

Timeline scenes:
- `Scene 2.1`
- `Scene 2.2`

Primary components:
- `ConceptBox`
- `ImageArtifact`
- `RegistryShelf`
- `WorkflowRail`

Main sequence:

```text
Four ConceptBoxes enter as vocabulary map
ImageArtifact opens enough to show layers/config preview
ImageArtifact moves to RegistryShelf
RegistryShelf.showNotRuntimeNote
WorkflowRail.enter
WorkflowRail.produceImage
WorkflowRail.pushImage
WorkflowRail.pullImage
WorkflowRail.runCreatesContainer
```

Acceptance:
The viewer can identify each noun and each verb's job.

### Scene file 03 — `03-open-the-image`

Timeline scenes:
- `Scene 3.1`

Primary components:
- `ImageArtifact`
- `LayerStack`
- `ConceptBox` or `ConfigCard`
- `Label` or `ReadOnlyBadge`

Main sequence:

```text
ImageArtifact.enterClosed
ImageArtifact.openIntoLayers
LayerStack.separateLayers
LayerStack.labelLayers
LayerStack.composeFilesystemView
LayerStack.showReadOnlyLocks
LayerStack.highlightShared
```

Acceptance:
The layer stack becomes the persistent shared object for later scenes.

### Scene file 04 — `04-runtime-preparation`

Timeline scenes:
- `Scene 4.1`
- `Scene 4.2`

Primary components:
- `RuntimeSetup`
- `LayerStack`
- `WritableLayer`
- `ProcessPulse`
- `ContainerInstance`
- `BoundaryFrame`

Main sequence:

```text
RuntimeSetup.receiveInput('image-layers')
RuntimeSetup.receiveInput('image-config')
RuntimeSetup.receiveInput('run-options')
LayerStack.composeFilesystemView
WritableLayer.enterOnTopOf(layerStack)
ProcessPulse.enterWaiting
ProcessPulse.attachConfig
ProcessPulse.start
ContainerInstance.addBoundary('filesystem-view')
ContainerInstance.addBoundary('namespace-views')
ContainerInstance.addBoundary('cgroup-budget')
```

Acceptance:
The process starts inside prepared boundaries, not before setup.

### Scene file 05 — `05-two-containers-copy-on-write`

Timeline scenes:
- `Scene 5.1`
- `Scene 5.2`

Primary components:
- `LayerStack`
- `ContainerPair`
- `WritableLayer`
- `TraceLine`
- `FileToken`

Main sequence:

```text
ContainerPair.enterFromSingleContainer
LayerStack.moveUnderContainers
ContainerPair.showSharedReads
ContainerPair.addWritableLayers
FileToken.enterInSharedLayer('/etc/app.conf')
FileToken.readBy('A')
FileToken.readBy('B')
FileToken.resistMutation
FileToken.duplicateAsModified
FileToken.moveToWritableLayer('A')
ContainerPair.splitFilesystemViews
FileToken.resolveFor('A')
FileToken.resolveFor('B')
```

Acceptance:
The token movement must explain copy-on-write without relying entirely on narration.

### Scene file 06 — `06-host-boundaries`

Timeline scenes:
- `Scene 6.1`
- `Scene 6.2`

Primary components:
- `ContainerInstance`
- `ProcessPulse`
- `KernelLayer`
- `NamespaceSplitView`
- `ResourceBudgetRing`
- `BoundaryFrame`

Main sequence:

```text
KernelLayer.enterBelowProcess
ProcessPulse.connectToKernel
brief mini-VM rejection if implementation cost is low
ContainerInstance.showAsBoundedProcess
NamespaceSplitView.enterHostView
NamespaceSplitView.shapeIntoContainerView
ResourceBudgetRing.enterAroundProcess
ResourceBudgetRing.showMeters
BoundarySummary.show('view + budget')
```

Acceptance:
The viewer understands “view versus budget.”

### Scene file 07 — `07-final-model`

Timeline scenes:
- `Scene 7.1`
- `Scene 7.2`

Primary components:
- `WorkflowRail`
- `FormulaAssembler`
- `SecondaryLoop`
- `CommandCallout`

Main sequence:

```text
WorkflowRail.enterCompact
WorkflowRail.annotateStep('image', 'layers + config')
WorkflowRail.annotateStep('run', 'runtime setup')
WorkflowRail.annotateStep('container', 'bounded process')
FormulaAssembler.collectPartsFromContainer
FormulaAssembler.arrangeFormula
SecondaryLoop.enterSmall
SecondaryLoop.traceLoop
SecondaryLoop.demote
WorkflowRail.collapseToFinalModel
CommandCallout.enter('docker run nginx') as quiet callback
FinalModelHold.hold
```

Acceptance:
The final formula feels assembled from the video, not placed on top of it.

## Implementation order

### Pass 0 — Inspect existing `src`

Goal:
Avoid fighting the current Motion Canvas project structure.

Tasks:

- identify the existing project entry point
- identify how scenes are currently registered
- identify existing theme/style helpers
- identify render/preview npm scripts
- identify any existing components worth reusing
- choose where the new shared/domain components belong

Acceptance:
The implementation plan is mapped to real paths in the current repo before creating files.

### Pass 1 — Visual skeleton

Goal:
Render the full video with all scenes present, using rough but persistent components.

Implement:

1. `VideoShell` or equivalent existing wrapper
2. `Label`
3. `ConceptBox`
4. `FlowArrow`
5. `TraceLine`
6. `PulseDot`
7. scene files with placeholder layouts

Acceptance:
All seven scene files render in order with rough timing and no missing imports.

### Pass 2 — Core container objects

Goal:
Make the core mental model visible.

Implement:

1. `CommandCallout`
2. `ImageArtifact`
3. `LayerStack`
4. `RuntimeSetup`
5. `ProcessPulse`
6. `ContainerInstance`
7. `KernelLayer`

Acceptance:
The video already communicates:

```text
image -> runtime setup -> bounded process
```

### Pass 3 — Copy-on-write hero section

Goal:
Make Act 5 good enough to judge the style of the whole video.

Implement:

1. `ContainerPair`
2. `WritableLayer`
3. `FileToken`
4. file read/write traces
5. A/B filesystem resolution view

Acceptance:
The copy-on-write scene works without explanation-heavy labels.

### Pass 4 — Boundary explanation

Goal:
Make namespaces and cgroups distinct.

Implement:

1. `NamespaceSplitView`
2. `ResourceBudgetRing`
3. `BoundarySummary`

Acceptance:
The viewer can summarize:

```text
namespaces = view
cgroups = budget
```

### Pass 5 — Polish and final recap

Goal:
Make the video feel like one continuous explanation rather than seven decks.

Implement:

1. `WorkflowRail` recap annotations
2. `FormulaAssembler`
3. `SecondaryLoop`
4. final hold
5. transitions between scene files

Acceptance:
The final model feels earned and the process pulse remains the last living object.

## Timing and narration integration

Use the narration IDs from `04-narration.md`. Do not duplicate narration text in scene code except where generating subtitles or reference comments requires it.

Suggested scene duration budgets:

```text
01-command-correction:              55–70s
02-vocabulary-and-workflow:         75–95s
03-open-the-image:                  80–105s
04-runtime-preparation:             95–120s
05-two-containers-copy-on-write:    125–155s
06-host-boundaries:                 100–125s
07-final-model:                     80–105s
```

For first render, rough timing is acceptable. Prefer slightly long holds over rushed diagrams.

Use the existing repo convention for whether copy, timings, and narration ID maps are `.ts`, `.json`, or inline scene constants.

## Acceptance checks before rendering review

The first generated video should be considered reviewable when:

- All scenes render without errors.
- The video uses the same visual language throughout.
- The new shared components live inside the existing `src` structure instead of creating a parallel architecture.
- The image artifact never pulses like a process.
- The registry never looks like runtime.
- The layer stack persists from image internals into runtime/copy-on-write scenes.
- The writable layer is visibly on top of shared read-only layers.
- The copy-on-write file token visibly moves into `Writable A` while the shared original remains unchanged.
- The host/kernel view makes the container feel like a real host process with boundaries.
- Namespaces and cgroups are visually different.
- The final formula is assembled from existing objects.
- `docker commit` is visually secondary.
- The final hold ends on the bounded running process model.

## Anti-PowerPoint checks

A scene should be revised if:

- objects disappear and unrelated objects replace them without transformation
- labels explain what the motion should have explained
- the camera is static for the whole scene without purposeful composition changes
- every idea appears as a card or bullet
- the narration works but the picture adds no explanatory value

## First-iteration simplifications allowed

These are acceptable for the first render:

- simple rectangles instead of highly polished custom shapes
- approximate camera movement
- placeholder icons for resources
- simple text labels instead of final typography polish
- manual timing rather than parsed narration timing
- no automated DSL/compiler
- component APIs that are useful but not yet perfect

These are not acceptable simplifications:

- turning the video into mostly title cards
- skipping the copy-on-write token movement
- making containers look like tiny VMs
- making the registry appear to run containers
- ending on `docker commit`

## Future reuse candidates

These components are likely to survive beyond this video:

```text
VideoShell
Label
ConceptBox
FlowArrow
TraceLine
PulseDot
LayerStack
FileToken
ProcessPulse
BoundaryFrame
WorkflowRail
```

Likely future uses:

- packages video: package artifact, dependency graph, installed files, version movement
- filesystems video: layer stacks, file tokens, path resolution, overlays
- bounded contexts video: boundary frames, context maps, translation/adapters
- containers follow-up: image build, registry distribution, volumes, networking, orchestration

Keep this reuse pressure in mind, but do not generalize prematurely. Let repeated videos harden the API.

## Open implementation questions

These should be answered by inspecting the actual Motion Canvas project before coding:

- What is the existing project entry point convention?
- Are there existing shared theme/typography utilities?
- Are there existing reusable components that should be extended instead of recreated?
- Which npm script renders or previews a Motion Canvas project in this repository?
- Is narration timing currently manual, generated from `04-narration.md`, or absent?
- Should the first render include audio, subtitles, or visual timing only?

Do not block the first visual render on perfect answers. Make conservative choices, document them, and keep the implementation easy to revise.
