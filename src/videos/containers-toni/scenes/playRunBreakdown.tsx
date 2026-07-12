import { Layout, Txt, Rect } from "@motion-canvas/2d"
import {
  all,
  easeOutBack,
  sequence,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import { defaultTerminalTheme } from "../../../components"
import { colors, World } from "./utils"

const Theme = {
  highlight: "#facc15",
  text: defaultTerminalTheme.text,
}

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

export const playRunBreakdown = function* (world: World): ThreadGenerator {
  const { liftedCommand } = world.elements ?? {}

  if (!liftedCommand) {
    return
  }

  const runToken = liftedCommand.phrase.token("run") as Txt | undefined

  const steps = [
    createStepCard("pull", "download image layers"),
    createStepCard("create", "add a writable layer"),
    createStepCard("start", "launch the process"),
  ]
  steps.forEach((card) => card.scale(0.85))

  const row = (
    <Layout layout direction={"row"} gap={44} y={210}>
      {steps}
    </Layout>
  ) as Layout
  world.overlay().add(row)

  yield* runToken ? runToken.fill(colors.amber, 0.4) : waitFor(0)

  yield* waitFor(3)

  yield* sequence(
    1.3,
    ...steps.map((card) =>
      all(card.opacity(1, 1), card.scale(1, 1, easeOutBack)),
    ),
  )

  yield* all(
    row.opacity(0, 0.6),
    runToken ? runToken.fill(Theme.text, 0.4) : waitFor(0),
  )
  row.remove()

  yield* waitFor(1)
}
