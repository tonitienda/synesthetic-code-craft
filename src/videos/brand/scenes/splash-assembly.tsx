import { Layout, Rect, Txt, makeScene2D } from "@motion-canvas/2d"
import {
  all,
  delay,
  easeOutCubic,
  loop,
  sequence,
  waitFor,
} from "@motion-canvas/core"
import { birdColors, createBirdLogo } from "../../../components"

// Variant A — "Assembly".
// The bird builds itself out of scattered geometric pieces, flaps awake, and
// the channel title settles in underneath with a four-color palette stripe.
// Centered composition: good for the channel avatar (bird alone) and banner.

const colors = {
  bg: "#060914",
  title: "#e5e7eb",
}

export default makeScene2D(function* (view) {
  view.fill(colors.bg)

  const bird = createBirdLogo()
  bird.node.y(-120)
  bird.node.scale(1.05)
  view.add(bird.node)
  bird.scatterNow()

  const title = (
    <Txt
      text={"Synesthetic Code Craft"}
      fontSize={92}
      fontWeight={800}
      fill={colors.title}
      y={185}
      opacity={0}
      letterSpacing={2}
    />
  ) as Txt

  // The palette stripe: the same four colors the bird is made of.
  const stripeColors = [
    birdColors.body,
    birdColors.wing,
    birdColors.accent,
    birdColors.tail,
  ]
  const stripes = stripeColors.map(
    (color) => (<Rect height={6} width={0} radius={3} fill={color} />) as Rect,
  )
  const stripeRow = (
    <Layout layout direction={"row"} gap={12} y={265}>
      {stripes}
    </Layout>
  ) as Layout

  view.add(title)
  view.add(stripeRow)

  yield* waitFor(0.4)
  yield* bird.assemble()
  yield* bird.flap(2)
  yield* bird.blink()

  yield* all(
    title.opacity(1, 0.9),
    title.y(170, 0.9, easeOutCubic),
    title.letterSpacing(8, 1.4, easeOutCubic),
    delay(
      0.4,
      sequence(0.12, ...stripes.map((s) => s.width(160, 0.5, easeOutCubic))),
    ),
  )

  // Idle life: the bird breathes by glow, not by size, with the odd blink.
  yield* loop(2, (i) =>
    all(bird.pulseGlow(2.4), i === 1 ? delay(1, bird.blink()) : waitFor(0)),
  )

  yield* waitFor(1.5)
})
