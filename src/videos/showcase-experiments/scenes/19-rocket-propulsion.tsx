import {Circle, Gradient, Layout, Polygon, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, delay, easeInCubic, easeOutBack, easeOutCubic, waitFor} from '@motion-canvas/core';
import {materials} from '../materials';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const rocket = createRef<Layout>();
  const flame = createRef<Polygon>();
  const smoke: Circle[] = [];

  view.fill(new Gradient({type: 'linear', from: [0, -540], to: [0, 540], stops: [{offset: 0, color: '#061327'}, {offset: 1, color: '#02040a'}]}));
  view.add(<Txt ref={title} text={'PROPULSION MATERIAL'} y={-430} fontFamily={'Inter, sans-serif'} fontSize={58} fontWeight={700} fill={'#f8fafc'} opacity={0} />);
  view.add(
    <Layout ref={rocket} y={30} opacity={0}>
      <Rect width={190} height={390} radius={88} fill={materials.metal.fill} stroke={materials.metal.border} lineWidth={4} shadowColor={'#67e8f955'} shadowBlur={28} />
      <Polygon sides={3} width={185} height={170} y={-260} fill={materials.copper.fill} stroke={materials.copper.border} lineWidth={3} />
      <Circle size={78} y={-75} fill={materials.glass.fill} stroke={materials.glass.accent} lineWidth={4} shadowColor={materials.glass.shadow} shadowBlur={20} />
      <Polygon sides={3} width={120} height={145} x={-120} y={135} rotation={-20} fill={materials.copper.fill} />
      <Polygon sides={3} width={120} height={145} x={120} y={135} rotation={20} fill={materials.copper.fill} />
      <Rect width={112} height={58} y={220} radius={12} fill={'#1f2937'} stroke={materials.metal.border} lineWidth={3} />
      <Polygon ref={flame} sides={3} width={105} height={210} y={330} rotation={180} fill={new Gradient({type: 'linear', from: [0, -100], to: [0, 110], stops: [{offset: 0, color: '#fff7ae'}, {offset: 0.45, color: '#fb923c'}, {offset: 1, color: '#ef444400'}]})} scale={[0.2, 0]} opacity={0} />
    </Layout>,
  );
  for (let index = 0; index < 12; index += 1) {
    const particle = new Circle({size: 28 + (index % 4) * 13, x: ((index * 73) % 220) - 110, y: 360 + (index % 3) * 35, fill: index % 3 === 0 ? '#f8fafc88' : '#94a3b866', opacity: 0});
    smoke.push(particle);
    view.add(particle);
  }

  yield* all(title().opacity(1, 0.45), rocket().opacity(1, 0.45), rocket().scale(1, 0.6, easeOutBack));
  yield* all(flame().opacity(1, 0.15), flame().scale([1, 1], 0.45, easeOutBack), rocket().y(18, 0.18).to(34, 0.18).to(30, 0.22));
  yield* all(...smoke.map((particle, index) => delay(index * 0.035, all(
    chain(particle.opacity(0.65, 0.18), particle.opacity(0, 0.72)),
    particle.y(540 + (index % 4) * 30, 0.9, easeOutCubic),
    particle.x(particle.x() * 2.1, 0.9, easeOutCubic),
    particle.scale(1.6, 0.9),
  ))));
  yield* chain(waitFor(0.15), all(rocket().y(-620, 1.65, easeInCubic), rocket().scale(0.78, 1.65, easeInCubic), title().opacity(0, 0.6)));
});
