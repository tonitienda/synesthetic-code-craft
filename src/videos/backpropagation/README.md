# Backpropagation

Motion Canvas implementation for `content/videos/backpropagation/`.

## Current implementation

- Act I only: `src/scenes/backpropagationAct1.tsx`
- Project entry point: `src/projects/backpropagation.ts`
- Source of truth for timing and narration intent: `content/videos/backpropagation/04-timeline.md`

Do not use `src/videos/backpropagation-basics/` or `src/projects/backpropagation-basics.ts` as the design source for this video. That older implementation is intentionally separate.

## Run

```bash
npm run start:backpropagation
npm run build:backpropagation
npm run screenshots:backpropagation
```

## Implementation notes

Act I targets the 90–120 second range from the timeline and covers only the perceptron setup:

1. Title and smaller-story setup.
2. Rosenblatt/perceptron historical anchor.
3. Concrete `hours studied` + `hours slept` inputs.
4. Weights, weighted sum, activation, and pass/not-pass output.
5. Weight changes as the seed of learning.
6. The same concrete example as 2D geometry.
7. A decision boundary line that moves with weights.
8. A final non-linear pattern that one line cannot separate.

Future acts should add new scenes instead of extending Act I with backpropagation details.
