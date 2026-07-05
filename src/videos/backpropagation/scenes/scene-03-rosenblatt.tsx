import {Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme} from '../theme';
import {Neuron, PortraitPlaceholder} from '../components';

// Scene 1.3 — Historical anchor (budget 13s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const neuron = createRef<Circle>();
  const portrait = createRef<Circle>();
  const name = createRef<Txt>();
  const date = createRef<Txt>();
  const perceptron = createRef<Txt>();

  view.add(
    <>
      <Neuron ref={neuron} />
      <PortraitPlaceholder ref={portrait} position={[-380, -20]} />
      <Txt ref={name} position={[-380, 150]} text={'Frank Rosenblatt'} fontSize={38} fill={theme.text} opacity={0} />
      <Txt ref={date} position={[-380, 205]} text={'1958'} fontSize={34} fill={theme.muted} opacity={0} />
      <Txt ref={perceptron} y={-180} text={'Perceptron'} fontSize={46} fontWeight={600} fill={theme.neuron} opacity={0} />
    </>,
  );

  // 0.0s — make room on the left for the historical figure.
  yield* all(neuron().x(320, 1.4), portrait().opacity(1, 1.4));
  yield* waitFor(2.4);

  // 4.5s — name and date.
  yield* all(name().opacity(1, 1.0), date().opacity(1, 1.0));
  yield* waitFor(1.0);

  // 6.5s — the word Perceptron rises above the neuron.
  yield* all(perceptron().opacity(1, 1.0), perceptron().y(-260, 1.0));
  yield* waitFor(1.6);

  // 10.0s — clear the history, return the neuron to centre.
  yield* all(
    portrait().opacity(0, 1.2),
    name().opacity(0, 1.2),
    date().opacity(0, 1.2),
    perceptron().opacity(0, 1.2),
    neuron().x(0, 1.4),
  );
  yield* waitFor(1.0);
});
