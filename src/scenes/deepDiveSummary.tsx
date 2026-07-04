import {Layout, Line, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const divider = createRef<Line>();
  const summary = createRef<Txt>();

  view.add(
    <Layout layout direction={'column'} alignItems={'center'} justifyContent={'center'} gap={64} width={'100%'} height={'100%'}>
      <Line
        ref={divider}
        points={[
          [-420, 0],
          [420, 0],
        ]}
        stroke={'#67e8f9'}
        lineWidth={10}
        end={0}
      />
      <Txt
        ref={summary}
        text={'Create once. Reuse scenes. Publish often.'}
        fontSize={68}
        fill={'#f8fafc'}
        opacity={0}
      />
    </Layout>,
  );

  yield* all(divider().end(1, 1), summary().opacity(1, 1));
  yield* waitFor(0.4);
});
