# Act I Review 001

## Context

First implementation pass of Act I was rendered and reviewed.

## Observations

### 1. Act I is too short

The rendered Act I is approximately 37 seconds.

That is too fast for narration, comprehension, and visual breathing room.

The viewer needs time to understand each concept before the next concept appears.

### 2. The line concept is too abstract

The current version jumps too quickly from perceptron to "line" as an abstraction.

Before generalizing to a decision boundary, the video should show a concrete classification example.

For example:

- input `x₁`: hours studied
- input `x₂`: hours slept
- output: pass / not pass

Then the dots can appear on a 2D graph.

Only after that should the visual generalize:

> With two inputs, the perceptron draws a line between two classes.

## Required content-spec changes

Before the next implementation pass, update content specs, not only `/src`.

Required updates:

1. Add explicit pacing guidance to Act I.
2. Add approximate target duration.
3. Add pauses after important concepts.
4. Add a concrete example before introducing the abstract decision boundary.
5. Update narration to support the concrete example.
6. Update the animation spec so Codex implements the revised story, not only timing tweaks.

## Target duration

Act I should target approximately 90–120 seconds.

Do not optimize for speed.

A slower Act I is acceptable if the concepts are clearer.

## Next Codex instruction

```text
Revise Act I using the content source files first.

Do not only edit Motion Canvas implementation files.

First update:
- content/videos/backpropagation/04-animation-spec.md
- content/videos/backpropagation/05-narration.md
- content/videos/backpropagation/act1-implementation.md

Then update the Motion Canvas implementation to match the revised specs.

Act I should target 90–120 seconds and include a concrete two-input classification example before generalizing to a decision boundary line.
```
