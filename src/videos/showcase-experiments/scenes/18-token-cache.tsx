import {Circle, Gradient, Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, easeInOutCubic, easeOutBack, easeOutCubic, waitFor} from '@motion-canvas/core';
import {CurvedLine} from '../../../components';
import {materials} from '../materials';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const cache = createRef<Layout>();
  const cacheGlow = createRef<Circle>();
  const tokenTexts = ['the', 'rocket', 'flies'];
  const transformed = ['K₁ / V₁', 'K₂ / V₂', 'K₃ / V₃'];
  const tokens: Rect[] = [];
  const labels: Txt[] = [];
  const paths: CurvedLine[] = [];

  view.fill('#050914');
  view.add(<Txt ref={title} text={'TOKENS → TRANSFORM → CACHE'} y={-420} fontFamily={'Inter, sans-serif'} fontSize={56} fontWeight={700} fill={'#f8fafc'} opacity={0} />);

  for (const [index, text] of tokenTexts.entries()) {
    const y = -150 + index * 150;
    const path = new CurvedLine({from: [-500, y], to: [250, y * 0.42], curve: 0.45, arc: (index - 1) * 42, stroke: '#a78bfa55', lineWidth: 3, end: 0});
    paths.push(path);
    view.add(path);
    const label = new Txt({text, fontFamily: 'JetBrains Mono, monospace', fontSize: 21, fontWeight: 700, fill: materials.paper.text});
    labels.push(label);
    const token = new Rect({layout: true, alignItems: 'center', justifyContent: 'center', width: 190, height: 72, x: -500, y, radius: 18, fill: materials.paper.fill, stroke: materials.paper.border, lineWidth: 2, shadowColor: materials.paper.shadow, shadowBlur: 20, opacity: 0, children: label});
    tokens.push(token);
    view.add(token);
  }

  view.add(
    <Layout ref={cache} x={390} y={20} opacity={0} scale={0.88}>
      <Rect width={390} height={330} fill={materials.metal.fill} stroke={materials.metal.border} lineWidth={3} shadowColor={materials.metal.shadow} shadowBlur={30} />
      <Circle width={390} height={105} y={-165} fill={'#71808d'} stroke={materials.metal.border} lineWidth={3} />
      <Circle ref={cacheGlow} width={390} height={105} y={165} fill={'#111a23'} stroke={materials.gel.accent} lineWidth={3} shadowColor={materials.gel.accent} shadowBlur={0} />
      <Txt text={'KV CACHE'} y={-25} fontFamily={'JetBrains Mono, monospace'} fontSize={36} fontWeight={800} fill={materials.metal.text} />
      <Txt text={'persistent context'} y={28} fontFamily={'Inter, sans-serif'} fontSize={20} fill={materials.metal.muted} />
    </Layout>,
  );

  yield* title().opacity(1, 0.45);
  yield* all(cache().opacity(1, 0.45), cache().scale(1, 0.55, easeOutBack), ...tokens.map((token, i) => chain(waitFor(i * 0.1), token.opacity(1, 0.3))));
  yield* all(...paths.map((path, i) => chain(waitFor(i * 0.08), path.end(1, 0.65, easeOutCubic))));

  for (let index = 0; index < tokens.length; index += 1) {
    yield* all(tokens[index].x(220, 0.55, easeInOutCubic), tokens[index].y((-1 + index) * 68, 0.55, easeInOutCubic), tokens[index].scale(0.78, 0.55, easeOutBack));
    labels[index].text(transformed[index]);
    yield* all(tokens[index].fill(materials.gel.fill, 0.25), labels[index].fill(materials.gel.text, 0.25), cacheGlow().shadowBlur(34, 0.15).to(0, 0.3));
  }
  yield* all(...tokens.map((token, index) => chain(waitFor(index * 0.05), token.x(390, 0.4, easeInOutCubic), token.opacity(0, 0.2))));
  yield* cache().scale(1.035, 0.18, easeOutCubic).to(1, 0.32, easeOutBack);
  yield* waitFor(0.7);
  yield* all(title().opacity(0, 0.35), cache().opacity(0, 0.45), ...paths.map(path => path.opacity(0, 0.35)));
});
