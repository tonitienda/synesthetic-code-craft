# Animation Specification v0

This document defines the first lightweight vocabulary for describing educational animations before implementing them in Motion Canvas.

It is not a strict compiler DSL yet. It is a structured, human-readable scene language that can later evolve into one.

The main goal is to let the scene timeline describe intent with reusable high-level components instead of forcing an agent to invent low-level Motion Canvas shapes from scratch.

## Principles

- Prefer high-level components over low-level drawing commands.
- Use low-level commands only when no component expresses the intent.
- One visual idea per timeline event when possible.
- Every reusable visual object should have an `id`.
- Narration should be referenced by segment ID, not duplicated.
- Motion should explain the concept, not decorate it.
- Keep the vocabulary small and reusable.
- Videos in the same family should share components so they develop a consistent look and feel.

## Scene timeline role

A scene timeline should answer:

- what appears on screen
- which high-level component represents it
- which narration segment it supports
- when the component enters, changes, and exits
- which props or states the implementation needs

A scene timeline should not contain Motion Canvas code.

## Component-first model

A component is a semantic visual unit.

It may be implemented later using many Motion Canvas nodes, but the scene timeline treats it as one reusable object.

Common component shape:

```yaml
- id: perceptron-main
  type: Perceptron
  props:
    inputs:
      - id: x1
        label: "hours studied"
      - id: x2
        label: "hours slept"
    weights:
      - id: w1
        label: "w₁"
      - id: w2
        label: "w₂"
    output_label: "pass / not pass"
  state: idle
```

Common event shape:

```yaml
- at: 4.0
  narration: n014
  target: perceptron-main
  action: show_inputs
  params:
    inputs: [x1, x2]
```

## High-level components

These are the preferred building blocks for scene timelines.

### VideoShell

Global visual wrapper for a video.

Use for:

- background style
- safe margins
- typography defaults
- color palette
- camera defaults
- caption placement

Typical props:

```yaml
type: VideoShell
props:
  background: dark-gradient
  style: calm-technical
  typography: default
  motion: restrained
```

### SplashScreen

A short branded opening screen.

Use for a logo, project mark, or channel identity.

Typical behavior:

```text
fade in → hold → fade out
```

Typical props:

```yaml
type: SplashScreen
props:
  logo: "still-moving-mark"
  title: "Still Moving"
  subtitle: "optional"
  animation: fade-in-hold-fade-out
```

### TitleCard

A title or section title screen.

Use for video titles, act titles, or major conceptual transitions.

Typical props:

```yaml
type: TitleCard
props:
  eyebrow: "optional small label"
  title: "Backpropagation"
  subtitle: "How neural networks learn from mistakes"
  animation: fade-in-hold-fade-out
```

### SectionCard

A lightweight divider between acts or conceptual sections.

Typical props:

```yaml
type: SectionCard
props:
  label: "Act I"
  title: "The First Artificial Neuron"
  subtitle: "Before deep networks, there was one learning unit."
```

### ConceptCard

A focused explanatory card for one idea or definition.

Typical props:

```yaml
type: ConceptCard
props:
  title: "Weight"
  body: "A weight controls how strongly an input matters."
  emphasis: "strongly"
```

### EquationStep

A progressive equation reveal.

Use when the narration explains symbols or operations step by step.

Typical props:

```yaml
type: EquationStep
props:
  expression: "x₁w₁ + x₂w₂"
  steps:
    - highlight: "x₁w₁"
    - highlight: "x₂w₂"
    - highlight: "+"
```

### Perceptron

Reusable visual component for a single artificial neuron.

Use for:

- inputs
- weights
- bias, when needed
- weighted sum
- activation
- output
- signal flow
- changing weights

Typical props:

```yaml
type: Perceptron
props:
  inputs:
    - id: x1
      label: "x₁ = hours studied"
    - id: x2
      label: "x₂ = hours slept"
  weights:
    - id: w1
      label: "w₁"
    - id: w2
      label: "w₂"
  show_bias: false
  activation: threshold
  output_label: "pass / not pass"
  layout: left-to-right
```

Useful actions:

```text
enter
show_inputs
show_weights
highlight_weight
send_signal
show_weighted_sum
activate
show_output
change_weight
exit
```

### NeuralNet

Reusable visual component for a neural network.

Use for multi-layer explanations, forward passes, backpropagation, and architecture overviews.

Typical props:

```yaml
type: NeuralNet
props:
  layers: [3, 4, 5, 4, 3]
  labels:
    input: "input layer"
    hidden: "hidden layers"
    output: "output layer"
  connection_style: sparse-readable
  node_style: soft-glow
  layout: left-to-right
```

Useful actions:

```text
enter
show_layer
highlight_layer
send_forward_signal
show_prediction
show_error
send_backward_signal
update_weights
collapse_to_overview
exit
```

### Graph2D

Reusable two-dimensional graph component.

Use for examples involving points, axes, coordinates, classification, loss curves, or decision boundaries.

Typical props:

```yaml
type: Graph2D
props:
  x_label: "hours studied"
  y_label: "hours slept"
  points:
    - id: p1
      class: pass
      x: 7
      y: 8
    - id: p2
      class: not-pass
      x: 2
      y: 3
```

Useful actions:

```text
enter_axes
add_points
label_groups
show_decision_boundary
move_decision_boundary
rotate_decision_boundary
highlight_region
exit
```

### DecisionBoundary

A subcomponent or child of `Graph2D`.

Use when a separating line, curve, or region needs its own identity.

Typical props:

```yaml
type: DecisionBoundary
props:
  shape: line
  label: "decision boundary"
  initial_position: center
```

### SignalFlow

Animated signal dots or pulses travelling through a component.

Use for inputs, network activations, gradients, or causal flow.

Typical props:

```yaml
type: SignalFlow
props:
  from: x1
  to: neuron
  count: 1
  stagger: 0.2
```

### ComparisonFrame

A split layout for comparing two concepts.

Typical props:

```yaml
type: ComparisonFrame
props:
  left_title: "single perceptron"
  right_title: "network"
  relation: "limitation → extension"
```

## Low-level commands

Low-level commands are still allowed, but they are the fallback vocabulary.

Use them when a scene needs something that is not yet covered by a high-level component.

```text
CREATE
LABEL
CONNECT
MOVE
ANIMATE
HIGHLIGHT
FOCUS
WAIT
FADE_IN
FADE_OUT
REMOVE
CAMERA
```

`NARRATE` is deprecated in scene timelines. Use narration segment references such as `narration: n001` instead.

## Low-level object types

```text
Background
Text
Circle
Line
Arrow
Dot
Signal
Group
Graph
Axis
Point
Equation
PortraitPlaceholder
```

## Scene timeline example

```yaml
scenes:
  - id: s001
    title: "Title"
    duration: 8
    beats: [b001]
    narration: [n001, n002]
    components:
      - id: title-card
        type: TitleCard
        props:
          title: "Backpropagation"
          subtitle: "How neural networks learn from mistakes"
          animation: fade-in-hold-fade-out
    events:
      - at: 0.0
        narration: n001
        target: title-card
        action: show_title
      - at: 2.0
        narration: n002
        target: title-card
        action: show_subtitle
      - at: 5.5
        target: title-card
        action: fade_out
```

## Perceptron scene example

```yaml
scenes:
  - id: s004
    title: "Concrete inputs"
    duration: 17
    beats: [b004]
    narration: [n010, n011, n012]
    components:
      - id: perceptron
        type: Perceptron
        props:
          inputs:
            - id: x1
              label: "x₁ = hours studied"
            - id: x2
              label: "x₂ = hours slept"
          output_label: "pass / not pass"
          layout: left-to-right
    events:
      - at: 0.0
        target: perceptron
        action: enter
      - at: 4.0
        narration: n010
        target: perceptron
        action: show_inputs
        params:
          inputs: [x1]
      - at: 7.5
        narration: n011
        target: perceptron
        action: show_inputs
        params:
          inputs: [x2]
      - at: 11.0
        narration: n012
        target: perceptron
        action: send_signal
        params:
          inputs: [x1, x2]
```

## Motion Canvas translation guidance

- `VideoShell`, `SplashScreen`, `TitleCard`, `Perceptron`, `NeuralNet`, and `Graph2D` should become reusable Motion Canvas components when they are used more than once.
- Component props should map to TypeScript props where practical.
- Component actions should map to generator functions or helper methods with consistent timing.
- `WAIT` maps to timeline delays when low-level commands are used.
- `HIGHLIGHT` should be implemented consistently across components.
- The first implementation can be manual; a compiler can come later.
- Do not build a compiler until at least one real video has proved the vocabulary.
