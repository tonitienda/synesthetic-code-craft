import {Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme, graph} from '../theme';
import {Axes, PointClass} from '../components';

// Scene 1.10 — Decision boundary line (budget 17s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const boundary = createRef<Line>();
  const label = createRef<Txt>();
  const passPts = [createRef<Circle>(), createRef<Circle>()];
  const failPts = [createRef<Circle>(), createRef<Circle>()];

  view.add(
    <>
      <Axes
        xAxis={xAxis}
        yAxis={yAxis}
        origin={graph.origin}
        xEnd={graph.xEnd}
        yEnd={graph.yEnd}
        end={1}
        labelOpacity={1}
      />

      <PointClass ref={passPts[0]} position={graph.pass[0]} color={theme.pass} opacity={1} />
      <PointClass ref={passPts[1]} position={graph.pass[1]} color={theme.pass} opacity={1} />
      <PointClass ref={failPts[0]} position={graph.notPass[0]} color={theme.notPass} opacity={1} />
      <PointClass ref={failPts[1]} position={graph.notPass[1]} color={theme.notPass} opacity={1} />

      <Txt position={[300, -260]} text={'pass'} fontSize={34} fill={theme.pass} />
      <Txt position={[300, -200]} text={'not pass'} fontSize={34} fill={theme.notPass} />

      <Line
        ref={boundary}
        points={[graph.boundaryA, graph.boundaryB]}
        stroke={theme.neuron}
        lineWidth={6}
        lineCap={'round'}
        shadowColor={theme.neuron}
        shadowBlur={16}
        end={0}
      />
      <Txt ref={label} position={[-235, -150]} text={'decision boundary'} fontSize={32} fill={theme.neuron} opacity={0} />
    </>,
  );

  // 0.0s — draw a line that separates the two groups.
  yield* boundary().end(1, 1.6);
  yield* waitFor(3.4);

  // 5.0s — name it.
  yield* label().opacity(1, 1.2);
  yield* waitFor(1.8);

  // 8.0s — changing the weights rotates the line.
  yield* boundary().rotation(9, 1.5);
  yield* waitFor(2.5);

  // 12.0s — shift it back toward the cleanest separation.
  yield* all(boundary().rotation(0, 1.5), boundary().position([12, 0], 1.5));
  yield* waitFor(2.0);

  // 15.5s — hold the clean separation.
  yield* waitFor(1.5);
});
