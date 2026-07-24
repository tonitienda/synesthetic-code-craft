import { Rect, Txt } from "@motion-canvas/2d"
import { ThreadGenerator, all, sequence, waitFor } from "@motion-canvas/core"
import { theme } from "../theme"
import { World } from "./utils"

function createBadge(text: string, color: string): Rect {
  return (
    <Rect
      layout
      alignItems={"center"}
      justifyContent={"center"}
      paddingLeft={10}
      paddingRight={10}
      height={30}
      radius={8}
      fill={color + "22"}
      stroke={color + "aa"}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={text} fontFamily={"monospace"} fontSize={16} fill={color} />
    </Rect>
  ) as Rect
}

export const playNamespaces = function* (world: World): ThreadGenerator {
  const { containerA: A, containerB: B } = world.elements ?? {}

  if (!A || !B) {
    return
  }

  const nsColor = theme.accent.base // purple = namespaces
  const names = ["pid", "net", "mnt", "uts", "ipc"]

  const badgesA = names.map((n) => createBadge(n, nsColor))
  const badgesB = names.map((n) => createBadge(n, nsColor))
  badgesA.forEach((badge) => A.badgeRow().add(badge))
  badgesB.forEach((badge) => B.badgeRow().add(badge))

  yield* all(
    sequence(0.1, ...badgesA.map((badge) => badge.opacity(1, 0.3))),
    sequence(0.1, ...badgesB.map((badge) => badge.opacity(1, 0.3))),
  )

  yield* all(
    A.process.scale(1.06, 0.3).to(1, 0.3),
    B.process.scale(1.06, 0.3).to(1, 0.3),
  )

  yield* waitFor(1)
}
