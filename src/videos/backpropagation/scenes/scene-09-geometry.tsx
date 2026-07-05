import {Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {backgroundGradient, theme, graph, wires} from '../theme';
import {Neuron, Connection, Axes, PointClass} from '../components';

// Scene 1.9 — Concrete example becomes geometry (budget 18s)
export default makeScene2D(function* (view) {
  view.fill(backgroundGradient());

  const ghost = createRef<Circle>();
  const ghostIn1 = createRef<Line>();
  const ghostIn2 = createRef<Line>();
  const ghostOut = createRef<Line>();
  const intro = createRef<Txt>();
  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const xLabel = createRef<Txt>();
  const yLabel = createRef<Txt>();
  const passLegend = createRef<Txt>();
  const failLegend = createRef<Txt>();
  const passPts = [createRef<Circle>(), createRef<Circle>()];
  const failPts = [createRef<Circle>(), createRef<Circle>()];

  view.add(
    <>
      {/* Perceptron ghost from the previous scene, faded out at the start. */}
      <Neuron ref={ghost} />
      <Connection ref={ghostIn1} points={[wires.in1Start, wires.in1End]} color={theme.input} lineWidth={11} end={1} />
      <Connection ref={ghostIn2} points={[wires.in2Start, wires.in2End]} color={theme.input} lineWidth={11} end={1} />
      <Connection ref={ghostOut} points={[wires.outStart, wires.outEnd]} color={theme.output} lineWidth={9} end={1} />

      <Txt ref={intro} text={'The same example can be drawn as geometry.'} fontSize={44} fill={theme.text} opacity={0} />

      <Axes
        xAxis={xAxis}
        yAxis={yAxis}
        xLabel={xLabel}
        yLabel={yLabel}
        origin={graph.origin}
        xEnd={graph.xEnd}
        yEnd={graph.yEnd}
      />

      <PointClass ref={passPts[0]} position={graph.pass[0]} color={theme.pass} />
      <PointClass ref={passPts[1]} position={graph.pass[1]} color={theme.pass} />
      <PointClass ref={failPts[0]} position={graph.notPass[0]} color={theme.notPass} />
      <PointClass ref={failPts[1]} position={graph.notPass[1]} color={theme.notPass} />

      <Txt ref={passLegend} position={[300, -260]} text={'pass'} fontSize={34} fill={theme.pass} opacity={0} />
      <Txt ref={failLegend} position={[300, -200]} text={'not pass'} fontSize={34} fill={theme.notPass} opacity={0} />
    </>,
  );

  // 0.0s — dissolve the perceptron, bring in the transition line.
  yield* all(
    ghost().opacity(0, 1.2),
    ghostIn1().opacity(0, 1.2),
    ghostIn2().opacity(0, 1.2),
    ghostOut().opacity(0, 1.2),
    intro().opacity(1, 1.2),
  );
  yield* waitFor(1.8);

  // 3.0s — draw the axes; the transition line steps aside.
  yield* all(
    intro().opacity(0, 1.0),
    xAxis().end(1, 1.4),
    yAxis().end(1, 1.4),
    xLabel().opacity(1, 1.2),
    yLabel().opacity(1, 1.2),
  );
  yield* waitFor(1.6);

  // 6.0s — emphasise the vertical axis.
  yield* yLabel().scale(1.2, 0.7);
  yield* yLabel().scale(1, 0.7);
  yield* waitFor(1.1);

  // 8.5s — every student becomes a point.
  yield* sequence(
    0.35,
    passPts[0]().opacity(1, 0.6),
    passPts[1]().opacity(1, 0.6),
    failPts[0]().opacity(1, 0.6),
    failPts[1]().opacity(1, 0.6),
  );
  yield* waitFor(1.85);

  // 12.0s — name the two classes.
  yield* all(passLegend().opacity(1, 1.2), failLegend().opacity(1, 1.2));
  yield* waitFor(1.8);

  // 15.0s — hold the graph.
  yield* waitFor(3.0);
});
