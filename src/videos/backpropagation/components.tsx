import {Circle, Line, Txt} from '@motion-canvas/2d';
import type {ComponentChildren} from '@motion-canvas/2d';
import type {PossibleColor, Reference, SignalValue} from '@motion-canvas/core';
import {theme} from './theme';

/** A single glowing artificial neuron. Children render on top (Σ, labels). */
export function Neuron({
  ref,
  size = 156,
  children,
}: {
  ref?: Reference<Circle>;
  size?: number;
  children?: ComponentChildren;
}) {
  return (
    <Circle
      ref={ref}
      size={size}
      fill={theme.neuronFill}
      stroke={theme.neuron}
      lineWidth={6}
      shadowColor={theme.neuron}
      shadowBlur={48}
    >
      {children}
    </Circle>
  );
}

/**
 * A connection line that grows toward its end. Weight/importance is
 * communicated through line thickness (`lineWidth`).
 */
export function Connection({
  ref,
  points,
  color = theme.dim,
  lineWidth = 5,
  end = 0,
}: {
  ref?: Reference<Line>;
  points: SignalValue<[number, number][]>;
  color?: PossibleColor;
  lineWidth?: number;
  end?: number;
}) {
  return (
    <Line
      ref={ref}
      points={points}
      stroke={color}
      lineWidth={lineWidth}
      lineCap={'round'}
      end={end}
    />
  );
}

/** A moving dot that represents a signal / information flowing along a line. */
export function Signal({
  ref,
  color = theme.input,
  size = 24,
  position = [0, 0],
  opacity = 0,
}: {
  ref?: Reference<Circle>;
  color?: PossibleColor;
  size?: number;
  position?: [number, number];
  opacity?: number;
}) {
  return (
    <Circle
      ref={ref}
      size={size}
      position={position}
      fill={color}
      shadowColor={color}
      shadowBlur={22}
      opacity={opacity}
    />
  );
}

/** A small classified data point (a student) on the geometry graph. */
export function PointClass({
  ref,
  position,
  color,
  size = 30,
  opacity = 0,
}: {
  ref?: Reference<Circle>;
  position: [number, number];
  color: PossibleColor;
  size?: number;
  opacity?: number;
}) {
  return (
    <Circle
      ref={ref}
      size={size}
      position={position}
      fill={color}
      shadowColor={color}
      shadowBlur={16}
      opacity={opacity}
    />
  );
}

/** The 2D graph axes with named X and Y labels. */
export function Axes({
  xAxis,
  yAxis,
  xLabel,
  yLabel,
  origin,
  xEnd,
  yEnd,
  end = 0,
  labelOpacity = 0,
}: {
  xAxis?: Reference<Line>;
  yAxis?: Reference<Line>;
  xLabel?: Reference<Txt>;
  yLabel?: Reference<Txt>;
  origin: [number, number];
  xEnd: [number, number];
  yEnd: [number, number];
  end?: number;
  labelOpacity?: number;
}) {
  return (
    <>
      <Line ref={xAxis} points={[origin, xEnd]} stroke={theme.muted} lineWidth={4} lineCap={'round'} endArrow arrowSize={14} end={end} />
      <Line ref={yAxis} points={[origin, yEnd]} stroke={theme.muted} lineWidth={4} lineCap={'round'} endArrow arrowSize={14} end={end} />
      <Txt ref={xLabel} position={[(origin[0] + xEnd[0]) / 2, origin[1] + 56]} text={'hours studied'} fontSize={32} fill={theme.muted} opacity={labelOpacity} />
      <Txt ref={yLabel} position={[origin[0] - 70, (origin[1] + yEnd[1]) / 2]} rotation={-90} text={'hours slept'} fontSize={32} fill={theme.muted} opacity={labelOpacity} />
    </>
  );
}

/** A minimal placeholder portrait frame for the historical anchor. */
export function PortraitPlaceholder({
  ref,
  size = 220,
  position = [0, 0],
  opacity = 0,
}: {
  ref?: Reference<Circle>;
  size?: number;
  position?: [number, number];
  opacity?: number;
}) {
  return (
    <Circle
      ref={ref}
      size={size}
      position={position}
      fill={'#0f1526'}
      stroke={theme.muted}
      lineWidth={4}
      opacity={opacity}
    >
      <Txt text={'👤'} fontSize={size * 0.42} fill={theme.muted} />
    </Circle>
  );
}
