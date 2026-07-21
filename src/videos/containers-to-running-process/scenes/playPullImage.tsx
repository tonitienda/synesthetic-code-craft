import {
  ThreadGenerator,
  cancel,
  loop,
  easeInOutCubic,
  all,
  easeOutBack,
  waitFor,
  chain,
  easeInCubic,
  easeOutCubic,
  delay,
} from "@motion-canvas/core"
import { containerColors, createDockerImageBox } from "../../../components/docker"
import { createLocalsystem } from "../../../components/registries"
import { impact, transferRibbon } from "../../../choreography"
import {
  PADDING,
  rotatePhaseToken,
  Theme,
  toWorldX,
  toWorldY,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  World,
} from "./utils"

// TODO - Show mini terminal in the host
// Show "Docker Daemon". Narrator says: Docker itself, and the terminal you're typing into, both run right there.
// Should we also show "Docker Daemon" in the host panel?

export const playPullImage = function* (world: World): ThreadGenerator {
  const { registryImage, registry } = world.elements ?? {}
  //const { registryBreath } = world.cancellation ?? {}

  if (!registryImage || !registry) {
    return
  }

  // First act of `run`: pull.
  yield* rotatePhaseToken(world, "pull", Theme.text)

  const localSystem = createLocalsystem()
  // Frame the local system as "the host" from the very first time we see it, so
  // it can persist unchanged all the way through to the container scenes.
  localSystem.title().text("Your machine — the host")

  // Tall enough to hold the terminal (docked into its left half in a moment),
  // with the image slot pushed to the right half to make room for it.
  localSystem.node.height(740)
  localSystem.slot().margin.left(500)

  localSystem.node.position([
    toWorldX(
      VIDEO_WIDTH - localSystem.node.width() - PADDING,
      localSystem.node.width(),
    ),
    toWorldY(
      VIDEO_HEIGHT - PADDING - localSystem.node.height(),
      localSystem.node.height(),
    ),
  ])
  localSystem.node.opacity(0)
  localSystem.node.scale(0.92)

  // Hand the "breathing" glow over: settle the registry's border back to rest,
  // and start the same soft pulse on the local system instead.
  // cancel(registryBreath)
  // yield* registry.node.stroke("#64748b", 0.4)

  // world.cancellation.localSystemBreath = yield loop(Infinity, () =>
  //   localSystem.node
  //     .stroke("#94a3b8", 1.6, easeInOutCubic)
  //     .to("#64748b", 1.6, easeInOutCubic),
  // )

  world.stage().add(localSystem.node)

  // The host panel wraps the terminal as it appears: the terminal glides into
  // the panel's left half while the box materialises around it — no words
  // needed, the containment says it. (The terminal joined the stage before the
  // panel, so bring it in front first.)
  //terminal.node.moveToTop()
  yield* all(
    localSystem.node.opacity(1, 1),
    localSystem.node.scale(1, 1, easeOutBack),
    //terminal.node.position([311, 165], 1.4, easeInOutCubic),
    // terminal.node.scale(0.55, 1.4, easeInOutCubic),
  )

  yield* waitFor(1.5)

  // const findLocallyLine = terminal.outputLine(
  //   "Unable to find image 'nginx:latest' locally",
  // )

  // if (!findLocallyLine) {
  //   return
  // }

  // yield* all(findLocallyLine.textRef().fill(Theme.highlight, 0.5))

  yield* waitFor(2)

  // const pullLine = terminal.outputLine("latest: Pulling from library/nginx")

  // if (!pullLine) {
  //   return
  // }

  // yield* all(
  //   findLocallyLine.textRef().fill(Theme.text, 0.5),
  //   pullLine.textRef().fill(Theme.highlight, 0.5),
  // )

  const localSlotCenter = localSystem.slot().absolutePosition()
  const cx = localSlotCenter.x
  const cy = localSlotCenter.y

  const localImage = createDockerImageBox("nginx")
  localImage.node.position(registryImage.node.position())
  localImage.node.opacity(0)
  localImage.node.scale(1)

  world.overlay().add(localImage.node)

  // Pull = flow: a soft cyan ribbon copies the image out of the registry and
  // into the host. The registry copy stays put — this reads as a copy, not a
  // move — and the ribbon's final segment snaps into the destination slot.
  yield* transferRibbon({
    overlay: world.overlay(),
    from: registryImage.node.absolutePosition(),
    to: [cx, cy],
    color: containerColors.readonly,
    width: 14,
    duration: 1,
  })

  // Drop the image like it's falling into water: accelerate down, plunge just
  // past the resting spot, squash on impact, then bob back up and settle.
  yield* all(
    localImage.node.opacity(1, 0.3),
    chain(
      localImage.node.absolutePosition([cx, cy + 30], 0.8, easeInCubic),
      localImage.node.absolutePosition([cx, cy - 16], 0.28, easeOutCubic),
      localImage.node.absolutePosition([cx, cy + 6], 0.22, easeInOutCubic),
      localImage.node.absolutePosition([cx, cy], 0.2, easeOutCubic),
    ),
    chain(
      localImage.node.scale([0.94, 1.08], 0.8, easeInCubic), // stretch as it falls
      localImage.node.scale([1.2, 0.78], 0.16), // squash on impact
      localImage.node.scale([0.9, 1.1], 0.22), // stretch off the bounce
      localImage.node.scale(1, 0.3, easeOutBack), // settle with a tiny overshoot
    ),
  )

  // The host receives the impact: one soft ripple through the panel, a brief
  // border brighten, and a shallow press of the image into the slot. Both the
  // moving object and the receiving surface react.
  yield* all(
    impact({
      overlay: world.overlay(),
      at: [cx, cy],
      color: containerColors.readonly,
      size: localSystem.slot().width(),
      surface: localSystem.node,
    }),
    chain(
      localImage.node.position.y(localImage.node.y() + 5, 0.12, easeOutCubic),
      localImage.node.position.y(localImage.node.y(), 0.28, easeOutBack),
    ),
  )

  yield* waitFor(1.5)
  // yield* all(
  // //  pullLine.textRef().fill(Theme.text, 0.5),
  //   // The terminal has done its one honest job: showing the pull. `docker run`
  //   // prints nothing for create or start, so instead of leaving it hanging
  //   // around as a chip, we let it bow out the moment pull is complete.
  //   // (Not terminal.exit() — that would tween scale back UP to 0.96 from the
  //   // docked 0.55; shrink it away in place instead.)
  //   delay(
  //     2,
  //   //  all(terminal.node.opacity(0, 0.9), terminal.node.scale(0.48, 0.9)),
  //   ),
  // )
  //terminal.node.remove()

  yield* waitFor(1)

  world.elements.localImage = localImage
  world.elements.localSystem = localSystem
}
