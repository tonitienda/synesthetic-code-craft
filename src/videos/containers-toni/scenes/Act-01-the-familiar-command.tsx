import { Layout, Txt, Rect, makeScene2D } from "@motion-canvas/2d"
import {
  all,
  chain,
  createRef,
  delay,
  Reference,
  waitFor,
} from "@motion-canvas/core"
import {
  createTerminal,
  Terminal,
  defaultTerminalTheme,
} from "../../../components"
import {
  liftCommandPhrase,
  LiftedCommandPhrase,
  liftTxt,
} from "../../../choreography"

const Theme = {
  highlight: "#facc15",
  text: defaultTerminalTheme.text,
}

const NARRATION_ENABLED = true
const VIDEO_WIDTH = 1920
const VIDEO_HEIGHT = 1080

type World = {
  narrator: Reference<Txt>
  background: Reference<Layout>
  stage: Reference<Layout>
  overlay: Reference<Layout>
  elements?: {
    liftedCommand?: LiftedCommandPhrase
    terminal?: Terminal
  }
}

const playIntro = function* (world: World) {
  const terminal = createTerminal({
    title: "local shell",
    width: VIDEO_WIDTH * 0.4,
    height: VIDEO_HEIGHT * 0.9,
    fontSize: 30,
    typingDelay: 0.1,
  })

  terminal.node.y(0)
  terminal.node.x(-VIDEO_WIDTH * 0.28)
  terminal.node.opacity(0)

  world.stage().add(terminal.node)

  yield* terminal.enter()
  yield* waitFor(1)
  yield* terminal.focus()
  yield* waitFor(1)
  yield* all(
    narrate(
      world.narrator,
      "You have probably typed a command like this before.",
      4,
    ),
    terminal.typeCommand("docker run nginx", 0.1),
  )
  yield* terminal.run()

  yield* waitFor(1)
  yield* terminal.print("Unable to find image 'nginx:latest' locally", {
    kind: "muted",
  })

  yield* waitFor(0.75)
  yield* all(
    narrate(world.narrator, "You are just running the nginx image, right?", 4),
    terminal.print("latest: Pulling from library/nginx", {
      kind: "muted",
    }),
  )

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
      gap: 18,
    },
  })

  yield* all(
    narrate(
      world.narrator,
      "But what are we really running? What does 'run' actually do?",
      8,
    ),
    liftedCommand.animation,
    terminal.exit(0.7),
  )

  yield* waitFor(0.4)

  if (!world.elements) {
    world.elements = {}
  }
  world.elements.liftedCommand = liftedCommand
  world.elements.terminal = terminal
}

const playSplash = function* (world: World) {
  const splash = createRef<Rect>()
  world.overlay().add(
    <Rect
      width={"100%"}
      height={"100%"}
      fill={colors.bg}
      opacity={1}
      ref={splash}
    >
      <Txt
        text={"Synesthesic Code Craft"}
        fontSize={72}
        fill={colors.amber}
        fontWeight={800}
      />
    </Rect>,
  )

  yield* waitFor(3)
  yield* all(
    narrate(world.narrator, "Let's take a closer look at what happens.", 4),
    splash().opacity(1, 2).to(0, 2),
  )

  yield* waitFor(0.5)
}

const playImageRegistry = function* (world: World) {
  const { liftedCommand, terminal } = world.elements ?? {}

  if (!liftedCommand || !terminal) {
    return
  }

  yield* all(
    liftedCommand.phrase.node.opacity(0, 1),
    terminal.node.opacity(1, 1),
  )

  const sourceCommand = terminal.command("docker run nginx")

  if (!sourceCommand) {
    return
  }

  const nginxToken = sourceCommand.token("nginx")

  if (!nginxToken) {
    return
  }

  yield* nginxToken.fill(Theme.highlight, 0.5)

  // Create the Registry visual on the right.
  const registry = createRegistry()
  registry.node.position([VIDEO_WIDTH / 4, -400])
  registry.node.opacity(0)
  registry.node.scale(0.96)

  world.stage().add(registry.node)

  // // Create an overlay Docker-image object from the "nginx" token.
  const nginxImage = createDockerImageBox("nginx")
  world.overlay().add(nginxImage.node)

  // // Start the box exactly over the title token.
  // nginxImage.node.position(
  //   scenePointFromAbsolute(nginxToken.absolutePosition()),
  // )
  nginxImage.node.opacity(0)
  nginxImage.node.scale(1)
  nginxImage.node.absolutePosition(registry.imageSlotPosition())

  yield* all(
    registry.node.opacity(1, 1),
    registry.node.scale(1, 1),
    narrate(
      world.narrator,
      "Images are stored in registries, like this one.",
      4,
    ),
    delay(
      3,
      all(
        nginxImage.node.opacity(1, 2),
        (liftedCommand.phrase.token("nginx") as Txt).opacity(0, 2),
      ),
    ),
  )

  yield* waitFor(5)

  yield* nginxToken.fill(Theme.text, 0.5)
}

const playPullImage = function* (world: World) {
  const { terminal } = world.elements ?? {}

  if (!terminal) {
    return
  }

  const localSystem = createLocalsystem()

  localSystem.node.position([VIDEO_WIDTH / 4, 400])
  localSystem.node.opacity(0)
  localSystem.node.scale(0.96)

  world.stage().add(localSystem.node)

  yield* all(
    localSystem.node.opacity(1, 1),
    localSystem.node.scale(1, 1),
    narrate(
      world.narrator,
      "The image is pulled from the registry to your local system.",
      4,
    ),
  )

  yield* waitFor(5)

  const findLocallyLine = terminal.outputLine(
    "Unable to find image 'nginx:latest' locally",
  )

  if (!findLocallyLine) {
    return
  }

  yield* findLocallyLine.textRef().fill(Theme.highlight, 0.5)

  yield* waitFor(2)

  const pullLine = terminal.outputLine("latest: Pulling from library/nginx")

  if (!pullLine) {
    return
  }

  yield* all(
    findLocallyLine.textRef().fill(Theme.text, 0.5),
    pullLine.textRef().fill(Theme.highlight, 0.5),
  )

  yield* waitFor(2)
}

const playExpandRunCommand = function* (world: World) {
  const { liftedCommand } = world.elements ?? {}

  if (!liftedCommand) {
    return
  }

  const runToken = liftedCommand.phrase.token("run")
  if (!runToken) {
    return
  }
}

const colors = {
  bg: "#090b1a",
  muted: "#94a3b8",
  amber: "#facc15",
}

function* narrate(
  narrator: Reference<Txt>,
  text: string,
  duration: number,
  delay: number = 0,
): Generator<any, void, any> {
  if (delay > 0) {
    yield* waitFor(delay)
  }
  if (!NARRATION_ENABLED) {
    yield* waitFor(duration)
  } else {
    narrator().text(`"${text}"`)
    yield* narrator()
      .opacity(1, duration / 2)
      .to(0, duration / 2)
  }
}

function createDockerImageBox(label: string) {
  const node = (
    <Rect
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      width={220}
      height={86}
      radius={18}
      fill={"#111827"}
      stroke={"#38bdf8"}
      lineWidth={4}
      shadowColor={"#38bdf866"}
      shadowBlur={18}
    >
      <Txt
        text={label}
        fontFamily={"monospace"}
        fontSize={42}
        fill={"#e0f2fe"}
      />
      <Txt text={"Docker Image"} fontSize={20} fill={"#7dd3fc"} marginTop={4} />
    </Rect>
  ) as Rect

  return {
    node,
  }
}

function createRegistry() {
  const slot = createRef<Rect>()

  const node = (
    <Rect
      layout
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      width={900}
      height={200}
      radius={28}
      fill={"#0f172a"}
      stroke={"#64748b"}
      lineWidth={3}
      padding={24}
      gap={22}
      shadowColor={"#00000066"}
      shadowBlur={24}
    >
      <Layout layout direction={"column"} gap={4} alignItems={"start"}>
        <Txt
          text={"Registry"}
          fontSize={38}
          fill={"#f8fafc"}
          fontWeight={700}
        />

        <Txt text={"remote image store"} fontSize={22} fill={"#94a3b8"} />
      </Layout>

      <Rect
        ref={slot}
        width={230}
        height={100}
        radius={20}
        stroke={"#334155"}
        lineWidth={3}
        fill={"#020617"}
        marginTop={18}
      />
    </Rect>
  ) as Rect

  return {
    node,
    imageSlotPosition() {
      return slot().absolutePosition()
    },
  }
}

function createLocalsystem() {
  const slot = createRef<Rect>()

  const node = (
    <Rect
      layout
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      width={900}
      height={200}
      radius={28}
      fill={"#0f172a"}
      stroke={"#64748b"}
      lineWidth={3}
      padding={24}
      gap={22}
      shadowColor={"#00000066"}
      shadowBlur={24}
    >
      <Layout layout direction={"column"} gap={4} alignItems={"start"}>
        <Txt
          text={"Local System"}
          fontSize={38}
          fill={"#f8fafc"}
          fontWeight={700}
        />

        <Txt text={"remote image store"} fontSize={22} fill={"#94a3b8"} />
      </Layout>

      <Rect
        ref={slot}
        width={230}
        height={100}
        radius={20}
        stroke={"#334155"}
        lineWidth={3}
        fill={"#020617"}
        marginTop={18}
      />
    </Rect>
  ) as Rect

  return {
    node,
    imageSlotPosition() {
      return slot().absolutePosition()
    },
  }
}

export default makeScene2D(function* (view) {
  view.fill(colors.bg)

  const background = createRef<Layout>()
  const stage = createRef<Layout>()
  const overlay = createRef<Layout>()
  //const captions = createRef<Layout>()

  view.add(<Layout ref={background} width={"100%"} height={"100%"} />)
  view.add(<Layout ref={stage} width={"100%"} height={"100%"} />)
  view.add(<Layout ref={overlay} width={"100%"} height={"100%"} />)

  const narrator = createRef<Txt>()

  view.add(
    <Txt
      ref={narrator}
      text={""}
      y={500}
      fontSize={50}
      fill={colors.muted}
      opacity={0}
    />,
  )

  const world = {
    narrator,
    background,
    stage,
    overlay,
  }

  yield* playIntro(world)

  yield* playSplash(world)

  yield* playImageRegistry(world)

  yield* playPullImage(world)

  yield* playExpandRunCommand(world)
  // TODO - Potentially add more info about the registry, types, what they are, some metaphor, etc. But no need to go into a lot of detail.

  // EXPLAIN THE RUN COMMAND - Split in 3 operations

  // const runToken = lifted.phrase.token("run")
  // if (!runToken) {
  //   return
  // }

  // const pull = liftTxt(runToken, {
  //   overlay: overlay(),
  //   to: [runToken.x(), runToken.y() - 200],
  //   duration: 1.5,
  //   restyle: {
  //     fontSize: 76,
  //     gap: 18,
  //   },
  // })

  // const create = liftTxt(runToken, {
  //   overlay: overlay(),
  //   to: [runToken.x(), runToken.y() - 38],
  //   duration: 1.5,
  //   restyle: {
  //     fontSize: 76,
  //     gap: 18,
  //   },
  // })

  // const start = liftTxt(runToken, {
  //   overlay: overlay(),
  //   to: [runToken.x(), runToken.y() + 120],
  //   duration: 1.5,
  //   restyle: {
  //     fontSize: 76,
  //     gap: 18,
  //   },
  // })

  // // Split RUN into PULL, CREATE, START
  // yield* all(
  //   narrate(
  //     narrator,
  //     "Run is a shortcut for 3 separate commands: pull, create and start.",
  //     4,
  //   ),
  //   pull.animation,
  //   pull.phrase.replaceText("run", "pull", { delay: 0.5, duration: 1 }),
  //   create.animation,
  //   create.phrase.replaceText("run", "create", { delay: 0.5, duration: 1 }),
  //   start.animation,
  //   start.phrase.replaceText("run", "start", { duration: 1 }),
  // )

  // yield* all(
  //   pull.phrase.highlight("pull", { hold: 4.5, restore: true }),
  //   delay(2.5, pull.phrase.node.y(runToken.y() - 38, 1.5)),
  //   create.phrase.node.opacity(0, 1),
  //   start.phrase.node.opacity(0, 1),
  //   narrate(narrator, "Let's focus on the first command: pull.", 4),
  // )

  // yield* waitFor(5)
  // // const nginxToken = lifted.phrase.token("nginx")

  // if (!nginxToken) {
  //   return
  // }

  // const nginxAnchor = createRef<Rect>()

  // overlay().add(
  //   <Rect
  //     ref={nginxAnchor}
  //     width={4}
  //     height={4}
  //     fill={"#ff00ff"}
  //     opacity={0}
  //   />,
  // )

  //nginxAnchor().absolutePosition(nginxToken.absolutePosition())

  // yield* waitFor(1)
  // // yield* lifted.phrase.highlight("nginx", {
  //   hold: 1.5,
  //   restore: true,
  // })
  // // caption().text("nginx: the image name")
  // // yield* waitFor(0.5)

  // yield* lifted.phrase.highlight("run", {
  //   hold: 0.5,
  //   restore: true,
  // })
  // // caption().text("run: image becomes process")
  // // yield* waitFor(0.7)

  // // 5. End with one token isolated.
  // yield* all(lifted.phrase.dimExcept("run"), caption().fill(colors.amber, 0.25))

  // yield* waitFor(1)

  yield* waitFor(5)
})
