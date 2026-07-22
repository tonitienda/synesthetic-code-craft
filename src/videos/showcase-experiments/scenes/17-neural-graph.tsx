import {Circle, Gradient, Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {CurvedLine} from '../../../components';
import {materials} from '../materials';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const pulse = createRef<Circle>();
  const progress = createSignal(0);
  const inputPositions: Array<[number, number]> = [[-520, -190], [-520, 0], [-520, 190]];
  const hiddenPositions: Array<[number, number]> = [[0, -210], [0, -70], [0, 70], [0, 210]];
  const outputPosition: [number, number] = [520, 0];
  const nodes: Circle[] = [];
  const connections: CurvedLine[] = [];

  view.fill(new Gradient({
    type: 'radial',
    from: [0, 20],
    to: [0, 20],
    fromRadius: 40,
    toRadius: 1000,
    stops: [{offset: 0, color: '#111827'}, {offset: 1, color: '#02040a'}],
  }));
  view.add(
    <Layout width={'100%'} height={'100%'}>
      <Txt ref={title} text={'NEURAL MATERIAL'} y={-430} fontFamily={'Inter, sans-serif'} fontSize={58} fontWeight={700} fill={'#f8fafc'} opacity={0} />
      <Txt ref={subtitle} text={'GEL PERCEPTRONS · COPPER CONNECTIONS'} y={-368} fontFamily={'JetBrains Mono, monospace'} fontSize={17} letterSpacing={2} fill={materials.gel.accent} opacity={0} />
    </Layout>,
  );

  for (const from of inputPositions) {
    for (const to of hiddenPositions) {
      const connection = new CurvedLine({from, to, curve: 0.42, stroke: '#fdba744c', lineWidth: 3, end: 0});
      connections.push(connection);
      view.add(connection);
    }
  }
  for (const from of hiddenPositions) {
    const connection = new CurvedLine({from, to: outputPosition, curve: 0.42, stroke: '#fdba7466', lineWidth: 4, end: 0});
    connections.push(connection);
    view.add(connection);
  }

  for (const [index, position] of [...inputPositions, ...hiddenPositions, outputPosition].entries()) {
    const node = new Circle({
      position,
      size: index < 3 ? 86 : index < 7 ? 102 : 126,
      fill: index < 3 ? materials.glass.fill : materials.gel.fill,
      stroke: index < 3 ? materials.glass.accent : materials.gel.accent,
      lineWidth: 3,
      shadowColor: index < 3 ? materials.glass.shadow : materials.gel.shadow,
      shadowBlur: 28,
      scale: 0,
    });
    nodes.push(node);
    view.add(node);
  }

  const signalPath = connections[5];
  view.add(
    <Circle
      ref={pulse}
      size={24}
      fill={'#ffffff'}
      shadowColor={materials.gel.accent}
      shadowBlur={26}
      opacity={0}
      position={() => signalPath.getPointAtPercentage(progress()).position}
    />,
  );

  yield* all(title().opacity(1, 0.45), subtitle().opacity(1, 0.5));
  yield* all(...nodes.map((node, index) => chain(waitFor(index * 0.035), node.scale(1, 0.5, easeOutBack))));
  yield* all(...connections.map((line, index) => chain(waitFor(index * 0.02), line.end(1, 0.62, easeOutCubic))));

  yield* pulse().opacity(1, 0.15);
  yield* progress(1, 0.9, easeInOutCubic);
  yield* all(nodes[4].scale(1.08, 0.18, easeOutCubic).to(1, 0.3, easeOutBack), nodes[4].shadowBlur(48, 0.18).to(28, 0.35));
  pulse().opacity(0);

  yield* all(...connections.slice(-4).map(line => line.stroke(materials.gel.accent, 0.35)));
  yield* all(nodes[7].scale(1.1, 0.2, easeOutCubic).to(1, 0.35, easeOutBack), nodes[7].shadowBlur(56, 0.2).to(28, 0.4));
  yield* waitFor(0.45);
  yield* all(...connections.map(line => line.stroke('#f472b6', 0.38)));
  yield* all(...nodes.slice(0, 7).map((node, index) => chain(waitFor(index * 0.025), node.scale(1.045, 0.16).to(1, 0.25))));
  yield* waitFor(0.65);

  yield* all(
    title().opacity(0, 0.4),
    subtitle().opacity(0, 0.35),
    ...nodes.map(node => node.opacity(0, 0.42)),
    ...connections.map(line => line.opacity(0, 0.38)),
  );
});
