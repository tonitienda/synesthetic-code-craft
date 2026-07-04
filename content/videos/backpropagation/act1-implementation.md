# Act I Implementation Guide

This file contains implementation guidance specific to Act I of the backpropagation video.

Repository-wide conventions live in `/docs` and `AGENTS.md`.

## Scope

Implement Act I only.

Do not implement Acts II–VII yet.

Act I should create the question that the next act answers:

> What happens if one line is not enough?

## Revision status

This guide incorporates feedback from the first implementation review:

```text
content/videos/backpropagation/reviews/act1-review-001.md
```

The next implementation pass should use the timeline file as the source of truth:

```text
content/videos/backpropagation/04-timeline.md
```

If `04-timeline.md` conflicts with `04-animation-spec.md` or `05-narration.md`, prefer `04-timeline.md`.

## Target duration

Act I should target approximately **90–120 seconds**.

The previous 37-second implementation was too fast.

Do not compress the act to fit under one minute.

## Pacing rules

- Every major concept needs visual breathing room.
- Add short pauses after important labels appear.
- Do not introduce inputs, weights, sum, activation, output, and decision boundary in one rapid chain.
- Narration should feel possible at normal speaking speed.
- Prefer fewer simultaneous animations.
- Important visual transitions should take around 1–2 seconds, not a few frames.
- Scene timestamps in `04-timeline.md` are relative to each scene.
- Scene durations in `04-timeline.md` are timing budgets. Adjust only slightly when implementation requires it.

## Source files

Read these files before implementation:

```text
content/videos/backpropagation/README.md
content/videos/backpropagation/00-video.md
content/videos/backpropagation/03-beats.md
content/videos/backpropagation/04-timeline.md
content/videos/backpropagation/06-codex-implementation.md
```

Reference only if needed:

```text
content/videos/backpropagation/04-animation-spec.md
content/videos/backpropagation/05-narration.md
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
8. A concrete two-input classification example appears.
9. The concrete example becomes a 2D graph.
10. The perceptron line separates two classes.
11. The line is then generalized as a decision boundary.
12. One line cannot separate every pattern.

## Concrete example requirement

Before introducing the abstract idea of a line or decision boundary, show a small concrete example.

Use this example unless there is a strong implementation reason to choose another:

```text
x₁ = hours studied
x₂ = hours slept
output = pass / not pass
```

The example should progress like this:

1. Show two named inputs entering the perceptron.
2. Show a few labeled examples, such as students represented as points.
3. Use two classes: `pass` and `not pass`.
4. Place the examples on a 2D graph.
5. Draw a line separating most/all of the examples.
6. Then generalize: with two inputs, a perceptron draws a line between classes.

The exact example is not important. The important rule is:

> concrete example first, abstraction second.

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
scene-concrete-example
scene-decision-boundary
scene-limitation
```

## Good next Codex task

```text
Revise Act I using content/videos/backpropagation/04-timeline.md as the source of truth.

Do not only edit Motion Canvas implementation files.

Use the timeline scene durations, timestamps, narration, and animation notes to guide the implementation.

If 04-timeline.md conflicts with 04-animation-spec.md or 05-narration.md, prefer 04-timeline.md.

Act I should target 90–120 seconds.
It must include a concrete two-input classification example before generalizing to a decision boundary line.
Do not implement future acts.
```
