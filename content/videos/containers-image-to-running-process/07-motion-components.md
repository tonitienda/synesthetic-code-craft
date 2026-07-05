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

- the component model
- proposed file structure
- scene-to-component mapping
- component responsibilities
- props and actions
- implementation order
- acceptance checks
- risks and simplifications

It does **not** change the story, narration, or motion design.

## Source documents

- `05-scene-timeline.md`
- `06-motion-design.md`
- `04-narration.md`
- `content/language/animation-spec-v0.md`

## Status notes

- Status is `in-progress` because this is the first component handoff draft.
- The user has approved the direction of `05` and `06` in conversation, but agents should not transition documents to `ready`. The human should update statuses directly when reviewing.
- This plan assumes the implementation will produce a first real rendered video quickly, so the design can be judged in motion rather than endlessly refined in Markdown.

## Implementation strategy

Do not try to build a complete visual framework before the first render.

Build a **thin reusable component layer** that is just enough to implement this video with good motion:

```text
core primitives
  ↓
containers domain components
  ↓
scene assemblies
  ↓
video project entry
```

The goal is not a compiler yet. The goal is a hand-authored Motion Canvas video whose components are clean enough to reuse and iterate.

## Proposed file structure

Verify the repository's actual Motion Canvas layout before implementation. If no Motion Canvas project structure exists yet, use this as the target layout.

```text
src/
  components/
    core/
      VideoShell.tsx
      Label.tsx
      ConceptBox.tsx
      FlowArrow.tsx
      TraceLine.tsx
      FocusFrame.tsx
      PulseDot.tsx
      SectionTitle.tsx
    containers/
      CommandCallout.tsx
      ImageArtifact.tsx
      RegistryShelf.tsx
      WorkflowRail.tsx
      RuntimeSetup.tsx
      LayerStack.tsx
      WritableLayer.tsx
      FileToken.tsx
      ProcessPulse.tsx
      BoundaryFrame.tsx
      ContainerInstance.tsx
      ContainerPair.tsx
      KernelLayer.tsx
      NamespaceSplitView.tsx
      ResourceBudgetRing.tsx
      FormulaAssembler.tsx
      SecondaryLoop.tsx
  videos/
    containers-image-to-running-process/
      project.ts
      scenes/
        01-command-correction.tsx
        02-vocabulary-and-workflow.tsx
        03-open-the-image.tsx
        04-runtime-preparation.tsx
        05-two-containers-copy-on-write.tsx
        06-host-boundaries.tsx
        07-final-model.tsx
      data/
        narration-ids.ts
        copy.ts
        timings.ts
```

If the project uses a different convention, preserve the existing convention and map these names into it.

## Global visual constants

Define these once and import them everywhere.

```text
background: dark technical gradient or solid near-black
primary text: high contrast
secondary text: muted
accent: restrained, used for attention only
read-only layer: stable / locked visual language
writable layer: distinct but not neon
process: soft pulse, always visually alive
host kernel: broad stable base
```

Required design tokens:

```ts
Theme = {
  spacing: {
    xs, sm, md, lg, xl
  }
  typography: {
    mono, title, label, small
  }
  durations: {
    quick, normal, slow, hold
  }
  emphasis: {
    dimOpacity, focusOpacity, glowStrength
  }
}
```

Do not hardcode timing and styling inside every scene. The first implementation can still be manual, but repeated values should live in one place.

---

# Component layers

## Layer 0 — Core primitives

These components are not specific to containers.

### `VideoShell`

Responsibility:
Provide background, safe margins, typography defaults, and common camera framing.

Props:

```ts
type VideoShellProps = {
  title?: string
  background?: 'dark-technical' | 'dark-flat'
  showSafeFrame?: boolean
}
```

Actions:

```text
enter
fadeIn
fadeOut
```

Notes:
Use this in every scene so the video does not feel like separate slides.

### `Label`

Responsibility:
Reusable text label attached to objects.

Props:

```ts
type LabelProps = {
  text: string
  variant?: 'title' | 'label' | 'small' | 'mono' | 'emphasis'
  anchor?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}
```

Actions:

```text
show
hide
highlight
dim
replaceText
```

Notes:
Labels should be attached to visual objects whenever possible. Avoid detached explanatory paragraphs.

### `ConceptBox`

Responsibility:
Generic rounded box/card for conceptual objects.

Props:

```ts
type ConceptBoxProps = {
  title: string
  subtitle?: string
  variant?: 'neutral' | 'artifact' | 'runtime' | 'registry' | 'container' | 'warning'
  icon?: string
}
```

Actions:

```text
enter
exit
highlight
dim
moveTo
morphTo
```

Notes:
This should be the base visual language for `ImageArtifact`, `RegistryShelf`, `RuntimeSetup`, and similar objects.

### `FlowArrow`

Responsibility:
Show directional workflow movement.

Props:

```ts
type FlowArrowProps = {
  from: NodeRef
  to: NodeRef
  label?: string
  style?: 'artifact-flow' | 'runtime-flow' | 'recap-flow'
}
```

Actions:

```text
draw
sendArtifact
highlight
dim
remove
```

Notes:
Use for build/push/pull/run workflow, not for file read/write traces.

### `TraceLine`

Responsibility:
Show read/write cause-and-effect traces.

Props:

```ts
type TraceLineProps = {
  from: NodeRef
  to: NodeRef
  label?: string
  style?: 'read' | 'write' | 'resolve'
}
```

Actions:

```text
drawRead
drawWrite
pulse
fade
```

Notes:
Use for copy-on-write and filesystem resolution. It should feel different from workflow arrows.

### `PulseDot`

Responsibility:
Represent aliveness/running process.

Props:

```ts
type PulseDotProps = {
  label?: string
  active?: boolean
  intensity?: 'subtle' | 'normal'
}
```

Actions:

```text
start
stop
pulseOnce
highlight
```

Notes:
This is the strongest recurring signifier in the video: only real processes pulse.

### `FocusFrame`

Responsibility:
Guide attention without changing the concept.

Props:

```ts
type FocusFrameProps = {
  target?: NodeRef
  label?: string
  mode?: 'spotlight' | 'outline' | 'dim-others'
}
```

Actions:

```text
focus
release
moveTo
```

Notes:
Use sparingly. The video should not become a sequence of highlighted boxes.

---

## Layer 1 — Containers domain components

### `CommandCallout`

Used in:
- Scene 1.1
- Final callback in Scene 7.2

Responsibility:
Show the familiar command and allow focus on fragments such as `run`.

Props:

```ts
type CommandCalloutProps = {
  command: string
  fragments?: {
    id: string
    text: string
  }[]
}
```

Actions:

```text
enter
highlightFragment(fragmentId)
dimFragments(fragmentIds)
askQuestion(text)
collapseToWorkflowStart
exit
```

Acceptance:
`run` must be focusable without making the command look like a full terminal tutorial.

### `ImageArtifact`

Used in:
- Scene 1.1
- Scene 2.1
- Scene 2.2
- Scene 3.1
- Scene 7.1

Responsibility:
Represent an inert packaged image. It can be closed, opened, moved, stored, and decomposed into layers/config.

Props:

```ts
type ImageArtifactProps = {
  label?: string
  state?: 'closed' | 'opening' | 'open' | 'stored' | 'local'
  showConfig?: boolean
  showLayerPreview?: boolean
}
```

Actions:

```text
enterClosed
moveToRegistry
moveToLocal
openIntoLayers
closeFromLayers
highlightAsInert
dim
exit
```

Acceptance:
The image must never pulse like a process.

### `RegistryShelf`

Used in:
- Scene 2.1
- Scene 2.2
- Scene 7.1

Responsibility:
Represent image storage/distribution.

Props:

```ts
type RegistryShelfProps = {
  label?: string
  slots?: number
  storedImages?: string[]
}
```

Actions:

```text
enter
receiveImage(imageId)
releaseImage(imageId)
highlightStorage
showNotRuntimeNote
exit
```

Acceptance:
The registry must feel inert: no process pulse, no runtime boundary, no host kernel relationship.

### `WorkflowRail`

Used in:
- Scene 2.2
- Scene 7.1
- Scene 7.2

Responsibility:
Render the corrected build/push/pull/run workflow.

Props:

```ts
type WorkflowStep = {
  id: 'build' | 'image' | 'push' | 'registry' | 'pull' | 'local-image' | 'run' | 'container'
  label: string
  kind: 'verb' | 'artifact' | 'place' | 'runtime-output'
}

type WorkflowRailProps = {
  steps: WorkflowStep[]
  layout?: 'horizontal' | 'compact'
}
```

Actions:

```text
enter
produceImage
pushImage
pullImage
runCreatesContainer
annotateStep(stepId, text)
collapseToFinalModel
exit
```

Acceptance:
`push` and `pull` must move image artifacts. Only `run` may create a pulsing container process.

### `LayerStack`

Used in:
- Scene 3.1
- Scene 4.1
- Scene 5.1
- Scene 5.2

Responsibility:
Represent ordered read-only image layers and optionally one composed filesystem view.

Props:

```ts
type LayerSpec = {
  id: string
  label: string
  readonly?: boolean
}

type LayerStackProps = {
  layers: LayerSpec[]
  mode?: 'stacked' | 'separated' | 'composed'
  showLocks?: boolean
  label?: string
}
```

Actions:

```text
enterStacked
separateLayers
labelLayers
composeFilesystemView
showReadOnlyLocks
moveUnderContainers
highlightShared
exit
```

Acceptance:
The same layer stack object should persist from Act 3 into Acts 4 and 5.

### `WritableLayer`

Used in:
- Scene 4.1
- Scene 5.1
- Scene 5.2

Responsibility:
Represent the private writable layer on top of shared image layers.

Props:

```ts
type WritableLayerProps = {
  owner?: 'A' | 'B' | 'single'
  label?: string
  files?: FileTokenSpec[]
}
```

Actions:

```text
enterOnTopOf(stackId)
receiveFile(fileId)
highlightPrivate
showEmpty
showChangedFile(fileId)
exit
```

Acceptance:
A writable layer must be visually above and separate from the read-only image layers.

### `RuntimeSetup`

Used in:
- Scene 1.1
- Scene 4.1
- Scene 7.1

Responsibility:
Represent conceptual runtime preparation.

Props:

```ts
type RuntimeSetupProps = {
  label?: string
  inputs?: ('image-layers' | 'image-config' | 'run-options')[]
  mode?: 'thesis' | 'preparation-table'
}
```

Actions:

```text
enter
receiveInput(inputId)
alignLayers
addWritableLayer
emitContainerInstance
exit
```

Acceptance:
It should feel like preparation, not brand-specific magic or a strict implementation trace.

### `ProcessPulse`

Used in:
- Scene 1.1
- Scene 4.2
- Scene 5.1
- Scene 6.1
- Scene 6.2
- Scene 7.2

Responsibility:
Represent the real running process.

Props:

```ts
type ProcessPulseProps = {
  label?: string
  state?: 'waiting' | 'running' | 'highlighted'
}
```

Actions:

```text
enterWaiting
attachConfig
start
pulse
connectToKernel
highlightAsReal
exit
```

Acceptance:
The process pulse is the only recurring alive object.

### `ContainerInstance`

Used in:
- Scene 1.1
- Scene 4.2
- Scene 5.1
- Scene 6.1
- Scene 7.1
- Scene 7.2

Responsibility:
Group process, filesystem view, namespace views, and cgroup budget into one bounded container instance.

Props:

```ts
type ContainerInstanceProps = {
  id: string
  label?: string
  process?: ProcessPulseProps
  showFilesystemFrame?: boolean
  showNamespaceFrame?: boolean
  showCgroupFrame?: boolean
  writableLayer?: WritableLayerProps
}
```

Actions:

```text
enterFromRuntime
startProcess
addBoundary(kind)
showAsBoundedProcess
duplicateAsPair
extractFormulaParts
exit
```

Acceptance:
A container is a process plus boundaries. It should never look like a self-contained VM box.

### `ContainerPair`

Used in:
- Scene 5.1
- Scene 5.2

Responsibility:
Represent two containers sharing one image foundation while keeping private writable layers.

Props:

```ts
type ContainerPairProps = {
  leftLabel?: string
  rightLabel?: string
  sharedLayerStackId: string
}
```

Actions:

```text
enterFromSingleContainer
showSharedReads
addWritableLayers
highlightPrivateChanges
splitFilesystemViews
exit
```

Acceptance:
The lower layer stack must not duplicate. One foundation, two private tops.

### `FileToken`

Used in:
- Scene 5.2

Responsibility:
Represent a file as a movable/resolvable token in the copy-on-write explanation.

Props:

```ts
type FileTokenSpec = {
  id: string
  path: string
  variant?: 'original' | 'modified'
  locked?: boolean
}
```

Actions:

```text
enterInSharedLayer
readBy(containerId)
resistMutation
duplicateAsModified
moveToWritableLayer(owner)
resolveFor(containerId)
```

Acceptance:
The shared original must remain visibly unchanged when the modified token appears in `Writable A`.

### `KernelLayer`

Used in:
- Scene 6.1
- Scene 7.2

Responsibility:
Represent the host kernel as the stable foundation underneath processes.

Props:

```ts
type KernelLayerProps = {
  label?: string
  width?: 'scene' | 'compact'
}
```

Actions:

```text
enterBelowProcess
connectProcess(processId)
highlightHostView
hold
exit
```

Acceptance:
The kernel should feel stable and broad, not like another container layer.

### `NamespaceSplitView`

Used in:
- Scene 6.2

Responsibility:
Show host-visible resources versus container-visible shaped view.

Props:

```ts
type NamespaceResource = 'processes' | 'mounts' | 'network' | 'hostname'

type NamespaceSplitViewProps = {
  hostResources: NamespaceResource[]
  containerResources: NamespaceResource[]
}
```

Actions:

```text
enterHostView
shapeIntoContainerView
highlightViewWord
collapseToBoundaryFrame
exit
```

Acceptance:
Namespaces must communicate shaped visibility, not resource budgeting.

### `ResourceBudgetRing`

Used in:
- Scene 6.2

Responsibility:
Show cgroup budget and resource accounting/limits.

Props:

```ts
type ResourceBudgetRingProps = {
  resources: ('CPU' | 'memory' | 'I/O')[]
  mode?: 'accounting' | 'limits' | 'budget'
}
```

Actions:

```text
enterAroundProcess
showMeters
highlightBudgetWord
collapseToBoundaryFrame
exit
```

Acceptance:
Cgroups must communicate budget/use, not visibility.

### `FormulaAssembler`

Used in:
- Scene 7.2

Responsibility:
Build the final formula from existing visual parts.

Props:

```ts
type FormulaPart = 'process' | 'filesystem-view' | 'namespaces' | 'cgroups'

type FormulaAssemblerProps = {
  parts: FormulaPart[]
  formula: string
}
```

Actions:

```text
collectPartsFromContainer
arrangeFormula
highlightPart(part)
holdFinalFormula
collapseToFinalWorkflow
```

Acceptance:
The formula must feel assembled from previous objects, not typed onto an empty slide.

### `SecondaryLoop`

Used in:
- Scene 7.2

Responsibility:
Show the optional `docker commit` loop as secondary.

Props:

```ts
type SecondaryLoopProps = {
  steps: string[]
  label?: string
}
```

Actions:

```text
enterSmall
traceLoop
demote
exit
```

Acceptance:
The commit loop must never become the final memory.

---

# Scene assembly plan

## Scene file 01 — `01-command-correction.tsx`

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

## Scene file 02 — `02-vocabulary-and-workflow.tsx`

Timeline scenes:
- `Scene 2.1`
- `Scene 2.2`

Primary components:
- `ConceptBox`
- `ImageArtifact`
- `RegistryShelf`
- `WorkflowRail`
- `SecondaryNote`

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

## Scene file 03 — `03-open-the-image.tsx`

Timeline scenes:
- `Scene 3.1`

Primary components:
- `ImageArtifact`
- `LayerStack`
- `ConfigCard`
- `ReadOnlyBadge`

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

## Scene file 04 — `04-runtime-preparation.tsx`

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

## Scene file 05 — `05-two-containers-copy-on-write.tsx`

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

## Scene file 06 — `06-host-boundaries.tsx`

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
MisconceptionCrossout.briefMiniVmRejection
ContainerInstance.showAsBoundedProcess
NamespaceSplitView.enterHostView
NamespaceSplitView.shapeIntoContainerView
ResourceBudgetRing.enterAroundProcess
ResourceBudgetRing.showMeters
BoundarySummary.show('view + budget')
```

Acceptance:
The viewer understands “view versus budget.”

## Scene file 07 — `07-final-model.tsx`

Timeline scenes:
- `Scene 7.1`
- `Scene 7.2`

Primary components:
- `WorkflowRail`
- `ConceptAnnotation`
- `FormulaAssembler`
- `SecondaryLoop`
- `CommandCallout`
- `FinalModelHold`

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

---

# Implementation order

Build in this order to get an early visible video while reducing throwaway work.

## Pass 1 — Visual skeleton

Goal:
Render the full video with all scenes present, using rough but persistent components.

Implement:

1. `VideoShell`
2. `Label`
3. `ConceptBox`
4. `FlowArrow`
5. `TraceLine`
6. `PulseDot`
7. scene files with placeholder layouts

Acceptance:
All seven scene files render in order with rough timing and no missing imports.

## Pass 2 — Core container objects

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

## Pass 3 — Copy-on-write hero section

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

## Pass 4 — Boundary explanation

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

## Pass 5 — Polish and final recap

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

---

# Timing and narration integration

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

## Data files

Use simple data files so copy and IDs are not scattered across components.

```text
data/copy.ts
```

Contains:

```text
commands
labels
workflow terms
formula text
resource names
file paths
```

```text
data/timings.ts
```

Contains:

```text
scene duration budgets
common hold durations
common animation speeds
```

```text
data/narration-ids.ts
```

Contains scene-to-narration mapping:

```text
scene01: ['n001', 'n002', 'n003']
scene02: ['n004', 'n005', 'n006', 'n007', 'n008']
...
```

---

# Acceptance checks before rendering review

The first generated video should be considered reviewable when:

- All scenes render without errors.
- The video uses the same visual language throughout.
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

These are not acceptable simplifications:

- turning the video into mostly title cards
- skipping the copy-on-write token movement
- making containers look like tiny VMs
- making the registry appear to run containers
- ending on `docker commit`

---

# Open implementation questions

These should be answered by inspecting the actual Motion Canvas project before coding:

- What is the existing project entry point convention?
- Are there existing shared theme/typography utilities?
- Are there existing reusable components that should be extended instead of recreated?
- Which npm script renders or previews a Motion Canvas project in this repository?
- Is narration timing currently manual, generated from `04-narration.md`, or absent?
- Should the first render include audio, subtitles, or visual timing only?

Do not block the first visual render on perfect answers. Make conservative choices, document them, and keep the implementation easy to revise.
