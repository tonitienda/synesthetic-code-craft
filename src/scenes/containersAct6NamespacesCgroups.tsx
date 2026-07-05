import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Card, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
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
        <Title text={'Namespaces and cgroups'} sub={'view plus budget'} />
      </Layout>
      <Layout ref={diagram} opacity={0}>
        <Layout layout direction={'column'} gap={34} alignItems={'center'}>
          <Layout layout gap={50} alignItems={'center'}>
            <Card title={'namespaces'} body={'what the process can see: processes, mounts, network, hostname'} color={c.violet} width={430} />
            <ProcessBox />
            <Card title={'cgroups'} body={'what the process can use: CPU, memory, I/O'} color={c.amber} width={430} />
          </Layout>
          <Txt text={'Namespaces shape the view. Cgroups shape the budget.'} fontSize={36} fill={c.text} />
        </Layout>
      </Layout>
    </Layout>,
  );

  yield* heading().opacity(1, timings.diagram);
  yield* diagram().opacity(1, timings.diagram);
  yield* waitFor(timings.hold);
  yield* all(heading().opacity(0, 0.35), diagram().opacity(0, 0.35));
});
