# 06 — Codex Implementation Instructions

This file tells Codex how to implement Act I in Motion Canvas.

## Source files

Use these files as source of truth:

```text
content/language/animation-spec-v0.md
content/videos/backpropagation-from-scratch/04-animation-spec.md
content/videos/backpropagation-from-scratch/05-narration.md
```

Do not use the previous direct backpropagation implementation as design source.
It can be inspected for project conventions, but the visual structure should come from the Markdown specification.

## Goal

Implement Act I only.

The result should be a polished but minimal Motion Canvas scene sequence introducing the perceptron.

## Implementation priorities

1. Faithfully follow the animation specification.
2. Prefer reusable components over one-off shapes.
3. Keep the visual style calm and minimal.
4. Make the animation readable even without narration audio.
5. Keep timings easy to adjust.

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

## Narration handling

For now, narration can be represented as comments, timing markers, or placeholder text cues.

Do not block the implementation on TTS.

Later we can add generated audio and exact timestamps.

## Acceptance criteria

The implementation is successful if a viewer can understand this sequence visually:

1. A neuron appears.
2. Inputs connect to it.
3. Weights appear on the inputs.
4. Signals move through weighted connections.
5. The neuron combines signals and emits an output.
6. A weight changes.
7. The output/decision changes.
8. The neuron becomes a decision boundary.
9. The boundary moves as weights change.
10. A non-linear pattern appears that one line cannot separate.

## Important

This is a pipeline test.

Do not over-engineer the full video yet.
Do not implement Acts II–VII yet.
Do not add explanations of backpropagation yet.

Act I should create the question that the next act answers.
