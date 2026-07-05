import {Layout, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, Card, LayerStack, Title} from '../videos/containers-image-to-running-process/components';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

const timings = {
  title: 0,
  diagram: 0.8,
  hold: 1.8,
};

export default makeScene2D(function* (view) {
  view.fill(c.bg);

  const heading = createRef<Layout>();
  const diagram = createRef<Layout>();

  view.add(
    <Layout layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70}>
      <Layout ref={heading} opacity={0}>
        <Title text={'What run prepares'} sub={'layers + config + run options'} />
      </Layout>
      <Layout ref={diagram} opacity={0}>
        <Layout layout gap={40} alignItems={'center'}>
          <LayerStack writable={'private writable layer'} />
          <Arrow />
          <Card title={'Runtime'} body={'prepares filesystem view'} color={c.amber} />
          <Arrow />
          <Card title={'one filesystem view'} body={'layer seams remain faintly visible'} color={c.green} />
        </Layout>
      </Layout>
    </Layout>,
  );

  yield* heading().opacity(1, timings.diagram);
  yield* diagram().opacity(1, timings.diagram);
  yield* waitFor(timings.hold);
  yield* all(heading().opacity(0, 0.35), diagram().opacity(0, 0.35));
});
