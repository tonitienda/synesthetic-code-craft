import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, Card, ContainerInstance, ImageBox, KernelLayer, LayerStack, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeScene2D(function* (view) {
  view.fill(c.bg);
  const main = createRef<Layout>();
  view.add(
    <Layout ref={main} layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70} opacity={0}>
      <Title text={'Four nouns, four roles'} sub={'Image · Registry · Runtime · Container'} />
      <Layout layout gap={28}><Card title={'Image'} body={'packaged starting point'} /><Card title={'Registry'} body={'stores and distributes images'} color={c.violet} /><Card title={'Runtime'} body={'prepares and starts'} color={c.amber} /><Card title={'Container'} body={'running instance'} color={c.green} /></Layout>
    </Layout>,
  );
  yield* main().opacity(1, 0.8);
  yield* waitFor(1.4);
  yield* main().opacity(0, 0.4);
});
