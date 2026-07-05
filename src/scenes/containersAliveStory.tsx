import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

const p = {
  bg: '#070a13',
  panel2: '#0f172a',
  ink: '#f8fafc',
  muted: '#94a3b8',
  dim: '#475569',
  cyan: '#38bdf8',
  violet: '#a78bfa',
  amber: '#fbbf24',
  green: '#34d399',
  rose: '#fb7185',
  blue: '#60a5fa',
};

function Chip({text, color = p.cyan}: {text: string; color?: string}) {
  return (
    <Rect layout padding={[10, 18]} radius={999} fill={'#0b1220'} stroke={color} lineWidth={3}>
      <Txt text={text} fontSize={23} fontWeight={700} fill={p.ink} />
    </Rect>
  );
}

function FlowArrow({color = p.dim}: {color?: string}) {
  return <Txt text={'→'} fontSize={30} fill={color} />;
}

export default makeScene2D(function* (view) {
  view.fill(p.bg);

  const command = createRef<Layout>();
  const question = createRef<Txt>();
  const thesis = createRef<Layout>();
  const image = createRef<Rect>();
  const imageTitle = createRef<Txt>();
  const imageLayers = createRef<Layout>();
  const registry = createRef<Rect>();
  const runtime = createRef<Rect>();
  const runtimePulse = createRef<Circle>();
  const containerA = createRef<Rect>();
  const containerB = createRef<Rect>();
  const processA = createRef<Circle>();
  const processB = createRef<Circle>();
  const kernel = createRef<Rect>();
  const namespaceFrame = createRef<Rect>();
  const cgroupFrame = createRef<Rect>();
  const formula = createRef<Layout>();
  const flow = createRef<Layout>();
  const cowTrace = createRef<Layout>();
  const finalMap = createRef<Layout>();

  view.add(
    <>
      <Rect width={'100%'} height={'100%'} fill={p.bg} />
      <Circle x={-760} y={-360} size={760} fill={'#0c1b2f'} opacity={0.38} />
      <Circle x={760} y={360} size={820} fill={'#1a1230'} opacity={0.35} />
      <Line points={[[-900, 410], [900, 410]]} stroke={'#111827'} lineWidth={2} opacity={0.8} />
      <Line points={[[-900, -410], [900, -410]]} stroke={'#111827'} lineWidth={2} opacity={0.8} />

      <Layout ref={command} layout gap={10} alignItems={'center'} y={-250} opacity={0} scale={0.94}>
        <Txt text={'docker'} fontSize={62} fontFamily={'monospace'} fill={p.muted} />
        <Rect layout padding={[8, 18]} radius={18} fill={'#211a08'} stroke={p.amber} lineWidth={4}>
          <Txt text={'run'} fontSize={62} fontFamily={'monospace'} fontWeight={900} fill={p.amber} />
        </Rect>
        <Txt text={'nginx'} fontSize={62} fontFamily={'monospace'} fill={p.ink} />
      </Layout>

      <Txt ref={question} text={'what runs?'} y={-165} opacity={0} fontSize={34} fill={p.amber} />

      <Layout ref={thesis} layout gap={24} alignItems={'center'} y={-340} opacity={0}>
        <Chip text={'image'} color={p.cyan} />
        <FlowArrow />
        <Chip text={'runtime'} color={p.amber} />
        <FlowArrow />
        <Chip text={'container process'} color={p.green} />
      </Layout>

      <Rect ref={image} x={-430} y={20} width={320} height={240} radius={28} padding={24} fill={p.panel2} stroke={p.cyan} lineWidth={5} opacity={0} scale={0.85}>
        <Layout layout direction={'column'} gap={18} alignItems={'center'}>
          <Txt ref={imageTitle} text={'nginx image'} fontSize={36} fontWeight={800} fill={p.ink} />
          <Txt text={'packaged starting point'} fontSize={22} fill={p.muted} />
          <Layout ref={imageLayers} layout direction={'column'} gap={8} opacity={0}>
            <Rect width={250} height={34} radius={10} fill={'#082f49'} stroke={p.cyan} lineWidth={2}>
              <Txt text={'app files'} fontSize={18} fill={p.ink} />
            </Rect>
            <Rect width={238} height={34} radius={10} fill={'#0b3b54'} stroke={p.cyan} lineWidth={2}>
              <Txt text={'runtime deps'} fontSize={18} fill={p.ink} />
            </Rect>
            <Rect width={226} height={34} radius={10} fill={'#0e4a61'} stroke={p.cyan} lineWidth={2}>
              <Txt text={'packages'} fontSize={18} fill={p.ink} />
            </Rect>
            <Rect width={214} height={34} radius={10} fill={'#155e75'} stroke={p.cyan} lineWidth={2}>
              <Txt text={'base fs'} fontSize={18} fill={p.ink} />
            </Rect>
          </Layout>
        </Layout>
      </Rect>

      <Rect ref={registry} x={0} y={20} width={300} height={230} radius={28} padding={24} fill={'#171226'} stroke={p.violet} lineWidth={5} opacity={0} scale={0.82}>
        <Layout layout direction={'column'} gap={16} alignItems={'center'}>
          <Txt text={'registry'} fontSize={36} fontWeight={800} fill={p.ink} />
          <Rect width={230} height={34} radius={9} fill={'#271b45'} stroke={p.dim} lineWidth={2} />
          <Rect width={230} height={34} radius={9} fill={'#271b45'} stroke={p.dim} lineWidth={2} />
          <Txt text={'stores and distributes'} fontSize={22} fill={p.muted} />
          <Txt text={'does not run'} fontSize={22} fill={p.rose} />
        </Layout>
      </Rect>

      <Rect ref={runtime} x={430} y={20} width={330} height={250} radius={32} padding={24} fill={'#1f1a0b'} stroke={p.amber} lineWidth={5} opacity={0} scale={0.82}>
        <Layout layout direction={'column'} gap={16} alignItems={'center'}>
          <Txt text={'runtime'} fontSize={38} fontWeight={900} fill={p.ink} />
          <Txt text={'prepares the process'} fontSize={23} fill={p.muted} />
          <Layout layout gap={12}>
            <Chip text={'cmd'} color={p.amber} />
            <Chip text={'env'} color={p.amber} />
            <Chip text={'user'} color={p.amber} />
          </Layout>
          <Circle ref={runtimePulse} size={34} fill={p.amber} opacity={0.35} />
        </Layout>
      </Rect>

      <Rect ref={containerA} x={210} y={20} width={370} height={310} radius={34} padding={20} fill={'#09111f'} stroke={p.green} lineWidth={5} opacity={0} scale={0.72}>
        <Layout layout direction={'column'} gap={12} alignItems={'center'}>
          <Txt text={'container A'} fontSize={30} fontWeight={800} fill={p.ink} />
          <Rect width={285} height={45} radius={12} fill={'#37260c'} stroke={p.amber} lineWidth={3}>
            <Txt text={'writable A'} fontSize={20} fill={p.ink} />
          </Rect>
          <Circle ref={processA} size={105} fill={'#082f49'} stroke={p.green} lineWidth={6}>
            <Txt text={'pid'} fontSize={26} fontWeight={800} fill={p.ink} />
          </Circle>
          <Txt text={'filesystem view'} fontSize={20} fill={p.muted} />
        </Layout>
      </Rect>

      <Rect ref={containerB} x={610} y={20} width={370} height={310} radius={34} padding={20} fill={'#09111f'} stroke={p.blue} lineWidth={5} opacity={0} scale={0.72}>
        <Layout layout direction={'column'} gap={12} alignItems={'center'}>
          <Txt text={'container B'} fontSize={30} fontWeight={800} fill={p.ink} />
          <Rect width={285} height={45} radius={12} fill={'#172554'} stroke={p.blue} lineWidth={3}>
            <Txt text={'writable B'} fontSize={20} fill={p.ink} />
          </Rect>
          <Circle ref={processB} size={105} fill={'#082f49'} stroke={p.blue} lineWidth={6}>
            <Txt text={'pid'} fontSize={26} fontWeight={800} fill={p.ink} />
          </Circle>
          <Txt text={'same image, private changes'} fontSize={20} fill={p.muted} />
        </Layout>
      </Rect>

      <Rect ref={kernel} x={0} y={365} width={1160} height={95} radius={26} fill={'#111827'} stroke={p.dim} lineWidth={4} opacity={0}>
        <Txt text={'host kernel: one shared foundation'} fontSize={34} fontWeight={700} fill={p.ink} />
      </Rect>

      <Rect ref={namespaceFrame} x={210} y={20} width={420} height={360} radius={42} stroke={p.violet} lineWidth={5} opacity={0}>
        <Txt text={'namespaces shape the view'} y={-205} fontSize={26} fill={p.violet} />
      </Rect>

      <Rect ref={cgroupFrame} x={210} y={20} width={475} height={415} radius={54} stroke={p.amber} lineWidth={5} opacity={0}>
        <Txt text={'cgroups shape the budget'} y={235} fontSize={26} fill={p.amber} />
      </Rect>

      <Layout ref={flow} layout gap={14} alignItems={'center'} y={-300} opacity={0}>
        <Chip text={'build'} color={p.cyan} />
        <FlowArrow />
        <Chip text={'push'} color={p.violet} />
        <FlowArrow />
        <Chip text={'pull'} color={p.violet} />
        <FlowArrow />
        <Chip text={'run'} color={p.amber} />
      </Layout>

      <Layout ref={cowTrace} layout direction={'column'} gap={12} alignItems={'center'} x={-430} y={285} opacity={0}>
        <Txt text={'/etc/app.conf'} fontSize={26} fontFamily={'monospace'} fill={p.ink} />
        <Txt text={'read shared original → write private copy in A'} fontSize={22} fill={p.amber} />
      </Layout>

      <Layout ref={formula} layout direction={'column'} gap={20} alignItems={'center'} y={-310} opacity={0}>
        <Txt text={'container = process + filesystem view + namespaces + cgroups'} fontSize={44} fontWeight={900} fill={p.ink} />
        <Txt text={'An image does not run. A process runs.'} fontSize={30} fill={p.amber} />
      </Layout>

      <Layout ref={finalMap} layout gap={18} alignItems={'center'} y={300} opacity={0}>
        <Chip text={'Registry'} color={p.violet} />
        <FlowArrow />
        <Chip text={'Image = layers + config'} color={p.cyan} />
        <FlowArrow />
        <Chip text={'Runtime'} color={p.amber} />
        <FlowArrow />
        <Chip text={'Container = process + writable layer + namespaces + cgroups'} color={p.green} />
      </Layout>
    </>,
  );

  // Act 1: start from the familiar command.
  yield* all(command().opacity(1, 0.7), command().scale(1, 0.7));
  yield* question().opacity(1, 0.45);
  yield* waitFor(0.35);
  yield* all(image().opacity(1, 0.7), image().scale(1, 0.7), processA().scale(1.12, 0.45));
  yield* all(containerA().opacity(1, 0.65), containerA().scale(0.9, 0.65), containerA().position([420, 20], 0.65));
  yield* all(thesis().opacity(1, 0.5), command().position([0, -380], 0.75), question().position([0, -310], 0.75));
  yield* waitFor(0.7);

  // Act 2: the vocabulary assembles without clearing the board.
  yield* all(
    image().position([-520, 10], 0.8),
    registry().opacity(1, 0.7),
    registry().scale(1, 0.7),
    runtime().opacity(1, 0.7),
    runtime().scale(1, 0.7),
    containerA().position([520, 210], 0.8),
    containerA().scale(0.7, 0.8),
    flow().opacity(1, 0.55),
  );
  yield* all(runtimePulse().scale(1.9, 0.45), runtimePulse().opacity(0.1, 0.45));
  yield* all(runtimePulse().scale(1, 0.2), runtimePulse().opacity(0.35, 0.2));
  yield* waitFor(0.75);

  // Act 3: the image opens; the same image object becomes its internals.
  imageTitle().text('image = layers + config');
  yield* all(
    registry().opacity(0.28, 0.5),
    runtime().opacity(0.28, 0.5),
    containerA().opacity(0.28, 0.5),
    flow().opacity(0.25, 0.5),
    image().position([0, 15], 0.8),
    image().scale(1.35, 0.8),
    imageLayers().opacity(1, 0.7),
  );
  yield* image().rotation(2, 0.15);
  yield* image().rotation(-2, 0.3);
  yield* image().rotation(0, 0.15);
  yield* waitFor(0.8);

  // Act 4: run prepares a filesystem view, options, and a process.
  yield* all(
    image().position([-430, 10], 0.8),
    image().scale(1.05, 0.8),
    runtime().position([0, 10], 0.8),
    runtime().opacity(1, 0.65),
    runtime().scale(1.08, 0.65),
    containerA().position([455, 10], 0.8),
    containerA().opacity(1, 0.65),
    containerA().scale(0.98, 0.65),
  );
  yield* all(runtimePulse().scale(2.2, 0.5), runtimePulse().opacity(0.08, 0.5));
  yield* processA().scale(1.18, 0.2);
  yield* processA().scale(1, 0.2);
  yield* waitFor(0.65);

  // Act 5: one image branches into two containers; copy-on-write stays visible.
  yield* all(
    command().opacity(0, 0.4),
    question().opacity(0, 0.4),
    thesis().opacity(0, 0.4),
    runtime().opacity(0.25, 0.45),
    image().position([-520, -50], 0.8),
    image().scale(0.95, 0.8),
    containerA().position([120, -20], 0.8),
    containerA().scale(0.95, 0.8),
    containerB().opacity(1, 0.65),
    containerB().scale(0.95, 0.8),
    containerB().position([540, -20], 0.8),
    cowTrace().opacity(1, 0.6),
  );
  yield* all(processA().scale(1.12, 0.25), processB().scale(1.12, 0.25));
  yield* all(processA().scale(1, 0.25), processB().scale(1, 0.25));
  yield* waitFor(0.9);

  // Act 6: the host model appears under the same running processes.
  yield* all(
    kernel().opacity(1, 0.6),
    image().opacity(0.3, 0.5),
    runtime().opacity(0.18, 0.5),
    registry().opacity(0.18, 0.5),
    cowTrace().opacity(0.35, 0.5),
    containerA().position([210, -10], 0.8),
    containerB().position([610, -10], 0.8),
    namespaceFrame().opacity(1, 0.65),
  );
  yield* all(cgroupFrame().opacity(1, 0.65), cgroupFrame().scale(1.03, 0.35));
  yield* cgroupFrame().scale(1, 0.25);
  yield* waitFor(0.85);

  // Act 7: reassemble the final memory from the parts already on screen.
  yield* all(
    image().opacity(1, 0.5),
    image().position([-500, -55], 0.75),
    registry().opacity(1, 0.5),
    registry().position([-760, -55], 0.75),
    runtime().opacity(1, 0.5),
    runtime().position([-180, -55], 0.75),
    containerA().position([320, -55], 0.75),
    containerA().scale(0.78, 0.75),
    containerB().opacity(0.2, 0.5),
    namespaceFrame().opacity(0.55, 0.5),
    cgroupFrame().opacity(0.55, 0.5),
    kernel().position([0, 410], 0.75),
    formula().opacity(1, 0.75),
    finalMap().opacity(1, 0.75),
  );
  yield* all(processA().scale(1.16, 0.35), namespaceFrame().scale(1.03, 0.35), cgroupFrame().scale(1.04, 0.35));
  yield* all(processA().scale(1, 0.35), namespaceFrame().scale(1, 0.35), cgroupFrame().scale(1, 0.35));
  yield* waitFor(1.2);
});
