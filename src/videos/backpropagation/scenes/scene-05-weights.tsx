import {Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme, wires} from '../theme';
import {Neuron, Connection} from '../components';

// Scene 1.5 — Weights appear (budget 14s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const neuron = createRef<Circle>();
  const line1 = createRef<Line>();
  const line2 = createRef<Line>();
  const label1 = createRef<Txt>();
  const label2 = createRef<Txt>();
  const w1 = createRef<Txt>();
  const w2 = createRef<Txt>();

  view.add(
    <>
      <Neuron ref={neuron} />
      <Connection ref={line1} points={[wires.in1Start, wires.in1End]} color={theme.input} end={1} />
      <Connection ref={line2} points={[wires.in2Start, wires.in2End]} color={theme.input} end={1} />
      <Txt ref={label1} position={[-330, -178]} text={'x₁ = hours studied'} fontSize={36} fill={theme.input} />
      <Txt ref={label2} position={[-330, 178]} text={'x₂ = hours slept'} fontSize={36} fill={theme.input} />
      <Txt ref={w1} position={[-300, -118]} text={'w₁'} fontSize={40} fontWeight={600} fill={theme.weight} opacity={0} />
      <Txt ref={w2} position={[-300, 118]} text={'w₂'} fontSize={40} fontWeight={600} fill={theme.weight} opacity={0} />
    </>,
  );

  // 0.0s — soften the input labels so weights can take focus.
  yield* all(label1().opacity(0.45, 1.0), label2().opacity(0.45, 1.0));
  yield* waitFor(2.0);

  // 3.0s — a weight sits on each connection.
  yield* all(w1().opacity(1, 1.2), w2().opacity(1, 1.2));
  yield* waitFor(1.8);

  // 6.0s — the first weight is emphasised; its connection thickens.
  yield* all(line1().lineWidth(11, 1.2), w1().scale(1.35, 1.2));
  yield* waitFor(1.5);

  // 10.0s — the second weight is emphasised too, then hold.
  yield* all(line2().lineWidth(11, 1.2), w2().scale(1.35, 1.2));
  yield* waitFor(1.0);
});
