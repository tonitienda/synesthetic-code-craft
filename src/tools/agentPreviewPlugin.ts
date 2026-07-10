import type {Plugin} from '@motion-canvas/core/lib/plugin';
import type {Player} from '@motion-canvas/core';

declare global {
  interface Window {
    motionCanvasAgent?: {
      player: Player;
      seek: (seconds: number) => void;
      frame: () => number;
      time: () => number;
      duration: () => number;
    };
  }
}

function readTimeParam(): number | null {
  const params = new URLSearchParams(window.location.search);
  const value = params.get('ts') ?? params.get('time') ?? params.get('t');
  if (value === null) return null;

  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

function readFrameParam(): number | null {
  const params = new URLSearchParams(window.location.search);
  const value = params.get('frame');
  if (value === null) return null;

  const frame = Number(value);
  return Number.isFinite(frame) && frame >= 0 ? Math.round(frame) : null;
}

function installUrlSync(player: Player): void {
  const seekToSeconds = (seconds: number) => {
    player.togglePlayback(false);
    player.requestSeek(player.status.secondsToFrames(seconds));
    player.requestRender();
  };

  window.motionCanvasAgent = {
    player,
    seek: seekToSeconds,
    frame: () => player.playback.frame,
    time: () => player.status.framesToSeconds(player.playback.frame),
    duration: () => player.status.framesToSeconds(player.playback.duration),
  };

  const targetFrame = readFrameParam();
  const targetSeconds = readTimeParam();
  if (targetFrame !== null) {
    player.togglePlayback(false);
    player.requestSeek(targetFrame);
    player.requestRender();
  } else if (targetSeconds !== null) {
    seekToSeconds(targetSeconds);
  }

  const writeUrl = (frame: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('frame', String(frame));
    params.set('ts', player.status.framesToSeconds(frame).toFixed(3));
    const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState(null, '', next);
  };

  let lastWrite = 0;
  player.onFrameChanged.subscribe(frame => {
    const now = performance.now();
    if (now - lastWrite < 250) return;
    lastWrite = now;
    writeUrl(frame);
  });
}

export default function agentPreviewPlugin(): Plugin {
  return {
    name: 'synesthetic-code-craft/agent-preview',
    player(player) {
      installUrlSync(player);
    },
  };
}
