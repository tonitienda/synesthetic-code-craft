import { Gradient, Layout, Rect, Txt, makeScene2D } from "@motion-canvas/2d"
import {
  all,
  cancel,
  chain,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  loop,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import { colors, VIDEO_WIDTH, World } from "./utils"
import { playNarrationVoice } from "./playNarration"
import { playSoundtrack } from "./playSoundtrack"
import { playIntro } from "./01-playIntro"
import { playSplash } from "./02-playSplash"
import { playImageRegistry } from "./04-playImageRegistry"
import { playPullImage } from "./playPullImage"
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

  const atmosphere = createRef<Rect>()
  const background = createRef<Layout>()
  const stage = createRef<Layout>()
  const overlay = createRef<Layout>()

  const backgroundGradient = new Gradient({
    type: "linear",
    from: [-1120, -680],
    to: [1020, 620],
    stops: [
      { offset: 0, color: "#050713" },
      { offset: 0.34, color: "#0a1020" },
      { offset: 0.68, color: "#101225" },
      { offset: 1, color: "#07121b" },
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

  // A single softly drifting field: enough movement to keep the frame from
  // feeling dead, but with no identifiable background objects.
  const gradientMotion = yield loop(Infinity, () =>
    chain(
      all(
        backgroundGradient.from([-820, -760], 12, easeInOutCubic),
        backgroundGradient.to([1160, 500], 12, easeInOutCubic),
      ),
      all(
        backgroundGradient.from([-1120, -680], 12, easeInOutCubic),
        backgroundGradient.to([1020, 620], 12, easeInOutCubic),
      ),
    ),
  )

  yield* all(
    atmosphere().opacity(1, 1.4, easeOutCubic),
    playMovie(world),
    playNarrationVoice(world),
    playSoundtrack(world),
  )
  cancel(gradientMotion)

  yield* waitFor(2)
})
