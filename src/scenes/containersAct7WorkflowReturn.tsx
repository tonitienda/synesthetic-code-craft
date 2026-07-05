import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Pipeline, Title} from '../videos/containers-image-to-running-process/components';
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
        <Title text={'Workflow returns'} sub={'sharper labels from earlier acts'} />
      </Layout>
      <Layout ref={diagram} opacity={0}>
        <Layout layout direction={'column'} gap={38} alignItems={'center'}>
          <Pipeline items={['build', 'image', 'push', 'registry', 'pull', 'local image', 'run', 'container']} highlight={'run'} />
          <Txt text={'image = layers + config · run = runtime setup · container = bounded process'} fontSize={32} fill={c.muted} />
        </Layout>
      </Layout>
    </Layout>,
  );

  yield* heading().opacity(1, timings.diagram);
  yield* diagram().opacity(1, timings.diagram);
  yield* waitFor(timings.hold);
  yield* all(heading().opacity(0, 0.35), diagram().opacity(0, 0.35));
});
