import {Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme} from '../theme';

// Scene 1.1 — Title (budget 8s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={title}
        y={40}
        text={'Backpropagation'}
        fontSize={104}
        fontWeight={700}
        fill={theme.text}
        opacity={0}
      />
      <Txt
        ref={subtitle}
        y={70}
        text={'How neural networks learn from mistakes'}
        fontSize={44}
        fill={theme.muted}
        opacity={0}
      />
    </>,
  );

  // 0.0s — fade in the title, drifting gently upward.
  yield* all(title().opacity(1, 1.3), title().y(0, 1.6));
  yield* waitFor(0.6);

  // 2.0s — reveal the subtitle below the title.
  yield* subtitle().opacity(1, 1.2);

  // 5.5s — hold, then fade everything out.
  yield* waitFor(1.6);
  yield* all(title().opacity(0, 1.2), subtitle().opacity(0, 1.2));
  yield* waitFor(0.5);
});
