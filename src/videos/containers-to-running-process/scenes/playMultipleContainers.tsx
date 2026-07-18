import {
  all,
  delay,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  loop,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import {
  SharedImageBase,
  createContainerCard,
  containerColors,
} from "../../../components/docker"
import { createFileChip } from "../../../components/filesystem"
import { World, rotatePhaseToken, Theme } from "./utils"

export const playMultipleContainers = function* (
  world: World,
): ThreadGenerator {
  const { imageFs } = world.elements ?? {}

  if (!imageFs) {
    return
  }

  // All three phases have played out — the banner settles back to `run`,
  // which is exactly what we're about to do again with a second container.
  yield* rotatePhaseToken(world, "run", Theme.text)

  // The shared read-only image is the foundation, so it must NOT move. We pin it
  // exactly where it already sits and build everything new on top of it, in
  // place. Going from one container to two never disturbs the base — or the host
  // around it, which we deliberately leave untouched.
  const readonlyNode = imageFs.layers[0].node
  const roPos = readonlyNode.absolutePosition()
  const roW = readonlyNode.width()
  const roH = readonlyNode.height()

  // Detach the base from the old container panel, pinned in place, so the panel
  // chrome can fade while the base stays exactly where it is underneath.
  readonlyNode.remove()
  world.stage().add(readonlyNode)
  readonlyNode.absolutePosition(roPos)

  const base: SharedImageBase = { node: readonlyNode }

  // The cards live in world.stage() alongside the base, so place them in the
  // base's LOCAL space — not the absolute space `roPos` is in. (Mixing the two
  // offsets the cards by the stage transform and shoves them off-screen.)
  const baseLocal = readonlyNode.position()

  // Two container boxes sit directly on top of the base — touching it, no gaps
  // and no connector lines — side by side and centred over it.
  const topEdgeY = baseLocal.y - roH / 2
  const cardHeight = 320
  const cardCenterY = topEdgeY - cardHeight / 2
  const cardWidth = "45%"
  const splitX = "50%" // half a card + half the gap between them

  // web-1 begins AS the single container: one full-width box straddling the
  // whole base. Cross-fade the old panel into it so the moment reads as "the
  // container we've been looking at", now drawn as a discrete box on the base.
  const A = createContainerCard("web-1")
  A.node.width(roW)
  A.node.position([baseLocal.x, cardCenterY])
  A.node.opacity(0)
  world.stage().add(A.node)

  yield* all(
    imageFs.node.opacity(0, 0.6),
    A.node.opacity(1, 0.6),
    imageFs.layers[0].label.text("shared image fs (read-only)", 0.6),
  )
  imageFs.node.remove()

  // web-2 SPLITS off from web-1: web-1 shrinks to the left half while web-2
  // emerges to the right — both still resting on the exact same base beneath.
  const B = createContainerCard("web-2")
  B.node.width(cardWidth)
  B.node.position([baseLocal.x, cardCenterY])
  B.node.opacity(0)
  B.node.scale(0.9)
  world.stage().add(B.node)

  // Both cards overshoot their final x by a touch and settle back, and web-2
  // pops in with a small scale-up, so the second container feels born rather
  // than slid into place.
  yield* all(
    A.node.width(cardWidth, 0.9, easeInOutCubic),
    A.node
      .x(baseLocal.x - 500, 0.7, easeOutCubic)
      .to(baseLocal.x - 514, 0.35, easeInOutCubic),
    delay(
      0.15,
      all(
        B.node.opacity(1, 0.75),
        B.node.scale(1, 0.9, easeOutBack),
        B.node
          .x(baseLocal.x + 514, 0.7, easeOutCubic)
          .to(baseLocal.x + 500, 0.35, easeInOutCubic),
      ),
    ),
    // The base glows once to say: both of these rest on the one shared image.
    delay(0.5, base.node.stroke("#7dd3fc", 0.3).to("#7dd3fc99", 0.5)),
  )

  yield* waitFor(0.4)

  // Writes stay isolated to each container's own writable layer.
  const chipA = createFileChip("web-1.log", containerColors.writable)
  chipA.scale(0.8)
  A.chipsRow().add(chipA)

  yield* all(chipA.opacity(1, 0.4), chipA.scale(1, 0.4, easeOutBack))
  yield* waitFor(1.4)

  // Both processes are alive — pulse each status light between a bright and a
  // dim green so they read as steady heartbeats without anything resizing.
  // world.cancellation.heartA = yield loop(Infinity, () =>
  //   A.dot
  //     .fill("#6ee7b7", 0.7, easeInOutCubic)
  //     .to("#10b981", 0.7, easeInOutCubic),
  // )
  // world.cancellation.heartB = yield loop(Infinity, () =>
  //   B.dot
  //     .fill("#6ee7b7", 0.7, easeInOutCubic)
  //     .to("#10b981", 0.7, easeInOutCubic),
  // )

  world.elements.sharedImage = base
  world.elements.containerA = A
  world.elements.containerB = B
}
