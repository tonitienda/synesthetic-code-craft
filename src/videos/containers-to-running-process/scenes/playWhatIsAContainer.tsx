import {
  PossibleVector2,
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
import { containerColors, theme } from "../theme"
import {
  World,
  colors,
  rotatePhaseToken,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "./utils"
import { Circle, Layout, Line, Node, Rect, Txt } from "@motion-canvas/2d"
import { createFileChip } from "../../../components/filesystem"
import { breathe, flowSignal, impact, spreadLayer } from "../../../choreography"

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
      fill={theme.secondary.soft}
      stroke={containerColors.writable + "cc"}
      lineWidth={3}
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
      opacity={0}
    >
      <Circle ref={dotRef} size={16} fill={containerColors.process} />
      <Txt
        text={name}
        fontFamily={"monospace"}
        fontSize={34}
        fill={theme.text}
      />
      <Txt text={pid} fontSize={22} fill={containerColors.process} />
    </Rect>
  ) as Rect

  return { node, dot: dotRef() }
}

// A layer band on the block's FRONT face — one of the container's stacked layers.
type BandSpec = {
  label: string
  fill: string
  stroke: string
  textColor: string
}

// One rigid 3D block, rotated about its shared top-front edge (the hinge).
//
//   rot 0 → upright: the layered FRONT face squarely faces the viewer (it looks
//           just like the container stack) and the merged-filesystem TOP face is
//           edge-on, so it is invisible.
//   rot 1 → a quarter-turn back: the TOP face has swung up to face the viewer
//           head-on (a flat, readable rectangle — the one filesystem the process
//           sees) while the FRONT face has swung down to horizontal, foreshorten-
//           ing to a sliver and fading out.
//
// Both faces are TRUE perspective trapezoids that converge *away from* the shared
// hinge: the top face narrows toward its far edge, the front face narrows toward
// its BOTTOM. That opposed convergence is what makes it read as a solid block
// turning in space rather than a rectangle being squashed.
//
// The trick that keeps this cheap: under a pure rotate-about-x every horizontal
// row stays a horizontal line on screen — it only slides, converges toward the
// centreline, and foreshortens. So each row/band is a plain per-row affine
// transform (a y-offset + a non-uniform scale), and each outline is a four-point
// trapezoid. No homography, no WebGL — just reactive signals.
type PerspectiveBlock = { node: Node; rot: SimpleSignal<number> }
function createPerspectiveBlock(
  width: number,
  frontHeight: number,
  frontLayers: BandSpec[],
): PerspectiveBlock {
  const rot = createSignal(0)
  const hw = width / 2

  // ---- TOP face: the merged filesystem, measured up from the hinge ----
  const PAD_TOP = 40
  const PAD_BOTTOM = 40
  const PAD_LEFT = 54
  const GAP = 16
  const rows = [
    {
      text: "/",
      fontSize: 40,
      fill: theme.text,
      weight: 700,
      indent: 0,
      h: 50,
    },
    {
      text: "📁  bin",
      fontSize: 30,
      fill: theme.text,
      weight: 400,
      indent: 44,
      h: 40,
    },
    {
      text: "📁  etc",
      fontSize: 30,
      fill: theme.text,
      weight: 400,
      indent: 44,
      h: 40,
    },
    {
      text: "📁  home",
      fontSize: 30,
      fill: theme.text,
      weight: 400,
      indent: 44,
      h: 40,
    },
    {
      text: "📁  usr",
      fontSize: 30,
      fill: theme.text,
      weight: 400,
      indent: 44,
      h: 40,
    },
    {
      text: "📁  var",
      fontSize: 30,
      fill: theme.text,
      weight: 400,
      indent: 44,
      h: 40,
    },
    // The file we just wrote to the writable layer — kept amber so the viewer
    // recognises it as the same access.log, now visible in the merged view.
    {
      text: "📄  access.log",
      fontSize: 28,
      fill: theme.text,
      weight: 400,
      indent: 88,
      h: 38,
    },
    {
      text: "📄  nginx.conf",
      fontSize: 30,
      fill: theme.details.mergedFilesystemText,
      weight: 400,
      indent: 44,
      h: 40,
    },
  ]
  const contentH =
    rows.reduce((sum, r) => sum + r.h, 0) + GAP * (rows.length - 1)
  const Ht = PAD_TOP + PAD_BOTTOM + contentH
  let cursor = Ht - PAD_TOP
  const rowU = rows.map((r) => {
    const centre = cursor - r.h / 2
    cursor -= r.h + GAP
    return centre
  })

  // A single rotation φ ∈ [0, 90°] drives the whole block. A point at depth z
  // projects at scale s = D/(D + z); smaller D = stronger perspective.
  const THETA = Math.PI / 2
  const D = 2.4 * Ht
  const phi = () => rot() * THETA

  // TOP face (b = up-distance from the hinge): as φ grows it swings up toward the
  // viewer, its depth b·cosφ shrinks to 0 → at head-on it is full width/height.
  const sT = (b: number) => D / (D + b * Math.cos(phi()))
  const yT = (b: number) => b * Math.sin(phi()) * sT(b) // magnitude, up
  // FRONT face (a = down-distance from the hinge): as φ grows it swings back,
  // its depth a·sinφ grows → it foreshortens to a sliver and converges downward.
  const sF = (a: number) => D / (D + a * Math.sin(phi()))
  const yF = (a: number) => a * Math.cos(phi()) * sF(a) // magnitude, down

  // Each face is only "there" when it is turned toward us; fade with its angle so
  // the collapsed (edge-on) face never smears a bright line across the hinge.
  const topOpacity = () => Math.pow(Math.sin(phi()), 0.6)
  const frontOpacity = () => Math.pow(Math.cos(phi()), 0.7)

  const topOutline = (): PossibleVector2[] => [
    [-hw, 0],
    [hw, 0],
    [hw * sT(Ht), -yT(Ht)],
    [-hw * sT(Ht), -yT(Ht)],
  ]

  // Project the filesystem tree through the same perspective transform as its
  // labels.  The main trunk connects the root's direct children; the indented
  // branch beneath `var` connects its `access.log` child.
  const rowX = -hw + PAD_LEFT
  const mainTrunkX = rowX + 20
  const mainBranchEndX = rowX + 36
  const childTrunkX = rowX + 64
  const childBranchEndX = rowX + 80
  const topLevelRowIndexes = [1, 2, 3, 4, 5, 7]
  const projectTopPoint = (x: number, u: number): PossibleVector2 => [
    x * sT(u),
    -yT(u),
  ]
  const mainTrunkPoints = (): PossibleVector2[] => [
    projectTopPoint(mainTrunkX, rowU[0] - rows[0].h / 2),
    ...topLevelRowIndexes.map((i) => projectTopPoint(mainTrunkX, rowU[i])),
  ]
  const mainBranchPoints = (rowIndex: number) => (): PossibleVector2[] => [
    projectTopPoint(mainTrunkX, rowU[rowIndex]),
    projectTopPoint(mainBranchEndX, rowU[rowIndex]),
  ]
  const childBranchPoints = (): PossibleVector2[] => [
    projectTopPoint(childTrunkX, (rowU[5] + rowU[6]) / 2),
    projectTopPoint(childTrunkX, rowU[6]),
    projectTopPoint(childBranchEndX, rowU[6]),
  ]

  // Split the front face into equal layer bands, top-to-bottom from the hinge.
  const nb = frontLayers.length
  const BAND_GAP = 10
  const bandH = (frontHeight - BAND_GAP * (nb - 1)) / nb
  const bands = frontLayers.map((layer, i) => {
    const a0 = i * (bandH + BAND_GAP) // top edge (down-distance)
    const a1 = a0 + bandH // bottom edge (down-distance)
    return { ...layer, a0, a1, amid: (a0 + a1) / 2 }
  })
  const bandPoints = (a0: number, a1: number) => (): PossibleVector2[] => [
    [-hw * sF(a0), yF(a0)], // top-left
    [hw * sF(a0), yF(a0)], // top-right
    [hw * sF(a1), yF(a1)], // bottom-right (narrower)
    [-hw * sF(a1), yF(a1)], // bottom-left (narrower)
  ]

  const node = (
    <Node opacity={0}>
      {/* FRONT face — the stacked layers, converging toward the bottom. */}
      <Node opacity={frontOpacity}>
        {bands.map((b) => (
          <Node>
            <Line
              points={bandPoints(b.a0, b.a1)}
              closed
              radius={10}
              fill={b.fill}
              stroke={b.stroke}
              lineWidth={3}
            />
            <Node
              y={() => yF(b.amid)}
              scale={() => [sF(b.amid), Math.cos(phi()) * sF(b.amid)]}
            >
              <Txt
                text={b.label}
                fontFamily={"monospace"}
                fontSize={24}
                fontWeight={700}
                fill={b.textColor}
              />
            </Node>
          </Node>
        ))}
      </Node>

      {/* TOP face — the single merged filesystem, converging toward the far edge. */}
      <Node opacity={topOpacity}>
        <Line
          points={topOutline}
          closed
          radius={14}
          fill={theme.details.mergedFilesystem}
          stroke={theme.details.mergedFilesystemText}
          lineWidth={3}
        />
        <Line
          points={mainTrunkPoints}
          stroke={theme.textMuted}
          lineWidth={3}
          lineCap={"round"}
          lineJoin={"round"}
          opacity={0.9}
        />
        {topLevelRowIndexes.map((rowIndex) => (
          <Line
            points={mainBranchPoints(rowIndex)}
            stroke={theme.textMuted}
            lineWidth={3}
            lineCap={"round"}
            opacity={0.9}
          />
        ))}
        <Line
          points={childBranchPoints}
          stroke={theme.textMuted}
          lineWidth={3}
          lineCap={"round"}
          lineJoin={"round"}
          radius={6}
          opacity={0.9}
        />
        {rows.map((r, i) => (
          <Node
            y={() => -yT(rowU[i])}
            scale={() => [sT(rowU[i]), Math.sin(phi()) * sT(rowU[i])]}
          >
            <Txt
              text={r.text}
              fontFamily={"monospace"}
              fontSize={r.fontSize}
              fontWeight={r.weight}
              fill={r.fill}
              offsetX={-1}
              x={-hw + PAD_LEFT + r.indent}
            />
          </Node>
        ))}
      </Node>
    </Node>
  ) as Node

  return { node, rot }
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
    from: theme.success.on,
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

  // 5) OVERLAYFS — the process has no idea any of this layering exists. Rotate the
  // whole stack back like a solid block until its TOP face — the single flat
  // filesystem overlayfs synthesises (read-only layers + writable layer, merged
  // into one "/") — swings up to face us head-on. This is the process's-eye view.
  const stack = imageFs.layersContainer()
  const panelTop = imageFs.node.y() - imageFs.node.height() / 2

  // Measure the upright stack (top-left-origin absolutePosition → centre-origin
  // overlay coords by subtracting half the frame; see coordinate-space notes).
  const stackAbs = stack.absolutePosition()
  const stackCenterX = stackAbs.x - VIDEO_WIDTH / 2
  const stackCenterY = stackAbs.y - VIDEO_HEIGHT / 2
  const stackHeight = stack.height()

  // The block's FRONT face mirrors the real stack's layers, top-to-bottom, so the
  // cross-fade from the live stack into the block is near-seamless. Colours match
  // the real nodes: process green, writable amber, read-only image layers slate.
  const frontLayers: BandSpec[] = [
    {
      label: "nginx · PID 1",
      fill: containerColors.processSoft,
      stroke: containerColors.process,
      textColor: theme.text,
    },
    {
      label: "writable layer",
      fill: theme.secondary.soft,
      stroke: containerColors.writable + "cc",
      textColor: containerColors.writable,
    },
    ...[...imageFs.layers].reverse().map((layer) => ({
      label: layer.label.text(),
      fill: theme.surfaceRaised + "88",
      stroke: theme.primary.base + "99",
      textColor: theme.text,
    })),
  ]

  const block = createPerspectiveBlock(barWidth, stackHeight, frontLayers)
  block.node.x(stackCenterX)
  // Hinge sits on the stack's top edge when upright; as the block turns we pan it
  // gently down so the head-on filesystem (which rises above the hinge) stays
  // centred in the panel instead of climbing out of frame.
  const hingeUprightY = stackCenterY - stackHeight / 2
  const hingeHeadOnY = imageFs.node.y() + 60
  block.node.y(
    () => hingeUprightY + (hingeHeadOnY - hingeUprightY) * block.rot(),
  )
  block.rot(0) // start upright, front face facing us — a twin of the real stack
  block.node.opacity(0)
  world.overlay().add(block.node)

  const mergedCaption = (
    <Txt
      text={"overlayfs · one merged filesystem"}
      fontFamily={"monospace"}
      fontSize={26}
      fill={theme.textMuted}
      opacity={0}
      position={[imageFs.node.x(), panelTop + 40]}
    />
  ) as Txt
  world.overlay().add(mergedCaption)

  // Cross-fade the live stack into the block while both stand upright and share
  // the same footprint, so the swap to the rotatable "solid" is invisible.
  yield* all(
    stack.opacity(0, 0.6, easeInOutCubic),
    block.node.opacity(1, 0.6, easeInOutCubic),
  )

  // Turn the block back to a clear three-quarter angle first: the top face opens
  // up (trapezoid narrowing toward its far edge) while the front-face layers
  // recede and converge toward the bottom — reading as one solid turning in space.
  yield* all(block.rot(0.62, 1.1, easeOutCubic), mergedCaption.opacity(1, 0.8))
  yield* waitFor(0.3)

  // Complete the quarter-turn: the merged filesystem straightens into a flat,
  // head-on rectangle while the layered front face folds under to a faint sliver —
  // all that squarely faces the viewer is the one filesystem the process sees.
  yield* block.rot(1, 1.0, easeInOutCubic)

  yield* waitFor(3)

  // Fold back down: the block turns upright again, then cross-fades back to the
  // live layer stack, ready for the container to be multiplied.
  yield* block.rot(0, 0.9, easeInOutCubic)
  yield* all(
    block.node.opacity(0, 0.5, easeInOutCubic),
    mergedCaption.opacity(0, 0.4),
    stack.opacity(1, 0.6, easeInOutCubic),
  )
  block.node.remove()
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
