import {Gradient} from '@motion-canvas/2d';

/**
 * Shared palette for the Backpropagation video (Act I).
 * Colours follow the repository visual style guide:
 *   blue  -> input / data
 *   amber -> adjustable parameters (weights)
 *   green -> output / success (pass)
 *   rose  -> the other class (not pass)
 *   red   -> failure / impossible case
 */
export const theme = {
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#4b5675',

  neuron: '#a78bfa',
  neuronFill: '#141a2e',

  input: '#38bdf8',
  weight: '#fbbf24',
  output: '#4ade80',

  pass: '#4ade80',
  notPass: '#fb7185',
  fail: '#f87171',
} as const;

/** Radial background gradient: a calm, dark centre-lit field. */
export function backgroundGradient(): Gradient {
  return new Gradient({
    type: 'radial',
    from: [0, 0],
    to: [0, 0],
    fromRadius: 0,
    toRadius: 1200,
    stops: [
      {offset: 0, color: '#131a30'},
      {offset: 0.6, color: '#0a0e1e'},
      {offset: 1, color: '#05060f'},
    ],
  });
}

/**
 * Shared diagram layout so the perceptron stays in the same place across
 * scenes 1.2–1.8, keeping scene cuts visually continuous.
 */
export const layout = {
  neuronR: 78,
  neuronX: 0,
  inputX: -540,
  outputX: 540,
  in1Y: -128,
  in2Y: 128,
} as const;

/** Shared 2D graph geometry for the geometry scenes (1.9–1.11). */
export const graph = {
  origin: [-350, 240] as [number, number],
  xEnd: [360, 240] as [number, number],
  yEnd: [-350, -270] as [number, number],
  // Linearly separable example: pass upper-right, not-pass lower-left.
  pass: [
    [120, -70],
    [235, -160],
  ] as [number, number][],
  notPass: [
    [-150, 120],
    [-30, 45],
  ] as [number, number][],
  // A line that cleanly separates the pass / not-pass clusters.
  boundaryA: [-150, -285] as [number, number],
  boundaryB: [245, 260] as [number, number],
  // XOR-like pattern that no single line can separate.
  xorPass: [
    [-150, -140],
    [200, 120],
  ] as [number, number][],
  xorFail: [
    [-150, 120],
    [200, -140],
  ] as [number, number][],
};

/** Shared wire endpoints so the perceptron diagram is identical across scenes. */
export const wires = {
  in1Start: [layout.inputX, layout.in1Y] as [number, number],
  in2Start: [layout.inputX, layout.in2Y] as [number, number],
  in1End: [-68, -40] as [number, number],
  in2End: [-68, 40] as [number, number],
  outStart: [68, 0] as [number, number],
  outEnd: [layout.outputX, 0] as [number, number],
};
