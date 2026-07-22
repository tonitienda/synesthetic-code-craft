import {
  Circle,
  Gradient,
  Layout,
  Line,
  Rect,
  Txt,
  makeScene2D,
} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {impact, spreadLayer} from '../../../choreography';
import {CurvedLine} from '../../../components';
import {MaterialKind, MaterialPanel, materials} from '../materials';

interface CombinationOptions {
  first: MaterialKind;
  second: MaterialKind;
  title: string;
  subtitle: string;
  firstRole: string;
  secondRole: string;
}

export function createCombinationShowcase(options: CombinationOptions) {
  return makeScene2D(function* (view) {
    const firstDefinition = materials[options.first];
    const secondDefinition = materials[options.second];
    const overlay = createRef<Layout>();
    const title = createRef<Txt>();
    const subtitle = createRef<Txt>();
    const content = createRef<Layout>();
    const layerLabel = createRef<Txt>();
    const seam = createRef<Line>();

    const isGelLayer = options.second === 'gel';
    const isCopperLayer = options.second === 'copper';
    const layerWidth = isGelLayer ? 900 : isCopperLayer ? 890 : 850;
    const layerHeight = isGelLayer ? 155 : isCopperLayer ? 350 : 325;
    const layerY = isGelLayer ? 142 : 38;

    const shell = new MaterialPanel({
      material: options.first,
      bare: true,
      width: 980,
      height: 500,
      y: 30,
    });
    const materialLayer = new MaterialPanel({
      material: options.second,
      bare: true,
      width: layerWidth,
      height: layerHeight,
      y: layerY,
      radius: isGelLayer ? 30 : 18,
      shadowBlur: isGelLayer ? 36 : 12,
      opacity: 0,
    });
    shell.add(materialLayer);

    if (isCopperLayer) {
      materialLayer.opacity(0.5);
      for (const [index, y] of [-105, 0, 105].entries()) {
        shell.add(
          <CurvedLine
            from={[-420, y]}
            to={[420, y]}
            curve={0.34}
            arc={(index - 1) * 62}
            y={38}
            stroke={secondDefinition.accent}
            lineWidth={4}
            lineCap={'round'}
            opacity={0.56}
          />,
        );
      }
    }

    shell.add(
      <Layout ref={content} width={880} height={400} opacity={0}>
        <Layout
          layout
          direction={'row'}
          alignItems={'center'}
          gap={12}
          x={-315}
          y={-190}
        >
          <Circle
            size={13}
            fill={secondDefinition.accent}
            shadowColor={secondDefinition.accent}
            shadowBlur={16}
          />
          <Txt
            text={options.firstRole.toUpperCase()}
            fontFamily={'JetBrains Mono, monospace'}
            fontSize={16}
            fontWeight={700}
            letterSpacing={1.5}
            fill={firstDefinition.text}
          />
        </Layout>
        <Txt
          text={'composite.surface()'}
          x={-290}
          y={-88}
          fontFamily={'JetBrains Mono, monospace'}
          fontSize={34}
          fontWeight={700}
          fill={firstDefinition.text}
        />
        <Txt
          ref={layerLabel}
          text={`${options.secondRole.toUpperCase()} / INTEGRATED LAYER`}
          x={isGelLayer ? 165 : 145}
          y={isGelLayer ? 142 : 175}
          fontFamily={'JetBrains Mono, monospace'}
          fontSize={15}
          fontWeight={700}
          letterSpacing={1.2}
          fill={secondDefinition.text}
          opacity={0}
        />
        <Rect
          x={337}
          y={-188}
          radius={10}
          padding={[8, 14]}
          fill={`${secondDefinition.accent}24`}
          stroke={secondDefinition.accent}
          lineWidth={1}
        >
          <Txt
            text={'COMPOSITE'}
            fontFamily={'JetBrains Mono, monospace'}
            fontSize={13}
            fontWeight={700}
            fill={secondDefinition.accent}
          />
        </Rect>
      </Layout>,
    );
    shell.add(
      <Line
        ref={seam}
        points={[[-430, isGelLayer ? 56 : -145], [430, isGelLayer ? 56 : -145]]}
        stroke={secondDefinition.accent}
        lineWidth={2}
        end={0}
        opacity={0.7}
      />,
    );

    view.fill(
      new Gradient({
        type: 'radial',
        from: [0, 30],
        to: [0, 30],
        fromRadius: 60,
        toRadius: 980,
        stops: [
          {offset: 0, color: '#111827'},
          {offset: 0.68, color: '#070b14'},
          {offset: 1, color: '#02040a'},
        ],
      }),
    );

    view.add(
      <Layout ref={overlay} width={'100%'} height={'100%'}>
        <Txt
          ref={title}
          text={options.title}
          y={-420}
          fontFamily={'Inter, sans-serif'}
          fontSize={54}
          fontWeight={700}
          letterSpacing={2}
          fill={'#f8fafc'}
          opacity={0}
        />
        <Txt
          ref={subtitle}
          text={options.subtitle}
          y={-360}
          fontFamily={'JetBrains Mono, monospace'}
          fontSize={17}
          letterSpacing={2}
          fill={secondDefinition.accent}
          opacity={0}
        />
      </Layout>,
    );
    overlay().add(shell);

    yield* all(
      title().opacity(1, 0.45, easeOutCubic),
      chain(waitFor(0.1), subtitle().opacity(1, 0.45, easeOutCubic)),
      shell.enter(),
    );
    yield* content().opacity(1, 0.35, easeOutCubic);
    yield* waitFor(0.25);

    yield* spreadLayer({
      layer: materialLayer,
      finalWidth: layerWidth,
      finalHeight: layerHeight,
      duration: 0.9,
    });
    if (isCopperLayer) {
      materialLayer.opacity(0.5);
    }
    yield* all(
      seam().end(1, 0.5, easeOutCubic),
      layerLabel().opacity(1, 0.35, easeOutCubic),
      impact({
        overlay: overlay(),
        at: materialLayer.absolutePosition(),
        color: secondDefinition.accent,
        size: isGelLayer ? 400 : 520,
        surface: shell,
      }),
    );
    yield* all(shell.setActive(true), materialLayer.react());
    yield* waitFor(0.45);

    // A single composite object moves and resizes; the integrated material
    // remains physically attached and inherits the parent's transformation.
    yield* all(
      shell.x(-170, 0.62, easeOutCubic),
      shell.scale(0.88, 0.62, easeOutBack),
    );
    yield* all(
      shell.x(0, 0.62, easeOutCubic),
      shell.scale(1, 0.62, easeOutBack),
      shell.react(),
    );
    yield* waitFor(0.72);

    yield* all(
      shell.opacity(0, 0.48, easeOutCubic),
      shell.y(0, 0.48, easeOutCubic),
      title().opacity(0, 0.4, easeOutCubic),
      subtitle().opacity(0, 0.34, easeOutCubic),
    );
  });
}
