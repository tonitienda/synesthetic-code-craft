import { Circle, Node, Path } from "@motion-canvas/2d"
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  sequence,
  ThreadGenerator,
  Vector2,
  waitFor,
} from "@motion-canvas/core"
import { emitRipple } from "./birdLogo"

// Schematic mono-line bird — the channel's original line-art logo, traced
// verbatim from its SVG (160x160 viewBox): a perched songbird in profile
// drawn as a handful of continuous strokes, with an amber eye as the only
// filled shape.
export const lineBirdColors = {
  stroke: "#e5e7eb",
  eye: "#fbbf24",
  glow: "#38bdf8",
}

// The SVG uses stroke-width 2 for most lines and 3 for the two body accents;
// widths here keep that ratio at the component's render scale.
const SCALE = 2.6
const THIN = 2.4
const THICK = 3.2

// The two long SVG paths that run from the head into the body are split at
// the neck — throat at (83.481,38.539), nape at (104.917,46.001) — so the
// head can tilt on its own. The pivot sits midway between the two seams,
// and the body-side paths re-trace the lower half of each neck curve, so
// the joints stay covered while the head rotates (at rest the overlap
// coincides exactly and is invisible).
const HEAD_PIVOT = new Vector2(94.2, 42.3)
const BEAK_TIP = new Vector2(121.5, 28)

type LogoStroke = {
  data: string
  width: number
  duration: number
  head?: boolean
}

// Path data straight from the logo SVG, in sketch order: head, face, body
// core, back and tail, wing feathers, belly, tail feathers, foot, claws,
// and finally the curled branch tip the bird grips.
const logoStrokes: LogoStroke[] = [
  // Crown: over the top of the head and down the face to the throat.
  {
    data: "M111.5,28 C100.193,18.827 90.792,19.454 81.5,30 C78.617,33.272 79.573,36.664 83.481,38.539",
    width: THIN,
    duration: 0.5,
    head: true,
  },
  // Cheek line under the eye.
  {
    data: "M100.5,30.5 C94.059,29.396 87.86,29.543 82.5,34",
    width: THIN,
    duration: 0.3,
    head: true,
  },
  // Beak base around the back of the head down to the nape.
  {
    data: "M121.5,28 C118.545,27.995 114.665,27.171 112.934,29.16 C108.819,33.892 104.816,38.945 104.917,46.001",
    width: THIN,
    duration: 0.5,
    head: true,
  },
  // Wing bulge sweeping out from the throat (starts halfway up the face
  // curve, under the head stroke, to keep the joint covered).
  {
    data: "M79.944,34.793 C80.311,36.285 81.527,37.602 83.481,38.539 C98.723,45.852 102.332,59.397 91.429,73.947 C86.432,80.614 79.131,84.429 71.5,87.5",
    width: THIN,
    duration: 0.6,
  },
  // Body core from the nape down to the belly (starts halfway up the nape
  // curve, under the head stroke, to keep the joint covered).
  {
    data: "M107.345,36.709 C105.842,39.446 104.867,42.473 104.917,46.001 C105.003,51.996 105.701,58.051 104.022,64.006 C99.934,78.496 90.759,87.621 76.004,91.017 C75.14,91.216 74.333,91.667 73.5,92",
    width: THIN,
    duration: 0.6,
  },
  // Back edge sweeping down into the long tail.
  {
    data: "M80,37.5 C79.167,38.167 78.365,38.878 77.495,39.493 C61.546,50.777 54.734,67.564 50.042,85.511 C45.929,101.242 40.294,116.545 36.988,132.497 C36.61,134.322 35.304,136.043 36.5,138",
    width: THIN,
    duration: 1.0,
  },
  // Long wing feather.
  {
    data: "M91.5,45 C91.167,48 91.344,51.172 90.404,53.968 C87.575,62.386 81.013,67.091 72.994,69.982 C64.088,73.193 56.367,77.767 52.531,87.013 C52.295,87.581 52.5,88.333 52.5,89",
    width: THIN,
    duration: 0.6,
  },
  // Short wing feather.
  {
    data: "M65.5,74.5 C64.555,81.861 59.7,85.979 53.505,89.011 C52.301,89.601 51.167,90.333 50,91",
    width: THIN,
    duration: 0.35,
  },
  // Belly curve.
  {
    data: "M84,101.5 C82.725,105.484 78.833,107.791 75.899,108.656 C70.108,110.362 66.104,114.528 61,117",
    width: THIN,
    duration: 0.4,
  },
  // Belly into the tail's lower edge.
  {
    data: "M72.5,92.5 C64.108,90.917 49.839,97.277 47.797,104.583 C46.901,107.785 46.409,111.485 45.98,114.998 C45.405,119.706 43.817,124.188 43.257,128.971 C42.706,133.67 38.974,137.215 35,140",
    width: THICK,
    duration: 0.7,
  },
  // Tail edge feather.
  {
    data: "M76,109.5 C75.937,113.55 72.535,115.065 69.948,116.927 C65.64,120.028 61,122.667 56.5,125.5",
    width: THIN,
    duration: 0.35,
  },
  // Middle tail feather.
  {
    data: "M54.5,98.5 C54.596,106.96 51.566,114.883 49.657,122.918 C48.895,126.122 49.386,129.485 48,132.5",
    width: THIN,
    duration: 0.4,
  },
  // Foot curling over the perch.
  {
    data: "M73.5,93 C75.984,94.641 78.427,96.314 80.531,98.47 C81.517,99.48 82.924,100.972 83.983,100.852 C87.479,100.459 87.495,102.913 87.976,105.005 C88.624,107.82 86.983,109.024 84.5,109.5",
    width: THICK,
    duration: 0.4,
  },
  // Claws.
  {
    data: "M97,96.5 C99.474,100.973 99.236,101.641 94.5,103.5",
    width: THIN,
    duration: 0.2,
  },
  {
    data: "M94.5,95.5 C93.436,98.949 89.694,98.989 87.5,101",
    width: THIN,
    duration: 0.2,
  },
  // The branch tip with its curled sprout, drawn last.
  {
    data: "M119.5,83.5 C123.807,82.268 125.103,79.086 125.538,74.508 C119.482,76.372 116.52,80.078 115.51,85.502 C114.773,89.456 113.812,93.203 110.037,95.56 C109.191,96.089 108.47,96.375 107.515,96.574 C106.448,96.797 105.356,97.239 104.524,96.473 C100.499,92.766 94.156,97.2 90.53,92.477 C89.071,90.575 86.666,90.43 85,89",
    width: THIN,
    duration: 0.7,
  },
]

export type LineBird = {
  node: Node
  eye: () => Node
  /** Resting beak tip in the logo's local space. */
  beakTipLocal: Vector2
  /** Instantly hide all strokes (call before draw()). */
  prepareDraw(): void
  /** Draw the bird on, stroke by stroke, like a pen sketch. */
  draw(): ThreadGenerator
  /** Fade the fully-drawn bird in (for scenes that skip the sketch). */
  appear(duration?: number): ThreadGenerator
  blink(): ThreadGenerator
  /**
   * Tilt just the head around the neck joint — negative angles look up,
   * 0 returns to rest.
   */
  tiltHead(angle?: number, duration?: number): ThreadGenerator
  /** One soft glow cycle — color-pulse breathing, no scaling. */
  pulseGlow(period?: number): ThreadGenerator
  /**
   * The bird "sings": colored rings ripple out from the beak, wherever the
   * head is currently pointing.
   */
  sing(options?: {
    colors?: string[]
    spread?: number
    stagger?: number
    duration?: number
  }): ThreadGenerator
}

/** Map a point in the SVG's 160x160 viewBox to the component's local space. */
const fromSvg = (x: number, y: number) =>
  new Vector2((x - 80) * SCALE, (y - 80) * SCALE)

export function createLineBird(colors = lineBirdColors): LineBird {
  const eye = createRef<Node>()

  const strokes = logoStrokes.map(({ data, width, duration, head }) => ({
    path: (
      <Path
        data={data}
        stroke={colors.stroke}
        lineWidth={width}
        lineCap={"round"}
        lineJoin={"round"}
        shadowColor={colors.glow + "00"}
        shadowBlur={0}
      />
    ) as Path,
    duration,
    head,
  }))

  const eyeNode = (
    <Node ref={eye} position={[102, 27]}>
      <Circle size={4.6} fill={colors.eye} />
    </Node>
  ) as Node

  // The head strokes and eye live under their own pivot at the neck joint,
  // so the bird can tip its head without moving the body. Paths keep their
  // absolute SVG coordinates; the inner offset re-bases them on the pivot.
  const headGroup = (
    <Node position={[HEAD_PIVOT.x, HEAD_PIVOT.y]}>
      <Node position={[-HEAD_PIVOT.x, -HEAD_PIVOT.y]}>
        {strokes.filter(({ head }) => head).map(({ path }) => path)}
        {eyeNode}
      </Node>
    </Node>
  ) as Node

  // Inner group recenters the 160x160 viewBox on the node's origin and
  // scales it up; ripples stay on the outer node in local space.
  const figure = (
    <Node scale={SCALE} position={[-80 * SCALE, -80 * SCALE]}>
      {strokes.filter(({ head }) => !head).map(({ path }) => path)}
      {headGroup}
    </Node>
  ) as Node

  const node = (<Node>{figure}</Node>) as Node

  function prepareDraw() {
    for (const { path } of strokes) {
      path.end(0)
    }
    eye().scale(0)
  }

  function* draw(): ThreadGenerator {
    yield* sequence(
      0.12,
      ...strokes.map(({ path, duration }) =>
        path.end(1, duration, easeInOutCubic),
      ),
    )
    yield* eye().scale(1, 0.4, easeOutBack)
  }

  function* appear(duration = 0.8): ThreadGenerator {
    node.scale(node.scale().mul(0.92))
    yield* all(
      node.opacity(1, duration),
      node.scale(node.scale().div(0.92), duration, easeOutBack),
    )
  }

  function* blink(): ThreadGenerator {
    yield* eye().scale.y(0.08, 0.07)
    yield* waitFor(0.05)
    yield* eye().scale.y(1, 0.09)
  }

  function* tiltHead(angle = -12, duration = 0.35): ThreadGenerator {
    yield* headGroup.rotation(angle, duration, easeOutCubic)
  }

  function* pulseGlow(period = 1.6): ThreadGenerator {
    yield* all(
      ...strokes.map(({ path }) =>
        all(
          path
            .shadowColor(colors.glow + "88", period / 2, easeInOutCubic)
            .to(colors.glow + "00", period / 2, easeInOutCubic),
          path
            .shadowBlur(18, period / 2, easeInOutCubic)
            .to(0, period / 2, easeInOutCubic),
        ),
      ),
    )
  }

  const beakTipLocal = fromSvg(BEAK_TIP.x, BEAK_TIP.y)

  /** Beak tip in local space, following the head's current tilt. */
  function beakTipNow(): Vector2 {
    const a = (headGroup.rotation() * Math.PI) / 180
    const dx = BEAK_TIP.x - HEAD_PIVOT.x
    const dy = BEAK_TIP.y - HEAD_PIVOT.y
    return fromSvg(
      HEAD_PIVOT.x + dx * Math.cos(a) - dy * Math.sin(a),
      HEAD_PIVOT.y + dx * Math.sin(a) + dy * Math.cos(a),
    )
  }

  function* sing(options?: {
    colors?: string[]
    spread?: number
    stagger?: number
    duration?: number
  }): ThreadGenerator {
    const ringColors = options?.colors ?? [
      "#38bdf8",
      "#a78bfa",
      "#fbbf24",
      "#4ade80",
    ]
    const spread = options?.spread ?? 900
    const stagger = options?.stagger ?? 0.22
    const duration = options?.duration ?? 1.5
    yield* sequence(
      stagger,
      ...ringColors.map((color) =>
        emitRipple(node, beakTipNow(), color, spread, duration),
      ),
    )
  }

  return {
    node,
    eye,
    beakTipLocal,
    prepareDraw,
    draw,
    appear,
    blink,
    tiltHead,
    pulseGlow,
    sing,
  }
}
