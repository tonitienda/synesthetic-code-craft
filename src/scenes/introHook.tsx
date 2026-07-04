import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const card = createRef<Rect>();
  const title = createRef<Txt>();

  view.add(
    <Layout layout alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'}>
      <Rect
        ref={card}
        width={1280}
        height={480}
        radius={36}
        fill={'#151528'}
        stroke={'#67e8f9'}
        lineWidth={8}
        scale={0.92}
      >
        <Txt
          ref={title}
          fontSize={86}
          fill={'#f8fafc'}
          text={'Build videos with Motion Canvas'}
          opacity={0}
        />
      </Rect>
    </Layout>,
  );

  yield* all(card().scale(1, 0.9), title().opacity(1, 0.9));
});
