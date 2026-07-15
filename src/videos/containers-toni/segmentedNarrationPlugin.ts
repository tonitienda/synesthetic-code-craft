import type {Player, Plugin} from '@motion-canvas/core';

import narrationsData from './narrations.json';
import narrationsVoiceData from './scenes/narrations-audio.json';

type NarrationVoiceManifestItem = {
  id: string;
  path?: string;
  timelineStart?: number;
  timelineEnd?: number;
  totalDuration?: number;
};

type NarrationSegment = {
  id: string;
  start: number;
  end: number;
  path: string;
};

const segments: NarrationSegment[] = (() => {
  let cursor = 0;

  return (narrationsVoiceData as NarrationVoiceManifestItem[])
    .map((narration, index) => {
      const fallbackDuration = narrationsData[index]?.totalDuration ?? 0;
      const totalDuration = narration.totalDuration ?? fallbackDuration;
      const start = narration.timelineStart ?? cursor;
      const end = narration.timelineEnd ?? start + totalDuration;
      const path = narration.path;

      if (!path || end <= start) {
        cursor = Math.max(cursor, end, start + Math.max(totalDuration, 0));
        return null;
      }

      const segment = {
        id: narration.id,
        start,
        end,
        path,
      };

      cursor = Math.max(cursor, segment.end);
      return segment;
    })
    .filter((segment): segment is NarrationSegment => segment !== null);
})();

function findSegmentAt(time: number): NarrationSegment | null {
  return (
    segments.find((segment) => time >= segment.start && time < segment.end) ??
    null
  );
}

function stopAudio(audio: HTMLAudioElement | null): void {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

export default function segmentedNarrationPlugin(): Plugin {
  return {
    name: 'synesthetic-code-craft/segmented-narration',
    player(player: Player) {
      let activeAudio: HTMLAudioElement | null = null;
      let activeSegmentId: string | null = null;
      let lastFrame = player.playback.frame;

      const syncVolume = () => {
        const state = player.onStateChanged.current;
        if (!activeAudio) return;
        activeAudio.muted = state.muted;
        activeAudio.volume = state.volume;
      };

      const playSegmentForCurrentTime = () => {
        const state = player.onStateChanged.current;
        const time = player.status.framesToSeconds(player.playback.frame);
        const segment = findSegmentAt(time);

        if (state.paused || !segment) {
          stopAudio(activeAudio);
          activeAudio = null;
          activeSegmentId = null;
          return;
        }

        const offset = Math.max(0, time - segment.start);
        const shouldRestart =
          activeSegmentId !== segment.id ||
          !activeAudio ||
          Math.abs(activeAudio.currentTime - offset) > 0.2;

        if (!shouldRestart) {
          syncVolume();
          return;
        }

        stopAudio(activeAudio);

        const audio = new Audio(segment.path);
        audio.preload = 'auto';
        audio.muted = state.muted;
        audio.volume = state.volume;
        activeAudio = audio;
        activeSegmentId = segment.id;

        const startPlayback = () => {
          if (activeAudio !== audio) return;
          audio.currentTime = offset;
          void audio.play().catch((error) => {
            console.warn(`Unable to play narration audio for ${segment.path}`, error);
          });
        };

        if (audio.readyState >= 1) {
          startPlayback();
        } else {
          audio.addEventListener('loadedmetadata', startPlayback, {once: true});
        }
      };

      player.onStateChanged.subscribe(() => {
        playSegmentForCurrentTime();
      });

      player.onFrameChanged.subscribe((frame) => {
        const jumped = Math.abs(frame - lastFrame) > 1;
        lastFrame = frame;

        if (player.onStateChanged.current.paused) {
          if (activeAudio) {
            stopAudio(activeAudio);
            activeAudio = null;
            activeSegmentId = null;
          }
          return;
        }

        if (jumped) {
          playSegmentForCurrentTime();
          return;
        }

        const time = player.status.framesToSeconds(frame);
        const segment = findSegmentAt(time);

        if (!segment) {
          stopAudio(activeAudio);
          activeAudio = null;
          activeSegmentId = null;
          return;
        }

        if (segment.id !== activeSegmentId) {
          playSegmentForCurrentTime();
          return;
        }

        syncVolume();
      });
    },
  };
}
