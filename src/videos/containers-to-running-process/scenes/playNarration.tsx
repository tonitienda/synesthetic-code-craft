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

const narrationsVoiceDataMap: Record<string, any> = narrationsVoiceData.reduce(
  (acc, narration) => {
    acc[narration.id] = narration
    return acc
  },
  {} as Record<string, any>,
)

const narrationsDataMap: Record<string, any> = narrationsData.reduce(
  (acc, narration) => {
    acc[narration.id] = narration
    return acc
  },
  {} as Record<string, any>,
)

const narrations: Narration[] = Object.values(narrationsVoiceDataMap).map(
  (narration) => ({
    id: narration.id,
    text: narration.text,
    totalDuration: narrationsDataMap[narration.id]?.totalDuration ?? 0,
    sound: sound(narration.path),
  }),
)

type Narration = {
  id: string
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
    //console.log(`Playing narration: "${narration.id}"`)
    // const isPlaying =
    //   playback.state === PlaybackState.Playing ||
    //   playback.state === PlaybackState.Presenting
    // if (narration.sound && isPlaying) {
    narration.sound.play()
    // }
    if (narration.totalDuration === 0) {
      console.warn(
        `Narration "${narration.id}" has a total duration of 0. This may indicate a missing or incorrect entry in the narrations.json file.`,
      )
    }
    yield* waitFor(narration.totalDuration)
  }
}
