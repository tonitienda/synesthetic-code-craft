import {Circle, Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

const c = {
  bg: '#070a13',
  panel: '#0f172a',
  ink: '#f8fafc',
  muted: '#94a3b8',
  dim: '#334155',
  cyan: '#38bdf8',
  violet: '#a78bfa',
  amber: '#fbbf24',
  green: '#34d399',
  blue: '#60a5fa',
  rose: '#fb7185',
};

function Pill({label, color = c.dim}: {label: string; color?: string}) {
  return (
    <Rect layout padding={[8, 16]} radius={999} fill={'#0b1220'} stroke={color} lineWidth={3}>
      <Txt text={label} fontSize={22} fontWeight={700} fill={c.ink} />
    </Rect>
  );
}

export default makeScene2D(function* (view) {
  view.fill(c.bg);

  const act = createRef<Txt>();
  const cue = createRef<Txt>();
  const timing = createRef<Txt>();
  const command = createRef<Txt>();
  const formula = createRef<Txt>();

  const image = createRef<Rect>();
  const registry = createRef<Rect>();
  const runtime = createRef<Rect>();
  const containerA = createRef<Rect>();
  const containerB = createRef<Rect>();
  const process = createRef<Circle>();
  const processB = createRef<Circle>();
  const layers = createRef<Layout>();
  const config = createRef<Rect>();
  const writableA = createRef<Rect>();
  const writableB = createRef<Rect>();
  const fileShared = createRef<Rect>();
  const fileA = createRef<Rect>();
  const kernel = createRef<Rect>();
  const namespaceFrame = createRef<Rect>();
  const cgroupFrame = createRef<Rect>();
  const pipeline = createRef<Layout>();
  const finalMap = createRef<Layout>();
  const ociNote = createRef<Layout>();

  view.add(
    <>
      <Rect width={'100%'} height={'100%'} fill={c.bg} />
      <Circle x={-760} y={-390} size={760} fill={'#0c1b2f'} opacity={0.42} />
      <Circle x={780} y={380} size={860} fill={'#1a1230'} opacity={0.34} />

      <Layout layout direction={'column'} gap={8} x={-690} y={-430} alignItems={'start'}>
        <Txt ref={act} text={'Act 1'} fontSize={28} fontWeight={800} fill={c.ink} opacity={0} />
        <Txt ref={cue} text={'Moment: 0.0s'} fontSize={21} fill={c.amber} opacity={0} />
      </Layout>
      <Txt ref={timing} text={'timeline-paced containers:alive'} x={640} y={-430} fontSize={20} fill={c.muted} opacity={0.75} />

      <Txt ref={command} text={'docker run nginx'} y={-285} fontFamily={'monospace'} fontSize={68} fill={c.ink} opacity={0} />
      <Txt ref={formula} text={'container = process + filesystem view + namespaces + cgroups'} y={-320} fontSize={44} fontWeight={900} fill={c.ink} opacity={0} />

      <Layout ref={pipeline} layout gap={16} y={-250} opacity={0} alignItems={'center'}>
        <Pill label={'build'} color={c.cyan} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'image'} color={c.cyan} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'push'} color={c.violet} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'registry'} color={c.violet} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'pull'} color={c.violet} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'run'} color={c.amber} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'container'} color={c.green} />
      </Layout>

      <Layout ref={ociNote} layout direction={'column'} gap={6} x={520} y={-165} alignItems={'start'} opacity={0}>
        <Txt text={'Docker interface'} fontSize={24} fontWeight={800} fill={c.violet} />
        <Txt text={'model maps broadly to OCI-style images and runtimes'} fontSize={19} fill={c.muted} />
      </Layout>

      <Rect ref={image} x={-420} y={20} width={300} height={190} radius={30} fill={c.panel} stroke={c.cyan} lineWidth={5} opacity={0}>
        <Layout layout direction={'column'} gap={8} alignItems={'center'}>
          <Txt text={'image'} fontSize={38} fontWeight={900} fill={c.ink} />
          <Txt text={'layers + config'} fontSize={22} fill={c.muted} />
        </Layout>
      </Rect>

      <Rect ref={registry} x={-60} y={20} width={290} height={190} radius={30} fill={'#171226'} stroke={c.violet} lineWidth={5} opacity={0}>
        <Layout layout direction={'column'} gap={8} alignItems={'center'}>
          <Txt text={'registry'} fontSize={36} fontWeight={900} fill={c.ink} />
          <Txt text={'stores images'} fontSize={22} fill={c.muted} />
          <Txt text={'does not run'} fontSize={20} fill={c.rose} />
        </Layout>
      </Rect>

      <Rect ref={runtime} x={300} y={20} width={300} height={190} radius={30} fill={'#1f1a0b'} stroke={c.amber} lineWidth={5} opacity={0}>
        <Layout layout direction={'column'} gap={8} alignItems={'center'}>
          <Txt text={'runtime'} fontSize={36} fontWeight={900} fill={c.ink} />
          <Txt text={'prepares'} fontSize={22} fill={c.muted} />
          <Layout layout gap={8}>
            <Pill label={'cmd'} color={c.amber} />
            <Pill label={'env'} color={c.amber} />
            <Pill label={'user'} color={c.amber} />
          </Layout>
        </Layout>
      </Rect>

      <Rect ref={containerA} x={420} y={80} width={335} height={300} radius={34} fill={'#09111f'} stroke={c.green} lineWidth={5} opacity={0}>
        <Txt text={'Container A'} y={-115} fontSize={30} fontWeight={800} fill={c.ink} />
      </Rect>
      <Rect ref={containerB} x={730} y={80} width={335} height={300} radius={34} fill={'#09111f'} stroke={c.blue} lineWidth={5} opacity={0}>
        <Txt text={'Container B'} y={-115} fontSize={30} fontWeight={800} fill={c.ink} />
      </Rect>
      <Circle ref={process} x={420} y={65} size={96} fill={'#082f49'} stroke={c.green} lineWidth={6} opacity={0}>
        <Txt text={'pid'} fontSize={25} fontWeight={800} fill={c.ink} />
      </Circle>
      <Circle ref={processB} x={730} y={65} size={96} fill={'#082f49'} stroke={c.blue} lineWidth={6} opacity={0}>
        <Txt text={'pid'} fontSize={25} fontWeight={800} fill={c.ink} />
      </Circle>

      <Layout ref={layers} layout direction={'column'} gap={8} x={-420} y={260} opacity={0}>
        <Rect width={360} height={34} radius={10} fill={'#082f49'} stroke={c.cyan} lineWidth={2}><Txt text={'application files'} fontSize={18} fill={c.ink} /></Rect>
        <Rect width={340} height={34} radius={10} fill={'#0b3b54'} stroke={c.cyan} lineWidth={2}><Txt text={'runtime dependencies'} fontSize={18} fill={c.ink} /></Rect>
        <Rect width={320} height={34} radius={10} fill={'#0e4a61'} stroke={c.cyan} lineWidth={2}><Txt text={'packages'} fontSize={18} fill={c.ink} /></Rect>
        <Rect width={300} height={34} radius={10} fill={'#155e75'} stroke={c.cyan} lineWidth={2}><Txt text={'base filesystem'} fontSize={18} fill={c.ink} /></Rect>
      </Layout>
      <Rect ref={config} x={-40} y={260} width={230} height={120} radius={22} fill={'#111827'} stroke={c.cyan} lineWidth={3} opacity={0}>
        <Txt text={'config / metadata'} fontSize={24} fill={c.ink} />
      </Rect>

      <Rect ref={writableA} x={420} y={-35} width={240} height={44} radius={14} fill={'#37260c'} stroke={c.amber} lineWidth={3} opacity={0}>
        <Txt text={'Writable A'} fontSize={20} fill={c.ink} />
      </Rect>
      <Rect ref={writableB} x={730} y={-35} width={240} height={44} radius={14} fill={'#172554'} stroke={c.blue} lineWidth={3} opacity={0}>
        <Txt text={'Writable B'} fontSize={20} fill={c.ink} />
      </Rect>
      <Rect ref={fileShared} x={-420} y={360} width={230} height={48} radius={14} fill={'#111827'} stroke={c.cyan} lineWidth={3} opacity={0}>
        <Txt text={'/etc/app.conf'} fontSize={22} fontFamily={'monospace'} fill={c.ink} />
      </Rect>
      <Rect ref={fileA} x={420} y={160} width={230} height={48} radius={14} fill={'#37260c'} stroke={c.amber} lineWidth={3} opacity={0}>
        <Txt text={'modified copy'} fontSize={21} fill={c.ink} />
      </Rect>

      <Rect ref={kernel} y={382} width={1220} height={96} radius={26} fill={'#111827'} stroke={c.dim} lineWidth={4} opacity={0}>
        <Txt text={'host kernel'} fontSize={34} fontWeight={800} fill={c.ink} />
      </Rect>
      <Rect ref={namespaceFrame} x={420} y={80} width={410} height={350} radius={44} stroke={c.violet} lineWidth={5} opacity={0}>
        <Txt text={'namespaces: view'} y={-205} fontSize={26} fill={c.violet} />
      </Rect>
      <Rect ref={cgroupFrame} x={420} y={80} width={460} height={405} radius={54} stroke={c.amber} lineWidth={5} opacity={0}>
        <Txt text={'cgroups: budget'} y={235} fontSize={26} fill={c.amber} />
      </Rect>

      <Layout ref={finalMap} layout gap={18} y={300} alignItems={'center'} opacity={0}>
        <Pill label={'Registry'} color={c.violet} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'Image = layers + config'} color={c.cyan} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'Runtime'} color={c.amber} />
        <Txt text={'→'} fontSize={30} fill={c.dim} />
        <Pill label={'Container = bounded running process'} color={c.green} />
      </Layout>
    </>,
  );

  let clock = 0;
  function* waitUntil(target: number) {
    if (target > clock) {
      yield* waitFor(target - clock);
      clock = target;
    }
  }
  function setCue(actLabel: string, momentLabel: string, absolute: number) {
    act().text(actLabel);
    cue().text(momentLabel);
    timing().text(`${Math.round(absolute)}s / 610s`);
  }
  function* run(duration: number, ...tasks: any[]) {
    yield* all(...tasks);
    clock += duration;
  }

  // Act 1 — The familiar command, corrected. Scene budget: 55s.
  setCue('Act 1', 'Moment: 0.0s — Command doorway', 0);
  yield* run(0.8, act().opacity(1, 0.8), cue().opacity(1, 0.8), command().opacity(1, 0.8));
  yield* waitUntil(11);
  setCue('Act 1', 'Moment: 11.0s — What is actually running?', 11);
  yield* run(0.8, command().fill(c.muted, 0.8), runtime().opacity(1, 0.8), runtime().scale(1.04, 0.8));
  yield* waitUntil(20);
  setCue('Act 1', 'Moment: 20.0s — Image does not equal process', 20);
  yield* run(0.9, command().opacity(0.25, 0.9), image().opacity(1, 0.9), process().opacity(1, 0.9), process().position([300, 20], 0.9));
  yield* waitUntil(42);
  setCue('Act 1', 'Moment: 42.0s — Thesis chain', 42);
  yield* run(0.9, pipeline().opacity(1, 0.9), image().position([-520, 25], 0.9), runtime().position([-60, 25], 0.9), process().position([420, 65], 0.9), containerA().opacity(1, 0.9));
  yield* waitUntil(55);

  // Act 2 — Four nouns, four roles. Act budget: 75s.
  setCue('Act 2', 'Scene 2.1 / Moment: 0.0s — Vocabulary map', 55);
  yield* run(
    0.7,
    command().opacity(0, 0.7),
    registry().opacity(1, 0.7),
    registry().position([-60, 20], 0.7),
    image().opacity(1, 0.7),
    image().position([-420, 20], 0.7),
    image().scale(1, 0.7),
    runtime().opacity(1, 0.7),
    runtime().position([300, 20], 0.7),
    runtime().scale(1, 0.7),
    containerA().opacity(1, 0.7),
    containerA().position([420, 80], 0.7),
    process().position([420, 65], 0.7),
  );
  yield* waitUntil(73);
  setCue('Act 2', 'Scene 2.1 / Moment: 18.0s — Image definition', 73);
  yield* run(0.8, image().scale(1.12, 0.8), layers().opacity(1, 0.8), config().opacity(1, 0.8));
  yield* waitUntil(89);
  setCue('Act 2', 'Scene 2.1 / Moment: 34.0s — Registry definition', 89);
  yield* run(0.8, registry().scale(1.12, 0.8), image().position([-260, 20], 0.8), registry().position([130, 20], 0.8));
  yield* waitUntil(100);
  setCue('Act 2', 'Scene 2.2 / Moment: 0.0s — Workflow verbs', 100);
  yield* run(0.8, pipeline().opacity(1, 0.8), pipeline().position([0, -270], 0.8), registry().scale(1, 0.8));
  yield* waitUntil(128);
  setCue('Act 2', 'Scene 2.2 / Moment: 28.0s — Docker doorway, OCI note', 128);
  yield* run(0.7, cue().fill(c.violet, 0.7), ociNote().opacity(1, 0.7), ociNote().position([520, -150], 0.7));
  yield* waitUntil(130);

  // Act 3 — Open the image. Scene budget: 80s.
  setCue('Act 3', 'Scene 3.1 / Moment: 0.0s — Image is not a blob', 130);
  yield* run(0.9, registry().opacity(0.25, 0.9), runtime().opacity(0.25, 0.9), containerA().opacity(0.25, 0.9), image().position([0, -40], 0.9), image().scale(1.2, 0.9), layers().position([0, 230], 0.9), config().position([410, 230], 0.9), layers().opacity(1, 0.9), config().opacity(1, 0.9), ociNote().opacity(0, 0.9), cue().fill(c.amber, 0.9));
  yield* waitUntil(152);
  setCue('Act 3', 'Scene 3.1 / Moment: 22.0s — Ordered filesystem changes', 152);
  yield* run(1.1, layers().scale(1.14, 1.1), image().opacity(0.45, 1.1));
  yield* waitUntil(188);
  setCue('Act 3', 'Scene 3.1 / Moment: 58.0s — Shared and read-only', 188);
  yield* run(0.9, containerA().opacity(0.38, 0.9), containerB().opacity(0.28, 0.9), layers().position([-160, 245], 0.9));
  yield* waitUntil(210);

  // Act 4 — What run prepares. Act budget: 95s.
  setCue('Act 4', 'Scene 4.1 / Moment: 0.0s — Runtime inputs', 210);
  yield* run(0.9, runtime().opacity(1, 0.9), runtime().position([0, -30], 0.9), image().position([-430, -30], 0.9), config().position([-80, 220], 0.9));
  yield* waitUntil(234);
  setCue('Act 4', 'Scene 4.1 / Moment: 24.0s — Filesystem view', 234);
  yield* run(0.9, layers().position([0, 235], 0.9), layers().scale(0.95, 0.9));
  yield* waitUntil(254);
  setCue('Act 4', 'Scene 4.1 / Moment: 44.0s — Private writable layer', 254);
  yield* run(0.8, writableA().opacity(1, 0.8), writableA().position([420, -35], 0.8));
  yield* waitUntil(270);
  setCue('Act 4', 'Scene 4.2 / Moment: 0.0s — Startup configuration', 270);
  yield* run(0.8, runtime().scale(1.08, 0.8), process().position([420, 65], 0.8), process().opacity(1, 0.8), containerA().opacity(1, 0.8));
  yield* waitUntil(292);
  setCue('Act 4', 'Scene 4.2 / Moment: 22.0s — Process starts inside boundaries', 292);
  yield* run(0.8, namespaceFrame().opacity(1, 0.8), cgroupFrame().opacity(1, 0.8), process().scale(1.18, 0.4));
  yield* run(0.4, process().scale(1, 0.4));
  yield* waitUntil(305);

  // Act 5 — Same image, two containers. Act budget: 125s.
  setCue('Act 5', 'Scene 5.1 / Moment: 0.0s — Two runs from one image', 305);
  yield* run(1.0, containerA().position([250, 55], 1), process().position([250, 55], 1), writableA().position([250, -70], 1), containerB().opacity(1, 1), processB().opacity(1, 1), containerB().position([610, 55], 1), processB().position([610, 55], 1), layers().position([0, 315], 1));
  yield* waitUntil(329);
  setCue('Act 5', 'Scene 5.1 / Moment: 24.0s — Shared part stays shared', 329);
  yield* run(0.8, layers().scale(1.04, 0.8), fileShared().opacity(1, 0.8));
  yield* waitUntil(353);
  setCue('Act 5', 'Scene 5.1 / Moment: 48.0s — Private writable layers', 353);
  yield* run(0.8, writableA().opacity(1, 0.8), writableB().opacity(1, 0.8), writableB().position([610, -70], 0.8));
  yield* waitUntil(370);
  setCue('Act 5', 'Scene 5.2 / Moment: 0.0s — Read from shared original', 370);
  yield* run(0.8, fileShared().position([0, 345], 0.8), fileShared().scale(1.08, 0.8));
  yield* waitUntil(392);
  setCue('Act 5', 'Scene 5.2 / Moment: 22.0s — Write records a private change', 392);
  yield* run(0.9, fileA().opacity(1, 0.9), fileA().position([250, 155], 0.9));
  yield* waitUntil(420);
  setCue('Act 5', 'Scene 5.2 / Moment: 50.0s — Different views, independent containers', 420);
  yield* run(0.8, fileA().scale(1.1, 0.4), fileShared().scale(1, 0.8), processB().scale(1.1, 0.4));
  yield* run(0.4, fileA().scale(1, 0.4), processB().scale(1, 0.4));
  yield* waitUntil(430);

  // Act 6 — The host sees a process with boundaries. Act budget: 100s.
  setCue('Act 6', 'Scene 6.1 / Moment: 0.0s — Host kernel foundation', 430);
  yield* run(
    0.9,
    kernel().opacity(1, 0.9),
    image().opacity(0.18, 0.9),
    registry().opacity(0.18, 0.9),
    runtime().opacity(0.18, 0.9),
    containerB().opacity(0, 0.9),
    processB().opacity(0, 0.9),
    writableB().opacity(0, 0.9),
    containerA().position([420, 80], 0.9),
    process().position([420, 65], 0.9),
    writableA().position([420, -35], 0.9),
    fileA().opacity(0, 0.9),
    namespaceFrame().position([420, 80], 0.9),
    cgroupFrame().position([420, 80], 0.9),
  );
  yield* waitUntil(458);
  setCue('Act 6', 'Scene 6.1 / Moment: 28.0s — Not just a casual process', 458);
  yield* run(0.9, namespaceFrame().opacity(1, 0.9), cgroupFrame().opacity(1, 0.9), containerB().opacity(0.08, 0.9));
  yield* waitUntil(475);
  setCue('Act 6', 'Scene 6.2 / Moment: 0.0s — Namespaces shape the view', 475);
  yield* run(0.9, namespaceFrame().scale(1.06, 0.9), cue().fill(c.violet, 0.9));
  yield* waitUntil(503);
  setCue('Act 6', 'Scene 6.2 / Moment: 28.0s — Cgroups shape the budget', 503);
  yield* run(0.9, namespaceFrame().scale(1, 0.9), cgroupFrame().scale(1.08, 0.9), cue().fill(c.amber, 0.9));
  yield* waitUntil(525);
  setCue('Act 6', 'Scene 6.2 / Moment: 50.0s — View plus budget', 525);
  yield* run(0.9, cgroupFrame().scale(1, 0.9), namespaceFrame().opacity(0.8, 0.9), cgroupFrame().opacity(0.8, 0.9));
  yield* waitUntil(530);

  // Act 7 — Reassemble the model. Act budget: 80s.
  setCue('Act 7', 'Scene 7.1 / Moment: 0.0s — Workflow returns with sharper words', 530);
  yield* run(0.9, pipeline().opacity(1, 0.9), pipeline().position([0, -270], 0.9), formula().opacity(0, 0.9));
  yield* waitUntil(555);
  setCue('Act 7', 'Scene 7.2 / Moment: 0.0s — Final formula', 555);
  yield* run(0.9, formula().opacity(1, 0.9), finalMap().opacity(0, 0.9), image().opacity(0.25, 0.9), runtime().opacity(0.25, 0.9));
  yield* waitUntil(581);
  setCue('Act 7', 'Scene 7.2 / Moment: 26.0s — Optional commit loop', 581);
  yield* run(0.4, writableA().scale(1.08, 0.4), image().scale(1.08, 0.4));
  yield* run(0.4, writableA().scale(1, 0.4), image().scale(1, 0.4));
  yield* waitUntil(599);
  setCue('Act 7', 'Scene 7.2 / Moment: 44.0s — Stable final diagram', 599);
  yield* run(0.9, finalMap().opacity(1, 0.9), pipeline().opacity(0.22, 0.9), formula().position([0, -340], 0.9));
  yield* waitUntil(610);
  yield* run(1.2, finalMap().opacity(0, 1.2), formula().opacity(0, 1.2), act().opacity(0, 1.2), cue().opacity(0, 1.2), timing().opacity(0, 1.2));
});
