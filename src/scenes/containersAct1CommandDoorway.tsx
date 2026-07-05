import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, ImageBox, Pipeline, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
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
        <Title text={'docker run nginx'} sub={'highlight run: what runs?'} />
      </Layout>
      <Layout ref={diagram} opacity={0}>
        <Layout layout direction={'column'} gap={34} alignItems={'center'}>
          <Txt text={'IMAGE  ≠  RUNNING PROCESS'} fontSize={58} fill={c.text} />
          <Layout layout gap={70} alignItems={'center'}>
            <ImageBox label={'nginx image'} />
            <Arrow />
            <Layout layout direction={'column'} gap={16} alignItems={'center'}>
              <ProcessBox label={'process'} />
              <Txt text={'An image does not run. A process runs.'} fontSize={30} fill={c.amber} />
            </Layout>
          </Layout>
          <Pipeline items={['image', 'runtime', 'container process']} highlight={'runtime'} />
        </Layout>
      </Layout>
    </Layout>,
  );

  yield* heading().opacity(1, timings.diagram);
  yield* diagram().opacity(1, timings.diagram);
  yield* waitFor(timings.hold);
  yield* all(heading().opacity(0, 0.35), diagram().opacity(0, 0.35));
});
