import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  ThreadGenerator,
  waitFor,
  sound,
} from "@motion-canvas/core"
import { theme } from "../../../theme"
import { colors, World } from "./utils"
import { Rect, Txt } from "@motion-canvas/2d"
import { createLineBird } from "../../../components"

export const playSplash = function* (world: World): ThreadGenerator {
  world.music?.gain(2)

  const splash = createRef<Rect>()
  world
    .overlay()
    .add(
      <Rect
        width={"100%"}
        height={"100%"}
        fill={colors.bg}
        opacity={0}
        ref={splash}
      />,
    )

  // The channel's line-art bird sketches itself on, then sings the title into
  // existence — colored ripples carrying each word in.
  const bird = createLineBird()
  bird.node.position([-420, -30])
  bird.node.scale(1.15)
  splash().add(bird.node)
  bird.prepareDraw()

  const words = [
    { text: "Synesthetic", position: [255, -100], settle: colors.amber },
    { text: "Code", position: [50, 40], settle: theme.text },
    { text: "Craft", position: [370, 40], settle: theme.text },
  ].map(({ text, position, settle }) => {
    const node = (
      <Txt
        text={text}
        fontSize={118}
        fontWeight={800}
        fill={colors.amber}
        position={[position[0] - 36, position[1]]}
        opacity={0}
        letterSpacing={2}
      />
    ) as Txt
    splash().add(node)
    return { node, settle }
  })
  words[0].node.fill(theme.accent.base)
  words[1].node.fill(theme.primary.base)
  words[2].node.fill(theme.success.base)

  yield* splash().opacity(1, 0.8, easeInOutCubic)
  yield* bird.draw()
  yield* bird.blink()

  yield* bird.tiltHead(-14, 0.35)
  yield* all(
    bird.sing({ spread: 2400, duration: 1.9, stagger: 0.28 }),
    delay(
      0.35,
      sequence(
        0.3,
        ...words.map(({ node }) =>
          all(node.opacity(1, 0.7), node.x(node.x() + 36, 0.7, easeOutCubic)),
        ),
      ),
    ),
  )
  yield* all(
    bird.tiltHead(0, 0.4),
    ...words.map(({ node, settle }) => node.fill(settle, 1.2)),
  )
  yield* bird.blink()

  yield* waitFor(0.4)
  yield* splash().opacity(0, 2)
  splash().remove()

  yield* waitFor(0.5)
}
