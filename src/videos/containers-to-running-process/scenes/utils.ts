import { Layout, Txt } from "@motion-canvas/2d"
import {
  Reference,
  SoundBuilder,
  ThreadGenerator,
} from "@motion-canvas/core"
import { LiftedCommandPhrase } from "../../../choreography"
import { Terminal } from "../../../components"
import { theme } from "../theme"
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

/**
 * The persistent phase breadcrumb (pull → create → start). Built once in the
 * run-breakdown scene and driven by `rotatePhaseToken` as the video advances.
 */
export type PhaseRail = {
  node: Layout
  reveal: () => ThreadGenerator
  dock: () => ThreadGenerator
  activate: (name: string) => ThreadGenerator
  retract: () => ThreadGenerator
}

export type World = {
  narrator: Reference<Txt>
  background: Reference<Layout>
  stage: Reference<Layout>
  overlay: Reference<Layout>
  music?: SoundBuilder
  elements: {
    terminal?: Terminal
    liftedCommand?: LiftedCommandPhrase
    /** Persistent pull → create → start breadcrumb; lights the current phase. */
    phaseRail?: PhaseRail
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
  highlight: theme.highlight,
  text: theme.textSoft,
}

export const colors = {
  bg: theme.bg,
  muted: theme.textMuted,
  amber: theme.highlight,
}

export // Advance the phase breadcrumb to the next step of `run`: light the named
// step (pull / create / start) and settle the previous one as completed. An
// unknown name (e.g. the `run` umbrella) just closes out the last active step.
function* rotatePhaseToken(
  world: World,
  next: string,
  _color: string,
): ThreadGenerator {
  const rail = world.elements?.phaseRail

  if (!rail) {
    return
  }

  yield* rail.activate(next)
}
