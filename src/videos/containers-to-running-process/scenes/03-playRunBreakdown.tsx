import { Txt } from "@motion-canvas/2d"
import { ThreadGenerator, waitFor } from "@motion-canvas/core"
import { colors, Theme, World } from "./utils"
import { createPhaseRail } from "./phaseRail"

export const playRunBreakdown = function* (world: World): ThreadGenerator {
  const { liftedCommand } = world.elements ?? {}

  if (!liftedCommand) {
    return
  }

  const runToken = liftedCommand.phrase.token("run") as Txt | undefined

  // `docker run` is really three steps. Teach them as cards, then graduate the
  // same cards into the persistent breadcrumb that will track where we are for
  // the rest of the video.
  const rail = createPhaseRail()
  world.overlay().add(rail.node)
  world.elements.phaseRail = rail

  yield* runToken ? runToken.fill(colors.amber, 0.4) : waitFor(0)

  yield* waitFor(3)

  yield* rail.reveal()

  yield* waitFor(1)

  // The cards collapse up into the compact rail; the `run` token relaxes back to
  // its resting colour now that its three parts are on screen as the map.
  yield* rail.dock()
  yield* runToken ? runToken.fill(Theme.text, 0.4) : waitFor(0)

  yield* waitFor(1)
}
