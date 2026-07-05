import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, Card, ContainerInstance, ImageBox, KernelLayer, LayerStack, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeScene2D(function* (view) {
  view.fill(c.bg);
  const main = createRef<Layout>();
  view.add(
    <Layout ref={main} layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70} opacity={0}>
      <Title text={'Final model'} sub={'An image does not run. A process runs.'} />
      <Layout layout direction={'column'} gap={38} alignItems={'center'}><Txt text={'container = process + filesystem view + namespaces + cgroups'} fontSize={44} fill={c.text} /><Txt text={'Registry → Image = layers + config → Runtime → Container = process + writable layer + namespaces + cgroups'} fontSize={30} fill={c.cyan} /><Txt text={'The container is the bounded running process.'} fontSize={34} fill={c.amber} /></Layout>
    </Layout>,
  );
  yield* main().opacity(1, 0.8);
  yield* waitFor(1.4);
  yield* main().opacity(0, 0.4);
});
