import { Circle, Layout, Line, Txt, Rect, makeScene2D } from "@motion-canvas/2d"
import {
  all,
  cancel,
  chain,
  createRef,
  delay,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  loop,
  Reference,
  sequence,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import {
  createTerminal,
  Terminal,
  defaultTerminalTheme,
} from "../../../components"
import { liftCommandPhrase, LiftedCommandPhrase } from "../../../choreography"
import {
  createFileSystemLayers,
  FileSystem,
} from "../../../components/filesystem"
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
    imageFs?: FileSystem
    sharedImage?: SharedImageBase
    containerA?: ContainerCard
    containerB?: ContainerCard
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

  world.elements.imageFs = fsLayers
}

const containerColors = {
  readonly: "#7dd3fc", // cool blue — inert, read-only image
  writable: "#fbbf24", // warm amber — the container's mutable layer
  process: "#34d399", // green — a live, running process
  processSoft: "#34d39922",
}

type WritableLayer = {
  node: Rect
  chipsRow: Reference<Layout>
}

// A warm, amber "read-write" layer that stacks on top of the read-only image.
function createWritableLayer(width: number, height: number): WritableLayer {
  const chipsRow = createRef<Layout>()

  const node = (
    <Rect
      layout
      direction={"column"}
      alignItems={"start"}
      justifyContent={"center"}
      gap={10}
      width={width}
      height={height}
      paddingLeft={26}
      paddingRight={26}
      radius={12}
      fill={"#1c130088"}
      stroke={containerColors.writable + "cc"}
      lineWidth={3}
      shadowColor={containerColors.writable + "22"}
      shadowBlur={14}
      opacity={0}
    >
      <Txt
        text={"writable layer (read-write)"}
        fontSize={24}
        fill={containerColors.writable}
        fontWeight={700}
      />
      <Layout ref={chipsRow} layout direction={"row"} gap={10} />
    </Rect>
  ) as Rect

  return { node, chipsRow }
}

// The container's main process, drawn as a live "pill" with a status dot.
function createProcessBox(name: string, pid: string): { node: Rect } {
  const node = (
    <Rect
      layout
      direction={"row"}
      gap={14}
      alignItems={"center"}
      justifyContent={"center"}
      paddingLeft={28}
      paddingRight={28}
      height={78}
      radius={999}
      fill={containerColors.processSoft}
      stroke={containerColors.process}
      lineWidth={3}
      shadowColor={containerColors.process + "44"}
      shadowBlur={20}
      opacity={0}
    >
      <Circle size={16} fill={containerColors.process} />
      <Txt
        text={name}
        fontFamily={"monospace"}
        fontSize={34}
        fill={"#ecfdf5"}
      />
      <Txt text={pid} fontSize={22} fill={containerColors.process} />
    </Rect>
  ) as Rect

  return { node }
}

// A small monospace "packet" that travels between the process and a layer to
// represent a single read or write of a specific file.
function createPacket(text: string, color: string): Rect {
  return (
    <Rect
      layout
      alignItems={"center"}
      justifyContent={"center"}
      paddingLeft={16}
      paddingRight={16}
      height={40}
      radius={10}
      fill={"#020617ee"}
      stroke={color}
      lineWidth={2}
      shadowColor={color + "55"}
      shadowBlur={16}
      opacity={0}
    >
      <Txt text={text} fontFamily={"monospace"} fontSize={22} fill={color} />
    </Rect>
  ) as Rect
}

// A persisted file that lives inside the writable layer after a write.
function createFileChip(text: string, color: string): Rect {
  return (
    <Rect
      layout
      alignItems={"center"}
      justifyContent={"center"}
      paddingLeft={12}
      paddingRight={12}
      height={34}
      radius={8}
      fill={color + "22"}
      stroke={color + "aa"}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={text} fontFamily={"monospace"} fontSize={20} fill={color} />
    </Rect>
  ) as Rect
}

// Send a packet from one node to another along an eased path, then clean it up.
function* flow(
  world: World,
  from: Layout,
  to: Layout,
  label: string,
  color: string,
  pulseTarget: boolean,
): ThreadGenerator {
  const packet = createPacket(label, color)
  world.overlay().add(packet)
  packet.absolutePosition(from.absolutePosition())
  packet.scale(0.9)

  yield* packet.opacity(1, 0.2)
  yield* packet.absolutePosition(to.absolutePosition(), 0.8, easeInOutCubic)

  if (pulseTarget) {
    yield* to.scale(1.05, 0.15).to(1, 0.2)
  } else {
    yield* waitFor(0.15)
  }

  yield* packet.opacity(0, 0.3)
  packet.remove()
}

const playWhatIsAContainer = function* (world: World): ThreadGenerator {
  const { imageFs } = world.elements ?? {}

  if (!imageFs) {
    return
  }

  const readonlyNode = imageFs.layers[0].node
  const barWidth = readonlyNode.width()
  const barHeight = readonlyNode.height()

  // 1) CREATE — a container is the image plus a thin writable layer on top.
  // Re-badge the image panel as a "container" and stack the writable layer in.
  const writable = createWritableLayer(barWidth, barHeight)
  writable.node.height(0)
  imageFs.layersContainer().insert(writable.node, 0)

  yield* all(
    imageFs.titleRef().text("container", 0.6),
    imageFs.titleRef().fill(containerColors.writable, 0.6),
    narrate(
      world.narrator,
      "Creating a container adds a thin writable layer on top of the read-only image.",
      6,
    ),
    delay(
      0.6,
      all(
        writable.node.height(barHeight, 0.9, easeOutCubic),
        writable.node.opacity(1, 0.7),
      ),
    ),
  )

  yield* waitFor(0.5)

  // 2) START — the container's main process comes to life as PID 1.
  const process = createProcessBox("nginx", "PID 1")
  process.node.scale(0.8)
  imageFs.layersContainer().insert(process.node, 0)

  yield* all(
    process.node.opacity(1, 0.5),
    process.node.scale(1, 0.5, easeOutBack),
    narrate(
      world.narrator,
      "Starting the container launches the image's main process as PID 1.",
      6,
    ),
  )

  // Unlike the inert image, the process has a heartbeat.
  const processBreath = yield loop(Infinity, () =>
    process.node.scale(1, 0.9).to(1.03, 0.9),
  )

  yield* waitFor(0.6)

  // 3) READ — config is read from the read-only image layer.
  yield* narrate(
    world.narrator,
    "It reads its configuration straight from the read-only image...",
    4,
  )
  yield* flow(
    world,
    readonlyNode,
    process.node,
    "read  /etc/nginx/nginx.conf",
    containerColors.readonly,
    false,
  )

  yield* waitFor(0.4)

  // 4) WRITE — logs are written to the writable layer, never the image.
  yield* narrate(
    world.narrator,
    "...but every write goes to the writable layer — the image is never touched.",
    6,
  )
  yield* flow(
    world,
    process.node,
    writable.node,
    "write  /var/log/nginx/access.log",
    containerColors.writable,
    true,
  )

  // The write persists: the file now lives in the writable layer.
  const chip = createFileChip("access.log", containerColors.writable)
  chip.scale(0.8)
  writable.chipsRow().add(chip)
  yield* all(chip.opacity(1, 0.4), chip.scale(1, 0.4, easeOutBack))

  yield* waitFor(1)

  // Land the point: same image, isolated changes.
  yield* all(
    readonlyNode.scale(1.03, 0.3).to(1, 0.4),
    imageFs.layers[0].label.fill(containerColors.readonly, 0.4),
    narrate(
      world.narrator,
      "Same read-only image, isolated changes. That is a container.",
      5,
    ),
  )

  yield* waitFor(1)

  cancel(processBreath)
  yield* process.node.scale(1, 0.3)
}

// ---------------------------------------------------------------------------
// docker run = pull + create + start
// ---------------------------------------------------------------------------

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

const playRunBreakdown = function* (world: World): ThreadGenerator {
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

  yield* all(
    runToken ? runToken.fill(colors.amber, 0.4) : waitFor(0),
    narrate(world.narrator, "But run is really three steps in one.", 4),
  )

  yield* sequence(
    0.35,
    ...steps.map((card) =>
      all(card.opacity(1, 0.5), card.scale(1, 0.5, easeOutBack)),
    ),
  )

  yield* narrate(
    world.narrator,
    "Pull the image, create the container, start the process. We'll follow each one.",
    6,
  )

  yield* all(
    row.opacity(0, 0.6),
    runToken ? runToken.fill(Theme.text, 0.4) : waitFor(0),
  )
  row.remove()
}

// ---------------------------------------------------------------------------
// Two containers over one shared, read-only image on the host
// ---------------------------------------------------------------------------

type SharedImageBase = { node: Rect }

type ContainerCard = {
  node: Rect
  titleRef: Reference<Txt>
  process: Rect
  writable: Rect
  chipsRow: Reference<Layout>
  badgeRow: Reference<Layout>
}

function createSharedImageBase(width: number, height: number): SharedImageBase {
  const node = (
    <Rect
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={6}
      width={width}
      height={height}
      paddingLeft={26}
      paddingRight={26}
      radius={16}
      fill={"#0f172a88"}
      stroke={containerColors.readonly + "cc"}
      lineWidth={3}
      shadowColor={containerColors.readonly + "22"}
      shadowBlur={16}
      opacity={0}
    >
      <Txt
        text={"nginx image layers (read-only)"}
        fontFamily={"monospace"}
        fontSize={26}
        fill={containerColors.readonly}
        fontWeight={700}
      />
      <Txt
        text={"stored on the host · /var/lib/docker/overlay2"}
        fontSize={20}
        fill={"#7dd3fcaa"}
      />
    </Rect>
  ) as Rect

  return { node }
}

function createContainerCard(name: string): ContainerCard {
  const titleRef = createRef<Txt>()
  const chipsRow = createRef<Layout>()
  const badgeRow = createRef<Layout>()
  const processRef = createRef<Rect>()
  const writableRef = createRef<Rect>()

  const node = (
    <Rect
      layout
      direction={"column"}
      alignItems={"stretch"}
      justifyContent={"start"}
      gap={16}
      width={620}
      height={320}
      padding={22}
      radius={22}
      fill={"#0b1220cc"}
      stroke={"#94a3b8aa"}
      lineWidth={3}
      shadowColor={"#00000066"}
      shadowBlur={22}
      opacity={0}
    >
      <Layout
        layout
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Txt
          ref={titleRef}
          text={name}
          fontFamily={"monospace"}
          fontSize={28}
          fill={"#e2e8f0"}
          fontWeight={700}
        />
        <Layout ref={badgeRow} layout direction={"row"} gap={8} />
      </Layout>

      <Rect
        ref={processRef}
        layout
        direction={"row"}
        gap={12}
        alignItems={"center"}
        justifyContent={"center"}
        height={64}
        radius={999}
        fill={containerColors.processSoft}
        stroke={containerColors.process}
        lineWidth={3}
      >
        <Circle size={14} fill={containerColors.process} />
        <Txt
          text={"nginx"}
          fontFamily={"monospace"}
          fontSize={26}
          fill={"#ecfdf5"}
        />
        <Txt text={"PID 1"} fontSize={18} fill={containerColors.process} />
      </Rect>

      <Rect
        ref={writableRef}
        layout
        direction={"column"}
        alignItems={"start"}
        justifyContent={"center"}
        gap={8}
        height={110}
        paddingLeft={20}
        paddingRight={20}
        radius={12}
        fill={"#1c130088"}
        stroke={containerColors.writable + "cc"}
        lineWidth={3}
      >
        <Txt
          text={"writable layer"}
          fontSize={20}
          fill={containerColors.writable}
          fontWeight={700}
        />
        <Layout ref={chipsRow} layout direction={"row"} gap={8} />
      </Rect>
    </Rect>
  ) as Rect

  return {
    node,
    titleRef,
    process: processRef(),
    writable: writableRef(),
    chipsRow,
    badgeRow,
  }
}

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

function createMountLine(
  a: [number, number],
  b: [number, number],
  color: string,
): Line {
  return (
    <Line
      points={[a, b]}
      stroke={color}
      lineWidth={3}
      lineDash={[10, 8]}
      end={0}
    />
  ) as Line
}

const playMultipleContainers = function* (world: World): ThreadGenerator {
  const { imageFs, localSystem, terminal } = world.elements ?? {}

  if (!imageFs || !localSystem) {
    return
  }

  // 1) Reframe the stage: the local system becomes "the host", widened to hold
  // two containers. The single-container panel and the terminal step aside.
  yield* all(
    terminal ? terminal.node.opacity(0, 0.8) : waitFor(0),
    imageFs.node.opacity(0, 0.8),
    localSystem.node.x(0, 1.2, easeInOutCubic),
    localSystem.node.width(1640, 1.2, easeInOutCubic),
    localSystem.title().text("Host · one shared Linux kernel", 0.8),
    narrate(
      world.narrator,
      "A container is not a copy of the image. Watch what a second one shares.",
      6,
    ),
  )
  imageFs.node.remove()

  // 2) The read-only image lives on the host disk — one copy, shared.
  const base = createSharedImageBase(1040, 130)
  base.node.position([0, 350])
  base.node.scale(0.96)
  world.stage().add(base.node)

  yield* all(
    base.node.opacity(1, 0.6),
    base.node.scale(1, 0.6, easeOutBack),
    narrate(
      world.narrator,
      "The image layers are just read-only directories on the host disk.",
      5,
    ),
  )

  // 3) Container web-1 mounts the shared image and adds a private writable layer.
  const A = createContainerCard("web-1")
  A.node.position([-380, 20])
  A.node.scale(0.9)
  world.stage().add(A.node)
  const lineA = createMountLine([-380, 180], [-380, 285], containerColors.readonly)
  world.overlay().add(lineA)

  yield* all(
    A.node.opacity(1, 0.6),
    A.node.scale(1, 0.6, easeOutBack),
    narrate(
      world.narrator,
      "A container mounts those read-only layers as its root, then stacks its own writable layer on top.",
      7,
    ),
  )
  yield* lineA.end(1, 0.6)

  // 4) Container web-2: same image, no copy, its own writable layer.
  const B = createContainerCard("web-2")
  B.node.position([380, 20])
  B.node.scale(0.9)
  world.stage().add(B.node)
  const lineB = createMountLine([380, 180], [380, 285], containerColors.readonly)
  world.overlay().add(lineB)

  yield* all(
    B.node.opacity(1, 0.6),
    B.node.scale(1, 0.6, easeOutBack),
    narrate(
      world.narrator,
      "Start a second container: it mounts the exact same read-only image — no copy — with its own writable layer.",
      8,
    ),
  )
  yield* lineB.end(1, 0.6)
  yield* base.node.scale(1.02, 0.25).to(1, 0.3)

  // 5) Writes are isolated to each container's own layer.
  const chipA = createFileChip("web-1.log", containerColors.writable)
  chipA.scale(0.8)
  A.chipsRow().add(chipA)

  yield* all(
    chipA.opacity(1, 0.4),
    chipA.scale(1, 0.4, easeOutBack),
    narrate(
      world.narrator,
      "A write in web-1 lands only in web-1's layer. web-2 never sees it.",
      6,
    ),
  )
  yield* waitFor(1)

  world.elements.sharedImage = base
  world.elements.containerA = A
  world.elements.containerB = B
}

// ---------------------------------------------------------------------------
// Namespaces — what each container gets its own private view of
// ---------------------------------------------------------------------------

const playNamespaces = function* (world: World): ThreadGenerator {
  const { containerA: A, containerB: B } = world.elements ?? {}

  if (!A || !B) {
    return
  }

  const nsColor = "#c084fc" // purple = namespaces
  const names = ["pid", "net", "mnt", "uts", "ipc"]

  yield* narrate(world.narrator, "So how are the two kept apart? Namespaces.", 4)

  const badgesA = names.map((n) => createBadge(n, nsColor))
  const badgesB = names.map((n) => createBadge(n, nsColor))
  badgesA.forEach((badge) => A.badgeRow().add(badge))
  badgesB.forEach((badge) => B.badgeRow().add(badge))

  yield* all(
    sequence(0.1, ...badgesA.map((badge) => badge.opacity(1, 0.3))),
    sequence(0.1, ...badgesB.map((badge) => badge.opacity(1, 0.3))),
    narrate(
      world.narrator,
      "A namespace gives a container its own private view of one kind of resource: process IDs, network, mounts, and more.",
      8,
    ),
  )

  yield* all(
    A.process.scale(1.06, 0.3).to(1, 0.3),
    B.process.scale(1.06, 0.3).to(1, 0.3),
    narrate(
      world.narrator,
      "In its PID namespace each process is PID 1 — and cannot even see the other's.",
      6,
    ),
  )

  yield* narrate(
    world.narrator,
    "The mount namespace is why each one sees the shared image as its own root filesystem.",
    6,
  )

  yield* waitFor(1)
}

// ---------------------------------------------------------------------------
// Cgroups — how much of the host each container is allowed to use
// ---------------------------------------------------------------------------

const playCgroups = function* (world: World): ThreadGenerator {
  const { containerA: A, containerB: B } = world.elements ?? {}

  if (!A || !B) {
    return
  }

  const cg1 = "#38bdf8"
  const cg2 = "#f472b6"
  const trackW = 1000
  const trackH = 56

  const seg1 = (<Rect width={0} height={trackH} fill={cg1} />) as Rect
  const seg2 = (<Rect width={0} height={trackH} fill={cg2} />) as Rect
  const track = (
    <Rect
      layout
      direction={"row"}
      alignItems={"center"}
      width={trackW}
      height={trackH}
      radius={14}
      fill={"#1e293b"}
      stroke={"#475569"}
      lineWidth={2}
      clip
      opacity={0}
      y={-430}
    >
      {seg1}
      {seg2}
    </Rect>
  ) as Rect
  const caption = (
    <Txt
      text={"host CPU & memory"}
      fontSize={22}
      fill={"#cbd5e1"}
      y={-482}
      opacity={0}
    />
  ) as Txt
  world.stage().add(track)
  world.stage().add(caption)

  yield* all(
    track.opacity(1, 0.5),
    caption.opacity(1, 0.5),
    narrate(
      world.narrator,
      "Isolation is one half. The other is limits — cgroups.",
      5,
    ),
  )

  yield* all(
    seg1.width(360, 0.8, easeOutCubic),
    A.node.stroke(cg1, 0.5),
    narrate(
      world.narrator,
      "A cgroup caps how much CPU and memory a container may use.",
      6,
    ),
  )

  yield* all(
    seg2.width(220, 0.8, easeOutCubic),
    B.node.stroke(cg2, 0.5),
    narrate(
      world.narrator,
      "web-2 is capped tighter, so it can't starve web-1 — or the host.",
      6,
    ),
  )

  // web-2 tries to grab more, but the cgroup clamps it back.
  yield* seg2.width(268, 0.3).to(220, 0.6)

  yield* narrate(
    world.narrator,
    "Same kernel, same image — but isolated by namespaces and bounded by cgroups. That is a container.",
    7,
  )

  yield* waitFor(1.5)
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

  // What does `run` actually do? -> pull + create + start.
  yield* playRunBreakdown(world)

  // pull: find the image, download it from the registry.
  yield* playImageRegistry(world)

  yield* playPullImage(world)

  yield* playWhatIsAnImage(world)

  // create + start: a writable layer and a running process.
  yield* playWhatIsAContainer(world)

  // Two containers over one shared read-only image on the host.
  yield* playMultipleContainers(world)

  // What keeps the two apart, and bounded.
  yield* playNamespaces(world)

  yield* playCgroups(world)

  // playClosingScene -- not sure

  yield* waitFor(5)
})
