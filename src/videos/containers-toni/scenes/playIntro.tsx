import { all, delay, ThreadGenerator, waitFor } from "@motion-canvas/core"
import { createTerminal } from "../../../components"
import {
  PADDING,
  toWorldX,
  toWorldY,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  World,
} from "./utils"
import { liftCommandPhrase } from "../../../choreography"
import { Txt } from "@motion-canvas/2d"

export const playIntro = function* (world: World): ThreadGenerator {
  // Narration starts and then we start showing elements
  yield* waitFor(2)

  const terminal = createTerminal({
    title: "local shell",
    width: VIDEO_WIDTH / 2 - PADDING * 2,
    height: VIDEO_HEIGHT - PADDING * 2,
    fontSize: 30,
    typingDelay: 0.1,
  })

  terminal.node.y(toWorldY(PADDING, terminal.node.height()))
  terminal.node.x(toWorldX(PADDING, terminal.node.width()))
  terminal.node.opacity(0)

  world.stage().add(terminal.node)

  yield* terminal.enter()
  yield* waitFor(1)
  yield* terminal.focus()
  yield* waitFor(1)
  yield* terminal.typeCommand("docker run nginx", 0.1)
  yield* terminal.run()

  yield* waitFor(1.5)
  yield* terminal.print("Unable to find image 'nginx:latest' locally", {
    kind: "muted",
  })

  yield* waitFor(0.75)
  yield* terminal.print("latest: Pulling from library/nginx", {
    kind: "muted",
  })

  yield* all(
    ...[
      "81b43e7a1eae: Pull complete",
      "74e33773ee42: Pull complete",
      "3be819c1c8cf: Pull complete",
      "63e237f10cf6: Pull complete",
      "75e5e08234c9: Pull complete",
      "41103e2ff54e: Pull complete",
      "5d1f91636239: Pull complete",
      "Digest: sha256:ec4ed8b5299e5e90694af7750eb6dffd2627317d30544d056b0371f8082f7bce",
      "Status: Downloaded newer image for nginx:latest",
    ].map((line, idx) =>
      delay(idx * 0.3, terminal.print(line, { kind: "muted" })),
    ),
  )

  yield* waitFor(3)

  // 2. Grab the command handle from the terminal.
  const sourceCommand = terminal.command("docker run nginx")

  if (!sourceCommand) {
    return
  }

  // The original terminal row hides, but the terminal keeps its layout.
  const liftedCommand = liftCommandPhrase(sourceCommand, {
    overlay: world.overlay(),
    to: [0, -38],
    hideSource: false,
    duration: 2,
    restyle: {
      fontSize: 76,
      //gap: 18,
    },
  })

  yield* all(liftedCommand.animation, terminal.exit(0.7))

  yield* waitFor(0.4)

  if (!world.elements) {
    world.elements = {}
  }
  world.elements.liftedCommand = liftedCommand
  world.elements.terminal = terminal

  yield* all(
    liftedCommand.phrase.restyle({ gap: 75 }, 1),
    (liftedCommand.phrase.token("run") as Txt).fill("#f9c74f", 1),
  )
  yield* waitFor(8)
}
