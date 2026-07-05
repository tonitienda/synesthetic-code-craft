import {Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme, wires} from '../theme';
import {Neuron, Connection, Signal} from '../components';

// Scene 1.4 — Concrete inputs (budget 17s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const title = createRef<Txt>();
  const neuron = createRef<Circle>();
  const line1 = createRef<Line>();
  const line2 = createRef<Line>();
  const label1 = createRef<Txt>();
  const label2 = createRef<Txt>();
  const sig1 = createRef<Circle>();
  const sig2 = createRef<Circle>();

  view.add(
    <>
      <Txt ref={title} y={-380} text={'Example: predicting an exam result'} fontSize={44} fill={theme.text} opacity={0} />
      <Neuron ref={neuron} />
      <Connection ref={line1} points={[wires.in1Start, wires.in1End]} color={theme.input} />
      <Connection ref={line2} points={[wires.in2Start, wires.in2End]} color={theme.input} />
      <Txt ref={label1} position={[-330, -178]} text={'x₁ = hours studied'} fontSize={36} fill={theme.input} opacity={0} />
      <Txt ref={label2} position={[-330, 178]} text={'x₂ = hours slept'} fontSize={36} fill={theme.input} opacity={0} />
      <Signal ref={sig1} color={theme.input} />
      <Signal ref={sig2} color={theme.input} />
    </>,
  );

  function* flow(sig: Circle, from: [number, number], to: [number, number]) {
    sig.position(from);
    sig.opacity(1);
    yield* sig.position(to, 1.4);
    yield* sig.opacity(0, 0.3);
  }

  // 0.0s — set up the concrete example.
  yield* title().opacity(1, 1.2);
  yield* waitFor(2.8);

  // 4.0s — first input grows in and is named.
  yield* all(line1().end(1, 1.4), label1().opacity(1, 1.0));
  yield* waitFor(2.1);

  // 7.5s — second input grows in and is named.
  yield* all(line2().end(1, 1.4), label2().opacity(1, 1.0));
  yield* waitFor(2.1);

  // 11.0s — a signal travels down each input toward the neuron.
  yield* sequence(
    0.4,
    flow(sig1(), wires.in1Start, wires.in1End),
    flow(sig2(), wires.in2Start, wires.in2End),
  );

  yield* waitFor(1.9);

  // 15.0s — hold the complete input diagram.
  yield* waitFor(2.0);
});
