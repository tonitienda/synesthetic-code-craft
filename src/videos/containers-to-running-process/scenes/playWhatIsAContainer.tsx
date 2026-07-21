import {
  ThreadGenerator,
  all,
  delay,
  easeOutBack,
  easeOutCubic,
  waitFor,
  cancel,
  createRef,
  Reference,
} from "@motion-canvas/core"
import { containerColors } from "../../../components/docker"
import { World, colors, rotatePhaseToken } from "./utils"
import { Circle, Layout, Rect, Txt } from "@motion-canvas/2d"
import { createFileChip } from "../../../components/filesystem"
import {
  breathe,
  flowSignal,
  impact,
  spreadLayer,
} from "../../../choreography"

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
function createProcessBox(
  name: string,
  pid: string,
): { node: Rect; dot: Circle } {
  const dotRef = createRef<Circle>()
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
      <Circle ref={dotRef} size={16} fill={containerColors.process} />
      <Txt
        text={name}
        fontFamily={"monospace"}
        fontSize={34}
        fill={"#ecfdf5"}
      />
      <Txt text={pid} fontSize={22} fill={containerColors.process} />
    </Rect>
  ) as Rect

  return { node, dot: dotRef() }
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
  // Re-badge the image panel as a "container" and grow the writable membrane in.
  const writable = createWritableLayer(barWidth, barHeight)
  writable.node.height(0)
  writable.node.opacity(0)
  imageFs.layersContainer().insert(writable.node, 0)

  yield* all(
    imageFs.titleRef().text("container", 0.6),
    imageFs.titleRef().fill(containerColors.writable, 0.6),
    // A membrane, not a curtain: it beads at the centre, spreads sideways, then
    // rises to full height with a slight overshoot, pressing the image below.
    delay(
      0.5,
      spreadLayer({
        layer: writable.node,
        finalWidth: barWidth,
        finalHeight: barHeight,
        below: readonlyNode,
        duration: 1.1,
      }),
    ),
  )

  yield* waitFor(0.5)

  // 2) START — the container's main process ignites into life as PID 1.
  yield* rotatePhaseToken(world, "start", colors.amber)

  const process = createProcessBox("nginx", "PID 1")
  process.node.width(imageFs.layersContainer().width())
  process.node.scale(0.6)
  imageFs.layersContainer().insert(process.node, 0)

  // Ignition: the pill inflates from its centre while one green ring expands
  // toward the container boundary and the status dot fires a single strong beat.
  process.dot.shadowColor(containerColors.process)
  process.dot.shadowBlur(0)
  yield* all(
    process.node.opacity(1, 0.4),
    process.node.scale(1, 0.5, easeOutBack),
    impact({
      overlay: world.overlay(),
      at: process.node.absolutePosition(),
      color: containerColors.process,
      size: process.node.width(),
    }),
    process.dot.scale(1.9, 0.16, easeOutCubic).to(1, 0.3, easeOutBack),
    process.dot.shadowBlur(26, 0.16, easeOutCubic).to(8, 0.4),
  )

  // Then it settles into a restrained "alive" breathing outline — pulsing the
  // green stroke brighter and back, never scaling.
  const processBreath = yield breathe(process.node, {
    from: "#6ee7b7",
    to: containerColors.process,
    period: 0.9,
  })

  yield* waitFor(0.6)

  // 3) READ — config is read from the read-only image layer. The layer releases
  // it, and the process absorbs it with a cyan glow-mix (not a uniform scale).
  yield* flowSignal({
    overlay: world.overlay(),
    from: readonlyNode,
    to: process.node,
    label: "read  /etc/nginx/nginx.conf",
    color: containerColors.readonly,
    absorb: true,
    releaseSource: true,
  })

  yield* waitFor(0.4)

  // 4) WRITE — logs are written to the writable layer, never the image. The
  // write packet does not vanish: it morphs into the persistent access.log chip,
  // so the file is visibly the thing that was just written.
  const chip = createFileChip("access.log", containerColors.writable)
  chip.opacity(0)
  writable.chipsRow().add(chip)

  yield* flowSignal({
    overlay: world.overlay(),
    from: process.node,
    to: writable.node,
    label: "write  /var/log/nginx/access.log",
    color: containerColors.writable,
    absorb: true,
    morphTo: chip,
    morphText: "access.log",
  })

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
