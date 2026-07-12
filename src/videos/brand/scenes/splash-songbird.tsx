import { Txt, makeScene2D } from "@motion-canvas/2d"
import {
  all,
  delay,
  easeOutCubic,
  loop,
  sequence,
  waitFor,
} from "@motion-canvas/core"
import { birdColors, createLineBird } from "../../../components"

// Variant B — "Songbird".
// The schematic line-art bird (after the channel's original logo) sketches
// itself on stroke by stroke, then sings: colored rings ripple out of its
// beak (synesthesia — seeing sound), and each word of the title appears as
// the waves wash over it. Wide composition: good as a channel banner.

const colors = {
  bg: "#060914",
  title: "#e5e7eb",
  amber: "#fbbf24",
}

export default makeScene2D(function* (view) {
  view.fill(colors.bg)

  const bird = createLineBird()
  bird.node.position([-420, -30])
  bird.node.scale(1.15)
  view.add(bird.node)
  bird.prepareDraw()

  // Each word arrives tinted with one of the palette colors — the
  // "synesthetic" moment — then settles into its final brand color.
  const wordSynesthetic = (
    <Txt
      text={"Synesthetic"}
      fontSize={118}
      fontWeight={800}
      fill={birdColors.wing}
      position={[255, -100]}
      opacity={0}
      letterSpacing={2}
    />
  ) as Txt
  const wordCode = (
    <Txt
      text={"Code"}
      fontSize={118}
      fontWeight={800}
      fill={birdColors.body}
      position={[50, 40]}
      opacity={0}
      letterSpacing={2}
    />
  ) as Txt
  const wordCraft = (
    <Txt
      text={"Craft"}
      fontSize={118}
      fontWeight={800}
      fill={birdColors.tail}
      position={[370, 40]}
      opacity={0}
      letterSpacing={2}
    />
  ) as Txt
  const words = [wordSynesthetic, wordCode, wordCraft]
  for (const word of words) {
    word.x(word.x() - 36)
    view.add(word)
  }

  // The logo sketches itself on, like a pen drawing.
  yield* waitFor(0.3)
  yield* bird.draw()
  yield* bird.blink()

  // Lift the head, like drawing breath, then sing the title into existence.
  yield* bird.tiltHead(-14, 0.35)
  yield* all(
    bird.sing({ spread: 2400, duration: 1.9, stagger: 0.28 }),
    delay(
      0.35,
      sequence(
        0.3,
        ...words.map((word) =>
          all(word.opacity(1, 0.7), word.x(word.x() + 36, 0.7, easeOutCubic)),
        ),
      ),
    ),
  )
  yield* bird.tiltHead(0, 0.4)

  // The colors settle: "Synesthetic" keeps the warm accent, the craft is calm.
  yield* all(
    wordSynesthetic.fill(colors.amber, 1.2),
    wordCode.fill(colors.title, 1.2),
    wordCraft.fill(colors.title, 1.2),
  )

  yield* bird.blink()

  // A softer second verse while the frame holds for the banner screenshot.
  yield* all(
    bird.sing({
      colors: [birdColors.body, birdColors.wing],
      spread: 700,
      duration: 1.6,
      stagger: 0.35,
    }),
    loop(2, () => bird.pulseGlow(2)),
  )

  yield* waitFor(1.5)
})
