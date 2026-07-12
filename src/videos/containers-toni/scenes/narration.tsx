import { Txt } from "@motion-canvas/2d"
import { Reference, waitFor } from "@motion-canvas/core"
import { World } from "./utils"
import narrationsData from "../narrations.json"

const NARRATION_ENABLED = true

type Narration = {
  text: string
  totalDuration: number
  path?: string
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
  for (const narration of narrationsData as Narration[]) {
    yield* narrate(world.narrator, narration.text, narration.totalDuration)
  }
}
export function* playNarrationVoice(world: World): Generator<any, void, any> {
  for (const narration of narrationsData as Narration[]) {
    if (narration.path) {
      const audio = new Audio(narration.path)
      audio.play()
      yield* waitFor(narration.totalDuration)
    } else {
      yield* narrate(world.narrator, narration.text, narration.totalDuration)
    }
  }
}
