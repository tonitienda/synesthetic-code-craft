import {Circle, Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const pulse = createRef<Circle>();
  const label = createRef<Txt>();

  view.add(
    <Layout layout direction={'column'} alignItems={'center'} justifyContent={'center'} gap={56} width={'100%'} height={'100%'}>
      <Circle ref={pulse} size={420} fill={'#1e293b'} stroke={'#a78bfa'} lineWidth={12} scale={0.75} />
      <Txt ref={label} text={'Deep Dive Episode'} fontSize={96} fill={'#f8fafc'} opacity={0} />
    </Layout>,
  );

  yield* all(pulse().scale(1, 1.1), label().opacity(1, 1.1));
});
