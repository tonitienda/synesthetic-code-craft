import {CubicBezier, CubicBezierProps} from '@motion-canvas/2d';
import {PossibleVector2, Vector2} from '@motion-canvas/core';

export interface CurvedLineProps
  extends Omit<
    CubicBezierProps,
    'p0' | 'p0X' | 'p0Y' | 'p1' | 'p1X' | 'p1Y' | 'p2' | 'p2X' | 'p2Y' | 'p3' | 'p3X' | 'p3Y'
  > {
  from: PossibleVector2;
  to: PossibleVector2;
  /** Fraction of the main-axis distance used for each Bézier handle. */
  curve?: number;
  /** Perpendicular offset shared by both handles, producing a broad arc. */
  arc?: number;
  axis?: 'auto' | 'horizontal' | 'vertical';
}

/**
 * A semantic connector with a continuous cubic curve.
 *
 * Use `curve` to control how gently the connector leaves and enters its
 * endpoints. Use `arc` when parallel endpoints should bow instead of becoming
 * a straight line. Because this extends CubicBezier, start/end drawing and
 * arrow animations work exactly like other Motion Canvas curves.
 */
export class CurvedLine extends CubicBezier {
  public constructor({
    from,
    to,
    curve = 0.42,
    arc = 0,
    axis = 'auto',
    ...props
  }: CurvedLineProps) {
    const start = new Vector2(from);
    const finish = new Vector2(to);
    const dx = finish.x - start.x;
    const dy = finish.y - start.y;
    const resolvedAxis = axis === 'auto'
      ? Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical'
      : axis;

    const control1: [number, number] = resolvedAxis === 'horizontal'
      ? [start.x + dx * curve, start.y + arc]
      : [start.x + arc, start.y + dy * curve];
    const control2: [number, number] = resolvedAxis === 'horizontal'
      ? [finish.x - dx * curve, finish.y + arc]
      : [finish.x + arc, finish.y - dy * curve];

    super({
      p0: start,
      p1: control1,
      p2: control2,
      p3: finish,
      lineCap: 'round',
      ...props,
    });
  }
}
