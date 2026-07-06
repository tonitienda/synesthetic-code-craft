import {Layout} from '@motion-canvas/2d';
import {all} from '@motion-canvas/core';
import {CommandPhrase, createCommandPhrase} from '../components/commandPhrase';
import type {
  CommandPhraseOptions,
  CommandPhraseRestyleOptions,
  CommandPhraseSnapshot,
} from '../components/commandPhrase';

export type LiftPoint = [number, number] | {x: number | (() => number); y: number | (() => number)};
export type LiftAnimation = Generator<unknown, void, unknown>;

export interface LiftableCommandPhrase {
  node: Layout;
  snapshot(): CommandPhraseSnapshot;
  hide(duration?: number): LiftAnimation;
  show?(duration?: number): LiftAnimation;
}

export interface LiftCommandPhraseOptions {
  overlay: Layout;
  to: LiftPoint;
  from?: LiftPoint;
  phrase?: CommandPhraseOptions;
  restyle?: CommandPhraseRestyleOptions;
  duration?: number;
  sourceFadeDuration?: number;
  hideSource?: boolean;
  startScale?: number;
  targetScale?: number;
}

export interface LiftedCommandPhrase {
  phrase: CommandPhrase;
  animation: LiftAnimation;
}

export function liftCommandPhrase(
  source: LiftableCommandPhrase,
  options: LiftCommandPhraseOptions,
): LiftedCommandPhrase {
  const sourceSnapshot = source.snapshot();
  const phrase = createCommandPhrase(sourceSnapshot, options.phrase);
  const from = resolvePoint(options.from ?? absolutePosition(source.node));
  const to = resolvePoint(options.to);
  const duration = options.duration ?? 0.75;
  const sourceFadeDuration = options.sourceFadeDuration ?? 0.12;
  const startScale = options.startScale ?? 1;
  const targetScale = options.targetScale ?? 1;

  phrase.node.position(from);
  phrase.node.scale(startScale);
  phrase.node.opacity(0);
  options.overlay.add(phrase.node);

  function* animation() {
    phrase.node.opacity(1);

    const animations: LiftAnimation[] = [
      phrase.node.position(to, duration),
      phrase.node.scale(targetScale, duration),
    ];

    if (options.restyle) {
      animations.push(phrase.restyle(options.restyle, duration));
    }

    if (options.hideSource ?? true) {
      animations.push(source.hide(sourceFadeDuration));
    }

    yield* all(...animations);
  }

  return {
    phrase,
    animation: animation(),
  };
}

function absolutePosition(node: Layout): LiftPoint {
  return node.absolutePosition() as unknown as LiftPoint;
}

function resolvePoint(point: LiftPoint): [number, number] {
  if (Array.isArray(point)) {
    return point;
  }

  return [resolveAxis(point.x), resolveAxis(point.y)];
}

function resolveAxis(axis: number | (() => number)) {
  return typeof axis === 'function' ? axis() : axis;
}
