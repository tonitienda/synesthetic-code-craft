import {
  ThreadGenerator,
  all,
  delay,
  easeOutBack,
  waitFor,
  loop,
  easeInOutCubic,
  cancel,
  createRef,
  Reference,
} from "@motion-canvas/core"
import { containerColors } from "../../../components/docker"
import { World, colors, rotatePhaseToken } from "./utils"
import { Circle, Layout, Rect, Txt } from "@motion-canvas/2d"
import { createFileChip } from "../../../components/filesystem"

type WritableLayer = {
  node: Rect
  chipsRow: Reference<Layout>
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

export const playWhatIsAContainer = function* (world: World): ThreadGenerator {
  const { imageFs } = world.elements ?? {}

  if (!imageFs) {
    return
  }

  const readonlyNode = imageFs.layers[0].node
  const barWidth = readonlyNode.width()
  const barHeight = readonlyNode.height()

  // The banner rolls on to the second act of `run`.
  yield* rotatePhaseToken(world, "create", colors.amber)

  // 1) CREATE — a container is the image plus a thin writable layer on top.
  // Re-badge the image panel as a "container" and stack the writable layer in.
  const writable = createWritableLayer(barWidth, barHeight)
  writable.node.height(0)
  imageFs.layersContainer().insert(writable.node, 0)

  yield* all(
    imageFs.titleRef().text("container", 0.6),
    imageFs.titleRef().fill(containerColors.writable, 0.6),
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
  yield* rotatePhaseToken(world, "start", colors.amber)

  const process = createProcessBox("nginx", "PID 1")
  process.node.width(imageFs.layersContainer().width())
  process.node.scale(0.8)
  imageFs.layersContainer().insert(process.node, 0)

  yield* all(
    process.node.opacity(1, 0.5),
    process.node.scale(1, 0.5, easeOutBack),
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
  )

  yield* waitFor(1)

  cancel(processBreath)
  yield* process.node.stroke(containerColors.process, 0.3)
}
