import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Arrow, Card, ContainerInstance, ImageBox, KernelLayer, LayerStack, ProcessBox, Title} from '../videos/containers-image-to-running-process/components';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeScene2D(function* (view) {
  view.fill(c.bg);
  const main = createRef<Layout>();
  view.add(
    <Layout ref={main} layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70} opacity={0}>
      <Title text={'Namespaces and cgroups'} sub={'view plus budget'} />
      <Layout layout gap={50} alignItems={'center'}><Card title={'namespaces'} body={'what the process can see: processes, mounts, network, hostname'} color={c.violet} width={430} /><ProcessBox /><Card title={'cgroups'} body={'what the process can use: CPU, memory, I/O'} color={c.amber} width={430} /></Layout><Txt text={'Namespaces shape the view. Cgroups shape the budget.'} fontSize={36} fill={c.text} />
    </Layout>,
  );
  yield* main().opacity(1, 0.8);
  yield* waitFor(1.4);
  yield* main().opacity(0, 0.4);
});
