import {Circle, Gradient, Layout, Polygon, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, createSignal, easeInOutCubic, easeOutBack, easeOutCubic, waitFor} from '@motion-canvas/core';
import {CurvedLine} from '../../../components';
import {materials} from '../materials';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const droplet = createRef<Circle>();
  const firstProgress = createSignal(0);
  const secondProgress = createSignal(0);
  const firstPipe = new CurvedLine({from: [-700, 120], to: [-90, 20], curve: 0.43, arc: -120, stroke: '#243746', lineWidth: 34, end: 0});
  const firstWater = new CurvedLine({from: [-700, 120], to: [-90, 20], curve: 0.43, arc: -120, stroke: '#38bdf8', lineWidth: 18, end: 0});
  const secondPipe = new CurvedLine({from: [-90, 20], to: [640, -70], curve: 0.43, arc: 95, stroke: '#243746', lineWidth: 34, end: 0});
  const secondWater = new CurvedLine({from: [-90, 20], to: [640, -70], curve: 0.43, arc: 95, stroke: '#38bdf8', lineWidth: 18, end: 0});

  view.fill(new Gradient({type: 'radial', from: [0, 30], to: [0, 30], fromRadius: 30, toRadius: 980, stops: [{offset: 0, color: '#0d2535'}, {offset: 1, color: '#02040a'}]}));
  view.add(<Txt ref={title} text={'WATER AS A FLOWING MATERIAL'} y={-420} fontFamily={'Inter, sans-serif'} fontSize={54} fontWeight={700} fill={'#f8fafc'} opacity={0} />);
  view.add(<Circle width={310} height={190} x={-700} y={175} fill={'#0c4a6e'} stroke={'#7dd3fc'} lineWidth={4} />);
  view.add(<Txt text={'RESERVOIR'} x={-700} y={175} fontFamily={'JetBrains Mono, monospace'} fontSize={18} fill={'#e0f2fe'} />);
  view.add(firstPipe); view.add(firstWater); view.add(secondPipe); view.add(secondWater);
  view.add(
    <Layout x={650} y={-70}>
      <Rect width={330} height={260} y={70} radius={18} fill={materials.paper.fill} stroke={materials.paper.border} lineWidth={3} />
      <Polygon sides={3} width={390} height={180} y={-105} fill={materials.wood.fill} stroke={materials.wood.border} lineWidth={3} />
      <Txt text={'HOME'} y={68} fontFamily={'JetBrains Mono, monospace'} fontSize={26} fontWeight={800} fill={materials.paper.text} />
    </Layout>,
  );
  view.add(<Circle ref={droplet} size={28} fill={'#e0f2fe'} shadowColor={'#38bdf8'} shadowBlur={26} opacity={0} scale={[0.72, 1.18]} position={() => firstPipe.getPointAtPercentage(firstProgress()).position} />);

  yield* title().opacity(1, 0.45);
  yield* all(firstPipe.end(1, 0.7, easeOutCubic), firstWater.end(1, 0.82, easeOutCubic));
  yield* droplet().opacity(1, 0.12);
  yield* firstProgress(1, 1, easeInOutCubic);
  droplet().position(() => secondPipe.getPointAtPercentage(secondProgress()).position);
  yield* all(secondPipe.end(1, 0.75, easeOutCubic), secondWater.end(1, 0.9, easeOutCubic), secondProgress(1, 1.05, easeInOutCubic));
  yield* droplet().scale(1.7, 0.18, easeOutCubic).to(1, 0.35, easeOutBack);
  yield* waitFor(0.75);
  yield* all(title().opacity(0, 0.4), firstPipe.opacity(0, 0.4), firstWater.opacity(0, 0.4), secondPipe.opacity(0, 0.4), secondWater.opacity(0, 0.4), droplet().opacity(0, 0.3));
});
