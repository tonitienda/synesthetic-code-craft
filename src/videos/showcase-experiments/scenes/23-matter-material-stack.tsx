import {Gradient, Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, waitFor} from '@motion-canvas/core';
import Matter from 'matter-js';
import {MaterialPanel, materials} from '../materials';
import {captureMatterTimeline, sampleMatterBody} from '../matterTimeline';

export default makeScene2D(function* (view) {
  const stage = createRef<Layout>();
  const progress = createSignal(0);
  const duration = 6.4;
  const engine = Matter.Engine.create({gravity: {x: 0, y: 1, scale: 0.0012}});
  const ground = Matter.Bodies.rectangle(0, 335, 1250, 70, {isStatic: true, friction: 0.9});
  const leftWall = Matter.Bodies.rectangle(-610, 0, 50, 720, {isStatic: true});
  const rightWall = Matter.Bodies.rectangle(610, 0, 50, 720, {isStatic: true});
  const marbleBody = Matter.Bodies.rectangle(0, 40, 390, 108, {density: 0.009, restitution: 0.04, friction: 0.86, chamfer: {radius: 18}});
  const metalBody = Matter.Bodies.rectangle(-80, -155, 330, 96, {density: 0.004, restitution: 0.16, friction: 0.55, chamfer: {radius: 14}});
  const bubbleBody = Matter.Bodies.rectangle(95, -355, 275, 104, {density: 0.0012, restitution: 0.72, friction: 0.18, chamfer: {radius: 42}});
  Matter.Body.setAngle(marbleBody, -0.035);
  Matter.Body.setAngle(metalBody, 0.12);
  Matter.Body.setAngle(bubbleBody, -0.16);
  Matter.Body.setAngularVelocity(bubbleBody, 0.018);
  Matter.Composite.add(engine.world, [ground, leftWall, rightWall, marbleBody, metalBody, bubbleBody]);

  const bodies = [marbleBody, metalBody, bubbleBody];
  const timeline = captureMatterTimeline(engine, bodies, duration);
  const sample = (body: Matter.Body) => sampleMatterBody(timeline, body, progress());
  const bind = (body: Matter.Body) => ({
    position: () => [sample(body).x, sample(body).y] as [number, number],
    rotation: () => sample(body).angle * 180 / Math.PI,
  });

  view.fill(new Gradient({type: 'radial', from: [0, 30], to: [0, 30], fromRadius: 40, toRadius: 1000, stops: [{offset: 0, color: '#111827'}, {offset: 1, color: '#02040a'}]}));
  view.add(
    <Layout ref={stage} width={'100%'} height={'100%'} opacity={0}>
      <Txt text={'MATERIALS AS RIGID BODIES'} y={-430} fontFamily={'Inter, sans-serif'} fontSize={56} fontWeight={700} fill={'#f8fafc'} />
      <Txt text={'MASS · RESTITUTION · FRICTION'} y={-370} fontFamily={'JetBrains Mono, monospace'} fontSize={16} letterSpacing={2} fill={'#a78bfa'} />
      <MaterialPanel material={'marble'} minimal label={'MARBLE'} description={'heavy · low bounce'} width={390} height={108} {...bind(marbleBody)} />
      <MaterialPanel material={'metal'} minimal label={'METAL'} description={'rigid · controlled rebound'} width={330} height={96} {...bind(metalBody)} />
      <MaterialPanel material={'bubble'} minimal label={'BUBBLE'} description={'light · high restitution'} width={275} height={104} {...bind(bubbleBody)} />
      <Rect width={1250} height={70} y={335} radius={14} fill={materials.concrete.fill} stroke={materials.concrete.border} lineWidth={3} shadowColor={materials.concrete.shadow} shadowBlur={24}>
        <Txt text={'CONCRETE GROUND'} fontFamily={'JetBrains Mono, monospace'} fontSize={15} fontWeight={700} fill={materials.concrete.text} />
      </Rect>
      <Txt text={'same visual materials · simulated physical properties'} y={405} fontFamily={'JetBrains Mono, monospace'} fontSize={15} letterSpacing={1.3} fill={'#64748b'} />
    </Layout>,
  );

  yield* stage().opacity(1, 0.4);
  yield* progress(1, duration, easeInOutCubic);
  yield* waitFor(0.55);
  yield* all(stage().opacity(0, 0.5));
});
