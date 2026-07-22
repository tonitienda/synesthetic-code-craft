import {
  Gradient,
  Layout,
  Rect,
  Txt,
  makeScene2D,
} from '@motion-canvas/2d';
import {
  all,
  cancel,
  chain,
  createRef,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {breathe, impact, spreadLayer} from '../../../choreography';
import {CurvedLine} from '../../../components';
import {MaterialPanel, materials} from '../materials';

export default makeScene2D(function* (view) {
  const overlay = createRef<Layout>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const process = createRef<Rect>();
  const inputTrace = createRef<CurvedLine>();
  const configTrace = createRef<CurvedLine>();

  const foundation = new MaterialPanel({
    material: 'concrete',
    bare: true,
    width: 1220,
    height: 135,
    y: 350,
  });
  const boundary = new MaterialPanel({
    material: 'frosted',
    bare: true,
    width: 1080,
    height: 585,
    y: 35,
  });
  const terminalHeader = new MaterialPanel({
    material: 'acrylic',
    bare: true,
    width: 1020,
    height: 92,
    y: -216,
    radius: 18,
    shadowBlur: 12,
  });
  const runtimeLayer = new MaterialPanel({
    material: 'gel',
    bare: true,
    width: 980,
    height: 165,
    y: 165,
    radius: 30,
    shadowBlur: 28,
  });
  const configInsert = new MaterialPanel({
    material: 'eink',
    bare: true,
    width: 280,
    height: 135,
    x: 315,
    y: -40,
    radius: 9,
    shadowBlur: 12,
  });
  const annotationTag = new MaterialPanel({
    material: 'paper',
    bare: true,
    width: 230,
    height: 118,
    x: -455,
    y: 32,
    rotation: -2,
    radius: 10,
    shadowBlur: 18,
  });

  terminalHeader.add(
    <Layout layout direction={'row'} alignItems={'center'} gap={18}>
      <Txt
        text={'$ docker run nginx'}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={25}
        fontWeight={700}
        fill={materials.acrylic.text}
      />
      <Txt
        text={'TOOL / SMOKED ACRYLIC'}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={13}
        letterSpacing={1.4}
        fill={materials.acrylic.accent}
      />
    </Layout>,
  );
  runtimeLayer.add(
    <Txt
      text={'RUNTIME LAYER / LUMINOUS GEL'}
      x={-270}
      y={50}
      fontFamily={'JetBrains Mono, monospace'}
      fontSize={14}
      fontWeight={700}
      letterSpacing={1.2}
      fill={materials.gel.text}
    />,
  );
  configInsert.add(
    <Layout layout direction={'column'} gap={8}>
      <Txt
        text={'CONFIG'}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={18}
        fontWeight={800}
        fill={materials.eink.text}
      />
      <Txt
        text={'declared: true'}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={15}
        fill={materials.eink.muted}
      />
    </Layout>,
  );
  annotationTag.add(
    <Layout layout direction={'column'} gap={7}>
      <Txt
        text={'BOUNDARY'}
        fontFamily={'Inter, sans-serif'}
        fontSize={18}
        fontWeight={800}
        fill={materials.paper.text}
      />
      <Txt
        text={'isolates the process'}
        fontFamily={'Inter, sans-serif'}
        fontSize={14}
        fill={materials.paper.muted}
      />
    </Layout>,
  );

  boundary.add(terminalHeader);
  boundary.add(runtimeLayer);
  boundary.add(
    <CurvedLine
      ref={inputTrace}
      from={[-360, -165]}
      to={[145, 92]}
      curve={0.44}
      arc={-38}
      stroke={materials.copper.accent}
      lineWidth={6}
      endArrow
      arrowSize={15}
      end={0}
      opacity={0}
      shadowColor={'#f9731666'}
      shadowBlur={16}
    />,
  );
  boundary.add(
    <CurvedLine
      ref={configTrace}
      from={[315, 30]}
      to={[245, 122]}
      axis={'vertical'}
      curve={0.45}
      arc={-24}
      stroke={materials.copper.accent}
      lineWidth={4}
      endArrow
      arrowSize={12}
      end={0}
      opacity={0}
    />,
  );
  boundary.add(configInsert);
  boundary.add(annotationTag);
  boundary.add(
    <Rect
      ref={process}
      width={240}
      height={92}
      x={145}
      y={160}
      radius={36}
      fill={'#052e2bcc'}
      stroke={materials.gel.accent}
      lineWidth={3}
      shadowColor={materials.gel.accent}
      shadowBlur={24}
      opacity={0}
    >
      <Layout layout direction={'column'} gap={5}>
        <Txt
          text={'PID 1'}
          fontFamily={'JetBrains Mono, monospace'}
          fontSize={23}
          fontWeight={800}
          fill={materials.gel.text}
        />
        <Txt
          text={'LIVE PROCESS'}
          fontFamily={'JetBrains Mono, monospace'}
          fontSize={12}
          letterSpacing={1.4}
          fill={materials.gel.muted}
        />
      </Layout>
    </Rect>,
  );
  boundary.add(
    <Txt
      text={'FROSTED GLASS / ISOLATION BOUNDARY'}
      x={-260}
      y={-140}
      fontFamily={'JetBrains Mono, monospace'}
      fontSize={14}
      fontWeight={700}
      letterSpacing={1.3}
      fill={materials.frosted.text}
    />,
  );
  foundation.add(
    <Layout layout direction={'row'} alignItems={'center'} gap={20}>
      <Txt
        text={'HOST / KERNEL'}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={20}
        fontWeight={800}
        letterSpacing={1.3}
        fill={materials.concrete.text}
      />
      <Txt
        text={'CONCRETE FOUNDATION'}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={13}
        fill={materials.concrete.muted}
      />
    </Layout>,
  );

  view.fill(
    new Gradient({
      type: 'radial',
      from: [0, 30],
      to: [0, 30],
      fromRadius: 60,
      toRadius: 1050,
      stops: [
        {offset: 0, color: '#111827'},
        {offset: 0.65, color: '#070b14'},
        {offset: 1, color: '#02040a'},
      ],
    }),
  );
  view.add(
    <Layout ref={overlay} width={'100%'} height={'100%'}>
      <Txt
        ref={title}
        text={'ONE INTEGRATED MATERIAL SYSTEM'}
        y={-445}
        fontFamily={'Inter, sans-serif'}
        fontSize={54}
        fontWeight={700}
        letterSpacing={2.2}
        fill={'#f8fafc'}
        opacity={0}
      />
      <Txt
        ref={subtitle}
        text={'ONE OBJECT · EACH MATERIAL HAS A JOB'}
        y={-385}
        fontFamily={'JetBrains Mono, monospace'}
        fontSize={17}
        letterSpacing={2.2}
        fill={'#94a3b8'}
        opacity={0}
      />
    </Layout>,
  );
  overlay().add(foundation);
  overlay().add(boundary);

  foundation.opacity(0);
  boundary.opacity(0);
  terminalHeader.opacity(0);
  runtimeLayer.opacity(0);
  configInsert.opacity(0);
  annotationTag.opacity(0);

  yield* all(
    title().opacity(1, 0.48, easeOutCubic),
    chain(waitFor(0.12), subtitle().opacity(1, 0.48, easeOutCubic)),
    chain(waitFor(0.1), foundation.enter()),
  );

  boundary.scale([0.86, 0.08]);
  yield* all(
    boundary.opacity(1, 0.25, easeOutCubic),
    boundary.scale.x(1, 0.55, easeOutCubic),
    boundary.scale.y(1, 0.72, easeOutBack),
    impact({
      overlay: overlay(),
      at: foundation.absolutePosition(),
      color: materials.frosted.accent,
      size: 520,
      surface: foundation,
    }),
  );

  yield* spreadLayer({
    layer: terminalHeader,
    finalWidth: 1020,
    finalHeight: 92,
    duration: 0.65,
  });
  yield* all(configInsert.enter(), annotationTag.enter());
  yield* waitFor(0.2);

  yield* spreadLayer({
    layer: runtimeLayer,
    finalWidth: 980,
    finalHeight: 165,
    duration: 0.78,
  });
  process().scale(0.35);
  yield* all(
    process().opacity(1, 0.3, easeOutCubic),
    process().scale(1, 0.55, easeOutBack),
    impact({
      overlay: overlay(),
      at: process().absolutePosition(),
      color: materials.gel.accent,
      size: 240,
      surface: runtimeLayer,
    }),
  );
  const processBreath = yield breathe(process(), {
    from: '#99f6e4',
    to: '#2dd4bf',
    period: 0.75,
  });

  yield* all(
    inputTrace().opacity(1, 0.15, easeOutCubic),
    inputTrace().end(1, 0.72, easeOutCubic),
    chain(
      waitFor(0.18),
      all(
        configTrace().opacity(1, 0.15, easeOutCubic),
        configTrace().end(1, 0.55, easeOutCubic),
      ),
    ),
  );
  yield* all(boundary.react(), runtimeLayer.react(), foundation.react());
  yield* waitFor(0.65);

  // Everything above the foundation now moves as one assembled component.
  yield* all(
    boundary.x(-95, 0.48, easeOutCubic),
    boundary.scale(0.96, 0.48, easeOutBack),
  );
  yield* all(
    boundary.x(0, 0.5, easeOutCubic),
    boundary.scale(1, 0.5, easeOutBack),
  );
  yield* waitFor(0.8);

  cancel(processBreath);
  yield* process().stroke(materials.gel.accent, 0.2);
  yield* all(
    foundation.opacity(0, 0.55, easeOutCubic),
    boundary.opacity(0, 0.5, easeOutCubic),
    boundary.y(10, 0.5, easeOutCubic),
    title().opacity(0, 0.42, easeOutCubic),
    subtitle().opacity(0, 0.35, easeOutCubic),
  );
});
