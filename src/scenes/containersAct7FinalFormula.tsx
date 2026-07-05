import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Title} from '../videos/containers-image-to-running-process/components';
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
        <Title text={'Final model'} sub={'An image does not run. A process runs.'} />
      </Layout>
      <Layout ref={diagram} opacity={0}>
        <Layout layout direction={'column'} gap={38} alignItems={'center'}>
          <Txt text={'container = process + filesystem view + namespaces + cgroups'} fontSize={44} fill={c.text} />
          <Txt text={'Registry → Image = layers + config → Runtime → Container = process + writable layer + namespaces + cgroups'} fontSize={30} fill={c.cyan} />
          <Txt text={'The container is the bounded running process.'} fontSize={34} fill={c.amber} />
        </Layout>
      </Layout>
    </Layout>,
  );

  yield* heading().opacity(1, timings.diagram);
  yield* diagram().opacity(1, timings.diagram);
  yield* waitFor(timings.hold);
  yield* all(heading().opacity(0, 0.35), diagram().opacity(0, 0.35));
});
