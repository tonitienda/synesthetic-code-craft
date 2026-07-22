import {
  Circle,
  Gradient,
  Layout,
  Line,
  Path,
  Rect,
  Txt,
  makeScene2D,
} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {materials} from '../materials';
import {ThreeRocketNode} from '../three/ThreeRocketNode';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const flatStage = createRef<Layout>();
  const flatRocket = createRef<Layout>();
  const flatFlame = createRef<Path>();
  const depthStage = createRef<Layout>();
  const depthRocket = createRef<ThreeRocketNode>();
  const divider = createRef<Line>();
  const verdict = createRef<Txt>();

  view.fill(new Gradient({
    type: 'radial',
    from: [0, 40],
    to: [0, 40],
    fromRadius: 40,
    toRadius: 1050,
    stops: [
      {offset: 0, color: '#111827'},
      {offset: 0.62, color: '#070b14'},
      {offset: 1, color: '#02040a'},
    ],
  }));

  view.add(
    <>
      <Txt
        ref={title}
        text={'ROCKET DIMENSION STUDY'}
        y={-442}
        fontFamily={'Inter, sans-serif'}
        fontSize={56}
        fontWeight={700}
        letterSpacing={2.2}
        fill={'#f8fafc'}
        opacity={0}
      />
      <Txt
        ref={subtitle}
        text={'SAME MOTION · DIFFERENT SPATIAL LANGUAGE'}
        y={-382}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={16}
        letterSpacing={2}
        fill={'#67e8f9'}
        opacity={0}
      />
      <Line
        ref={divider}
        points={[[0, -315], [0, 350]]}
        stroke={'#ffffff1f'}
        lineWidth={2}
        end={0}
      />

      <Layout ref={flatStage} x={-455} y={8} opacity={0}>
        <Txt text={'2.5D VECTOR'} y={-310} fontFamily={'JetBrains Mono, monospace'} fontSize={18} fontWeight={700} letterSpacing={1.6} fill={materials.metal.accent} />
        <Txt text={'continuous silhouette'} y={-276} fontFamily={'Inter, sans-serif'} fontSize={16} fill={'#94a3b8'} />
        <Layout ref={flatRocket} y={18} scale={0.92}>
          <Path
            data={'M 0 -255 C -23 -226 -54 -181 -70 -128 C -78 -84 -78 92 -68 145 C -58 181 -39 208 -31 222 L 31 222 C 39 208 58 181 68 145 C 78 92 78 -84 70 -128 C 54 -181 23 -226 0 -255 Z'}
            fill={materials.metal.fill}
            stroke={materials.metal.border}
            lineWidth={4}
            shadowColor={'#67e8f944'}
            shadowBlur={24}
          />
          <Path
            data={'M -57 92 C -88 111 -128 163 -145 220 C -107 205 -68 186 -38 151 Z'}
            fill={materials.copper.fill}
            stroke={materials.copper.border}
            lineWidth={3}
          />
          <Path
            data={'M 57 92 C 88 111 128 163 145 220 C 107 205 68 186 38 151 Z'}
            fill={materials.copper.fill}
            stroke={materials.copper.border}
            lineWidth={3}
          />
          <Rect y={222} width={66} height={42} radius={[8, 8, 18, 18]} fill={'#111827'} stroke={materials.metal.border} lineWidth={3} />
          <Circle y={-48} size={58} fill={materials.glass.fill} stroke={materials.glass.accent} lineWidth={4} shadowColor={materials.glass.shadow} shadowBlur={18} />
          <Line points={[[-67, -112], [67, -112]]} stroke={materials.copper.accent} lineWidth={5} />
          <Path
            ref={flatFlame}
            data={'M -28 244 C -30 292 -15 345 0 374 C 17 340 31 291 28 244 C 12 256 -12 256 -28 244 Z'}
            fill={new Gradient({type: 'linear', from: [0, 235], to: [0, 380], stops: [{offset: 0, color: '#fff7ae'}, {offset: 0.42, color: '#fb923c'}, {offset: 1, color: '#ef444400'}]})}
            opacity={0}
            scale={[0.25, 0]}
          />
        </Layout>
      </Layout>

      <Layout ref={depthStage} x={455} y={8} opacity={0}>
        <Txt text={'THREE.JS HYBRID'} y={-310} fontFamily={'JetBrains Mono, monospace'} fontSize={18} fontWeight={700} letterSpacing={1.6} fill={'#f0abfc'} />
        <Txt text={'volume · occlusion · light'} y={-276} fontFamily={'Inter, sans-serif'} fontSize={16} fill={'#94a3b8'} />
        <ThreeRocketNode ref={depthRocket} y={48} scale={0.84} />
      </Layout>

      <Txt
        ref={verdict}
        text={'3D FOR HERO OBJECTS · MOTION CANVAS FOR EXPLANATION'}
        y={438}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={16}
        fontWeight={700}
        letterSpacing={1.5}
        fill={'#cbd5e1'}
        opacity={0}
      />
    </>,
  );

  flatRocket().y(70);
  depthRocket().y(100);
  yield* all(
    title().opacity(1, 0.42, easeOutCubic),
    subtitle().opacity(1, 0.48, easeOutCubic),
    divider().end(1, 0.72, easeOutCubic),
    flatStage().opacity(1, 0.5, easeOutCubic),
    depthStage().opacity(1, 0.5, easeOutCubic),
    flatRocket().y(18, 0.72, easeOutBack),
    depthRocket().y(48, 0.72, easeOutBack),
  );
  yield* waitFor(0.35);

  yield* all(
    depthRocket().yaw(24, 1.35, easeInOutCubic),
    depthRocket().lightSweep(1, 1.35, easeInOutCubic),
    flatRocket().rotation(2.5, 0.67, easeInOutCubic).to(-2.5, 0.68, easeInOutCubic),
  );
  yield* all(
    depthRocket().yaw(-12, 0.8, easeInOutCubic),
    flatRocket().rotation(0, 0.52, easeOutCubic),
    verdict().opacity(1, 0.42, easeOutCubic),
  );
  yield* waitFor(0.32);

  yield* all(
    depthRocket().thrust(1, 0.38, easeOutBack),
    flatFlame().opacity(1, 0.16, easeOutCubic),
    flatFlame().scale(1, 0.38, easeOutBack),
    chain(
      all(flatRocket().y(10, 0.16), depthRocket().y(40, 0.16)),
      all(flatRocket().y(22, 0.16), depthRocket().y(52, 0.16)),
      all(flatRocket().y(18, 0.2), depthRocket().y(48, 0.2)),
    ),
  );
  yield* waitFor(0.45);
  yield* all(
    flatRocket().y(-650, 1.45, easeInOutCubic),
    depthRocket().y(-650, 1.45, easeInOutCubic),
    flatRocket().scale(0.72, 1.45, easeInOutCubic),
    depthRocket().scale(0.66, 1.45, easeInOutCubic),
    title().opacity(0, 0.52, easeOutCubic),
    subtitle().opacity(0, 0.46, easeOutCubic),
    verdict().opacity(0, 0.42, easeOutCubic),
    divider().start(1, 0.62, easeInOutCubic),
  );
});
