import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const headline = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(
    <Layout layout direction={'column'} alignItems={'center'} justifyContent={'center'} gap={60} width={'100%'} height={'100%'}>
      <Txt ref={headline} fontSize={92} fill={'#22d3ee'} text={'Multiple scenes, one pipeline'} opacity={0} />
      <Txt ref={cta} fontSize={64} fill={'#f8fafc'} text={'Publish to YouTube'} opacity={0} />
    </Layout>,
  );

  yield* all(headline().opacity(1, 0.8), cta().opacity(1, 0.8));
  yield* waitFor(0.4);
});
