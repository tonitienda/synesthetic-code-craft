import {Circle, Gradient, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, createSignal, easeInOutCubic, easeOutBack, easeOutBounce, easeOutCubic, waitFor} from '@motion-canvas/core';
import {impact} from '../../../choreography';
import {materials} from '../materials';

export default makeScene2D(function* (view) {
  const overlay = createRef<Layout>();
  const title = createRef<Txt>();
  const falling = createRef<Circle>();
  const pad = createRef<Rect>();
  const leftBall = createRef<Circle>();
  const rightBall = createRef<Circle>();
  const bob = createRef<Circle>();
  const angle = createSignal(-42);
  const pivot: [number, number] = [510, -170];
  const length = 270;
  const bobPosition = () => {
    const radians = angle() * Math.PI / 180;
    return [pivot[0] + Math.sin(radians) * length, pivot[1] + Math.cos(radians) * length] as [number, number];
  };

  view.fill(new Gradient({type: 'radial', from: [0, 20], to: [0, 20], fromRadius: 40, toRadius: 1000, stops: [{offset: 0, color: '#151827'}, {offset: 1, color: '#02040a'}]}));
  view.add(
    <Layout ref={overlay} width={'100%'} height={'100%'}>
      <Txt ref={title} text={'PHYSICS PLAYGROUND'} y={-430} fontFamily={'Inter, sans-serif'} fontSize={58} fontWeight={700} fill={'#f8fafc'} opacity={0} />
      <Txt text={'IMPACT'} x={-520} y={-280} fontFamily={'JetBrains Mono, monospace'} fontSize={15} fill={'#94a3b8'} />
      <Txt text={'COLLISION'} x={0} y={-280} fontFamily={'JetBrains Mono, monospace'} fontSize={15} fill={'#94a3b8'} />
      <Txt text={'JOINT'} x={520} y={-280} fontFamily={'JetBrains Mono, monospace'} fontSize={15} fill={'#94a3b8'} />
      <Circle ref={falling} size={105} x={-520} y={-170} fill={materials.bubble.fill} stroke={materials.bubble.border} lineWidth={3} shadowColor={materials.bubble.shadow} shadowBlur={28} />
      <Rect ref={pad} width={260} height={55} x={-520} y={235} radius={25} fill={'#172554'} stroke={'#818cf8'} lineWidth={3} />
      <Circle ref={leftBall} size={112} x={-190} y={80} fill={materials.marble.fill} stroke={materials.marble.border} lineWidth={3} />
      <Circle ref={rightBall} size={112} x={190} y={80} fill={materials.gel.fill} stroke={materials.gel.border} lineWidth={3} shadowColor={materials.gel.shadow} shadowBlur={24} />
      <Line points={() => [pivot, bobPosition()]} stroke={'#cbd5e1'} lineWidth={5} lineCap={'round'} />
      <Circle size={20} position={pivot} fill={'#f8fafc'} />
      <Circle ref={bob} size={105} position={bobPosition} fill={materials.metal.fill} stroke={materials.metal.border} lineWidth={3} shadowColor={materials.metal.shadow} shadowBlur={24} />
      <Txt text={'fixed step · seeded · scrub-safe'} y={370} fontFamily={'JetBrains Mono, monospace'} fontSize={16} letterSpacing={1.5} fill={'#64748b'} />
    </Layout>,
  );

  yield* title().opacity(1, 0.45);
  yield* chain(
    falling().y(175, 0.72, easeOutBounce),
    all(
      falling().scale([1.12, 0.86], 0.12, easeOutCubic).to(1, 0.3, easeOutBack),
      pad().scale([1.04, 0.9], 0.12, easeOutCubic).to(1, 0.3, easeOutBack),
      impact({overlay: overlay(), at: pad().absolutePosition(), color: materials.bubble.accent, size: 220, surface: pad()}),
    ),
  );
  yield* all(leftBall().x(-58, 0.5, easeInOutCubic), rightBall().x(58, 0.5, easeInOutCubic));
  yield* all(leftBall().x(-215, 0.52, easeOutCubic), rightBall().x(235, 0.52, easeOutCubic), leftBall().rotation(-18, 0.52), rightBall().rotation(22, 0.52));
  yield* angle(38, 0.85, easeInOutCubic).to(-28, 0.78, easeInOutCubic).to(17, 0.68, easeInOutCubic).to(0, 0.55, easeOutCubic);
  yield* waitFor(0.65);
  yield* all(title().opacity(0, 0.4), overlay().opacity(0, 0.48));
});
