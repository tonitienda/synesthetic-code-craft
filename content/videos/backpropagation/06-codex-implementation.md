# 06 — Codex Implementation Instructions

This file tells Codex how to implement Act I in Motion Canvas.

## Source files

Use these files as source of truth:

```text
content/language/animation-spec-v0.md
content/videos/backpropagation/04-timeline.md
content/videos/backpropagation/act1-implementation.md
```

Reference these only if needed:

```text
content/videos/backpropagation/04-animation-spec.md
content/videos/backpropagation/05-narration.md
```

If files conflict, prefer `04-timeline.md`.

Do not use the previous direct backpropagation implementation as design source.
It can be inspected for project conventions, but the visual structure should come from the Markdown timeline.

## Goal

Implement Act I only.

The result should be a polished but minimal Motion Canvas scene sequence introducing the perceptron.

Target duration: **90–120 seconds**.

Do not compress the act below 90 seconds.

## Implementation priorities

1. Faithfully follow the timeline.
2. Use scene durations and relative timestamps from `04-timeline.md` as timing guidance.
3. Prefer reusable components over one-off shapes.
4. Keep the visual style calm and minimal.
5. Make the animation readable even without final narration audio.
6. Keep timings easy to adjust.

## Suggested reusable components

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

## Visual constraints

- Dark background.
- Soft glow is allowed, but avoid neon excess.
- Avoid crowded screens.
- Use generous spacing.
- Movement should be slow and intentional.
- Use line thickness to communicate weight strength.
- Use signal dots to communicate information flow.
- Show the concrete example before the abstract decision boundary.

## Narration handling

Narration can be represented as comments, timing markers, or placeholder text cues.

Do not block implementation on final TTS.

Use the narration blocks in `04-timeline.md` to pace the scene.

## Acceptance criteria

The implementation is successful if a viewer can understand this sequence visually:

1. A neuron appears.
2. Inputs connect to it.
3. Weights appear on the inputs.
4. Signals move through weighted connections.
5. The neuron combines signals and emits an output.
6. A weight changes.
7. The output/decision changes.
8. A concrete two-input example appears: hours studied + hours slept → pass / not pass.
9. The concrete example becomes a graph.
10. The perceptron draws a line between two classes.
11. The line is generalized as a decision boundary.
12. The boundary moves as weights change.
13. A non-linear pattern appears that one line cannot separate.

## Important

This is a pipeline test.

Do not over-engineer the full video yet.
Do not implement Acts II–VII yet.
Do not add explanations of backpropagation yet.

Act I should create the question that the next act answers.
