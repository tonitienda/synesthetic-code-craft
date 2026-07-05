import {Layout, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Card, Title} from '../videos/containers-image-to-running-process/components';
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
        <Title text={'Four nouns, four roles'} sub={'Image · Registry · Runtime · Container'} />
      </Layout>
      <Layout ref={diagram} opacity={0}>
        <Layout layout gap={28}>
          <Card title={'Image'} body={'packaged starting point'} />
          <Card title={'Registry'} body={'stores and distributes images'} color={c.violet} />
          <Card title={'Runtime'} body={'prepares and starts'} color={c.amber} />
          <Card title={'Container'} body={'running instance'} color={c.green} />
        </Layout>
      </Layout>
    </Layout>,
  );

  yield* heading().opacity(1, timings.diagram);
  yield* diagram().opacity(1, timings.diagram);
  yield* waitFor(timings.hold);
  yield* all(heading().opacity(0, 0.35), diagram().opacity(0, 0.35));
});
