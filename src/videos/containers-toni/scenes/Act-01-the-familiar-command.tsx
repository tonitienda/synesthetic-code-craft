import { Circle, Layout, Txt, Rect, makeScene2D } from "@motion-canvas/2d"
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
  createLineBird,
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
    imageFloat?: ThreadGenerator
    heartA?: ThreadGenerator
    heartB?: ThreadGenerator
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
      "If you've spent any time around Docker, you've almost certainly typed something like this.",
      6,
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
    narrate(
      world.narrator,
      "You hit enter, and it just works. You wanted nginx, so Docker goes and gets it.",
      6,
    ),
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
      "But have you ever stopped to ask what's really going on here? What does 'run' actually do?",
      7,
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
      opacity={0}
      ref={splash}
    />,
  )

  // The channel's line-art bird sketches itself on, then sings the title into
  // existence — colored ripples carrying each word in.
  const bird = createLineBird()
  bird.node.position([-420, -30])
  bird.node.scale(1.15)
  splash().add(bird.node)
  bird.prepareDraw()

  const words = [
    { text: "Synesthetic", position: [255, -100], settle: colors.amber },
    { text: "Code", position: [50, 40], settle: "#e5e7eb" },
    { text: "Craft", position: [370, 40], settle: "#e5e7eb" },
  ].map(({ text, position, settle }) => {
    const node = (
      <Txt
        text={text}
        fontSize={118}
        fontWeight={800}
        fill={colors.amber}
        position={[position[0] - 36, position[1]]}
        opacity={0}
        letterSpacing={2}
      />
    ) as Txt
    splash().add(node)
    return { node, settle }
  })
  words[0].node.fill("#a78bfa")
  words[1].node.fill("#38bdf8")
  words[2].node.fill("#4ade80")

  yield* splash().opacity(1, 0.8, easeInOutCubic)
  yield* bird.draw()
  yield* bird.blink()

  yield* bird.tiltHead(-14, 0.35)
  yield* all(
    bird.sing({ spread: 2400, duration: 1.9, stagger: 0.28 }),
    delay(
      0.35,
      sequence(
        0.3,
        ...words.map(({ node }) =>
          all(node.opacity(1, 0.7), node.x(node.x() + 36, 0.7, easeOutCubic)),
        ),
      ),
    ),
  )
  yield* all(
    bird.tiltHead(0, 0.4),
    ...words.map(({ node, settle }) => node.fill(settle, 1.2)),
  )
  yield* bird.blink()

  yield* waitFor(0.4)
  yield* all(
    narrate(
      world.narrator,
      "So let's slow it right down, and follow what actually happens behind that one line.",
      4,
    ),
    splash().opacity(0, 2),
  )
  splash().remove()

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
  registry.node.scale(0.92)

  // Breathe with a soft glow — pulse the border brighter and back — instead of
  // scaling, so the panel never shimmers or nudges its neighbours.
  world.cancellation.registryBreath = yield loop(Infinity, () =>
    registry.node
      .stroke("#94a3b8", 1.6, easeInOutCubic)
      .to("#64748b", 1.6, easeInOutCubic),
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
  nginxImage.node.scale(0.8)
  nginxImage.node.absolutePosition(registry.imageSlotPosition())

  yield* all(
    registry.node.opacity(1, 1),
    registry.node.scale(1, 1, easeOutBack),
    narrate(
      world.narrator,
      "Public images like nginx live in a registry — a shared library of images. By default, Docker looks in Docker Hub.",
      7,
    ),
    delay(
      3,
      all(
        nginxImage.node.opacity(1, 0.6),
        nginxImage.node.scale(1, 0.8, easeOutBack),
      ),
    ),
  )

  yield* waitFor(1.5)

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
  // Frame the local system as "the host" from the very first time we see it, so
  // it can persist unchanged all the way through to the container scenes.
  localSystem.title().text("Your machine — the host")

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
  localSystem.node.scale(0.92)

  // Hand the "breathing" glow over: settle the registry's border back to rest,
  // and start the same soft pulse on the local system instead.
  cancel(registryBreath)
  yield* registry.node.stroke("#64748b", 0.4)

  world.cancellation.localSystemBreath = yield loop(Infinity, () =>
    localSystem.node
      .stroke("#94a3b8", 1.6, easeInOutCubic)
      .to("#64748b", 1.6, easeInOutCubic),
  )

  world.stage().add(localSystem.node)

  yield* all(
    localSystem.node.opacity(1, 1),
    localSystem.node.scale(1, 1, easeOutBack),
    narrate(
      world.narrator,
      "This box down here is your own machine — the host that Docker is actually running on.",
      6,
    ),
  )

  yield* waitFor(1.5)

  const findLocallyLine = terminal.outputLine(
    "Unable to find image 'nginx:latest' locally",
  )

  if (!findLocallyLine) {
    return
  }

  yield* all(
    findLocallyLine.textRef().fill(Theme.highlight, 0.5),
    narrate(
      world.narrator,
      "The very first thing Docker does is look right here on your machine and ask: do I already have this image?",
      7,
    ),
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
      "This time it doesn't. So it reaches out to the registry and pulls the image down onto your machine, layer by layer.",
      7,
    ),
  )

  const localSlotCenter = localSystem.slot().absolutePosition()
  const cx = localSlotCenter.x
  const cy = localSlotCenter.y

  const localImage = createDockerImageBox("nginx")
  localImage.node.position(registryImage.node.position())
  localImage.node.opacity(0)
  localImage.node.scale(1)

  world.overlay().add(localImage.node)

  // Drop the image like it's falling into water: accelerate down, plunge just
  // past the resting spot, squash on impact, then bob back up and settle.
  yield* all(
    localImage.node.opacity(1, 0.3),
    chain(
      localImage.node.absolutePosition([cx, cy + 30], 0.8, easeInCubic),
      localImage.node.absolutePosition([cx, cy - 16], 0.28, easeOutCubic),
      localImage.node.absolutePosition([cx, cy + 6], 0.22, easeInOutCubic),
      localImage.node.absolutePosition([cx, cy], 0.2, easeOutCubic),
    ),
    chain(
      localImage.node.scale([0.94, 1.08], 0.8, easeInCubic), // stretch as it falls
      localImage.node.scale([1.2, 0.78], 0.16), // squash on impact
      localImage.node.scale([0.9, 1.1], 0.22), // stretch off the bounce
      localImage.node.scale(1, 0.3, easeOutBack), // settle with a tiny overshoot
    ),
  )

  // ...then let it bob gently, as if floating on the surface.
  const landedY = localImage.node.y()
  world.cancellation.imageFloat = yield loop(Infinity, () =>
    localImage.node
      .y(landedY + 5, 1.6, easeInOutCubic)
      .to(landedY - 5, 1.6, easeInOutCubic),
  )

  yield* waitFor(3)
  yield* all(
    pullLine.textRef().fill(Theme.text, 0.5),
    narrate(
      world.narrator,
      "And there it is — the image now lives on your machine, ready to go. That's the pull step done.",
      6,
    ),
    // The terminal has done its one honest job: showing the pull. `docker run`
    // prints nothing for create or start, so instead of leaving it hanging
    // around as a chip, we let it bow out the moment pull is complete.
    delay(2, terminal.exit(0.9)),
  )
  terminal.node.remove()

  yield* waitFor(1)

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
    // Fade in quickly, hold the line so it stays readable, then fade out.
    // This keeps longer, conversational lines legible instead of only
    // peaking for a single instant.
    const fade = Math.min(0.6, duration / 3)
    const hold = Math.max(0, duration - fade * 2)
    yield* narrator().opacity(1, fade)
    yield* waitFor(hold)
    yield* narrator().opacity(0, fade)
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
  const { registry, localSystem, registryImage, localImage } =
    world.elements ?? {}

  if (!registry || !localSystem || !registryImage || !localImage) {
    return
  }

  // The image is about to be reshaped into layers, so stop its idle float first
  // to avoid fighting the upcoming position tweens.
  if (world.cancellation.imageFloat) {
    cancel(world.cancellation.imageFloat)
  }

  const localSystemTargetHeight = VIDEO_HEIGHT - PADDING * 2

  // The terminal has already bowed out after the pull, so the host panel can
  // take centre stage. Slide it to the middle and grow it to fill the frame, so
  // it reads as the subject we're about to open up rather than a sidebar.
  const focusX = 0

  yield* all(
    registry.node.y(-1000, 2),
    registryImage.node.y(-1000, 2),
    localSystem.node.x(focusX, 2, easeInOutCubic),
    localImage.node.x(focusX, 2, easeInOutCubic),
    localSystem.node.height(localSystemTargetHeight, 2),
    localSystem.node.y(toWorldY(PADDING, localSystemTargetHeight), 2),
    narrate(
      world.narrator,
      "But hold on — what exactly is this thing we just downloaded? What is an image?",
      5,
    ),
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
      "An image is really just a frozen snapshot of a filesystem, stacked up in layers. It's completely inert — it can't do anything on its own. It just sits there.",
      9,
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
  yield* all(
    fsLayers.appear(0.5),
    narrate(
      world.narrator,
      "Each layer is one step in how the image was built: a base system at the bottom, then packages, then dependencies, and the application files right on top.",
      9,
    ),
  )

  yield* all(
    fsLayers.collapse("image fs (read-only)", 3),
    narrate(
      world.narrator,
      "Stacked together, those layers behave as one single, read-only filesystem. Add a little metadata — like which program to start — and that's an image. And notice: nothing is actually running yet.",
      9,
    ),
  )

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
      "Here's where create comes in. Docker takes that read-only image and lays a thin, writable layer right on top of it. The image plus that new layer — together, that's a container.",
      9,
    ),
    delay(
      0.6,
      all(
        // easeOutBack overshoots the target height slightly, so the new layer
        // "snaps" into place instead of gliding in.
        writable.node.height(barHeight, 0.9, easeOutBack),
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
      "And then start brings it to life. It launches the image's main program — for nginx, that's the web server — as the very first process inside the container, PID 1.",
      9,
    ),
  )

  // Unlike the inert image, the process is alive — it breathes by pulsing its
  // green outline brighter and back, rather than by changing size.
  const processBreath = yield loop(Infinity, () =>
    process.node
      .stroke("#6ee7b7", 0.9, easeInOutCubic)
      .to(containerColors.process, 0.9, easeInOutCubic),
  )

  yield* waitFor(0.6)

  // 3) READ — config is read from the read-only image layer.
  yield* narrate(
    world.narrator,
    "Now watch how it uses that filesystem. When the process needs its configuration, it reads it straight from the read-only image underneath.",
    7,
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
    "But the moment it writes something — a log file, say — that never touches the image. The write lands in the container's own writable layer. Even changing an existing file first copies it up into that layer.",
    9,
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
      "Same read-only image underneath, but every change stays isolated in the container's own layer. That is a container.",
      6,
    ),
  )

  yield* waitFor(1)

  cancel(processBreath)
  yield* process.node.stroke(containerColors.process, 0.3)
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
    narrate(
      world.narrator,
      "Here's the first surprise: run isn't really one thing at all. It's three smaller steps rolled into one convenient command.",
      7,
    ),
  )

  yield* sequence(
    0.35,
    ...steps.map((card) =>
      all(card.opacity(1, 0.5), card.scale(1, 0.5, easeOutBack)),
    ),
  )

  yield* narrate(
    world.narrator,
    "First it pulls the image — if you don't already have it — then it creates a container from it, and finally it starts the process inside. Let's walk through each one.",
    9,
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
  dot: Circle
  writable: Rect
  chipsRow: Reference<Layout>
  badgeRow: Reference<Layout>
}

function createContainerCard(name: string): ContainerCard {
  const titleRef = createRef<Txt>()
  const chipsRow = createRef<Layout>()
  const badgeRow = createRef<Layout>()
  const processRef = createRef<Rect>()
  const dotRef = createRef<Circle>()
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
        <Circle ref={dotRef} size={14} fill={containerColors.process} />
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
    dot: dotRef(),
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

const playMultipleContainers = function* (world: World): ThreadGenerator {
  const { imageFs } = world.elements ?? {}

  if (!imageFs) {
    return
  }

  // The shared read-only image is the foundation, so it must NOT move. We pin it
  // exactly where it already sits and build everything new on top of it, in
  // place. Going from one container to two never disturbs the base — or the host
  // around it, which we deliberately leave untouched.
  const readonlyNode = imageFs.layers[0].node
  const roPos = readonlyNode.absolutePosition()
  const roW = readonlyNode.width()
  const roH = readonlyNode.height()

  // Detach the base from the old container panel, pinned in place, so the panel
  // chrome can fade while the base stays exactly where it is underneath.
  readonlyNode.remove()
  world.stage().add(readonlyNode)
  readonlyNode.absolutePosition(roPos)

  const base: SharedImageBase = { node: readonlyNode }

  // The cards live in world.stage() alongside the base, so place them in the
  // base's LOCAL space — not the absolute space `roPos` is in. (Mixing the two
  // offsets the cards by the stage transform and shoves them off-screen.)
  const baseLocal = readonlyNode.position()

  // Two container boxes sit directly on top of the base — touching it, no gaps
  // and no connector lines — side by side and centred over it.
  const topEdgeY = baseLocal.y - roH / 2
  const cardHeight = 320
  const cardCenterY = topEdgeY - cardHeight / 2
  const cardWidth = 372
  const splitX = cardWidth / 2 + 12 // half a card + half the gap between them

  // web-1 begins AS the single container: one full-width box straddling the
  // whole base. Cross-fade the old panel into it so the moment reads as "the
  // container we've been looking at", now drawn as a discrete box on the base.
  const A = createContainerCard("web-1")
  A.node.width(roW)
  A.node.position([baseLocal.x, cardCenterY])
  A.node.opacity(0)
  world.stage().add(A.node)

  yield* all(
    imageFs.node.opacity(0, 0.6),
    A.node.opacity(1, 0.6),
    imageFs.layers[0].label.text("shared image fs (read-only)", 0.6),
    narrate(
      world.narrator,
      "So far we've been looking at just one container, sitting on top of that read-only image. Now watch what happens when we run a second one.",
      8,
    ),
  )
  imageFs.node.remove()

  // web-2 SPLITS off from web-1: web-1 shrinks to the left half while web-2
  // emerges to the right — both still resting on the exact same base beneath.
  const B = createContainerCard("web-2")
  B.node.width(cardWidth)
  B.node.position([baseLocal.x, cardCenterY])
  B.node.opacity(0)
  B.node.scale(0.9)
  world.stage().add(B.node)

  // Both cards overshoot their final x by a touch and settle back, and web-2
  // pops in with a small scale-up, so the second container feels born rather
  // than slid into place.
  yield* all(
    A.node.width(cardWidth, 0.9, easeInOutCubic),
    A.node
      .x(baseLocal.x - splitX - 14, 0.7, easeOutCubic)
      .to(baseLocal.x - splitX, 0.35, easeInOutCubic),
    delay(
      0.15,
      all(
        B.node.opacity(1, 0.75),
        B.node.scale(1, 0.9, easeOutBack),
        B.node
          .x(baseLocal.x + splitX + 14, 0.7, easeOutCubic)
          .to(baseLocal.x + splitX, 0.35, easeInOutCubic),
      ),
    ),
    // The base glows once to say: both of these rest on the one shared image.
    delay(0.5, base.node.stroke("#7dd3fc", 0.3).to("#7dd3fc99", 0.5)),
    narrate(
      world.narrator,
      "Docker doesn't copy the image. It creates a brand-new container from it — a new process, and a new, empty writable layer — and both containers read from the very same image on disk.",
      10,
    ),
  )

  yield* waitFor(0.4)

  // Writes stay isolated to each container's own writable layer.
  const chipA = createFileChip("web-1.log", containerColors.writable)
  chipA.scale(0.8)
  A.chipsRow().add(chipA)

  yield* all(
    chipA.opacity(1, 0.4),
    chipA.scale(1, 0.4, easeOutBack),
    narrate(
      world.narrator,
      "So when web-1 writes a log file, it lands only in web-1's own layer. web-2 never even sees it. Same shared image underneath — completely separate changes on top.",
      9,
    ),
  )
  yield* waitFor(0.6)

  yield* narrate(
    world.narrator,
    "And that's the real beauty of it. Add a third container, or a tenth — nothing about the system underneath changes. It's always one shared image, with lightweight containers layered on top.",
    9,
  )

  yield* waitFor(0.8)

  // Both processes are alive — pulse each status light between a bright and a
  // dim green so they read as steady heartbeats without anything resizing.
  world.cancellation.heartA = yield loop(Infinity, () =>
    A.dot
      .fill("#6ee7b7", 0.7, easeInOutCubic)
      .to("#10b981", 0.7, easeInOutCubic),
  )
  world.cancellation.heartB = yield loop(Infinity, () =>
    B.dot
      .fill("#6ee7b7", 0.7, easeInOutCubic)
      .to("#10b981", 0.7, easeInOutCubic),
  )

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

  yield* narrate(
    world.narrator,
    "Now, both of these containers are running on the same kernel — the host's. So how are they kept apart? The answer is namespaces.",
    8,
  )

  const badgesA = names.map((n) => createBadge(n, nsColor))
  const badgesB = names.map((n) => createBadge(n, nsColor))
  badgesA.forEach((badge) => A.badgeRow().add(badge))
  badgesB.forEach((badge) => B.badgeRow().add(badge))

  yield* all(
    sequence(0.1, ...badgesA.map((badge) => badge.opacity(1, 0.3))),
    sequence(0.1, ...badgesB.map((badge) => badge.opacity(1, 0.3))),
    narrate(
      world.narrator,
      "A namespace gives a container its own private view of just one kind of resource. There's one for process IDs, one for the network, one for filesystem mounts, and several more.",
      9,
    ),
  )

  yield* all(
    A.process.scale(1.06, 0.3).to(1, 0.3),
    B.process.scale(1.06, 0.3).to(1, 0.3),
    narrate(
      world.narrator,
      "Take process IDs. Inside its own namespace, each container's main process is PID 1 — and neither container can see the other's processes at all.",
      8,
    ),
  )

  yield* narrate(
    world.narrator,
    "And the mount namespace is the trick that lets each container see its own stack — the shared image plus its own writable layer — as its entire root filesystem, starting at slash.",
    9,
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
  // The track must sit INSIDE the host panel (900 wide, top edge at y≈-516,
  // title row down to y≈-456), so keep it narrower than the panel and below
  // the title — otherwise it crosses the panel border and collides with the
  // "Your machine — the host" label.
  const trackW = 800
  const trackH = 56
  const trackRestY = -390
  const captionRestY = -436

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
      y={trackRestY}
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
      y={captionRestY}
      opacity={0}
    />
  ) as Txt
  world.stage().add(track)
  world.stage().add(caption)

  // Drift down into place while fading in, instead of materialising in situ.
  track.y(trackRestY - 30)
  caption.y(captionRestY - 30)

  yield* all(
    track.opacity(1, 0.5),
    track.y(trackRestY, 0.7, easeOutCubic),
    caption.opacity(1, 0.5),
    caption.y(captionRestY, 0.7, easeOutCubic),
    narrate(
      world.narrator,
      "Now, keeping them apart is only half the story. The other half is stopping any one container from hogging everything. And that's the job of cgroups.",
      8,
    ),
  )

  yield* all(
    seg1.width(288, 0.8, easeOutCubic),
    A.node.stroke(cg1, 0.5),
    narrate(
      world.narrator,
      "A cgroup — short for control group — lets you set a hard cap on how much CPU and memory a container may use out of the host's total.",
      8,
    ),
  )

  yield* all(
    seg2.width(176, 0.8, easeOutCubic),
    B.node.stroke(cg2, 0.5),
    narrate(
      world.narrator,
      "We can give web-2 a tighter limit, so no matter what it does, it can never starve web-1 — or bring down the host itself.",
      8,
    ),
  )

  // web-2 tries to grab more, but the cgroup clamps it back.
  yield* seg2.width(214, 0.3).to(176, 0.6, easeOutBack)

  yield* narrate(
    world.narrator,
    "And that's the whole picture. One shared kernel, one shared image — but each container fenced off by namespaces, and kept in check by cgroups. That, in the end, is all a container really is.",
    10,
  )

  yield* waitFor(1.5)
}

// ---------------------------------------------------------------------------
// Closing — full circle back to the command, then the outro card
// ---------------------------------------------------------------------------

const playClosingScene = function* (world: World): ThreadGenerator {
  // Stop the idle loops so nothing keeps ticking behind the outro.
  const { localSystemBreath, heartA, heartB } = world.cancellation ?? {}
  if (localSystemBreath) cancel(localSystemBreath)
  if (heartA) cancel(heartA)
  if (heartB) cancel(heartB)

  // 1) Calmly clear the working diagram. The closing content lives in the
  // background layer, which shows through once the front layers fade out.
  yield* all(
    world.stage().opacity(0, 1.4, easeInOutCubic),
    world.overlay().opacity(0, 1.4, easeInOutCubic),
    narrate(
      world.narrator,
      "So — let's pull the whole thing back together.",
      4,
    ),
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

  yield* all(
    cmd.opacity(1, 0.6),
    cmd.scale(1, 0.6, easeOutBack),
    narrate(
      world.narrator,
      "It still looks like one simple line. But now you know everything it quietly sets in motion.",
      6,
    ),
  )

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

  yield* narrate(
    world.narrator,
    "Pull the image, create the container, start the process — then fence it off with namespaces, and rein it in with cgroups.",
    9,
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
    narrate(
      world.narrator,
      "That's what really happens, every single time you run a container. Thanks for watching.",
      6,
    ),
  )

  yield* waitFor(2)
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
      y={450}
      width={VIDEO_WIDTH - 300}
      fontSize={36}
      textAlign={"center"}
      textWrap
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

  yield* playClosingScene(world)

  yield* waitFor(2)
})
