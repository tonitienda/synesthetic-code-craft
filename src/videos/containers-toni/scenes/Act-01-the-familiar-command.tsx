import { Layout, Txt, Rect, makeScene2D } from "@motion-canvas/2d"
import {
  all,
  cancel,
  chain,
  createRef,
  delay,
  easeInCubic,
  easeOutBack,
  loop,
  Reference,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import {
  createTerminal,
  Terminal,
  defaultTerminalTheme,
} from "../../../components"
import { liftCommandPhrase, LiftedCommandPhrase } from "../../../choreography"
import { createFileSystemLayers } from "../../../components/filesystem"
import {
  LocalSystem,
  Registry,
  createLocalsystem,
  createRegistry,
} from "../../../components/registries"

const Theme = {
  highlight: "#facc15",
  text: defaultTerminalTheme.text,
}

const NARRATION_ENABLED = true
const VIDEO_WIDTH = 1920
const VIDEO_HEIGHT = 1080

const toWorldX = (x: number, width: number) => x - VIDEO_WIDTH / 2 + width / 2
const toWorldY = (y: number, height: number) =>
  y - VIDEO_HEIGHT / 2 + height / 2

const PADDING = 24

type World = {
  narrator: Reference<Txt>
  background: Reference<Layout>
  stage: Reference<Layout>
  overlay: Reference<Layout>
  elements: {
    liftedCommand?: LiftedCommandPhrase
    terminal?: Terminal
    registry?: Registry
    localSystem?: LocalSystem // We will need a different type here for the fs layers, etc
    registryImage?: DockerImage
    localImage?: DockerImage
  }
  cancellation: {
    registryBreath?: ThreadGenerator
    localSystemBreath?: ThreadGenerator
  }
}

const playIntro = function* (world: World) {
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
      delay(idx * 0.2, terminal.print(line, { kind: "muted" })),
    ),
  )

  yield* waitFor(1)

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

const playImageRegistry = function* (world: World): ThreadGenerator {
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
  registry.node.position([
    toWorldX(
      VIDEO_WIDTH - registry.node.width() - PADDING,
      registry.node.width(),
    ),
    toWorldY(PADDING, registry.node.height()),
  ])
  registry.node.opacity(0)

  world.cancellation.registryBreath = yield loop(
    Infinity,
    () => registry.node.scale(1, 1).to(1.01, 1), // ~1% breath, background
  )

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

  if (!world.elements) {
    world.elements = {}
  }
  world.elements.registryImage = nginxImage
  world.elements.registry = registry

  yield* nginxToken.fill(Theme.text, 0.5)
}

const playPullImage = function* (world: World): ThreadGenerator {
  const { terminal, registryImage, registry } = world.elements ?? {}
  const { registryBreath } = world.cancellation ?? {}

  if (!terminal || !registryImage || !registry || !registryBreath) {
    return
  }

  const localSystem = createLocalsystem()

  localSystem.node.position([
    toWorldX(
      VIDEO_WIDTH - localSystem.node.width() - PADDING,
      localSystem.node.width(),
    ),
    toWorldY(
      VIDEO_HEIGHT - PADDING - localSystem.node.height(),
      localSystem.node.height(),
    ),
  ])
  localSystem.node.opacity(0)

  // STOP breathing animation on the registry, and start breathing on the local system.
  cancel(registryBreath)
  yield* registry.node.scale(1, 0.4) // ease it back to 1 so nothing "jumps"

  world.cancellation.localSystemBreath = yield loop(
    Infinity,
    () => localSystem.node.scale(1, 1).to(1.01, 1), // ~1% breath, background
  )

  world.stage().add(localSystem.node)

  yield* all(localSystem.node.opacity(1, 1), localSystem.node.scale(1, 1))

  yield* waitFor(5)

  const findLocallyLine = terminal.outputLine(
    "Unable to find image 'nginx:latest' locally",
  )

  if (!findLocallyLine) {
    return
  }

  yield* all(
    findLocallyLine.textRef().fill(Theme.highlight, 0.5),
    narrate(world.narrator, "The image is searched in your local system.", 4),
  )

  yield* waitFor(2)

  const pullLine = terminal.outputLine("latest: Pulling from library/nginx")

  if (!pullLine) {
    return
  }

  yield* all(
    findLocallyLine.textRef().fill(Theme.text, 0.5),
    pullLine.textRef().fill(Theme.highlight, 0.5),
    narrate(
      world.narrator,
      "Since it is not found, the image will be downloaded from the registry.",
      4,
    ),
  )

  const localSlotCenter = localSystem.slot().absolutePosition()

  const localImage = createDockerImageBox("nginx")
  localImage.node.position(registryImage.node.position()) // TODO - Maybe absolute position
  localImage.node.opacity(0)
  localImage.node.scale(1)

  world.overlay().add(localImage.node)

  yield* all(
    localImage.node.opacity(1, 0.3),
    // fall: accelerate in, so easeInCubic on the way down
    localImage.node.absolutePosition(localSlotCenter, 1.0, easeInCubic),
    chain(
      delay(0.75, localImage.node.scale([1.15, 0.8], 0.12)), // squash on impact
      localImage.node.scale([0.92, 1.08], 0.12), // stretch rebound
      localImage.node.scale(1, 0.18, easeOutBack), // settle w/ tiny overshoot
    ),
  )

  yield* waitFor(5)
  yield* all(
    pullLine.textRef().fill(Theme.text, 0.5),
    narrate(world.narrator, "The image is now stored in your local system.", 4),
  )

  yield* waitFor(2)

  world.elements.localImage = localImage
  world.elements.localSystem = localSystem
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

type DockerImage = {
  node: Rect
}

function createDockerImageBox(label: string): DockerImage {
  const node = (
    <Rect
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      width={220}
      height={86}
      radius={18}
      fill={"#0f172acc"}
      stroke={"#7dd3fc99"}
      lineWidth={3}
      shadowColor={"#38bdf833"}
      shadowBlur={14}
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

const playWhatIsAnImage = function* (world: World): ThreadGenerator {
  const { registry, localSystem, registryImage, localImage, terminal } =
    world.elements ?? {}

  if (!registry || !localSystem || !registryImage || !localImage || !terminal) {
    return
  }

  const localSystemTargetHeight = VIDEO_HEIGHT - PADDING * 2

  // The terminal has served its purpose as the script. Demote it to a compact
  // anchor chip in the bottom-left corner so the concept diagram can own the
  // screen, and slide the local system into the freed space so it reads as the
  // subject rather than a right-hand sidebar.
  const dockWidth = 470
  const dockHeight = 140
  const focusX = 240 // centred in the band to the right of the docked chip

  yield* all(
    terminal.dock({
      width: dockWidth,
      height: dockHeight,
      position: [
        toWorldX(PADDING, dockWidth),
        toWorldY(VIDEO_HEIGHT - PADDING - dockHeight, dockHeight),
      ],
      duration: 2,
    }),
    registry.node.y(-1000, 2),
    registryImage.node.y(-1000, 2),
    localSystem.node.x(focusX, 2),
    localImage.node.x(focusX, 2),
    localSystem.node.height(localSystemTargetHeight, 2),
    localSystem.node.y(toWorldY(PADDING, localSystemTargetHeight), 2),
    narrate(world.narrator, "But what is exactly an image?", 4),
  )

  yield* all(
    chain(
      localImage.node.width(localSystem.node.width() - PADDING * 2, 2),
      all(
        localImage.node.height(VIDEO_HEIGHT / 2 - PADDING, 2),
        localImage.node.y(
          toWorldY(VIDEO_HEIGHT / 2 - PADDING, VIDEO_HEIGHT / 2 - PADDING),
          2,
        ),
      ),
    ),
    narrate(
      world.narrator,
      "An image is a static snapshot of a filesystem built in layers. It is inert, and cannot run.",
      8,
    ),
  )

  const fsLayers = createFileSystemLayers(
    localImage.node.width(),
    localImage.node.height(),
    localImage.node.x(),
    localImage.node.y(),
    "nginx",
    [
      "base filesystem",
      "packages",
      "runtime dependencies",
      "application files",
    ],
  )
  fsLayers.node.opacity(0)
  world.overlay().add(fsLayers.node)

  yield* all(
    localImage.node.opacity(0, 0.5),
    localSystem.slot().opacity(0, 0.5),
    fsLayers.node.opacity(1, 0.5),
  )
  yield* fsLayers.appear(0.5)

  yield* fsLayers.collapse("image fs (read-only)", 3)
}

const playWhatIsAContainer = function* (world: World) {
  const { localSystem } = world.elements ?? {}

  if (!localSystem) {
    return
  }
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
    elements: {},
    cancellation: {},
  }

  yield* playIntro(world)

  yield* playSplash(world)

  yield* playImageRegistry(world)

  yield* playPullImage(world)

  yield* playWhatIsAnImage(world)

  yield* playWhatIsAContainer(world)

  // playWhatIsAContainer -> docker create
  // playWhatIsAProcess -> docker start

  // playMutipleContainers containers side be side reading shared layers, writing to they own writtable layer

  // playNamespaceCgroups -- only one container again. Explain the concepts

  // playClosingScene -- not sure

  //yield* playExpandRunCommand(world)
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
