import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

const colors = {
  bg: '#070914',
  panel: '#101827',
  panelSoft: '#0d1324',
  cyan: '#67e8f9',
  cyanDim: '#155e75',
  violet: '#c4b5fd',
  amber: '#fcd34d',
  green: '#86efac',
  red: '#fb7185',
  text: '#f8fafc',
  muted: '#94a3b8',
  line: '#334155',
};

export default makeScene2D(function* (view) {
  view.fill(colors.bg);

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const intro = createRef<Txt>();
  const neuron = createRef<Circle>();
  const neuronLabel = createRef<Txt>();
  const portrait = createRef<Rect>();
  const rosenblatt = createRef<Txt>();
  const year = createRef<Txt>();
  const perceptron = createRef<Txt>();
  const exampleTitle = createRef<Txt>();
  const input1 = createRef<Line>();
  const input2 = createRef<Line>();
  const input1Label = createRef<Txt>();
  const input2Label = createRef<Txt>();
  const signal1 = createRef<Circle>();
  const signal2 = createRef<Circle>();
  const w1 = createRef<Txt>();
  const w2 = createRef<Txt>();
  const sigma = createRef<Txt>();
  const equation = createRef<Txt>();
  const output = createRef<Line>();
  const outputLabel = createRef<Txt>();
  const outputSignal = createRef<Circle>();
  const geometryText = createRef<Txt>();
  const graph = createRef<Layout>();
  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const xAxisLabel = createRef<Txt>();
  const yAxisLabel = createRef<Txt>();
  const passLabel = createRef<Txt>();
  const notPassLabel = createRef<Txt>();
  const boundary = createRef<Line>();
  const boundaryLabel = createRef<Txt>();
  const question = createRef<Txt>();

  const passPoints = [createRef<Circle>(), createRef<Circle>()];
  const notPassPoints = [createRef<Circle>(), createRef<Circle>()];
  const xorPoints = [createRef<Circle>(), createRef<Circle>(), createRef<Circle>(), createRef<Circle>()];

  view.add(
    <>
      <Rect width={'100%'} height={'100%'} fill={colors.bg} />
      <Txt ref={title} text={'Backpropagation'} y={-70} fontSize={92} fontWeight={700} fill={colors.text} opacity={0} />
      <Txt ref={subtitle} text={'How neural networks learn from mistakes'} y={38} fontSize={38} fill={colors.muted} opacity={0} />

      <Txt ref={intro} text={'But the story does not start with a deep network.'} y={-245} fontSize={42} fill={colors.text} opacity={0} />
      <Circle ref={neuron} size={170} fill={colors.panel} stroke={colors.cyan} lineWidth={5} shadowColor={colors.cyanDim} shadowBlur={28} opacity={0}>
        <Txt ref={sigma} text={'Σ'} fontSize={70} fontWeight={700} fill={colors.text} opacity={0} />
      </Circle>
      <Txt ref={neuronLabel} text={'artificial neuron'} y={128} fontSize={30} fill={colors.muted} opacity={0} />

      <Rect ref={portrait} x={-330} y={0} width={190} height={230} radius={28} fill={colors.panelSoft} stroke={colors.line} lineWidth={3} opacity={0}>
        <Circle y={-42} size={72} fill={'#1e293b'} stroke={colors.violet} lineWidth={3} />
        <Rect y={64} width={104} height={70} radius={18} fill={'#1e293b'} stroke={colors.violet} lineWidth={3} />
      </Rect>
      <Txt ref={rosenblatt} text={'Frank Rosenblatt'} x={-330} y={160} fontSize={30} fill={colors.text} opacity={0} />
      <Txt ref={year} text={'1958'} x={-330} y={202} fontSize={28} fill={colors.muted} opacity={0} />
      <Txt ref={perceptron} text={'Perceptron'} x={130} y={-150} fontSize={48} fontWeight={700} fill={colors.cyan} opacity={0} />

      <Txt ref={exampleTitle} text={'Example: predicting an exam result'} y={-300} fontSize={36} fill={colors.text} opacity={0} />
      <Line ref={input1} points={[[-430, -84], [-92, -28]]} stroke={colors.cyan} lineWidth={5} end={0} opacity={0} />
      <Line ref={input2} points={[[-430, 86], [-92, 28]]} stroke={colors.violet} lineWidth={5} end={0} opacity={0} />
      <Txt ref={input1Label} text={'x₁ = hours studied'} x={-500} y={-126} fontSize={28} fill={colors.text} opacity={0} />
      <Txt ref={input2Label} text={'x₂ = hours slept'} x={-500} y={126} fontSize={28} fill={colors.text} opacity={0} />
      <Circle ref={signal1} x={-430} y={-84} size={22} fill={colors.cyan} opacity={0} />
      <Circle ref={signal2} x={-430} y={86} size={22} fill={colors.violet} opacity={0} />
      <Txt ref={w1} text={'w₁'} x={-275} y={-92} fontSize={32} fontWeight={700} fill={colors.cyan} opacity={0} />
      <Txt ref={w2} text={'w₂'} x={-275} y={92} fontSize={32} fontWeight={700} fill={colors.violet} opacity={0} />
      <Txt ref={equation} text={'x₁w₁ + x₂w₂'} y={260} fontSize={44} fill={colors.text} opacity={0} />
      <Line ref={output} points={[[92, 0], [430, 0]]} stroke={colors.green} lineWidth={5} end={0} opacity={0} />
      <Txt ref={outputLabel} text={'pass / not pass'} x={510} y={-34} fontSize={30} fill={colors.green} opacity={0} />
      <Circle ref={outputSignal} x={92} y={0} size={22} fill={colors.green} opacity={0} />

      <Txt ref={geometryText} text={'The same example can be drawn as geometry.'} y={-260} fontSize={40} fill={colors.text} opacity={0} />
      <Layout ref={graph} opacity={0}>
        <Line ref={xAxis} points={[[-430, 220], [430, 220]]} stroke={colors.line} lineWidth={4} end={0} />
        <Line ref={yAxis} points={[[-430, 220], [-430, -220]]} stroke={colors.line} lineWidth={4} end={0} />
        <Txt ref={xAxisLabel} text={'hours studied'} x={80} y={270} fontSize={28} fill={colors.muted} opacity={0} />
        <Txt ref={yAxisLabel} text={'hours slept'} x={-520} y={0} rotation={-90} fontSize={28} fill={colors.muted} opacity={0} />
        <Circle ref={passPoints[0]} x={130} y={-80} size={28} fill={colors.green} opacity={0} />
        <Circle ref={passPoints[1]} x={250} y={-145} size={28} fill={colors.green} opacity={0} />
        <Circle ref={notPassPoints[0]} x={-190} y={110} size={28} fill={colors.red} opacity={0} />
        <Circle ref={notPassPoints[1]} x={-40} y={90} size={28} fill={colors.red} opacity={0} />
        <Txt ref={passLabel} text={'pass'} x={310} y={-125} fontSize={28} fill={colors.green} opacity={0} />
        <Txt ref={notPassLabel} text={'not pass'} x={-250} y={70} fontSize={28} fill={colors.red} opacity={0} />
        <Line ref={boundary} points={[[-160, -210], [160, 210]]} stroke={colors.cyan} lineWidth={6} end={0} opacity={0} />
        <Txt ref={boundaryLabel} text={'decision boundary'} x={190} y={20} fontSize={30} fill={colors.cyan} opacity={0} />
        <Circle ref={xorPoints[0]} x={-210} y={100} size={30} fill={colors.green} opacity={0} />
        <Circle ref={xorPoints[1]} x={210} y={-100} size={30} fill={colors.green} opacity={0} />
        <Circle ref={xorPoints[2]} x={-210} y={-100} size={30} fill={colors.red} opacity={0} />
        <Circle ref={xorPoints[3]} x={210} y={100} size={30} fill={colors.red} opacity={0} />
      </Layout>
      <Txt ref={question} text={'What if one line is not enough?'} y={305} fontSize={44} fontWeight={700} fill={colors.text} opacity={0} />
    </>,
  );

  // Scene 1.1 — Title (8s)
  yield* all(title().opacity(1, 1), title().y(-92, 1));
  yield* waitFor(1);
  yield* subtitle().opacity(1, 1);
  yield* waitFor(2.5);
  yield* all(title().opacity(0, 1.2), subtitle().opacity(0, 1.2));
  yield* waitFor(1.3);

  // Scene 1.2 — The story starts smaller (11s)
  yield* intro().opacity(1, 1);
  yield* waitFor(2.2);
  yield* all(intro().y(-300, 1.2), neuron().opacity(1, 1.2));
  yield* waitFor(2.1);
  yield* neuronLabel().opacity(1, 0.8);
  yield* waitFor(1.7);
  yield* all(intro().opacity(0, 1), neuronLabel().opacity(0, 1));
  yield* waitFor(1);

  // Scene 1.3 — Historical anchor (13s)
  yield* all(neuron().x(130, 1.5), portrait().opacity(1, 1.5));
  yield* waitFor(3);
  yield* all(rosenblatt().opacity(1, 0.8), year().opacity(1, 0.8));
  yield* waitFor(1.2);
  yield* perceptron().opacity(1, 1);
  yield* waitFor(2.5);
  yield* all(portrait().opacity(0, 1), rosenblatt().opacity(0, 1), year().opacity(0, 1), perceptron().opacity(0, 1), neuron().x(0, 1));
  yield* waitFor(1);

  // Scene 1.4 — Concrete inputs (17s)
  yield* exampleTitle().opacity(1, 1);
  yield* waitFor(3);
  yield* all(input1().opacity(1, 0.1), input1().end(1, 1.2), input1Label().opacity(1, 1));
  yield* waitFor(2.3);
  yield* all(input2().opacity(1, 0.1), input2().end(1, 1.2), input2Label().opacity(1, 1));
  yield* waitFor(2.3);
  yield* all(signal1().opacity(1, 0.2), signal2().opacity(1, 0.2), signal1().position([-92, -28], 2), signal2().position([-92, 28], 2));
  yield* waitFor(2);
  yield* all(signal1().opacity(0, 0.4), signal2().opacity(0, 0.4));
  yield* waitFor(2);

  // Scene 1.5 — Weights appear (14s)
  yield* all(input1Label().fill(colors.muted, 0.8), input2Label().fill(colors.muted, 0.8));
  yield* waitFor(2.2);
  yield* all(w1().opacity(1, 0.8), w2().opacity(1, 0.8));
  yield* waitFor(2.2);
  yield* all(input1().lineWidth(9, 1), w1().scale(1.22, 1));
  yield* waitFor(3);
  yield* all(input2().lineWidth(8, 1), w2().scale(1.16, 1));
  yield* waitFor(2.8);

  // Scene 1.6 — Weighted sum (14s)
  yield* sigma().opacity(1, 1);
  yield* waitFor(2.5);
  yield* equation().opacity(1, 1);
  yield* waitFor(2);
  signal1().position([-430, -84]);
  signal2().position([-430, 86]);
  yield* all(signal1().opacity(1, 0.2), signal2().opacity(1, 0.2), signal1().position([-92, -28], 2), signal2().position([-92, 28], 2));
  yield* all(sigma().scale(1.25, 0.35), signal1().opacity(0, 0.35), signal2().opacity(0, 0.35));
  yield* sigma().scale(1, 0.35);
  yield* waitFor(3.5);

  // Scene 1.7 — Activation and output (12s)
  yield* all(output().opacity(1, 0.1), output().end(1, 1.2), outputLabel().opacity(1, 1));
  yield* waitFor(3.3);
  yield* all(outputSignal().opacity(1, 0.2), outputSignal().position([430, 0], 1.6));
  yield* waitFor(0.9);
  yield* all(outputLabel().scale(1.18, 0.6), outputSignal().opacity(0, 0.6));
  yield* outputLabel().scale(1, 0.6);
  yield* waitFor(2.8);

  // Scene 1.8 — Learning as weight change (13s)
  yield* all(w1().scale(1.45, 1), input1().stroke(colors.amber, 1));
  yield* waitFor(1.5);
  yield* input1().lineWidth(15, 1.3);
  yield* waitFor(2.7);
  signal1().position([-430, -84]);
  outputSignal().position([92, 0]);
  yield* all(signal1().opacity(1, 0.2), signal1().position([-92, -28], 1.5));
  yield* all(signal1().opacity(0, 0.2), outputSignal().opacity(1, 0.2), outputSignal().position([430, 0], 1.2), outputLabel().fill(colors.amber, 1));
  yield* outputSignal().opacity(0, 0.3);
  yield* waitFor(3.6);

  // Scene 1.9 — Concrete example becomes geometry (18s)
  yield* all(exampleTitle().opacity(0, 1), input1().opacity(0, 1), input2().opacity(0, 1), input1Label().opacity(0, 1), input2Label().opacity(0, 1), w1().opacity(0, 1), w2().opacity(0, 1), sigma().opacity(0, 1), equation().opacity(0, 1), output().opacity(0, 1), outputLabel().opacity(0, 1), neuron().opacity(0, 1));
  yield* geometryText().opacity(1, 1);
  yield* waitFor(2);
  yield* graph().opacity(1, 0.1);
  yield* all(xAxis().end(1, 1), yAxis().end(1, 1), xAxisLabel().opacity(1, 1));
  yield* waitFor(2);
  yield* yAxisLabel().opacity(1, 0.8);
  yield* waitFor(1.7);
  yield* all(passPoints[0]().opacity(1, 0.5), passPoints[1]().opacity(1, 0.5), notPassPoints[0]().opacity(1, 0.5), notPassPoints[1]().opacity(1, 0.5));
  yield* waitFor(2.5);
  yield* all(passLabel().opacity(1, 0.8), notPassLabel().opacity(1, 0.8));
  yield* waitFor(3);

  // Scene 1.10 — Decision boundary line (17s)
  yield* all(geometryText().opacity(0, 1), boundary().opacity(1, 0.1), boundary().end(1, 1.4));
  yield* waitFor(3.6);
  yield* boundaryLabel().opacity(1, 0.8);
  yield* waitFor(2.2);
  yield* boundary().rotation(8, 1.4);
  yield* waitFor(2.6);
  yield* all(boundary().x(24, 1.2), boundaryLabel().x(220, 1.2));
  yield* waitFor(2.3);

  // Scene 1.11 — The limitation (16s)
  yield* all(passPoints[0]().opacity(0, 0.8), passPoints[1]().opacity(0, 0.8), notPassPoints[0]().opacity(0, 0.8), notPassPoints[1]().opacity(0, 0.8), passLabel().opacity(0, 0.8), notPassLabel().opacity(0, 0.8), boundaryLabel().opacity(0, 0.8));
  yield* all(xorPoints[0]().opacity(1, 0.8), xorPoints[1]().opacity(1, 0.8), xorPoints[2]().opacity(1, 0.8), xorPoints[3]().opacity(1, 0.8));
  yield* waitFor(1.4);
  yield* boundary().rotation(-14, 1.2);
  yield* waitFor(1.8);
  yield* boundary().rotation(20, 1);
  yield* boundary().x(-30, 0.8);
  yield* boundary().x(30, 0.8);
  yield* boundary().x(0, 0.8);
  yield* waitFor(1.6);
  yield* question().opacity(1, 1);
  yield* waitFor(2);
  yield* all(question().opacity(0, 1), graph().opacity(0, 1), boundary().opacity(0, 1));
});
