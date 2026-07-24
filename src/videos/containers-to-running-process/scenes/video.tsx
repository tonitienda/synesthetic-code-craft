import { Gradient, Layout, Rect, Txt, makeScene2D } from "@motion-canvas/2d"
import {
  all,
  cancel,
  chain,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  loop,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import { colors, VIDEO_WIDTH, World } from "./utils"
import { theme } from "../theme"
import { playNarrationVoice } from "./playNarration"
import { playSoundtrack } from "./playSoundtrack"
import { playIntro } from "./01-playIntro"
import { playSplash } from "./02-playSplash"
import { playImageRegistry } from "./04-playImageRegistry"
import { playPullImage } from "./05-playPullImage"
import { playWhatIsAnImage } from "./playWhatIsAnImage"
import { playWhatIsAContainer } from "./playWhatIsAContainer"
import { playMultipleContainers } from "./playMultipleContainers"
import { playNamespaces } from "./playNamespaces"
import { playCgroups } from "./playCgroups"
import { playClosingScene } from "./playClosingScene"
import { playRunBreakdown } from "./03-playRunBreakdown"

function* playMovie(world: World): ThreadGenerator {
  yield* playIntro(world)
  yield* playSplash(world)
  yield* playRunBreakdown(world)
  yield* playImageRegistry(world)
  yield* playPullImage(world)
  yield* playWhatIsAnImage(world)
  yield* playWhatIsAContainer(world)
  yield* playMultipleContainers(world)
  yield* playNamespaces(world)
  yield* playCgroups(world)
  yield* playClosingScene(world)
}

export default makeScene2D(function* (view) {
  view.fill(colors.bg)

  // The shared environment is layered, not flat, so the whole video reads as one
  // lit physical space rather than a slide backdrop:
  //   1. a deep drifting field (the void)
  //   2. a key-light glow from the upper-left (the project's light direction) —
  //      this is what gives every flat vector object a sense of volume (2.5D)
  //   3. a slow breathing luminosity (the world is *alive*, pulsing light not size)
  //   4. a vignette that frames the content and deepens the corners
  const atmosphere = createRef<Rect>()
  const depthGlow = createRef<Rect>()
  const pulseGlow = createRef<Rect>()
  const vignette = createRef<Rect>()
  const background = createRef<Layout>()
  const stage = createRef<Layout>()
  const overlay = createRef<Layout>()

  const backgroundGradient = new Gradient({
    type: "linear",
    from: [-1120, -680],
    to: [1020, 620],
    stops: [
      { offset: 0, color: theme.background.atmosphere[0] },
      { offset: 0.34, color: theme.background.atmosphere[1] },
      { offset: 0.68, color: theme.background.atmosphere[2] },
      { offset: 1, color: theme.background.atmosphere[3] },
    ],
  })

  // The key light. Anchored upper-left so it agrees with the light direction the
  // material system uses on every object. Its centre drifts in gentle parallax
  // against the base field, which is what actually sells the depth.
  const depthGradient = new Gradient({
    type: "radial",
    from: [-300, -360],
    to: [-300, -360],
    fromRadius: 0,
    toRadius: 1500,
    stops: [
      { offset: 0, color: theme.background.depth[0] },
      { offset: 0.42, color: theme.background.depth[1] },
      { offset: 1, color: theme.background.depth[2] },
    ],
  })

  // A broad, soft central bloom whose *brightness* breathes. This is the world's
  // living pulse — luminosity, never scale — so nothing on stage is nudged.
  const pulseGradient = new Gradient({
    type: "radial",
    from: [0, -40],
    to: [0, -40],
    fromRadius: 120,
    toRadius: 1180,
    stops: [
      { offset: 0, color: theme.background.pulse[0] },
      { offset: 0.5, color: theme.background.pulse[1] },
      { offset: 1, color: theme.background.pulse[2] },
    ],
  })

  // Darkens the corners to hold the eye toward centre stage and add depth.
  const vignetteGradient = new Gradient({
    type: "radial",
    from: [0, 0],
    to: [0, 0],
    fromRadius: 720,
    toRadius: 1500,
    stops: [
      { offset: 0, color: theme.background.vignette[0] },
      { offset: 1, color: theme.background.vignette[1] },
    ],
  })

  view.add(
    <Rect
      ref={atmosphere}
      width={"100%"}
      height={"100%"}
      fill={backgroundGradient}
      opacity={0}
    />,
  )
  view.add(
    <Rect
      ref={depthGlow}
      width={"100%"}
      height={"100%"}
      fill={depthGradient}
      opacity={0}
      scale={0.92}
      compositeOperation={"screen"}
    />,
  )
  view.add(
    <Rect
      ref={pulseGlow}
      width={"100%"}
      height={"100%"}
      fill={pulseGradient}
      opacity={0}
      compositeOperation={"screen"}
    />,
  )
  view.add(
    <Rect
      ref={vignette}
      width={"100%"}
      height={"100%"}
      fill={vignetteGradient}
      opacity={0}
    />,
  )
  view.add(<Layout ref={background} width={"100%"} height={"100%"} />)
  view.add(<Layout ref={stage} width={"100%"} height={"100%"} />)
  view.add(<Layout ref={overlay} width={"100%"} height={"100%"} />)

  const narrator = createRef<Txt>()

  view.add(
    <Txt
      ref={narrator}
      text={""}
      y={450}
      width={VIDEO_WIDTH - 300}
      fontSize={36}
      textAlign={"center"}
      textWrap
      fill={colors.muted}
      opacity={0}
    />,
  )

  const world = {
    narrator,
    background,
    stage,
    overlay,
    elements: {},
    cancellation: {},
  }

  // One coherent field motion: the base void and the key light drift in opposite
  // phase, so the two planes shear past each other and the frame gains depth from
  // parallax rather than from any identifiable background object.
  const fieldMotion = yield loop(Infinity, () =>
    chain(
      all(
        backgroundGradient.from([-820, -760], 12, easeInOutCubic),
        backgroundGradient.to([1160, 500], 12, easeInOutCubic),
        depthGradient.from([-220, -280], 12, easeInOutCubic),
        depthGradient.to([-220, -280], 12, easeInOutCubic),
      ),
      all(
        backgroundGradient.from([-1120, -680], 12, easeInOutCubic),
        backgroundGradient.to([1020, 620], 12, easeInOutCubic),
        depthGradient.from([-300, -360], 12, easeInOutCubic),
        depthGradient.to([-300, -360], 12, easeInOutCubic),
      ),
    ),
  )

  // Breathing light for the world itself: a slow luminosity swell, low amplitude,
  // so it reads as "alive" without ever shimmering or pushing neighbours.
  const pulseBreath = yield loop(Infinity, () =>
    pulseGlow()
      .opacity(0.12, 5, easeInOutCubic)
      .to(0.26, 5, easeInOutCubic),
  )

  yield* all(
    // Ignition: the world comes alive as the process starts — the field rises,
    // the key light blooms in and settles elastically, the vignette closes in.
    atmosphere().opacity(1, 1.4, easeOutCubic),
    depthGlow().opacity(0.42, 1.4, easeOutCubic),
    depthGlow().scale(1, 1.6, easeOutBack),
    vignette().opacity(1, 1.6, easeOutCubic),
    playMovie(world),
    playNarrationVoice(world),
    playSoundtrack(world),
  )
  cancel(fieldMotion, pulseBreath)

  yield* waitFor(2)
})
