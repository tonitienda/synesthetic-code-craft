import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

const colors = {
  bg: '#090b1a',
  card: '#111827',
  cyan: '#22d3ee',
  violet: '#a78bfa',
  amber: '#fbbf24',
  text: '#f8fafc',
  muted: '#94a3b8',
};

export default makeScene2D(function* (view) {
  view.fill(colors.bg);

  const title = createRef<Txt>();
  const neuron = createRef<Circle>();
  const decision = createRef<Line>();
  const limitation = createRef<Rect>();

  view.add(
    <Layout layout direction={'column'} gap={48} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={72}>
      <Txt ref={title} text={'1. A perceptron learns a line'} fontSize={76} fontWeight={700} fill={colors.text} opacity={0} />
      <Layout layout gap={80} alignItems={'center'}>
        <Layout layout direction={'column'} gap={22}>
          <Txt text={'inputs'} fontSize={34} fill={colors.muted} />
          <Circle size={64} fill={colors.cyan} />
          <Circle size={64} fill={colors.violet} />
          <Circle size={64} fill={colors.amber} />
        </Layout>
        <Layout width={300} height={250}>
          <Line points={[[-140, -75], [90, 0]]} stroke={colors.cyan} lineWidth={8} end={0.9} />
          <Line points={[[-140, 0], [90, 0]]} stroke={colors.violet} lineWidth={8} end={0.9} />
          <Line points={[[-140, 75], [90, 0]]} stroke={colors.amber} lineWidth={8} end={0.9} />
          <Circle ref={neuron} x={120} size={150} fill={colors.card} stroke={colors.cyan} lineWidth={8} scale={0.72}>
            <Txt text={'Σ + step'} fontSize={34} fill={colors.text} />
          </Circle>
        </Layout>
        <Rect width={420} height={300} radius={28} fill={'#0f172a'} stroke={'#334155'} lineWidth={4}>
          <Line ref={decision} points={[[-155, 100], [155, -100]]} stroke={colors.cyan} lineWidth={8} end={0} />
          <Circle x={-80} y={-52} size={34} fill={colors.violet} />
          <Circle x={-35} y={25} size={34} fill={colors.violet} />
          <Circle x={96} y={56} size={34} fill={colors.amber} />
          <Circle x={60} y={-28} size={34} fill={colors.amber} />
        </Rect>
      </Layout>
      <Rect ref={limitation} width={1180} height={118} radius={24} fill={'#1e1b4b'} opacity={0}>
        <Txt text={'Useful for simple yes/no boundaries — limited when patterns are curved or layered.'} fontSize={42} fill={colors.text} />
      </Rect>
    </Layout>,
  );

  yield* all(title().opacity(1, 0.8), neuron().scale(1, 0.8));
  yield* decision().end(1, 1.1);
  yield* limitation().opacity(1, 0.8);
  yield* waitFor(1.2);
});
