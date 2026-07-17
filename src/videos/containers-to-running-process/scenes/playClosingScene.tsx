import { Txt, Layout, Rect } from "@motion-canvas/2d"
import {
  ThreadGenerator,
  cancel,
  all,
  easeInOutCubic,
  easeOutBack,
  sequence,
  waitFor,
  easeOutCubic,
  delay,
} from "@motion-canvas/core"
import { World, colors } from "./utils"

function createStepCard(name: string, gloss: string): Rect {
  return (
    <Rect
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={14}
      width={380}
      height={190}
      paddingLeft={20}
      paddingRight={20}
      radius={20}
      fill={"#0f172acc"}
      stroke={colors.amber + "99"}
      lineWidth={3}
      shadowColor={"#00000055"}
      shadowBlur={18}
      opacity={0}
    >
      <Txt
        text={`docker ${name}`}
        fontFamily={"monospace"}
        fontSize={32}
        fill={colors.amber}
        fontWeight={700}
      />
      <Txt text={gloss} fontSize={23} fill={"#cbd5e1"} />
    </Rect>
  ) as Rect
}

export const playClosingScene = function* (world: World): ThreadGenerator {
  // Stop the idle loops so nothing keeps ticking behind the outro.
  // const { localSystemBreath, heartA, heartB } = world.cancellation ?? {}
  // if (localSystemBreath) cancel(localSystemBreath)
  // if (heartA) cancel(heartA)
  // if (heartB) cancel(heartB)

  // 1) Calmly clear the working diagram. The closing content lives in the
  // background layer, which shows through once the front layers fade out.
  yield* all(
    world.stage().opacity(0, 1.4, easeInOutCubic),
    world.overlay().opacity(0, 1.4, easeInOutCubic),
  )

  // 2) Full circle: the very command we started with.
  const cmd = (
    <Txt
      text={"$ docker run nginx"}
      fontFamily={"monospace"}
      fontSize={70}
      fill={"#e2e8f0"}
      y={-240}
      opacity={0}
      scale={0.9}
    />
  ) as Txt
  world.background().add(cmd)

  yield* all(cmd.opacity(1, 0.6), cmd.scale(1, 0.6, easeOutBack))

  // 3) Recap the three phases — a callback to the opening breakdown.
  const steps = [
    createStepCard("pull", "download the image"),
    createStepCard("create", "add a writable layer"),
    createStepCard("start", "launch the process"),
  ]
  steps.forEach((card) => card.scale(0.85))
  const row = (
    <Layout layout direction={"row"} gap={44} y={40}>
      {steps}
    </Layout>
  ) as Layout
  world.background().add(row)

  yield* sequence(
    0.3,
    ...steps.map((card) =>
      all(card.opacity(1, 0.5), card.scale(1, 0.5, easeOutBack)),
    ),
  )

  yield* waitFor(0.5)

  // 4) Outro card.
  yield* all(cmd.opacity(0, 0.8), row.opacity(0, 0.8))
  cmd.remove()
  row.remove()

  const title = (
    <Txt
      text={"Synesthetic Code Craft"}
      fontSize={76}
      fill={colors.amber}
      fontWeight={800}
      y={10}
      opacity={0}
    />
  ) as Txt
  const subtitle = (
    <Txt
      text={"containers, from the inside out"}
      fontSize={30}
      fill={colors.muted}
      y={80}
      opacity={0}
    />
  ) as Txt
  world.background().add(title)
  world.background().add(subtitle)

  yield* all(
    title.opacity(1, 1),
    title.y(-10, 1.2, easeOutCubic),
    delay(0.4, subtitle.opacity(1, 1)),
  )

  yield* waitFor(2)
}
