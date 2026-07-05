import {Txt, Circle, Line, Layout, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme, wires} from '../theme';
import {Neuron, Connection, Signal} from '../components';

// Scene 1.6 — Weighted sum (budget 14s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const neuron = createRef<Circle>();
  const sigma = createRef<Txt>();
  const line1 = createRef<Line>();
  const line2 = createRef<Line>();
  const term1 = createRef<Txt>();
  const term2 = createRef<Txt>();
  const equation = createRef<Layout>();
  const sig1 = createRef<Circle>();
  const sig2 = createRef<Circle>();

  view.add(
    <>
      <Neuron ref={neuron}>
        <Txt ref={sigma} text={'Σ'} fontSize={72} fontWeight={600} fill={theme.text} opacity={0} scale={0.6} />
      </Neuron>
      <Connection ref={line1} points={[wires.in1Start, wires.in1End]} color={theme.input} lineWidth={11} end={1} />
      <Connection ref={line2} points={[wires.in2Start, wires.in2End]} color={theme.input} lineWidth={11} end={1} />
      <Txt position={[-300, -118]} text={'w₁'} fontSize={40} fontWeight={600} fill={theme.weight} scale={1.35} />
      <Txt position={[-300, 118]} text={'w₂'} fontSize={40} fontWeight={600} fill={theme.weight} scale={1.35} />
      <Layout ref={equation} layout y={360} gap={18} alignItems={'center'} opacity={0}>
        <Txt ref={term1} text={'x₁w₁'} fontSize={46} fill={theme.muted} />
        <Txt text={'+'} fontSize={46} fill={theme.muted} />
        <Txt ref={term2} text={'x₂w₂'} fontSize={46} fill={theme.muted} />
      </Layout>
      <Signal ref={sig1} color={theme.weight} />
      <Signal ref={sig2} color={theme.weight} />
    </>,
  );

  function* flow(sig: Circle, from: [number, number], to: [number, number]) {
    sig.position(from);
    sig.opacity(1);
    yield* sig.position(to, 1.4);
    yield* sig.opacity(0, 0.25);
  }

  // 0.0s — the summation symbol appears inside the neuron.
  yield* all(sigma().opacity(1, 1.2), sigma().scale(1, 1.2));
  yield* waitFor(2.3);

  // 3.5s — write the weighted-sum expression and highlight each term.
  yield* equation().opacity(1, 1.0);
  yield* term1().fill(theme.weight, 0.6);
  yield* term2().fill(theme.weight, 0.6);
  yield* waitFor(0.8);

  // 6.5s — weighted signals flow in; the sigma pulses as they arrive.
  yield* sequence(
    0.3,
    flow(sig1(), wires.in1Start, wires.in1End),
    flow(sig2(), wires.in2Start, wires.in2End),
  );
  yield* sigma().scale(1.3, 0.35);
  yield* sigma().scale(1, 0.35);

  // 11.0s — hold the equation and neuron.
  yield* waitFor(1.0);
});
