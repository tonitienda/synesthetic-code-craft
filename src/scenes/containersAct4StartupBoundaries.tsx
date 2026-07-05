import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, Card, ContainerInstance, ImageBox, KernelLayer, LayerStack, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeScene2D(function* (view) {
  view.fill(c.bg);
  const main = createRef<Layout>();
  view.add(
    <Layout ref={main} layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70} opacity={0}>
      <Title text={'Startup and boundaries'} sub={'command · env · workdir · user'} />
      <Layout layout gap={40} alignItems={'center'}><Layout layout direction={'column'} gap={16}><Card title={'command'} /><Card title={'environment'} /><Card title={'working dir / user'} /></Layout><Arrow /><ContainerInstance label={'container instance'} /></Layout>
    </Layout>,
  );
  yield* main().opacity(1, 0.8);
  yield* waitFor(1.4);
  yield* main().opacity(0, 0.4);
});
