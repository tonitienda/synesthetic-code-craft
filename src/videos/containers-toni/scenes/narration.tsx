import { Txt } from "@motion-canvas/2d"
import {
  PlaybackState,
  Reference,
  usePlayback,
  waitFor,
  sound,
} from "@motion-canvas/core"
import { World } from "./utils"
import narrationsData from "../narrations.json"
import narrationsVoiceData from "./narrations-audio.json"

const NARRATION_ENABLED = true

const narrations: Narration[] = narrationsVoiceData.map((narration, idx) => ({
  text: narration.text,
  totalDuration: narrationsData[idx].totalDuration,
  sound: sound(narration.path),
}))

type Narration = {
  text: string
  totalDuration: number
  sound: ReturnType<typeof sound>
}

// This will be internal later on
export function* narrate(
  narrator: Reference<Txt>,
  text: string,
  duration: number,
  delay: number = 0,
): Generator<any, void, any> {
  if (delay > 0) {
    yield* waitFor(delay)
  }
  if (!NARRATION_ENABLED) {
    yield* waitFor(duration)
  } else {
    narrator().text(`"${text}"`)
    // Fade in quickly, hold the line so it stays readable, then fade out.
    // This keeps longer, conversational lines legible instead of only
    // peaking for a single instant.
    const fade = Math.min(0.6, duration / 3)
    const hold = Math.max(0, duration - fade * 2)
    yield* narrator().opacity(1, fade)
    yield* waitFor(hold)
    yield* narrator().opacity(0, fade)
  }
}

export function* playNarration(world: World): Generator<any, void, any> {
  for (const narration of narrations as Narration[]) {
    yield* narrate(world.narrator, narration.text, narration.totalDuration)
  }
}
export function* playNarrationVoice(world: World): Generator<any, void, any> {
  const playback = usePlayback()

  for (const narration of narrations as Narration[]) {
    if (narration.sound && playback.state === PlaybackState.Playing) {
      narration.sound.play()
    }
    yield* waitFor(narration.totalDuration)
  }
}
