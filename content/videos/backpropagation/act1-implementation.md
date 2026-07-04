# Act I Implementation Guide

This file contains implementation guidance specific to Act I of the backpropagation video.

Repository-wide conventions live in `/docs` and `AGENTS.md`.

## Scope

Implement Act I only.

Do not implement Acts II–VII yet.

Act I should create the question that the next act answers:

> What happens if one line is not enough?

## Source files

Read these files before implementation:

```text
content/videos/backpropagation/README.md
content/videos/backpropagation/00-video.md
content/videos/backpropagation/03-beats.md
content/videos/backpropagation/04-animation-spec.md
content/videos/backpropagation/05-narration.md
content/videos/backpropagation/06-codex-implementation.md
```

## Act I visual acceptance criteria

A viewer should be able to visually understand:

1. A neuron appears.
2. Inputs connect to it.
3. Weights appear on connections.
4. Signals move through weighted inputs.
5. The neuron combines information.
6. An output is produced.
7. Changing a weight changes the decision.
8. The perceptron becomes a linear decision boundary.
9. One line cannot separate every pattern.

## Suggested reusable components

Use these only if they simplify the implementation:

- `Neuron`
- `Connection`
- `Signal`
- `WeightedConnection`
- `DecisionBoundaryGraph`
- `PointClass`
- `PortraitPlaceholder`
- `SceneTitle`

## Suggested scene modules

```text
scene-title
scene-single-neuron
scene-rosenblatt
scene-inputs-and-weights
scene-weighted-sum
scene-learning-weight-change
scene-decision-boundary
scene-limitation
```

## Good first Codex task

```text
Implement Act I of the backpropagation video from the Markdown source files.

Use content/videos/backpropagation/04-animation-spec.md as the source of truth.
Use content/videos/backpropagation/05-narration.md for pacing.
Use content/videos/backpropagation/act1-implementation.md for Act I-specific acceptance criteria.
Keep the implementation minimal and readable.
Create reusable components only for repeated concepts.
Do not implement future acts.
```
