import Matter from 'matter-js';

export interface MatterBodySample {
  x: number;
  y: number;
  angle: number;
}

export type MatterTimeline = Record<number, MatterBodySample[]>;

/**
 * Precompute a fixed-step Matter.js world so Motion Canvas remains the owner
 * of playback, seeking, and rendering. No requestAnimationFrame runner is used.
 */
export function captureMatterTimeline(
  engine: Matter.Engine,
  bodies: Matter.Body[],
  duration: number,
  beforeStep?: (step: number) => void,
  fps = 60,
): MatterTimeline {
  const timeline: MatterTimeline = {};
  for (const body of bodies) {
    timeline[body.id] = [];
  }
  const steps = Math.ceil(duration * fps);

  for (let step = 0; step <= steps; step += 1) {
    beforeStep?.(step);
    for (const body of bodies) {
      timeline[body.id].push({
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
      });
    }
    Matter.Engine.update(engine, 1000 / fps);
  }

  return timeline;
}

export function sampleMatterBody(
  timeline: MatterTimeline,
  body: Matter.Body,
  progress: number,
): MatterBodySample {
  const frames = timeline[body.id];
  const frame = Math.max(0, Math.min(frames.length - 1, progress * (frames.length - 1)));
  const fromIndex = Math.floor(frame);
  const toIndex = Math.min(frames.length - 1, fromIndex + 1);
  const amount = frame - fromIndex;
  const from = frames[fromIndex];
  const to = frames[toIndex];

  return {
    x: from.x + (to.x - from.x) * amount,
    y: from.y + (to.y - from.y) * amount,
    angle: from.angle + (to.angle - from.angle) * amount,
  };
}
