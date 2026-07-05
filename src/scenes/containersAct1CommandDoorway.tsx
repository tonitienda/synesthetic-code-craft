import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, Card, ContainerInstance, ImageBox, KernelLayer, LayerStack, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeScene2D(function* (view) {
  view.fill(c.bg);
  const main = createRef<Layout>();
  view.add(
    <Layout ref={main} layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70} opacity={0}>
      <Title text={'docker run nginx'} sub={'what runs?'} />
      <Layout layout direction={'column'} gap={34} alignItems={'center'}><Txt text={'IMAGE  ≠  RUNNING PROCESS'} fontSize={58} fill={c.text} /><Layout layout gap={70} alignItems={'center'}><ImageBox label={'nginx image'} /><Arrow /><Rect layout direction={'column'} gap={16} alignItems={'center'}><ProcessBox label={'process'} /><Txt text={'An image does not run. A process runs.'} fontSize={30} fill={c.amber} /></Rect></Layout><Txt text={'image → runtime → container process'} fontSize={42} fill={c.cyan} /></Layout>
    </Layout>,
  );
  yield* main().opacity(1, 0.8);
  yield* waitFor(1.4);
  yield* main().opacity(0, 0.4);
});
