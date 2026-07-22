import {Circle, Gradient, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {
  MaterialKind,
  MaterialPanel,
  materials,
} from '../materials';

export function createMaterialShowcase(material: MaterialKind) {
  return makeScene2D(function* (view) {
    const definition = materials[material];
    const hero = createRef<MaterialPanel>();
    const left = createRef<MaterialPanel>();
    const right = createRef<MaterialPanel>();
    const joined = createRef<MaterialPanel>();
    const title = createRef<Txt>();
    const subtitle = createRef<Txt>();
    const stageLine = createRef<Line>();
    const impactRing = createRef<Circle>();
    const seam = createRef<Line>();
    const adhesionBridge = createRef<Rect>();

    view.fill(
      new Gradient({
        type: 'radial',
        from: [0, 20],
        to: [0, 20],
        fromRadius: 40,
        toRadius: 980,
        stops: [
          {offset: 0, color: '#111827'},
          {offset: 0.62, color: '#070b14'},
          {offset: 1, color: '#02040a'},
        ],
      }),
    );

    view.add(
      <Layout width={'100%'} height={'100%'}>
        <Txt
          ref={title}
          text={definition.name}
          y={-414}
          fontFamily={'Inter, sans-serif'}
          fontSize={62}
          fontWeight={700}
          letterSpacing={3}
          fill={definition.text}
          opacity={0}
        />
        <Txt
          ref={subtitle}
          text={definition.subtitle.toUpperCase()}
          y={-354}
          fontFamily={'JetBrains Mono, monospace'}
          fontSize={17}
          letterSpacing={2.5}
          fill={definition.accent}
          opacity={0}
        />
        <Line
          ref={stageLine}
          points={[[-520, 282], [520, 282]]}
          stroke={definition.border}
          lineWidth={2}
          end={0}
        />
        <MaterialPanel ref={hero} material={material} y={-12} />
        <Rect
          ref={adhesionBridge}
          width={0}
          height={70}
          y={-5}
          radius={35}
          fill={definition.fill}
          stroke={definition.accent}
          lineWidth={2}
          shadowColor={definition.shadow}
          shadowBlur={28}
          opacity={0}
        />
        <MaterialPanel
          ref={left}
          material={material}
          width={430}
          height={330}
          y={-5}
          opacity={0}
        />
        <MaterialPanel
          ref={right}
          material={material}
          width={430}
          height={330}
          y={-5}
          opacity={0}
        />
        <MaterialPanel
          ref={joined}
          material={material}
          width={900}
          height={350}
          y={-5}
          opacity={0}
        />
        <Circle
          ref={impactRing}
          size={84}
          y={-5}
          stroke={definition.accent}
          lineWidth={4}
          opacity={0}
        />
        <Line
          ref={seam}
          points={[[0, -142], [0, 132]]}
          stroke={definition.accent}
          lineWidth={3}
          end={0}
          opacity={0}
        />
      </Layout>,
    );

    yield* all(
      chain(waitFor(0.1), title().opacity(1, 0.48, easeOutCubic)),
      chain(waitFor(0.2), subtitle().opacity(0.92, 0.48, easeOutCubic)),
      stageLine().end(1, 0.72, easeOutCubic),
      hero().enter(),
    );
    yield* waitFor(0.42);

    yield* all(
      hero().x(-270, 0.75, easeInOutCubic),
      hero().width(620, 0.75, easeInOutCubic),
      hero().height(315, 0.75, easeInOutCubic),
    );
    yield* hero().setActive(true, 0.36);
    yield* all(
      hero().x(0, 0.72, easeInOutCubic),
      hero().width(900, 0.72, easeOutBack),
      hero().height(350, 0.72, easeOutBack),
    );
    yield* waitFor(0.34);

    left().x(0);
    right().x(0);
    left().scale([0.92, 1]);
    right().scale([0.92, 1]);
    if (material === 'bubble') {
      left().rotation(0);
      right().rotation(0);

      yield* all(
        hero().width(80, 0.58, easeInOutCubic),
        hero().opacity(0, 0.38, easeOutCubic),
        left().opacity(1, 0.22, easeOutCubic),
        right().opacity(1, 0.22, easeOutCubic),
        chain(
          all(
            left().x(-170, 0.32, easeOutCubic),
            right().x(170, 0.32, easeOutCubic),
            left().scale([1.08, 0.94], 0.32, easeOutCubic),
            right().scale([1.08, 0.94], 0.32, easeOutCubic),
            adhesionBridge().width(60, 0.32, easeOutCubic),
            adhesionBridge().height(80, 0.32, easeOutCubic),
            adhesionBridge().opacity(0.8, 0.18, easeOutCubic),
          ),
          all(
            left().x(-285, 0.42, easeOutCubic),
            right().x(285, 0.42, easeOutCubic),
            left().scale([1.14, 0.9], 0.42, easeOutCubic),
            right().scale([1.14, 0.9], 0.42, easeOutCubic),
            adhesionBridge().width(160, 0.42, easeOutCubic),
            adhesionBridge().height(48, 0.42, easeOutCubic),
          ),
          all(
            left().x(-242, 0.24, easeInOutCubic),
            right().x(242, 0.24, easeInOutCubic),
            left().scale([0.98, 1.03], 0.24, easeInOutCubic),
            right().scale([0.98, 1.03], 0.24, easeInOutCubic),
            adhesionBridge().width(80, 0.18, easeInOutCubic),
            adhesionBridge().height(75, 0.18, easeInOutCubic),
          ),
          all(
            left().x(-252, 0.2, easeOutCubic),
            right().x(252, 0.2, easeOutCubic),
            left().scale(1, 0.2, easeOutCubic),
            right().scale(1, 0.2, easeOutCubic),
            adhesionBridge().width(0, 0.16, easeOutCubic),
            adhesionBridge().opacity(0, 0.16, easeOutCubic),
          ),
        ),
      );
    } else {
      yield* all(
        hero().width(80, 0.58, easeInOutCubic),
        hero().opacity(0, 0.38, easeOutCubic),
        left().opacity(1, 0.28, easeOutCubic),
        right().opacity(1, 0.28, easeOutCubic),
        left().x(-252, 0.72, easeOutBack),
        right().x(252, 0.72, easeOutBack),
        left().scale(1, 0.72, easeOutBack),
        right().scale(1, 0.72, easeOutBack),
      );
    }
    yield* all(left().setActive(true), right().setActive(true));

    impactRing().size(70);
    impactRing().opacity(0);
    yield* all(
      left().react(),
      right().react(),
      chain(
        impactRing().opacity(0.85, 0.12, easeOutCubic),
        all(
          impactRing().size(580, 0.7, easeOutCubic),
          impactRing().opacity(0, 0.7, easeOutCubic),
        ),
      ),
    );
    yield* left().setActive(false, 0.42);
    yield* waitFor(0.52);

    if (material === 'bubble') {
      left().rotation(0);
      right().rotation(0);
      seam().opacity(0);
      seam().end(0);

      yield* chain(
        all(
          left().x(-205, 0.38, easeInOutCubic),
          right().x(205, 0.38, easeInOutCubic),
          left().scale([1.05, 0.96], 0.38, easeInOutCubic),
          right().scale([1.05, 0.96], 0.38, easeInOutCubic),
          adhesionBridge().width(70, 0.3, easeOutCubic),
          adhesionBridge().height(60, 0.3, easeOutCubic),
          adhesionBridge().opacity(0.8, 0.18, easeOutCubic),
        ),
        all(
          left().x(-225, 0.18, easeOutCubic),
          right().x(225, 0.18, easeOutCubic),
          left().scale([0.985, 1.02], 0.18, easeOutCubic),
          right().scale([0.985, 1.02], 0.18, easeOutCubic),
          adhesionBridge().width(38, 0.18, easeOutCubic),
          adhesionBridge().height(100, 0.18, easeOutCubic),
        ),
        all(
          left().x(-216, 0.22, easeOutCubic),
          right().x(216, 0.22, easeOutCubic),
          left().scale(1, 0.22, easeOutCubic),
          right().scale(1, 0.22, easeOutCubic),
          adhesionBridge().width(30, 0.22, easeOutCubic),
          adhesionBridge().height(270, 0.22, easeOutCubic),
          seam().opacity(1, 0.12, easeOutCubic),
          seam().end(1, 0.22, easeOutCubic),
        ),
      );
      joined().scale([1.035, 0.96]);
    } else {
      seam().opacity(1);
      yield* all(
        left().x(-225, 0.62, easeInOutCubic),
        right().x(225, 0.62, easeInOutCubic),
        left().width(450, 0.62, easeInOutCubic),
        right().width(450, 0.62, easeInOutCubic),
        seam().end(1, 0.55, easeOutCubic),
      );
    }
    yield* all(
      joined().opacity(1, 0.28, easeOutCubic),
      joined().scale(1, 0.42, easeOutBack),
      left().opacity(0, 0.24, easeOutCubic),
      right().opacity(0, 0.24, easeOutCubic),
      adhesionBridge().opacity(0, 0.24, easeOutCubic),
      chain(
        seam().lineWidth(8, 0.16, easeOutCubic),
        all(
          seam().lineWidth(2, 0.34, easeOutCubic),
          seam().opacity(0, 0.34, easeOutCubic),
        ),
      ),
    );
    yield* joined().setActive(true, 0.34);
    yield* joined().react();
    yield* waitFor(0.85);

    yield* all(
      joined().opacity(0, 0.48, easeOutCubic),
      joined().y(-45, 0.48, easeOutCubic),
      title().opacity(0, 0.42, easeOutCubic),
      subtitle().opacity(0, 0.36, easeOutCubic),
      stageLine().start(1, 0.5, easeInOutCubic),
    );
  });
}
