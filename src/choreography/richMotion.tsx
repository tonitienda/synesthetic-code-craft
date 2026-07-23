import { Circle, Layout, Line, Rect, Txt } from "@motion-canvas/2d"
import {
  all,
  chain,
  delay,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  loop,
  ThreadGenerator,
  Vector2,
  waitFor,
} from "@motion-canvas/core"

/**
 * Rich motion vocabulary for Synesthetic Code Craft videos.
 *
 * Every helper here encodes one *physical metaphor* from the motion brief, so
 * scenes read as intent ("this impacts", "this flows", "this breathes") rather
 * than as raw tween chains. They are deliberately small, composable, and safe
 * to reuse across videos (containers, backprop, git, ...).
 *
 * Conventions:
 * - Overlay work uses WORLD coordinates. Pass `node.absolutePosition()` in, and
 *   the helper pins temporary nodes with `absolutePosition` so they land right
 *   regardless of the overlay's own transform. Never mix absolute values into a
 *   layout child's local `position()`.
 * - Anything that loops forever returns a cancellable handle. Cancel it (and
 *   reset the property) before the node changes state or leaves the scene.
 * - Temporary nodes are always removed before the helper returns, so scrubbing
 *   the timeline never leaves orphans behind.
 */

export type WorldPoint = [number, number] | Vector2

function toXY(p: WorldPoint): [number, number] {
  return Array.isArray(p) ? p : [p.x, p.y]
}

/**
 * BREATHING LIGHT — a live process is alive because its outline pulses between
 * two shades, not because it changes size (scaling reads as shimmer and nudges
 * neighbours). Returns the loop so the caller can `cancel()` it; reset the
 * stroke afterwards.
 */
export function breathe(
  node: Rect | Circle,
  opts: { from: string; to: string; period?: number },
): ThreadGenerator {
  const period = opts.period ?? 1.8
  return loop(Infinity, () =>
    node
      .stroke(opts.from, period, easeInOutCubic)
      .to(opts.to, period, easeInOutCubic),
  )
}

/**
 * PRESSURE RIPPLE / ELASTIC SETTLING — a receiving surface reacting to an
 * arriving object. Expands one soft ring from the impact point, optionally
 * flashes the surface border and gives the panel a shallow depress-and-settle.
 * The moving object's own squash/stretch is choreographed by the caller; this
 * is only the *surface's* half of the reaction.
 */
export function* impact(opts: {
  overlay: Layout
  at: WorldPoint
  color: string
  /** Ring's starting width in px (roughly the size of the landing slot). */
  size?: number
  /** Panel whose border briefly brightens on contact. */
  surface?: Rect
  /** Panel to nudge down and settle back, communicating absorption. */
  settleNode?: Layout
  depress?: number
}): ThreadGenerator {
  const [x, y] = toXY(opts.at)
  const size = opts.size ?? 220
  const depress = opts.depress ?? 8

  const ring = (
    <Rect
      width={size}
      height={size * 0.5}
      radius={size * 0.25}
      stroke={opts.color}
      lineWidth={4}
      opacity={0.55}
      scale={0.6}
    />
  ) as Rect
  opts.overlay.add(ring)
  ring.absolutePosition([x, y])

  const reactions: ThreadGenerator[] = [
    chain(
      all(ring.scale(1.7, 0.5, easeOutCubic), ring.opacity(0, 0.5)),
    ),
  ]

  if (opts.surface) {
    const rest = opts.surface.stroke()
    reactions.push(opts.surface.stroke(opts.color, 0.12).to(rest, 0.5))
  }

  if (opts.settleNode) {
    const restY = opts.settleNode.y()
    reactions.push(
      chain(
        opts.settleNode.y(restY + depress, 0.12, easeOutCubic),
        opts.settleNode.y(restY, 0.3, easeOutBack),
      ),
    )
  }

  yield* all(...reactions)
  ring.remove()
}

/**
 * FLOW / RIBBON — copying a coherent artifact from one place to another. Draws a
 * soft curved ribbon from origin to destination, tapers it as the transfer
 * finishes, then dissolves it tail-to-head. The source is never touched, so a
 * pull reads as *copy*, not *move*.
 */
export function* transferRibbon(opts: {
  overlay: Layout
  from: WorldPoint
  to: WorldPoint
  color: string
  width?: number
  duration?: number
  /** Fraction of the span used as the arc's perpendicular bow. */
  curve?: number
}): ThreadGenerator {
  const [fx, fy] = toXY(opts.from)
  const [tx, ty] = toXY(opts.to)
  const width = opts.width ?? 12
  const d = opts.duration ?? 1
  const curve = opts.curve ?? 0.22

  const dx = tx - fx
  const dy = ty - fy
  const len = Math.hypot(dx, dy) || 1
  // Bow the ribbon out along the perpendicular so it curves instead of cutting
  // a flat line between the two panels.
  const nx = -dy / len
  const ny = dx / len
  const ctrl: [number, number] = [
    dx / 2 + nx * len * curve,
    dy / 2 + ny * len * curve,
  ]

  const ribbon = (
    <Line
      points={[[0, 0], ctrl, [dx, dy]]}
      stroke={opts.color}
      lineWidth={width}
      radius={40}
      lineCap={"round"}
      end={0}
      opacity={0}
      shadowColor={opts.color + "66"}
      shadowBlur={16}
    />
  ) as Line
  opts.overlay.add(ribbon)
  // Pin local origin (0,0) onto the source's world point so the relative points
  // render correctly no matter what transform the overlay carries.
  ribbon.absolutePosition([fx, fy])

  // Draw on, origin -> destination.
  yield* all(ribbon.opacity(1, 0.2), ribbon.end(1, d * 0.6, easeInOutCubic))
  // Narrow as the transfer completes and the final segment snaps home.
  yield* ribbon.lineWidth(width * 0.35, d * 0.25, easeOutCubic)
  // Dissolve tail-to-head, leaving no orphan path node behind.
  yield* all(
    ribbon.start(1, d * 0.4, easeInOutCubic),
    delay(d * 0.2, ribbon.opacity(0, d * 0.2)),
  )
  ribbon.remove()
}

/**
 * MEMBRANE SPREAD — a thin writable layer being added on top of the image.
 * Begins as a thin bead, spreads laterally from the centre, then grows to full
 * height with a slight overshoot while the layer below is briefly compressed.
 * Lands on the exact final geometry so later scenes see the size they expect.
 */
export function* spreadLayer(opts: {
  layer: Rect
  finalWidth: number
  finalHeight: number
  /** Read-only layer below, briefly pressed as the membrane settles on it. */
  below?: Rect
  duration?: number
}): ThreadGenerator {
  const d = opts.duration ?? 1
  opts.layer.opacity(1)
  opts.layer.width(0)
  opts.layer.height(6)

  // 1) A thin bead spreads sideways from the centre.
  yield* opts.layer.width(opts.finalWidth, d * 0.4, easeOutCubic)

  // 2) It rises to full height with a small overshoot, pressing the layer below.
  yield* all(
    opts.layer.height(opts.finalHeight, d * 0.6, easeOutBack),
    opts.below
      ? chain(
          opts.below.scale.y(0.97, d * 0.3, easeOutCubic),
          opts.below.scale.y(1, d * 0.3, easeOutBack),
        )
      : waitFor(0),
  )

  // Land exactly on the geometry later scenes rely on.
  opts.layer.width(opts.finalWidth)
  opts.layer.height(opts.finalHeight)
}

/**
 * DRAG / GEL SLIDE — moving an *elastic* object (a bubble, a membrane, packaged
 * gel) so it reads as sticky and massy rather than a rigid slab teleporting.
 * The body loads with a stretch along the direction of travel, slides while
 * stretched (leading edge ahead, trailing edge lagging), overshoots the mark a
 * touch, then the trailing edge "catches up" as a single squash before it
 * settles on the exact target. Zero rotation.
 *
 * Only for objects whose identity is elastic — never the rigid base image, the
 * kernel, or storage. Restraint: stretch stays < 8%, settle 0.3–0.5s. Uses only
 * post-layout transforms (scale/position on a free node), so it never reflows a
 * layout's siblings.
 */
export function* dragMove(
  node: Layout,
  to: WorldPoint,
  opts?: {
    duration?: number
    /** Peak stretch along the travel axis, as a fraction (default 0.06). */
    stretch?: number
    axis?: "x" | "y" | "auto"
    /** Overshoot past the target along travel, in px (default derived). */
    overshoot?: number
    settle?: number
  },
): ThreadGenerator {
  const d = opts?.duration ?? 0.9
  const stretch = opts?.stretch ?? 0.06
  const settle = opts?.settle ?? 0.34
  const from = node.position()
  const [tx, ty] = toXY(to)
  const dx = tx - from.x
  const dy = ty - from.y
  const len = Math.hypot(dx, dy) || 1
  const axis = opts?.axis ?? (Math.abs(dx) >= Math.abs(dy) ? "x" : "y")
  const overshootPx = opts?.overshoot ?? Math.min(len * 0.05, 12)
  const ox = tx + (dx / len) * overshootPx
  const oy = ty + (dy / len) * overshootPx

  // Stretch along the axis of motion, thin slightly across it (constant volume).
  const stretchVec: [number, number] =
    axis === "x" ? [1 + stretch, 1 - stretch * 0.6] : [1 - stretch * 0.6, 1 + stretch]
  // The arrival squash: compress along travel, bulge across — the trailing edge
  // piling into the leading edge as it stops.
  const squashVec: [number, number] =
    axis === "x" ? [1 - stretch * 0.7, 1 + stretch * 0.5] : [1 + stretch * 0.5, 1 - stretch * 0.7]

  // Load: the body stretches along the pull before the far edge lets go.
  yield* node.scale(stretchVec, d * 0.2, easeOutCubic)
  // Travel: it slides while stretched, overshooting the mark slightly.
  yield* node.position([ox, oy], d * 0.62, easeInOutCubic)
  // Arrive: the trailing edge catches up (one squash) and it settles exactly.
  yield* all(
    node.position([tx, ty], settle, easeOutBack),
    chain(
      node.scale(squashVec, settle * 0.4, easeOutCubic),
      node.scale(1, settle * 0.6, easeOutBack),
    ),
  )
  node.position([tx, ty])
  node.scale(1)
}

export type LabeledPacket = { node: Rect; label: Txt }

/**
 * A small monospace "packet" that represents a single read or write of a
 * specific file as it travels between a process and a layer.
 */
export function createLabeledPacket(text: string, color: string): LabeledPacket {
  const label = (
    <Txt text={text} fontFamily={"monospace"} fontSize={22} fill={color} />
  ) as Txt
  const node = (
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
      {label}
    </Rect>
  ) as Rect
  return { node, label }
}

/**
 * FLOW SIGNAL — a directional read or write. A labelled packet travels along a
 * thin curved path; the source releases (a subtle brighten) and the target
 * absorbs (a glow-mix and dimple). When `morphTo` is supplied the packet does
 * NOT fade out — it reshapes into that node (see MORPH below), so a write
 * becomes the persistent file it created rather than two unrelated fades.
 *
 * Reads should originate from the read-only image; writes should land in the
 * writable layer. This helper never modifies the source's geometry, so the
 * image layers never look edited by a write.
 */
export function* flowSignal(opts: {
  overlay: Layout
  from: Rect
  to: Rect
  label: string
  color: string
  /** Pulse + glow-mix the target as it receives the packet. */
  absorb?: boolean
  /** Briefly brighten the source as it releases the packet. */
  releaseSource?: boolean
  /** Draw the thin guiding path (default true). */
  path?: boolean
  /** If set, morph the packet into this node instead of fading it out. */
  morphTo?: Rect
  /** Text to swap in mid-morph (e.g. the resulting file name). */
  morphText?: string
}): ThreadGenerator {
  const fromPos = opts.from.absolutePosition()
  const toPos = opts.to.absolutePosition()

  // Thin guiding path, drawn on from source to target.
  let path: Line | undefined
  if (opts.path ?? true) {
    const dx = toPos.x - fromPos.x
    const dy = toPos.y - fromPos.y
    const len = Math.hypot(dx, dy) || 1
    const ctrl: [number, number] = [
      dx / 2 + (-dy / len) * len * 0.14,
      dy / 2 + (dx / len) * len * 0.14,
    ]
    path = (
      <Line
        points={[[0, 0], ctrl, [dx, dy]]}
        stroke={opts.color}
        lineWidth={3}
        radius={30}
        lineCap={"round"}
        end={0}
        opacity={0.7}
      />
    ) as Line
    opts.overlay.add(path)
    path.absolutePosition([fromPos.x, fromPos.y])
    yield* path.end(1, 0.3, easeOutCubic)
  }

  const packet = createLabeledPacket(opts.label, opts.color)
  opts.overlay.add(packet.node)
  packet.node.absolutePosition(fromPos)
  packet.node.scale(0.9)

  yield* packet.node.opacity(1, 0.2)

  // Source releases the packet: a restrained brighten, never a geometry change.
  const release: ThreadGenerator[] = []
  if (opts.releaseSource) {
    const rest = opts.from.stroke()
    release.push(opts.from.stroke(opts.color, 0.15).to(rest, 0.5))
  }

  yield* all(
    packet.node.absolutePosition(toPos, 0.8, easeInOutCubic),
    ...release,
  )

  // Target absorbs: a dimple plus a brief glow-mix in the target's own colour.
  if (opts.absorb) {
    const restGlow = opts.to.shadowColor()
    yield* all(
      opts.to.scale(1.04, 0.14, easeOutCubic).to(1, 0.22, easeOutBack),
      opts.to
        .shadowColor(opts.color + "88", 0.14)
        .to(restGlow, 0.4),
    )
  }

  if (opts.morphTo) {
    yield* morphInto({
      packet,
      target: opts.morphTo,
      color: opts.color,
      newText: opts.morphText,
    })
  } else {
    yield* packet.node.opacity(0, 0.3)
    packet.node.remove()
  }

  if (path) {
    yield* path.start(1, 0.3, easeInOutCubic)
    path.remove()
  }
}

/**
 * MORPH — preserve identity between two visual states. The traveling packet
 * reshapes into an already-placed (but hidden) target chip: it slides to the
 * chip's world position, matches its size and colours, swaps its text at the
 * least disruptive moment, then hands off — the chip is revealed and the packet
 * removed in the same beat, so the file looks like the same object that was
 * just written, not a second element fading in.
 *
 * The target must already be added to its layout parent (opacity 0) so its
 * final world position and size are known.
 */
export function* morphInto(opts: {
  packet: LabeledPacket
  target: Rect
  color: string
  newText?: string
}): ThreadGenerator {
  const targetPos = opts.target.absolutePosition()
  const targetW = opts.target.width()
  const targetH = opts.target.height()

  // Compress at contact, then reshape toward the chip's footprint.
  yield* opts.packet.node.scale(0.9, 0.12, easeOutCubic)

  yield* all(
    opts.packet.node.absolutePosition(targetPos, 0.4, easeInOutCubic),
    opts.packet.node.width(targetW, 0.4, easeInOutCubic),
    opts.packet.node.height(targetH, 0.4, easeInOutCubic),
    opts.packet.node.fill(opts.color + "22", 0.4),
    opts.packet.node.stroke(opts.color + "aa", 0.4),
    opts.packet.node.scale(1, 0.4, easeOutBack),
    opts.packet.label.fontSize(20, 0.4),
    // Swap the text at ~60% through, while the shape is smallest and busiest.
    opts.newText
      ? delay(0.24, opts.packet.label.text(opts.newText, 0))
      : waitFor(0),
  )

  // Seamless handoff: reveal the persistent chip, drop the packet same frame.
  opts.target.opacity(1)
  opts.packet.node.remove()
}
