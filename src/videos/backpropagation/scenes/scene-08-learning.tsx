import {Txt, Circle, Line, Layout, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme, wires} from '../theme';
import {Neuron, Connection, Signal} from '../components';

// Scene 1.8 — Learning as weight change (budget 13s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const line1 = createRef<Line>();
  const line2 = createRef<Line>();
  const w1 = createRef<Txt>();
  const w2 = createRef<Txt>();
  const equation = createRef<Layout>();
  const outLabel = createRef<Txt>();
  const inSig = createRef<Circle>();
  const outSig = createRef<Circle>();

  view.add(
    <>
      <Neuron>
        <Txt text={'Σ'} fontSize={72} fontWeight={600} fill={theme.text} />
      </Neuron>
      <Connection ref={line1} points={[wires.in1Start, wires.in1End]} color={theme.input} lineWidth={11} end={1} />
      <Connection ref={line2} points={[wires.in2Start, wires.in2End]} color={theme.input} lineWidth={11} end={1} />
      <Txt ref={w1} position={[-300, -118]} text={'w₁'} fontSize={40} fontWeight={600} fill={theme.weight} scale={1.35} />
      <Txt ref={w2} position={[-300, 118]} text={'w₂'} fontSize={40} fontWeight={600} fill={theme.weight} scale={1.35} />
      <Layout ref={equation} layout y={360} gap={18} alignItems={'center'}>
        <Txt text={'x₁w₁'} fontSize={46} fill={theme.weight} />
        <Txt text={'+'} fontSize={46} fill={theme.muted} />
        <Txt text={'x₂w₂'} fontSize={46} fill={theme.weight} />
      </Layout>
      <Connection points={[wires.outStart, wires.outEnd]} color={theme.output} lineWidth={9} end={1} />
      <Txt ref={outLabel} position={[540, -58]} text={'pass / not pass'} fontSize={36} fill={theme.output} />
      <Signal ref={inSig} color={theme.weight} />
      <Signal ref={outSig} color={theme.output} />
    </>,
  );

  // 0.0s — put the first weight under a spotlight.
  yield* all(
    line2().opacity(0.35, 1.0),
    w2().opacity(0.35, 1.0),
    equation().opacity(0.35, 1.0),
  );
  yield* waitFor(1.5);

  // 2.5s — the weight grows: this connection now matters more.
  yield* all(line1().lineWidth(18, 1.4), w1().scale(1.7, 1.4));
  yield* waitFor(2.6);

  // 6.5s — replay the signal; a stronger weight drives the output.
  inSig().position(wires.in1Start);
  inSig().opacity(1);
  yield* inSig().position(wires.in1End, 1.4);
  yield* inSig().opacity(0, 0.2);
  outSig().position(wires.outStart);
  outSig().opacity(1);
  yield* outSig().position(wires.outEnd, 1.4);
  yield* outSig().opacity(0, 0.2);
  yield* outLabel().scale(1.25, 0.4);
  yield* outLabel().scale(1, 0.4);

  // 10.0s — hold the changed connection and output.
  yield* waitFor(2.5);
});
