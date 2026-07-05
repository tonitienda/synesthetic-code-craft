import {Txt, Circle, Line, Layout, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme, wires} from '../theme';
import {Neuron, Connection, Signal} from '../components';

// Scene 1.7 — Activation and output (budget 12s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const neuron = createRef<Circle>();
  const outLine = createRef<Line>();
  const outLabel = createRef<Txt>();
  const outSig = createRef<Circle>();

  view.add(
    <>
      <Neuron ref={neuron}>
        <Txt text={'Σ'} fontSize={72} fontWeight={600} fill={theme.text} />
      </Neuron>
      <Connection points={[wires.in1Start, wires.in1End]} color={theme.input} lineWidth={11} end={1} />
      <Connection points={[wires.in2Start, wires.in2End]} color={theme.input} lineWidth={11} end={1} />
      <Txt position={[-300, -118]} text={'w₁'} fontSize={40} fontWeight={600} fill={theme.weight} scale={1.35} />
      <Txt position={[-300, 118]} text={'w₂'} fontSize={40} fontWeight={600} fill={theme.weight} scale={1.35} />
      <Layout layout y={360} gap={18} alignItems={'center'}>
        <Txt text={'x₁w₁'} fontSize={46} fill={theme.weight} />
        <Txt text={'+'} fontSize={46} fill={theme.muted} />
        <Txt text={'x₂w₂'} fontSize={46} fill={theme.weight} />
      </Layout>
      <Connection ref={outLine} points={[wires.outStart, wires.outEnd]} color={theme.output} lineWidth={9} end={0} />
      <Txt ref={outLabel} position={[540, -58]} text={'pass / not pass'} fontSize={36} fill={theme.output} opacity={0} />
      <Signal ref={outSig} color={theme.output} />
    </>,
  );

  // 0.0s — the output connection grows out to the right.
  yield* all(outLine().end(1, 1.4), outLabel().opacity(1, 1.0));
  yield* waitFor(3.1);

  // 4.5s — an output signal travels along the output line.
  outSig().position(wires.outStart);
  outSig().opacity(1);
  yield* outSig().position(wires.outEnd, 1.4);
  yield* outSig().opacity(0, 0.25);
  yield* waitFor(1.1);

  // 7.0s — emphasise the decision.
  yield* outLabel().scale(1.25, 0.6);
  yield* outLabel().scale(1, 0.6);
  yield* waitFor(1.1);

  // 10.0s — hold the full perceptron.
  yield* waitFor(1.2);
});
