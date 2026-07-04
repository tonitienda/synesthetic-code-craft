import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';

const colors = {
  bg: '#070914',
  panel: '#0f172a',
  panelSoft: '#111827',
  line: '#38bdf8',
  lineDim: '#334155',
  violet: '#a78bfa',
  amber: '#fbbf24',
  red: '#fb7185',
  blue: '#60a5fa',
  green: '#34d399',
  text: '#f8fafc',
  muted: '#94a3b8',
};

function* narration(text: string, seconds = 0.55) {
  // Placeholder timing cue for future TTS alignment.
  yield* waitFor(seconds);
}

export default makeScene2D(function* (view) {
  view.fill(colors.bg);

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const neuron = createRef<Circle>();
  const neuronLabel = createRef<Txt>();
  const rewind = createRef<Txt>();
  const portrait = createRef<Rect>();
  const rosenblatt = createRef<Txt>();
  const date = createRef<Txt>();
  const perceptron = createRef<Txt>();
  const sigma = createRef<Txt>();
  const equation = createRef<Txt>();
  const output = createRef<Line>();
  const outputLabel = createRef<Txt>();
  const graph = createRef<Layout>();
  const boundary = createRef<Line>();
  const question = createRef<Txt>();
  const neuronGroup = createRef<Layout>();
  const graphGroup = createRef<Layout>();

  const inputs = [createRef<Line>(), createRef<Line>(), createRef<Line>()];
  const inputLabels = [createRef<Txt>(), createRef<Txt>(), createRef<Txt>()];
  const weights = [createRef<Txt>(), createRef<Txt>(), createRef<Txt>()];
  const signals = [createRef<Circle>(), createRef<Circle>(), createRef<Circle>()];

  view.add(
    <>
      <Rect width={'100%'} height={'100%'} fill={'#070914'}>
        <Circle x={-520} y={-330} size={520} fill={'#0b2447'} opacity={0.18} />
        <Circle x={520} y={330} size={620} fill={'#1e1b4b'} opacity={0.16} />
      </Rect>

      <Layout ref={neuronGroup} opacity={0}>
        <Line ref={inputs[0]} points={[[-440, -130], [-66, 0]]} stroke={colors.lineDim} lineWidth={4} end={0} />
        <Line ref={inputs[1]} points={[[-440, 0], [-66, 0]]} stroke={colors.lineDim} lineWidth={4} end={0} />
        <Line ref={inputs[2]} points={[[-440, 130], [-66, 0]]} stroke={colors.lineDim} lineWidth={4} end={0} />
        {[-130, 0, 130].map((y, index) => (
          <Txt ref={inputLabels[index]} x={-505} y={y - 8} text={`x${index + 1}`} fontSize={34} fill={colors.text} opacity={0} />
        ))}
        {[-88, -24, 86].map((y, index) => (
          <Txt ref={weights[index]} x={-285} y={y} text={`w${index + 1}`} fontSize={34} fill={colors.amber} opacity={0} />
        ))}
        {[-130, 0, 130].map((y, index) => (
          <Circle ref={signals[index]} x={-440} y={y} size={18} fill={colors.green} shadowColor={colors.green} shadowBlur={16} opacity={0} />
        ))}
        <Circle ref={neuron} size={132} fill={colors.panelSoft} stroke={colors.line} lineWidth={5} shadowColor={colors.line} shadowBlur={24} scale={0.65}>
          <Txt ref={sigma} text={'Σ'} fontSize={58} fill={colors.text} opacity={0} />
        </Circle>
        <Txt ref={neuronLabel} y={104} text={'artificial neuron'} fontSize={28} fill={colors.muted} opacity={0} />
        <Line ref={output} points={[[66, 0], [430, 0]]} stroke={colors.lineDim} lineWidth={4} end={0} />
        <Txt ref={outputLabel} x={270} y={-34} text={'output'} fontSize={30} fill={colors.text} opacity={0} />
      </Layout>

      <Layout ref={graphGroup} opacity={0}>
        <Rect ref={graph} width={820} height={510} radius={28} fill={'#0b1020'} stroke={'#1f2937'} lineWidth={3}>
          <Line points={[[-330, 180], [-330, -180]]} stroke={colors.muted} lineWidth={3} endArrow />
          <Line points={[[-330, 180], [330, 180]]} stroke={colors.muted} lineWidth={3} endArrow />
          <Txt x={354} y={180} text={'x1'} fontSize={26} fill={colors.muted} />
          <Txt x={-330} y={-206} text={'x2'} fontSize={26} fill={colors.muted} />
          <Circle x={-190} y={-90} size={28} fill={colors.red} />
          <Circle x={-70} y={-126} size={28} fill={colors.red} />
          <Circle x={120} y={86} size={28} fill={colors.blue} />
          <Circle x={0} y={116} size={28} fill={colors.blue} />
          <Circle x={-190} y={-90} size={0} fill={colors.red} />
          <Line ref={boundary} points={[[-245, 150], [235, -150]]} stroke={colors.green} lineWidth={6} shadowColor={colors.green} shadowBlur={18} end={0} />
        </Rect>
      </Layout>

      <Txt ref={title} text={'Backpropagation'} fontSize={82} fontWeight={700} fill={colors.text} opacity={0} />
      <Txt ref={subtitle} y={86} text={'How neural networks learn from mistakes'} fontSize={36} fill={colors.muted} opacity={0} />
      <Txt ref={rewind} text={'But the story does not start with a deep network.'} fontSize={42} fill={colors.text} opacity={0} />
      <Rect ref={portrait} x={-330} width={170} height={220} radius={22} stroke={colors.muted} lineWidth={4} opacity={0}>
        <Circle y={-42} size={56} stroke={colors.muted} lineWidth={4} />
        <Line points={[[-48, 52], [48, 52]]} stroke={colors.muted} lineWidth={4} />
      </Rect>
      <Txt ref={rosenblatt} x={-330} y={150} text={'Frank Rosenblatt'} fontSize={32} fill={colors.text} opacity={0} />
      <Txt ref={date} x={-330} y={190} text={'1958'} fontSize={26} fill={colors.muted} opacity={0} />
      <Txt ref={perceptron} y={-132} text={'Perceptron'} fontSize={54} fontWeight={700} fill={colors.text} opacity={0} />
      <Txt ref={equation} y={285} text={'x1w1 + x2w2 + x3w3'} fontSize={40} fill={colors.text} opacity={0} />
      <Txt ref={question} y={292} text={'What if one line is not enough?'} fontSize={42} fontWeight={700} fill={colors.text} opacity={0} />
    </>,
  );

  yield* all(title().opacity(1, 0.8), title().y(-16, 0.8));
  yield* narration('Backpropagation.');
  yield* subtitle().opacity(1, 0.6);
  yield* narration('How neural networks learn from mistakes.', 1);
  yield* all(title().opacity(0, 0.7), subtitle().opacity(0, 0.7));

  yield* rewind().opacity(1, 0.7);
  yield* narration('But the story does not start with a deep network.', 0.8);
  yield* rewind().y(-260, 0.8);
  neuronGroup().opacity(1);
  yield* all(neuron().scale(1, 0.7), neuronLabel().opacity(1, 0.5));
  yield* narration('It starts with a single artificial neuron.', 0.8);
  yield* all(rewind().opacity(0, 0.5), neuronLabel().opacity(0, 0.5));

  yield* neuronGroup().x(245, 0.8);
  yield* all(portrait().opacity(1, 0.6), rosenblatt().opacity(1, 0.6), date().opacity(1, 0.6));
  yield* narration('In the late nineteen fifties, Frank Rosenblatt introduced the perceptron.', 0.8);
  yield* perceptron().opacity(1, 0.5);
  yield* narration('It was one of the first learning machines.', 0.8);
  yield* all(portrait().opacity(0, 0.5), rosenblatt().opacity(0, 0.5), date().opacity(0, 0.5), perceptron().opacity(0, 0.5), neuronGroup().x(0, 0.8));

  yield* sequence(0.15, ...inputs.map(line => line().end(1, 0.7)));
  yield* sequence(0.12, ...inputLabels.map(label => label().opacity(1, 0.35)));
  yield* narration('The perceptron receives input values. Each input is just a number.', 0.7);
  for (const [index, signal] of signals.entries()) signal().opacity(1).position.x(-440).position.y([-130, 0, 130][index]);
  yield* sequence(0.15, ...signals.map((signal, index) => signal().position([index === 0 ? -66 : -66, 0], 0.9)));
  yield* narration('The inputs carry information into the neuron.', 0.6);
  signals.forEach(signal => signal().opacity(0));

  yield* sequence(0.12, ...weights.map(weight => weight().opacity(1, 0.4)));
  yield* narration('Each connection has a weight.', 0.5);
  yield* all(inputs[0]().lineWidth(9, 0.45), weights[0]().scale(1.25, 0.45));
  yield* narration('The weight controls how strongly that input matters.', 0.4);
  yield* all(inputs[1]().lineWidth(6, 0.35), weights[1]().scale(1.15, 0.35));
  yield* all(inputs[2]().lineWidth(11, 0.35), weights[2]().scale(1.25, 0.35));

  yield* all(sigma().opacity(1, 0.5), equation().opacity(1, 0.6));
  yield* narration('The neuron multiplies each input by its weight.', 0.5);
  for (const [index, signal] of signals.entries()) signal().opacity(1).position.x(-440).position.y([-130, 0, 130][index]);
  yield* sequence(0.15, ...signals.map(signal => signal().position([-66, 0], 0.8)));
  yield* all(neuron().scale(1.1, 0.25), neuron().scale(1, 0.35));
  yield* narration('Then it adds the weighted values together.', 0.8);
  signals.forEach(signal => signal().opacity(0));

  yield* all(output().end(1, 0.7), outputLabel().opacity(1, 0.5));
  yield* narration('If the combined signal is strong enough, the neuron activates.', 0.5);
  const outputSignal = createRef<Circle>();
  view.add(<Circle ref={outputSignal} x={66} y={0} size={22} fill={colors.green} shadowColor={colors.green} shadowBlur={18} opacity={1} />);
  yield* outputSignal().x(430, 0.9);
  yield* narration('And it produces one output.', 0.8);
  outputSignal().remove();

  yield* all(inputs[0]().lineWidth(15, 0.8), weights[0]().scale(1.45, 0.8));
  yield* narration('Changing a weight changes how the neuron decides. This is the seed of learning.', 0.8);

  yield* all(neuronGroup().opacity(0, 0.8), equation().opacity(0, 0.8));
  graphGroup().opacity(1);
  yield* boundary().end(1, 0.9);
  yield* narration('With two inputs, the perceptron becomes geometry. It draws a line between two classes.', 0.8);
  yield* boundary().rotation(9, 1);
  yield* narration('Changing the weights moves the line.', 0.5);
  yield* boundary().position([38, -12], 1);
  yield* narration('Learning means moving the boundary until the mistakes get smaller.', 0.8);

  graph().removeChildren();
  graph().add(
    <>
      <Line points={[[-330, 180], [-330, -180]]} stroke={colors.muted} lineWidth={3} endArrow />
      <Line points={[[-330, 180], [330, 180]]} stroke={colors.muted} lineWidth={3} endArrow />
      <Circle x={-175} y={-105} size={30} fill={colors.red} />
      <Circle x={175} y={105} size={30} fill={colors.red} />
      <Circle x={175} y={-105} size={30} fill={colors.blue} />
      <Circle x={-175} y={105} size={30} fill={colors.blue} />
      <Line ref={boundary} points={[[-250, 150], [250, -150]]} stroke={colors.green} lineWidth={6} shadowColor={colors.green} shadowBlur={18} />
    </>,
  );
  yield* narration('But some patterns cannot be separated by one line.', 0.5);
  yield* sequence(0.25, boundary().rotation(-28, 0.45), boundary().rotation(22, 0.45), boundary().rotation(0, 0.45));
  yield* all(boundary().x(-14, 0.08), boundary().x(14, 0.08), boundary().x(0, 0.08));
  yield* narration('A single perceptron is powerful, but limited.', 0.8);
  yield* question().opacity(1, 0.7);
  yield* narration('So what happens if one line is not enough?', 1);
  yield* all(graphGroup().opacity(0, 1), question().opacity(0, 1));
});
