import { Layout, Txt, makeScene2D } from "@motion-canvas/2d"
import { all, createRef, waitFor } from "@motion-canvas/core"
import { createTerminal } from "../../../components"
import { liftCommandPhrase } from "../../../choreography"

const colors = {
  bg: "#090b1a",
  muted: "#94a3b8",
  amber: "#facc15",
}

export default makeScene2D(function* (view) {
  view.fill(colors.bg)

  const overlay = createRef<Layout>()
  const caption = createRef<Txt>()

  const terminal = createTerminal({
    title: "local shell",
    width: 920,
    height: 390,
    fontSize: 34,
    typingDelay: 0.1,
  })

  terminal.node.y(110)
  terminal.node.opacity(0)

  view.add(terminal.node)

  // Anything lifted out of components should live here.
  view.add(<Layout ref={overlay} width={"100%"} height={"100%"} />)

  view.add(
    <Txt
      ref={caption}
      text={""}
      y={220}
      fontSize={38}
      fill={colors.muted}
      opacity={0}
    />,
  )

  yield* waitFor(1)

  // 1. Terminal moment.
  yield* terminal.enter()
  yield* waitFor(1)
  yield* terminal.focus()
  yield* waitFor(1)
  yield* terminal.typeCommand("docker run nginx")
  yield* terminal.run()

  yield* waitFor(1)
  yield* terminal.print("Unable to find image 'nginx:latest' locally", {
    kind: "muted",
  })

  yield* waitFor(0.75)
  yield* terminal.print("latest: Pulling from library/nginx", {
    kind: "muted",
  })

  yield* waitFor(2)

  // 2. Grab the command handle from the terminal.
  const sourceCommand = terminal.command("docker run nginx")

  if (!sourceCommand) {
    return
  }

  // 3. Lift a visual clone into the overlay.
  // The original terminal row hides, but the terminal keeps its layout.
  const lifted = liftCommandPhrase(sourceCommand, {
    overlay: overlay(),
    to: [0, -250],
    duration: 0.85,
    restyle: {
      fontSize: 76,
      gap: 18,
    },
  })

  yield* all(lifted.animation, terminal.exit(0.7))

  // 4. The lifted phrase is now the real actor.
  caption().text("But what does 'run' really do?")
  yield* caption().opacity(1, 0.35)

  yield* waitFor(0.4)

  caption().text("// SHOWING SPLASH SCREEN WITH LOGO AND TITLE HERE")

  yield* waitFor(3)

  caption().text("But what does 'run' really do?")

  // TODO - Inject Splash screen with logo and title here.
  // Music fades and we get a moment of silence before the next scene.

  yield* waitFor(2)

  yield* lifted.phrase.highlight("nginx", {
    hold: 1.5,
    restore: true,
  })
  // caption().text("nginx: the image name")
  // yield* waitFor(0.5)

  yield* lifted.phrase.highlight("run", {
    hold: 0.5,
    restore: true,
  })
  // caption().text("run: image becomes process")
  // yield* waitFor(0.7)

  // 5. End with one token isolated.
  yield* all(lifted.phrase.dimExcept("run"), caption().fill(colors.amber, 0.25))

  yield* waitFor(1)
})
