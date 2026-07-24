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

// A 2.5D turn that opens the merged-filesystem face behind the real layer stack.
//
//   rot 0 → upright: the original layered stack faces the viewer and the merged
//           filesystem face is edge-on, so it is invisible.
//   rot 1 → a quarter-turn back: the TOP face has swung up to face the viewer
//           head-on while the original stack has foreshortened to a sliver.
//
// The caller drives the real stack with the front-face projection returned here.
// That preserves every existing layer, label, process, and file chip instead of
// cross-fading to a static duplicate at the start of the turn.
type PerspectiveBlock = {
  node: Node
  rot: SimpleSignal<number>
  frontOffset: (distanceFromBase: number) => number
  frontScale: (distanceFromBase: number) => number
  frontOpacity: () => number
}
function createPerspectiveBlock(
  width: number,
  frontHeight: number,
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
  // FRONT face projection used by the original stack as it folds toward its
  // planted base. The bottom is farther from the viewer, so it becomes the
  // short edge while the top remains wider.
  const sF = (a: number) =>
    D / (D + (frontHeight - a) * Math.sin(phi()))
  const yF = (a: number) => a * Math.cos(phi()) * sF(a)

  // Each face is only "there" when it is turned toward us.
  const topOpacity = () => Math.pow(Math.sin(phi()), 0.6)
  const frontOpacity = () => Math.pow(Math.cos(phi()), 0.7)

  const topOutline = (): PossibleVector2[] => [
    [-hw, 0],
    [hw, 0],
    [hw * sT(Ht), -yT(Ht)],
    [-hw * sT(Ht), -yT(Ht)],
  ]
  const frontOutline = (): PossibleVector2[] => [
    [-hw * sF(frontHeight), 0],
    [hw * sF(frontHeight), 0],
    [hw * sF(0), yF(frontHeight)],
    [-hw * sF(0), yF(frontHeight)],
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

  const node = (
    <Node opacity={0}>
      {/* A quiet converging silhouette ties the independently projected original
          layers into one rigid front face during the turn. */}
      <Line
        points={frontOutline}
        closed
        radius={12}
        fill={theme.surface + "22"}
        stroke={theme.primary.base + "66"}
        lineWidth={2}
        opacity={frontOpacity}
      />

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

  return {
    node,
    rot,
    frontOffset: yF,
    frontScale: sF,
    frontOpacity,
  }
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
  const stackBaseY = stackCenterY + stackHeight / 2

  // The process is about to become part of one rigid geometric turn. Stop its
  // independent outline pulse before its stroke is handed to the trapezoid.
  cancel(processBreath)
  process.node.stroke(containerColors.process)

  // Capture each real layer's centre before taking layout out of the equation.
  // Their content remains live, but their rectangular surfaces will be replaced
  // by clipping paths that can actually deform into trapezoids.
  const projectedItems = (stack.children() as Rect[]).map((node) => {
    const absolute = node.absolutePosition()
    const centerY = absolute.y - VIDEO_HEIGHT / 2
    return {
      node,
      distanceFromBase: stackBaseY - centerY,
      width: node.width(),
      height: node.height(),
      fill: node.fill(),
      stroke: node.stroke(),
      lineWidth: node.lineWidth(),
    }
  })
  const frontHeight = Math.max(
    ...projectedItems.map(
      ({distanceFromBase, height}) => distanceFromBase + height / 2,
    ),
  )

  const block = createPerspectiveBlock(barWidth, frontHeight)
  block.node.x(stackCenterX)
  // The shared top-front hinge moves toward the planted base as the layer face
  // folds. The merged filesystem opens above that hinge, rather than occupying
  // the same plane as the receding layers.
  block.node.y(() => stackBaseY - block.frontOffset(frontHeight))
  block.rot(0) // start upright, front face facing us — a twin of the real stack
  block.node.opacity(1)
  world.overlay().add(block.node)

  // Wrap each original layer in a four-point clipping surface. The content is
  // still the original node, while the wrapper supplies the shape a Rect cannot:
  // a wide top edge and a shorter bottom edge, with continuous slanted sides.
  const projectedSurfaces = projectedItems.map((item) => {
    const topDistance = item.distanceFromBase + item.height / 2
    const bottomDistance = item.distanceFromBase - item.height / 2
    const halfWidth = item.width / 2
    const points = (): PossibleVector2[] => [
      [
        -halfWidth * block.frontScale(topDistance),
        -block.frontOffset(topDistance),
      ],
      [
        halfWidth * block.frontScale(topDistance),
        -block.frontOffset(topDistance),
      ],
      [
        halfWidth * block.frontScale(bottomDistance),
        -block.frontOffset(bottomDistance),
      ],
      [
        -halfWidth * block.frontScale(bottomDistance),
        -block.frontOffset(bottomDistance),
      ],
    ]
    const surface = (
      <Line
        points={points}
        closed
        clip
        radius={item.node === process.node ? PROCESS_HEIGHT / 2 : 12}
        fill={item.fill}
        stroke={item.stroke}
        lineWidth={item.lineWidth}
        opacity={block.frontOpacity}
        position={[stackCenterX, stackBaseY]}
      />
    ) as Line
    world.overlay().add(surface)

    item.node.remove()
    item.node.fill("#00000000")
    item.node.stroke("#00000000")
    surface.add(item.node)
    item.node.x(0)
    item.node.y(
      () =>
        -(
          block.frontOffset(topDistance) +
          block.frontOffset(bottomDistance)
        ) / 2,
    )
    item.node.scale(() => [
      (block.frontScale(topDistance) +
        block.frontScale(bottomDistance)) / 2,
      (block.frontOffset(topDistance) -
        block.frontOffset(bottomDistance)) /
        item.height,
    ])

    return {...item, surface}
  })

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

  // Turn the block back to a clear three-quarter angle first: the top face opens
  // up while the original component foreshortens toward its planted base.
  // Absorb the old handoff time into this turn so narration timing is unchanged.
  yield* all(block.rot(0.62, 1.7, easeOutCubic), mergedCaption.opacity(1, 0.8))
  yield* waitFor(0.3)

  // Complete the quarter-turn: the merged filesystem straightens into a flat,
  // head-on rectangle while the layered front face folds under to a faint sliver —
  // all that squarely faces the viewer is the one filesystem the process sees.
  yield* block.rot(1, 1.0, easeInOutCubic)

  yield* waitFor(3)

  // Fold the same stack back upright. The previous swap-back time is absorbed
  // into the rotation, keeping the approved duration without another handoff.
  yield* all(
    block.rot(0, 1.5, easeInOutCubic),
    mergedCaption.opacity(0, 0.4),
  )

  // Restore the same nodes, in their original order, to the persistent layout.
  // Reset projection signals first so layout can resume ownership of geometry.
  for (const item of projectedSurfaces) {
    item.node.remove()
    item.surface.remove()
    item.node.fill(item.fill)
    item.node.stroke(item.stroke)
    item.node.opacity(1)
    item.node.scale(1)
    item.node.position([0, 0])
    stack.add(item.node)
  }
  block.node.remove()
  mergedCaption.remove()

  // Land the point: same image, isolated changes.
  yield* all(
    readonlyNode.scale(1.03, 0.3).to(1, 0.4),
    imageFs.layers[0].label.fill(containerColors.readonly, 0.4),
  )

  yield* waitFor(1)

  yield* process.node.stroke(containerColors.process, 0.3)
}
