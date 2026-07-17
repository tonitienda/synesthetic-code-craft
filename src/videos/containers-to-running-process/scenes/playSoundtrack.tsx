import { Txt } from "@motion-canvas/2d"
import {
  PlaybackState,
  Reference,
  usePlayback,
  waitFor,
  sound,
} from "@motion-canvas/core"
import { World } from "./utils"

export function* playSoundtrack(world: World): Generator<any, void, any> {
  const music = sound("/audio/Dream Culture.mp3")
  const bird = sound("/audio/nightingale-33000.mp3")
  music.gain(-10)

  yield* waitFor(21)
  music.play()
  yield* waitFor(9)
  bird.trim(4, 7).play()
}
