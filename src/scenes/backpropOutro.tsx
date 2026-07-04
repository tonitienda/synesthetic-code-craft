import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#070814');
  const card = createRef<Rect>();
  const text = createRef<Txt>();
  view.add(
    <Layout layout alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'}>
      <Rect ref={card} width={1280} height={520} radius={40} fill={'#10172a'} stroke={'#22d3ee'} lineWidth={8} scale={0.9}>
        <Layout layout direction={'column'} gap={36} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'}>
          <Txt text={'Backprop is not magic'} fontSize={82} fontWeight={700} fill={'#f8fafc'} />
          <Txt ref={text} text={'It is the chain rule turned into a training algorithm.'} fontSize={48} fill={'#cbd5e1'} opacity={0} />
        </Layout>
      </Rect>
    </Layout>,
  );
  yield* all(card().scale(1, 0.9), text().opacity(1, 0.9));
  yield* waitFor(1);
});
