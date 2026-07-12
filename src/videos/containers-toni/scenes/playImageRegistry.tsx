import {
  all,
  delay,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  loop,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import {
  colors,
  PADDING,
  Theme,
  toWorldX,
  toWorldY,
  VIDEO_WIDTH,
  World,
} from "./utils"
import { createDockerImageBox } from "../../../components/docker"
import { createRegistry } from "../../../components/registries"

function* rotatePhaseToken(
  world: World,
  next: string,
  color: string,
): ThreadGenerator {
  const token = world.elements?.phaseToken

  if (!token) {
    return
  }

  yield* token.scale.y(0, 0.16, easeInCubic)
  token.text(next)
  token.fill(color)
  yield* token.scale.y(1, 0.22, easeOutBack)
}

export const playImageRegistry = function* (world: World): ThreadGenerator {
  const { liftedCommand, terminal } = world.elements ?? {}

  if (!liftedCommand || !terminal) {
    return
  }

  // The command doesn't leave — it docks in the top-left corner as a small
  // persistent banner that will narrate which phase of `run` we're in. The
  // terminal comes back too, but smaller: from here on it's a prop, not the
  // protagonist.
  yield* all(
    liftedCommand.phrase.node.position([-710, -486], 1.2, easeInOutCubic),
    liftedCommand.phrase.node.scale(0.5, 1.2, easeInOutCubic),
    // The lift kept the terminal's tight token gap; at banner size the words
    // fuse together, so open it up to a proper word space.
    liftedCommand.phrase.node.gap(44, 1.2, easeInOutCubic),
    terminal.node.opacity(1, 1),
    terminal.node.scale(0.62, 1.2, easeInOutCubic),
    terminal.node.position([-600, 40], 1.2, easeInOutCubic),
  )

  world.elements.phaseToken = liftedCommand.phrase.token("run")

  // First act of `run`: pull.
  yield* rotatePhaseToken(world, "pull", Theme.text)

  const sourceCommand = terminal.command("docker run nginx")

  if (!sourceCommand) {
    return
  }

  const nginxToken = sourceCommand.token("nginx")

  if (!nginxToken) {
    return
  }

  yield* nginxToken.fill(Theme.highlight, 0.5)

  // Create the Registry visual on the right.
  const registry = createRegistry()
  registry.node.position([
    toWorldX(
      VIDEO_WIDTH - registry.node.width() - PADDING,
      registry.node.width(),
    ),
    toWorldY(PADDING, registry.node.height()),
  ])
  registry.node.opacity(0)
  registry.node.scale(0.92)

  // Breathe with a soft glow — pulse the border brighter and back — instead of
  // scaling, so the panel never shimmers or nudges its neighbours.
  world.cancellation.registryBreath = yield loop(Infinity, () =>
    registry.node
      .stroke("#94a3b8", 1.6, easeInOutCubic)
      .to("#64748b", 1.6, easeInOutCubic),
  )

  world.stage().add(registry.node)

  // // Create an overlay Docker-image object from the "nginx" token.
  const nginxImage = createDockerImageBox("nginx")
  world.overlay().add(nginxImage.node)

  // // Start the box exactly over the title token.
  // nginxImage.node.position(
  //   scenePointFromAbsolute(nginxToken.absolutePosition()),
  // )
  nginxImage.node.opacity(0)
  nginxImage.node.scale(0.8)
  nginxImage.node.absolutePosition(registry.imageSlotPosition())

  yield* all(
    registry.node.opacity(1, 1),
    registry.node.scale(1, 1, easeOutBack),
    delay(
      3,
      all(
        nginxImage.node.opacity(1, 0.6),
        nginxImage.node.scale(1, 0.8, easeOutBack),
      ),
    ),
  )

  yield* waitFor(1.5)

  if (!world.elements) {
    world.elements = {}
  }
  world.elements.registryImage = nginxImage
  world.elements.registry = registry

  yield* nginxToken.fill(Theme.text, 0.5)
}
