# Animation Specification v0

This document defines the first lightweight vocabulary for describing educational animations before implementing them in Motion Canvas.

It is not meant to be a strict DSL yet. It is a structured human-readable format that can later evolve into one.

## Principles

- One visual event per block when possible.
- Every reusable visual object should have an `id`.
- Narration should be close to the visual event it explains.
- Motion should explain the concept, not decorate it.
- Keep the vocabulary small.

## Core commands

```text
CREATE
LABEL
CONNECT
MOVE
ANIMATE
HIGHLIGHT
FOCUS
WAIT
NARRATE
FADE_IN
FADE_OUT
REMOVE
CAMERA
```

## Object types

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

## Example

```text
CREATE Circle
id: neuron
position: center
radius: 48
style: soft glow

NARRATE
"This is an artificial neuron."

CREATE Line
id: input_1
from: left
to: neuron
animation: grow toward neuron

LABEL
target: input_1
text: x₁

WAIT 0.5
```

## Motion Canvas translation guidance

- `CREATE` usually maps to reusable components or JSX nodes.
- `NARRATE` maps to audio timing markers or comments if audio is not implemented yet.
- `WAIT` maps to timeline delays.
- `HIGHLIGHT` should be implemented consistently across components.
- The first implementation can be manual; a compiler can come later.
