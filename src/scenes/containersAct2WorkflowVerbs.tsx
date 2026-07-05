import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, Card, ContainerInstance, ImageBox, KernelLayer, LayerStack, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeScene2D(function* (view) {
  view.fill(c.bg);
  const main = createRef<Layout>();
  view.add(
    <Layout ref={main} layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70} opacity={0}>
      <Title text={'Workflow verbs'} sub={'run is the verb that creates a container'} />
      <Layout layout direction={'column'} gap={34} alignItems={'center'}><Txt text={'build → image → push → registry → pull → local image → run → container'} fontSize={38} fill={c.text} /><Layout layout gap={30} alignItems={'center'}><Card title={'push / pull'} body={'move images'} color={c.violet} /><Card title={'run'} body={'creates a container'} color={c.green} /><Card title={'Docker doorway'} body={'broader OCI-style model'} color={c.cyan} /></Layout></Layout>
    </Layout>,
  );
  yield* main().opacity(1, 0.8);
  yield* waitFor(1.4);
  yield* main().opacity(0, 0.4);
});
