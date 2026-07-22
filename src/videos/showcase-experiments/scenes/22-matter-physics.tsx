import {Circle, Gradient, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, waitFor} from '@motion-canvas/core';
import Matter from 'matter-js';
import {materials} from '../materials';
import {captureMatterTimeline, sampleMatterBody} from '../matterTimeline';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const stage = createRef<Layout>();
  const progress = createSignal(0);
  const duration = 5.6;
  const engine = Matter.Engine.create({gravity: {x: 0, y: 1, scale: 0.001}});

  const fallingBody = Matter.Bodies.circle(-520, -180, 52, {restitution: 0.78, frictionAir: 0.008});
  const impactGround = Matter.Bodies.rectangle(-520, 235, 270, 55, {isStatic: true});
  const leftBody = Matter.Bodies.circle(-190, 70, 56, {restitution: 0.94, frictionAir: 0.002});
  const rightBody = Matter.Bodies.circle(190, 70, 56, {restitution: 0.94, frictionAir: 0.002});
  const collisionFloor = Matter.Bodies.rectangle(0, 145, 480, 34, {isStatic: true});
  const pivot = {x: 520, y: -170};
  const bobBody = Matter.Bodies.circle(350, 40, 53, {density: 0.004, frictionAir: 0.004});
  const pendulum = Matter.Constraint.create({pointA: pivot, bodyB: bobBody, length: 270, stiffness: 0.98, damping: 0.012});
  Matter.Composite.add(engine.world, [fallingBody, impactGround, leftBody, rightBody, collisionFloor, bobBody, pendulum]);

  const bodies = [fallingBody, leftBody, rightBody, bobBody];
  const timeline = captureMatterTimeline(engine, bodies, duration, step => {
    if (step === 72) {
      Matter.Body.setVelocity(leftBody, {x: 5.6, y: 0});
      Matter.Body.setVelocity(rightBody, {x: -4.7, y: 0});
    }
  });
  const sample = (body: Matter.Body) => sampleMatterBody(timeline, body, progress());

  view.fill(new Gradient({type: 'radial', from: [0, 20], to: [0, 20], fromRadius: 40, toRadius: 1000, stops: [{offset: 0, color: '#151827'}, {offset: 1, color: '#02040a'}]}));
  view.add(
    <Layout ref={stage} width={'100%'} height={'100%'} opacity={0}>
      <Txt ref={title} text={'MATTER.JS PHYSICS'} y={-430} fontFamily={'Inter, sans-serif'} fontSize={58} fontWeight={700} fill={'#f8fafc'} />
      <Txt text={'FIXED 60 HZ · PRECOMPUTED · SCRUB-SAFE'} y={-370} fontFamily={'JetBrains Mono, monospace'} fontSize={16} letterSpacing={2} fill={'#a78bfa'} />
      <Txt text={'IMPACT'} x={-520} y={-280} fontFamily={'JetBrains Mono, monospace'} fontSize={15} fill={'#94a3b8'} />
      <Txt text={'COLLISION'} x={0} y={-280} fontFamily={'JetBrains Mono, monospace'} fontSize={15} fill={'#94a3b8'} />
      <Txt text={'CONSTRAINT'} x={520} y={-280} fontFamily={'JetBrains Mono, monospace'} fontSize={15} fill={'#94a3b8'} />
      <Rect width={270} height={55} x={-520} y={235} radius={25} fill={'#172554'} stroke={'#818cf8'} lineWidth={3} />
      <Circle size={104} position={() => [sample(fallingBody).x, sample(fallingBody).y]} rotation={() => sample(fallingBody).angle * 180 / Math.PI} fill={materials.bubble.fill} stroke={materials.bubble.border} lineWidth={3} shadowColor={materials.bubble.shadow} shadowBlur={28} />
      <Rect width={480} height={34} y={145} radius={14} fill={'#1f2937'} opacity={0.65} />
      <Circle size={112} position={() => [sample(leftBody).x, sample(leftBody).y]} fill={materials.marble.fill} stroke={materials.marble.border} lineWidth={3} />
      <Circle size={112} position={() => [sample(rightBody).x, sample(rightBody).y]} fill={materials.gel.fill} stroke={materials.gel.border} lineWidth={3} shadowColor={materials.gel.shadow} shadowBlur={24} />
      <Line points={() => [[pivot.x, pivot.y], [sample(bobBody).x, sample(bobBody).y]]} stroke={'#cbd5e1'} lineWidth={5} lineCap={'round'} />
      <Circle size={20} position={[pivot.x, pivot.y]} fill={'#f8fafc'} />
      <Circle size={106} position={() => [sample(bobBody).x, sample(bobBody).y]} rotation={() => sample(bobBody).angle * 180 / Math.PI} fill={materials.metal.fill} stroke={materials.metal.border} lineWidth={3} shadowColor={materials.metal.shadow} shadowBlur={24} />
    </Layout>,
  );

  yield* stage().opacity(1, 0.4);
  yield* progress(1, duration, easeInOutCubic);
  yield* waitFor(0.45);
  yield* all(stage().opacity(0, 0.45), title().opacity(0, 0.35));
});
