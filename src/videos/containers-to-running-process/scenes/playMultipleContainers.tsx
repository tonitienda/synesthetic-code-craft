import {
  all,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import { Rect, Txt } from "@motion-canvas/2d"
import {
  SharedImageBase,
  createContainerCard,
} from "../../../components/docker"
import { createFileChip } from "../../../components/filesystem"
import { containerColors, theme } from "../theme"
import { World, rotatePhaseToken, Theme, VIDEO_WIDTH } from "./utils"

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

  // The shared read-only image is the foundation, so it must NOT move. We read
  // where the single collapsed bar sits, then present that image as the distinct
  // read-only layers it is actually made of — the stack every container shares.
  const readonlyNode = imageFs.layers[0].node
  const roPos = readonlyNode.absolutePosition()
  const roW = readonlyNode.width()
  const roH = readonlyNode.height()

  // Detach the collapsed bar, pinned in place, so it can cross-fade into the
  // layered view while the old panel chrome fades around it. The cards live in
  // world.stage() alongside it, so we work in the base's LOCAL space.
  readonlyNode.remove()
  world.stage().add(readonlyNode)
  readonlyNode.absolutePosition(roPos)
  const baseLocal = readonlyNode.position()

  // Build the shared image as its read-only layers (app files on top → base
  // filesystem at the bottom), bottom-aligned to where the single bar sat so it
  // reads as that image expanding into the layers it is composed of. Each layer
  // is locked; nothing here is ever written — that is the whole point.
  const roLabels = [
    "application files",
    "runtime dependencies",
    "packages",
    "base filesystem",
  ] // top → bottom
  const layerH = 42
  const layerGap = 6
  const stackPad = 8
  const stackH =
    stackPad * 2 + roLabels.length * layerH + (roLabels.length - 1) * layerGap
  const stackBottom = baseLocal.y + roH / 2
  const stackCenterY = stackBottom - stackH / 2

  const sharedStack = (
    <Rect
      layout
      direction={"column"}
      gap={layerGap}
      padding={stackPad}
      alignItems={"center"}
      justifyContent={"center"}
      width={roW}
      height={stackH}
      radius={14}
      fill={theme.surface + "55"}
      stroke={containerColors.readonly + "55"}
      lineWidth={2}
      position={[baseLocal.x, stackCenterY]}
      opacity={0}
    >
      {roLabels.map((lbl) => (
        <Rect
          layout
          alignItems={"center"}
          justifyContent={"start"}
          paddingLeft={26}
          width={"100%"}
          height={layerH}
          radius={10}
          fill={theme.surfaceRaised + "88"}
          stroke={containerColors.readonly + "99"}
          lineWidth={2}
        >
          <Txt text={`${lbl}  🔒`} fontSize={20} fill={theme.primary.on} />
        </Rect>
      ))}
    </Rect>
  ) as Rect
  world.stage().add(sharedStack)

  const base: SharedImageBase = { node: sharedStack }

  // Two container boxes sit directly on top of the shared layer stack.
  const topEdgeY = stackCenterY - stackH / 2
  const cardHeight = 320
  const cardCenterY = topEdgeY - cardHeight / 2
  const cardWidthPx = Math.round(VIDEO_WIDTH * 0.45)
  const aTargetX = baseLocal.x - 500
  const bTargetX = baseLocal.x + 500

  // web-1 begins AS the single container, covering the whole stack. We give it
  // its final layout width right away and use scale.x to make it *look*
  // full-width — so the later shrink is a smooth stretch, not a content reflow.
  const A = createContainerCard("web-1", theme)
  A.node.width(cardWidthPx)
  A.node.scale.x(roW / cardWidthPx)
  A.node.position([baseLocal.x, cardCenterY])
  A.node.opacity(0)
  world.stage().add(A.node)

  // The collapsed bar expands into its layers as the old panel fades and web-1
  // takes shape over it.
  yield* all(
    imageFs.node.opacity(0, 0.6),
    readonlyNode.opacity(0, 0.6),
    sharedStack.opacity(1, 0.6),
    A.node.opacity(1, 0.6),
  )
  imageFs.node.remove()
  readonlyNode.remove()

  // Hold on the single container so "a single container on top of a read-only
  // image" lands before we add the second one.
  yield* waitFor(1.0)

  // web-2 is ADDED, not split off. Docker doesn't copy the image — so first web-1
  // settles to its resting size and slides aside to make room, the read-only
  // stack staying exactly where it is.
  yield* all(
    A.node.scale.x(1, 0.9, easeInOutCubic),
    A.node.x(aTargetX, 0.9, easeOutBack),
  )

  // Then a brand-new container is instantiated on the SAME shared image: web-2
  // rises out of the base at its resting spot and inflates into place with an
  // elastic settle, while the base flashes once to say both containers share
  // this one read-only image.
  const B = createContainerCard("web-2", theme)
  B.node.width(cardWidthPx)
  B.node.position([bTargetX, cardCenterY + 52])
  B.node.scale(0.72)
  B.node.opacity(0)
  world.stage().add(B.node)

  yield* all(
    base.node
      .stroke(theme.primary.base, 0.35, easeOutCubic)
      .to(theme.primary.base + "99", 0.7),
    B.node.opacity(1, 0.5, easeOutCubic),
    B.node.y(cardCenterY, 0.78, easeOutBack),
    B.node.scale(1, 0.78, easeOutBack),
  )
  B.node.y(cardCenterY)

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
  //     .fill(theme.success.on, 0.7, easeInOutCubic)
  //     .to(theme.success.base, 0.7, easeInOutCubic),
  // )
  // world.cancellation.heartB = yield loop(Infinity, () =>
  //   B.dot
  //     .fill(theme.success.on, 0.7, easeInOutCubic)
  //     .to(theme.success.base, 0.7, easeInOutCubic),
  // )

  // `run` is complete for both containers — the phase breadcrumb has done its
  // job and bows out before the namespace/cgroup deep-dives take over the top.
  const rail = world.elements.phaseRail
  if (rail) {
    yield* rail.retract()
  }

  world.elements.sharedImage = base
  world.elements.containerA = A
  world.elements.containerB = B
}
