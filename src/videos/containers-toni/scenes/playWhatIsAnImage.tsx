import {
  ThreadGenerator,
  cancel,
  all,
  easeInOutCubic,
  chain,
} from "@motion-canvas/core"
import { createFileSystemLayers } from "../../../components/filesystem"
import { World, VIDEO_HEIGHT, PADDING, toWorldY } from "./utils"

export const playWhatIsAnImage = function* (world: World): ThreadGenerator {
  const { registry, localSystem, registryImage, localImage } =
    world.elements ?? {}

  if (!registry || !localSystem || !registryImage || !localImage) {
    return
  }

  // The image is about to be reshaped into layers, so stop its idle float first
  // to avoid fighting the upcoming position tweens.
  // if (world.cancellation.imageFloat) {
  //   cancel(world.cancellation.imageFloat)
  // }

  const localSystemTargetHeight = VIDEO_HEIGHT - PADDING * 2

  // The terminal has already bowed out after the pull, so the host panel can
  // take centre stage. Slide it to the middle and grow it to fill the frame, so
  // it reads as the subject we're about to open up rather than a sidebar.
  const focusX = 0

  yield* all(
    registry.node.y(-1000, 2),
    registryImage.node.y(-1000, 2),
    localSystem.node.x(focusX, 2, easeInOutCubic),
    localImage.node.x(focusX, 2, easeInOutCubic),
    localSystem.node.height(localSystemTargetHeight, 2),
    localSystem.node.y(toWorldY(PADDING, localSystemTargetHeight), 2),
  )

  yield* all(
    chain(
      localImage.node.width(localSystem.node.width() - PADDING * 2, 2),
      all(
        localImage.node.height(VIDEO_HEIGHT / 2 - PADDING, 2),
        localImage.node.y(
          toWorldY(VIDEO_HEIGHT / 2 - PADDING, VIDEO_HEIGHT / 2 - PADDING),
          2,
        ),
      ),
    ),
  )

  const fsLayers = createFileSystemLayers(
    localImage.node.width(),
    localImage.node.height(),
    localImage.node.x(),
    localImage.node.y(),
    "nginx",
    [
      "base filesystem",
      "packages",
      "runtime dependencies",
      "application files",
    ],
  )
  fsLayers.node.opacity(0)
  world.overlay().add(fsLayers.node)

  yield* all(
    localImage.node.opacity(0, 0.5),
    localSystem.slot().opacity(0, 0.5),
    fsLayers.node.opacity(1, 0.5),
  )
  yield* all(fsLayers.appear(0.5))

  yield* all(fsLayers.collapse("image fs (read-only)", 3))

  world.elements.imageFs = fsLayers
}
