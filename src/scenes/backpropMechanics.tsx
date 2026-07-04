import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

const c = {bg: '#060817', text: '#f8fafc', muted: '#cbd5e1', cyan: '#22d3ee', violet: '#8b5cf6', amber: '#f59e0b', green: '#10b981', card: '#111827'};

export default makeScene2D(function* (view) {
  view.fill(c.bg);
  const forward = createRef<Line>();
  const backward = createRef<Line>();
  const formula = createRef<Rect>();
  const update = createRef<Txt>();

  view.add(
    <Layout layout direction={'column'} gap={42} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70}>
      <Txt text={'3. Backpropagation: send credit backward'} fontSize={72} fontWeight={700} fill={c.text} />
      <Layout width={1180} height={360}>
        <Circle x={-430} y={0} size={110} fill={c.card} stroke={c.cyan} lineWidth={7}><Txt text={'x'} fontSize={44} fill={c.text} /></Circle>
        <Circle x={-150} y={0} size={130} fill={c.card} stroke={c.violet} lineWidth={7}><Txt text={'h'} fontSize={44} fill={c.text} /></Circle>
        <Circle x={150} y={0} size={130} fill={c.card} stroke={c.amber} lineWidth={7}><Txt text={'ŷ'} fontSize={44} fill={c.text} /></Circle>
        <Rect x={430} y={0} width={180} height={120} radius={24} fill={'#172554'} stroke={c.green} lineWidth={7}><Txt text={'loss'} fontSize={40} fill={c.text} /></Rect>
        <Line ref={forward} points={[[-360, -56], [-220, -56], [80, -56], [330, -56]]} stroke={c.cyan} lineWidth={9} endArrow end={0} />
        <Line ref={backward} points={[[330, 58], [80, 58], [-220, 58], [-360, 58]]} stroke={c.amber} lineWidth={9} endArrow end={0} />
        <Txt x={0} y={-128} text={'forward: predict'} fontSize={34} fill={c.cyan} />
        <Txt x={0} y={130} text={'backward: gradients'} fontSize={34} fill={c.amber} opacity={0.95} />
      </Layout>
      <Rect ref={formula} width={1120} height={152} radius={28} fill={'#111827'} stroke={'#334155'} lineWidth={4} opacity={0}>
        <Txt text={'gradient = local sensitivity × downstream error'} fontSize={48} fill={c.text} />
      </Rect>
      <Txt ref={update} text={'Then update each weight:  w ← w − learning_rate × gradient'} fontSize={44} fill={c.muted} opacity={0} />
    </Layout>,
  );

  yield* forward().end(1, 1);
  yield* backward().end(1, 1);
  yield* all(formula().opacity(1, 0.8), update().opacity(1, 0.8));
  yield* waitFor(1.4);
});
