# Backpropagation — Act I (Motion Canvas implementation)

Working title: **Backpropagation: How Neural Networks Learn From Mistakes**

This folder implements **Act I only** of the video.

- Content source of truth: `content/videos/backpropagation/04-timeline.md`
- Implementation guide: `content/videos/backpropagation/act1-implementation.md`
- Project entry: `src/projects/backpropagation.ts`

The earlier `src/videos/backpropagation-basics/` attempt is disposable and is
not a design source for this implementation.

## Run it

```bash
npm run start:backprop      # dev server / editor
npm run build:backprop      # type-check + production build
```

## Act I structure

Act I introduces the perceptron and ends by posing the question Act II answers:
**"What if one line is not enough?"** The scenes are paced to the timeline's
per-beat timestamps so each concept has room to be narrated and understood;
total runtime lands at ~150 seconds. The timeline's 90–120s figure is a guide
for the content — clear narration and comprehension take priority over fitting a
hard time boundary.

| # | Scene file | Beat | Budget |
|---|------------|------|--------|
| 1.1 | `scene-01-title` | Title + subtitle | 8s |
| 1.2 | `scene-02-single-neuron` | The story starts with one neuron | 11s |
| 1.3 | `scene-03-rosenblatt` | Rosenblatt, 1958, the perceptron | 13s |
| 1.4 | `scene-04-inputs` | Concrete inputs: hours studied / hours slept | 17s |
| 1.5 | `scene-05-weights` | Each connection has a weight | 14s |
| 1.6 | `scene-06-weighted-sum` | The neuron sums weighted inputs (Σ) | 14s |
| 1.7 | `scene-07-activation` | Activation and output: pass / not pass | 12s |
| 1.8 | `scene-08-learning` | Changing a weight changes the decision | 13s |
| 1.9 | `scene-09-geometry` | The same example as a 2D graph | 18s |
| 1.10 | `scene-10-decision-boundary` | The perceptron draws a decision boundary | 17s |
| 1.11 | `scene-11-limitation` | One line cannot separate an XOR pattern | 16s |

Scene budgets above are the timeline's timing intent, and the implementation
follows them: beats fire at the timeline's relative timestamps and the total
runs ~150s. This favours calm, unrushed narration over compressing the act.

## Shared building blocks

- `theme.ts` — palette, background gradient, and shared diagram/graph geometry
  so the perceptron and graph stay in place across scene cuts.
- `components.tsx` — `Neuron`, `Connection`, `Signal`, `PointClass`, `Axes`,
  `PortraitPlaceholder`.

## Visual conventions (from the repo style guide)

- blue → input / data
- amber → adjustable parameters (weights)
- green → output / success (pass)
- rose → the other class (not pass)
- red → failure / the impossible case
- line thickness → weight strength; moving dots → signals

## Narration

Narration is captured as timing comments inside each scene, taken verbatim from
`04-timeline.md`. Final TTS is not implemented yet; the animation is designed to
read on its own before audio is added.
