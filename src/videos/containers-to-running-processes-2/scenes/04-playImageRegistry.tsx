import {
  all,
  delay,
  easeOutBack,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import {
  PADDING,
  toWorldX,
  toWorldY,
  VIDEO_WIDTH,
  World,
} from "./utils"
import { createDockerImageBox } from "../../../components/docker"
import { createRegistry } from "../../../components/registries"

export const playImageRegistry = function* (world: World): ThreadGenerator {
  const { liftedCommand, terminal } = world.elements ?? {}

  if (!liftedCommand) {
    return
  }

  // The terminal did its one honest job in the intro — showing the pull log —
  // so it bows out for good here instead of lingering as a corner chip. The
  // phase rail now carries where we are; the lifted command fades with it.
  terminal?.node.remove()
  world.elements.terminal = undefined

  yield* liftedCommand.phrase.node.opacity(0, 1.2)

  yield* waitFor(1)

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
  // world.cancellation.registryBreath = yield loop(Infinity, () =>
  //   registry.node
  //     .stroke("#a1a1a1", 1.6, easeInOutCubic)
  //     .to("#5a5a5a", 1.6, easeInOutCubic),
  // )

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
}
