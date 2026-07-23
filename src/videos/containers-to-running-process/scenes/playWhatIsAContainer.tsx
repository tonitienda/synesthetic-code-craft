import {
  ThreadGenerator,
  all,
  delay,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
  cancel,
  createRef,
  createSignal,
  Reference,
  SimpleSignal,
} from "@motion-canvas/core"
import { containerColors } from "../../../components/docker"
import {
  World,
  colors,
  rotatePhaseToken,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "./utils"
import { Circle, Layout, Line, Node, Rect, Txt } from "@motion-canvas/2d"
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

const PROCESS_HEIGHT = 78
const STACK_GAP = 12
// A little slack on top of the exact reserve, so the six-item stack (process +
// writable + four read-only layers) never sits flush against the panel edges.
// Without it the reserved height equals the content to the pixel and font-metric
// rounding can tip the top layer into an overflow.
const STACK_HEADROOM = 48

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
      height={PROCESS_HEIGHT}
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

// The "top face" of the stack: the single, flat filesystem the process actually
// sees. It is deliberately neutral (cool slate, not amber or blue) because it is
// neither the writable layer nor any one read-only layer — it is the unified view
// overlayfs synthesises from all of them.
//
// It is drawn as a true perspective rotate-about-x. The face hinges on its NEAR
// (bottom) edge — the edge shared with the stack's top — and a single `tilt`
// signal drives the whole rotation: tilt 0 = standing head-on to the viewer (a
// flat rectangle), tilt 1 = laid back so we look down onto its top surface.
//
// The trick that keeps this cheap: under a pure rotate-about-x every horizontal
// row of the surface stays a horizontal line on screen — it only rises, converges
// toward the centreline, and foreshortens. So each row is placed with a plain
// per-row affine transform (a y-offset + a non-uniform scale), and the outline is
// a four-point trapezoid. No homography, no WebGL — just reactive signals.
type PerspectiveFace = { node: Node; tilt: SimpleSignal<number> }
function createPerspectiveFace(width: number): PerspectiveFace {
  const tilt = createSignal(0)

  const PAD_TOP = 40
  const PAD_BOTTOM = 40
  const PAD_LEFT = 54
  const GAP = 16
  const rows = [
    { text: "/", fontSize: 40, fill: "#0f172a", weight: 700, indent: 0, h: 50 },
    { text: "📁  bin", fontSize: 30, fill: "#1e293b", indent: 44, h: 40 },
    { text: "📁  etc", fontSize: 30, fill: "#1e293b", indent: 44, h: 40 },
    { text: "📁  home", fontSize: 30, fill: "#1e293b", indent: 44, h: 40 },
    { text: "📁  usr", fontSize: 30, fill: "#1e293b", indent: 44, h: 40 },
    { text: "📁  var", fontSize: 30, fill: "#1e293b", indent: 44, h: 40 },
    { text: "📄  nginx.conf", fontSize: 30, fill: "#475569", indent: 44, h: 40 },
  ]

  // Total surface height, and each row's centre measured in local "up from the
  // hinge" units (u = 0 at the near/bottom edge, u = H at the far/top edge).
  const contentH =
    rows.reduce((sum, r) => sum + r.h, 0) + GAP * (rows.length - 1)
  const H = PAD_TOP + PAD_BOTTOM + contentH
  let cursor = H - PAD_TOP
  const rowU = rows.map((r) => {
    const centre = cursor - r.h / 2
    cursor -= r.h + GAP
    return centre
  })

  // Perspective: tilt back by up to THETA_MAX; a point u units up the surface
  // recedes to depth u·sinθ, so it projects at scale s = D/(D + depth). The far
  // edge is therefore narrower (converges toward the centreline) and the vertical
  // spacing compresses by cosθ·s — the two cues a shear could never give.
  const THETA_MAX = (66 * Math.PI) / 180
  const D = 2.4 * H
  const theta = () => tilt() * THETA_MAX
  const sAt = (u: number) => D / (D + u * Math.sin(theta()))
  // Projected height (up from the hinge) of a point u units up the surface.
  const yUp = (u: number) => u * Math.cos(theta()) * sAt(u)

  const bgPoints = () => {
    const sTop = sAt(H)
    const yTop = yUp(H)
    const hw = width / 2
    return [
      [-hw, 0], // near-left (hinge)
      [hw, 0], // near-right (hinge)
      [hw * sTop, -yTop], // far-right (converged)
      [-hw * sTop, -yTop], // far-left (converged)
    ]
  }

  // The node's origin is the hinge (near edge centre); rows live above it at
  // negative y. Positioned/foreshortened reactively so the whole face rotates as
  // one when `tilt` changes.
  const node = (
    <Node opacity={0}>
      <Line
        points={bgPoints}
        closed
        radius={14}
        fill={"#e8eef7"}
        stroke={"#7dd3fc"}
        lineWidth={3}
        shadowColor={"#7dd3fc66"}
        shadowBlur={44}
      />
      {rows.map((r, i) => (
        <Node
          y={() => -yUp(rowU[i])}
          scale={() => [sAt(rowU[i]), Math.cos(theta()) * sAt(rowU[i])]}
        >
          <Txt
            text={r.text}
            fontFamily={"monospace"}
            fontSize={r.fontSize}
            fontWeight={r.weight}
            fill={r.fill}
            offsetX={-1}
            x={-width / 2 + PAD_LEFT + r.indent}
          />
        </Node>
      ))}
    </Node>
  ) as Node

  return { node, tilt }
}

export const playWhatIsAContainer = function* (world: World): ThreadGenerator {
  const { imageFs } = world.elements ?? {}

  if (!imageFs) {
    return
  }

  const readonlyNode = imageFs.layers[0].node
  const barWidth = readonlyNode.width()
  const barHeight = readonlyNode.height()
  const panelHeight = imageFs.node.height()
  const panelBottom = imageFs.node.y() + panelHeight / 2
  // Reserve room for both additions made in this scene: the writable layer and
  // the process pill. Keeping the bottom edge fixed makes the panel grow into
  // the free space above instead of pushing the persistent image stack down.
  const expandedPanelHeight =
    panelHeight + barHeight + PROCESS_HEIGHT + STACK_GAP * 2 + STACK_HEADROOM
  const expandedPanelY = panelBottom - expandedPanelHeight / 2

  // The banner rolls on to the second act of `run`.
  yield* rotatePhaseToken(world, "create", colors.amber)

  // 1) CREATE — a container is the image plus a thin writable layer on top.
  // Re-badge the image panel as a "container" and grow the writable membrane in.
  const writable = createWritableLayer(barWidth, barHeight)
  writable.node.height(0)
  writable.node.opacity(0)
  imageFs.layersContainer().insert(writable.node, 0)

  yield* all(
    imageFs.node.height(expandedPanelHeight, 1.1, easeOutCubic),
    imageFs.node.y(expandedPanelY, 1.1, easeOutCubic),
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

  // 5) OVERLAYFS — the process has no idea any of this layering exists. Tilt the
  // whole stack back so we look down onto its top surface, and reveal the single
  // flat filesystem overlayfs synthesises: read-only layers + writable layer,
  // merged into one "/". This is the process's-eye view.
  const stack = imageFs.layersContainer()
  const panelTop = imageFs.node.y() - imageFs.node.height() / 2

  // Treat the stack as one 3D block. The layers are its FRONT face: it only
  // foreshortens (no shear), so it stays a clean rectangle — never a staircase.
  // The merged filesystem is the block's TOP face: the SAME width, hinged on the
  // stack's top edge, shearing back so we look down onto it as the block tilts.
  const STACK_TILT_SCALE_Y = 0.46

  // Measure the upright stack once (scale.y === 1) so the top face can be pinned
  // to its top edge and stay glued there throughout the tilt. absolutePosition of
  // a layout child is top-left origin; the overlay is centre origin, so convert
  // by subtracting half the frame (see coordinate-space notes).
  const stackAbs = stack.absolutePosition()
  const stackCenterX = stackAbs.x - VIDEO_WIDTH / 2
  const stackCenterY = stackAbs.y - VIDEO_HEIGHT / 2
  const stackHeight = stack.height()
  // The stack foreshortens about its centre, so its live top edge is
  // centre − halfHeight·scaleY. The top face's bottom (hinge) edge tracks this.
  const stackTopEdgeY = () =>
    stackCenterY - (stackHeight / 2) * stack.scale.y()

  const face = createPerspectiveFace(barWidth)
  face.node.x(stackCenterX)
  face.node.y(stackTopEdgeY) // reactive: the hinge follows the stack's top edge
  face.tilt(1) // start laid flat onto the stack, hidden — revealed by opacity
  face.node.opacity(0)
  world.overlay().add(face.node)

  const mergedCaption = (
    <Txt
      text={"overlayfs · one merged filesystem"}
      fontFamily={"monospace"}
      fontSize={26}
      fill={"#94a3b8"}
      opacity={0}
      position={[imageFs.node.x(), panelTop + 40]}
    />
  ) as Txt
  world.overlay().add(mergedCaption)

  // Tilt the block back: the front face (layers) foreshortens in place while the
  // top face opens upward off the shared edge — settling to a clear looking-down
  // angle so we read it as the top surface of a 3D block, catching the light.
  yield* all(
    stack.scale.y(STACK_TILT_SCALE_Y, 1.1, easeInOutCubic),
    stack.opacity(0.7, 1.1, easeInOutCubic),
    delay(
      0.35,
      all(
        face.node.opacity(1, 0.85, easeOutCubic),
        face.tilt(0.72, 0.95, easeOutCubic),
        mergedCaption.opacity(1, 0.8),
      ),
    ),
  )

  // Complete the rotation until the merged filesystem faces us head-on: the
  // trapezoid straightens into a flat, full-height rectangle (tilt → 0), while the
  // layered front face keeps rotating away — foreshortening down and dimming to a
  // faint sliver — so all that squarely faces the viewer is the one filesystem the
  // process sees, with the layers still hinted underneath.
  yield* all(
    face.tilt(0, 1.0, easeInOutCubic),
    stack.scale.y(0.12, 1.0, easeInOutCubic),
    stack.opacity(0.22, 1.0, easeInOutCubic),
  )

  yield* waitFor(3)

  // Fold back to normal: the top face rotates back down onto the shared edge and
  // the layers stand up again, ready for the container to be multiplied.
  yield* all(
    face.node.opacity(0, 0.6, easeOutCubic),
    face.tilt(1, 0.6, easeInOutCubic),
    mergedCaption.opacity(0, 0.5),
    stack.scale.y(1, 1.0, easeInOutCubic),
    stack.opacity(1, 1.0, easeInOutCubic),
  )
  face.node.remove()
  mergedCaption.remove()

  // Land the point: same image, isolated changes.
  yield* all(
    readonlyNode.scale(1.03, 0.3).to(1, 0.4),
    imageFs.layers[0].label.fill(containerColors.readonly, 0.4),
  )

  yield* waitFor(1)

  cancel(processBreath)
  yield* process.node.stroke(containerColors.process, 0.3)
}
