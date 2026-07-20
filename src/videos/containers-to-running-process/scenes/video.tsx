import { Layout, Txt, makeScene2D } from "@motion-canvas/2d"
import { all, createRef, ThreadGenerator, waitFor } from "@motion-canvas/core"
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

  const background = createRef<Layout>()
  const stage = createRef<Layout>()
  const overlay = createRef<Layout>()

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

  yield* all(playMovie(world), playNarrationVoice(world), playSoundtrack(world))

  yield* waitFor(2)
})
