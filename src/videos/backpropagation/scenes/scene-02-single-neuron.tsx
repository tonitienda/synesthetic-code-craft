import {Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme} from '../theme';
import {Neuron} from '../components';

// Scene 1.2 — The story starts smaller (budget 11s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const intro = createRef<Txt>();
  const neuron = createRef<Circle>();
  const label = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={intro}
        text={'But the story does not start with a deep network.'}
        fontSize={46}
        fill={theme.text}
        opacity={0}
      />
      <Neuron ref={neuron} />
      <Txt
        ref={label}
        y={150}
        text={'artificial neuron'}
        fontSize={40}
        fill={theme.muted}
        opacity={0}
      />
    </>,
  );

  neuron().scale(0.55).opacity(0);

  // 0.0s — the opening line.
  yield* intro().opacity(1, 1.2);
  yield* waitFor(2.0);

  // 3.2s — text moves up; a single neuron appears at centre.
  yield* all(
    intro().y(-340, 1.4),
    neuron().opacity(1, 1.4),
    neuron().scale(1, 1.4),
  );
  yield* waitFor(1.9);

  // 6.5s — name the neuron and hold.
  yield* label().opacity(1, 1.0);
  yield* waitFor(1.5);

  // 9.0s — clear the words, keep the neuron.
  yield* all(intro().opacity(0, 1.2), label().opacity(0, 1.2));
  yield* waitFor(0.8);
});
