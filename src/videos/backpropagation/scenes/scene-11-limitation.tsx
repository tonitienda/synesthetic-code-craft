import {Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme, graph} from '../theme';
import {Axes, PointClass} from '../components';

// Scene 1.11 — The limitation (budget 16s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const boundary = createRef<Line>();
  const question = createRef<Txt>();
  const oldPass = [createRef<Circle>(), createRef<Circle>()];
  const oldFail = [createRef<Circle>(), createRef<Circle>()];
  const xorPass = [createRef<Circle>(), createRef<Circle>()];
  const xorFail = [createRef<Circle>(), createRef<Circle>()];

  view.add(
    <>
      <Axes xAxis={xAxis} yAxis={yAxis} origin={graph.origin} xEnd={graph.xEnd} yEnd={graph.yEnd} end={1} labelOpacity={1} />

      {/* Points carried over from the previous scene, faded out at the start. */}
      <PointClass ref={oldPass[0]} position={graph.pass[0]} color={theme.pass} opacity={1} />
      <PointClass ref={oldPass[1]} position={graph.pass[1]} color={theme.pass} opacity={1} />
      <PointClass ref={oldFail[0]} position={graph.notPass[0]} color={theme.notPass} opacity={1} />
      <PointClass ref={oldFail[1]} position={graph.notPass[1]} color={theme.notPass} opacity={1} />

      {/* XOR-like pattern: classes sit on opposite diagonals. */}
      <PointClass ref={xorPass[0]} position={graph.xorPass[0]} color={theme.pass} />
      <PointClass ref={xorPass[1]} position={graph.xorPass[1]} color={theme.pass} />
      <PointClass ref={xorFail[0]} position={graph.xorFail[0]} color={theme.notPass} />
      <PointClass ref={xorFail[1]} position={graph.xorFail[1]} color={theme.notPass} />

      <Line
        ref={boundary}
        points={[graph.boundaryA, graph.boundaryB]}
        stroke={theme.neuron}
        lineWidth={6}
        lineCap={'round'}
        shadowColor={theme.neuron}
        shadowBlur={16}
        position={[12, 0]}
        end={1}
      />

      <Txt ref={question} y={340} text={'What if one line is not enough?'} fontSize={46} fontWeight={600} fill={theme.text} opacity={0} />
    </>,
  );

  // 0.0s — swap the separable data for an XOR-like pattern.
  yield* all(
    oldPass[0]().opacity(0, 1.0),
    oldPass[1]().opacity(0, 1.0),
    oldFail[0]().opacity(0, 1.0),
    oldFail[1]().opacity(0, 1.0),
    sequence(
      0.3,
      xorPass[0]().opacity(1, 0.6),
      xorFail[0]().opacity(1, 0.6),
      xorPass[1]().opacity(1, 0.6),
      xorFail[1]().opacity(1, 0.6),
    ),
  );
  yield* waitFor(1.6);

  // 3.0s — try rotating the line once.
  yield* boundary().rotation(16, 1.4);
  yield* waitFor(0.8);

  // 6.0s — try several positions; none of them work.
  yield* boundary().rotation(-18, 1.0);
  yield* boundary().rotation(24, 1.0);

  // The line fails: it turns red and shakes.
  yield* boundary().stroke(theme.fail, 0.4);
  boundary().shadowColor(theme.fail);
  for (const angle of [30, 18, 28, 20, 24]) {
    yield* boundary().rotation(angle, 0.12);
  }

  // 10.0s — hold the failed separation.
  yield* waitFor(2.0);

  // 13.0s — pose the question that Act II will answer.
  yield* question().opacity(1, 1.2);
  yield* waitFor(0.8);
  yield* question().opacity(0, 1.4);
});
