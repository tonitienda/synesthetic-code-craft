import { Layout, Txt } from "@motion-canvas/2d"
import {
  easeInCubic,
  easeOutBack,
  Reference,
  SoundBuilder,
  ThreadGenerator,
} from "@motion-canvas/core"
import { LiftedCommandPhrase } from "../../../choreography"
import { defaultTerminalTheme, Terminal } from "../../../components"
import { LocalSystem, Registry } from "../../../components/registries"
import {
  ContainerCard,
  DockerImage,
  SharedImageBase,
} from "../../../components/docker"
import { FileSystem } from "../../../components/filesystem"

export const VIDEO_WIDTH = 1920
export const VIDEO_HEIGHT = 1080
export const PADDING = 24

export const toWorldX = (x: number, width: number) =>
  x - VIDEO_WIDTH / 2 + width / 2
export const toWorldY = (y: number, height: number) =>
  y - VIDEO_HEIGHT / 2 + height / 2

export type World = {
  narrator: Reference<Txt>
  background: Reference<Layout>
  stage: Reference<Layout>
  overlay: Reference<Layout>
  music?: SoundBuilder
  elements: {
    liftedCommand?: LiftedCommandPhrase
    /** The middle token of the docked command banner — rotates run/pull/create/start. */
    phaseToken?: Txt
    registry?: Registry
    localSystem?: LocalSystem // We will need a different type here for the fs layers, etc
    registryImage?: DockerImage
    localImage?: DockerImage
    imageFs?: FileSystem
    sharedImage?: SharedImageBase
    containerA?: ContainerCard
    containerB?: ContainerCard
  }
  cancellation: {
    registryBreath?: ThreadGenerator
    localSystemBreath?: ThreadGenerator
    imageFloat?: ThreadGenerator
    heartA?: ThreadGenerator
    heartB?: ThreadGenerator
  }
}

export const Theme = {
  highlight: "#facc15",
  text: defaultTerminalTheme.text,
}

export const colors = {
  bg: "#090b1a",
  muted: "#94a3b8",
  amber: "#facc15",
}

export // Flip the banner's middle token to the next phase of `run` — a little
// split-flap roll: the word folds shut, swaps, and springs back open.
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
