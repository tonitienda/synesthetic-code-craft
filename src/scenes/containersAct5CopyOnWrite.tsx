import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, Card, ContainerInstance, ImageBox, KernelLayer, LayerStack, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeScene2D(function* (view) {
  view.fill(c.bg);
  const main = createRef<Layout>();
  view.add(
    <Layout ref={main} layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70} opacity={0}>
      <Title text={'Copy-on-write mental model'} sub={'/etc/app.conf'} />
      <Layout layout direction={'column'} gap={34} alignItems={'center'}><Layout layout gap={60}><Card title={'Container A'} body={'A sees: modified'} color={c.amber} /><Card title={'shared original'} body={'/etc/app.conf'} color={c.cyan} /><Card title={'Container B'} body={'B sees: original'} color={c.green} /></Layout><Txt text={'write: record change in Writable A · shared original unchanged'} fontSize={32} fill={c.text} /></Layout>
    </Layout>,
  );
  yield* main().opacity(1, 0.8);
  yield* waitFor(1.4);
  yield* main().opacity(0, 0.4);
});
