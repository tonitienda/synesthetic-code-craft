import { Circle, Line, Node } from "@motion-canvas/2d"
import {
  all,
  chain,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  sequence,
  ThreadGenerator,
  Vector2,
  waitFor,
} from "@motion-canvas/core"

// One palette color per piece: the bird literally carries the channel's
// "synesthetic" palette — blue body, violet wing, green tail, amber accents.
export const birdColors = {
  body: "#38bdf8",
  wing: "#a78bfa",
  tail: "#4ade80",
  accent: "#fbbf24",
  eye: "#f8fafc",
  pupil: "#060914",
}

export type BirdLogo = {
  node: Node
  body: () => Circle
  head: () => Circle
  wingPivot: () => Node
  /** Beak tip in the logo's local space — anchor for song ripples. */
  beakTipLocal: Vector2
  /** Instantly scatter the pieces off their resting pose (call before assemble). */
  scatterNow(): void
  /** Fly the scattered pieces into place, then pop the eye in. */
  assemble(stagger?: number): ThreadGenerator
  /** Fade the fully-built bird in (for scenes that skip the assembly). */
  appear(duration?: number): ThreadGenerator
  flap(times?: number): ThreadGenerator
  blink(): ThreadGenerator
  /** One soft glow cycle — color-pulse breathing, no scaling. */
  pulseGlow(period?: number): ThreadGenerator
  /** The bird "sings": colored rings ripple out from the beak. */
  sing(options?: {
    colors?: string[]
    spread?: number
    stagger?: number
    duration?: number
  }): ThreadGenerator
}

type Scatter = [number, number, number] // dx, dy, rotation

/** A colored ring that expands from a point and fades — one note of birdsong. */
export function* emitRipple(
  parent: Node,
  at: Vector2,
  color: string,
  spread: number,
  duration: number,
): ThreadGenerator {
  const ring = (
    <Circle
      position={at}
      size={26}
      stroke={color}
      lineWidth={5}
      opacity={0}
    />
  ) as Circle
  parent.add(ring)
  yield* all(
    ring.size(spread, duration, easeOutCubic),
    chain(
      ring.opacity(0.85, 0.12),
      waitFor(duration * 0.25),
      ring.opacity(0, duration * 0.6),
    ),
  )
  ring.remove()
}

export function createBirdLogo(colors = birdColors): BirdLogo {
  const body = createRef<Circle>()
  const head = createRef<Circle>()
  const wingPivot = createRef<Node>()
  const eye = createRef<Node>()

  const wrap = (shape: Node): Node => (<Node>{shape}</Node>) as Node

  const tailW = wrap(
    (
      <Line
        closed
        points={[
          [-70, 12],
          [-195, -18],
          [-70, 58],
        ]}
        fill={colors.tail}
      />
    ) as Line,
  )

  const bodyW = wrap(
    (
      <Circle
        ref={body}
        position={[10, 30]}
        size={190}
        fill={colors.body}
        shadowColor={colors.body + "55"}
        shadowBlur={10}
      />
    ) as Circle,
  )

  // The wing sits in its own pivot node at the shoulder, so flapping is a pure
  // rotation around the point where the wing meets the body.
  const wingW = wrap(
    (
      <Node ref={wingPivot} position={[15, -15]}>
        <Line
          closed
          points={[
            [8, 14],
            [-150, -78],
            [-42, 56],
          ]}
          fill={colors.wing}
        />
      </Node>
    ) as Node,
  )

  const beakW = wrap(
    (
      <Line
        closed
        points={[
          [132, -80],
          [132, -48],
          [198, -62],
        ]}
        fill={colors.accent}
      />
    ) as Line,
  )

  const crestW = wrap(
    (
      <Line
        closed
        points={[
          [66, -104],
          [86, -152],
          [106, -100],
        ]}
        fill={colors.accent}
      />
    ) as Line,
  )

  const headW = wrap(
    (
      <Circle
        ref={head}
        position={[95, -65]}
        size={104}
        fill={colors.body}
        shadowColor={colors.body + "55"}
        shadowBlur={8}
      />
    ) as Circle,
  )

  const eyeNode = (
    <Node ref={eye} position={[110, -74]}>
      <Circle size={22} fill={colors.eye} />
      <Circle size={10} position={[4, 0]} fill={colors.pupil} />
    </Node>
  ) as Node

  // Draw order: beak and crest slide under the head so their bases stay hidden.
  const node = (
    <Node>
      {tailW}
      {bodyW}
      {wingW}
      {beakW}
      {crestW}
      {headW}
      {eyeNode}
    </Node>
  ) as Node

  // Assembly order tells a story: body first, then head, face, wing, tail.
  const pieces: { wrapper: Node; scatter: Scatter }[] = [
    { wrapper: bodyW, scatter: [0, 260, 0] },
    { wrapper: headW, scatter: [210, -210, 30] },
    { wrapper: beakW, scatter: [340, -60, 70] },
    { wrapper: crestW, scatter: [130, -300, -60] },
    { wrapper: wingW, scatter: [-150, -260, 40] },
    { wrapper: tailW, scatter: [-260, 190, -45] },
  ]

  function scatterNow() {
    for (const { wrapper, scatter } of pieces) {
      wrapper.position([scatter[0], scatter[1]])
      wrapper.rotation(scatter[2])
      wrapper.opacity(0)
    }
    eye().scale(0)
  }

  function* assemble(stagger = 0.14): ThreadGenerator {
    yield* sequence(
      stagger,
      ...pieces.map(({ wrapper }) =>
        all(
          wrapper.position([0, 0], 0.75, easeOutCubic),
          wrapper.rotation(0, 0.75, easeOutCubic),
          wrapper.opacity(1, 0.5),
        ),
      ),
    )
    yield* eye().scale(1, 0.4, easeOutBack)
  }

  function* appear(duration = 0.8): ThreadGenerator {
    node.scale(node.scale().mul(0.88))
    yield* all(
      node.opacity(1, duration),
      node.scale(node.scale().div(0.88), duration, easeOutBack),
    )
  }

  function* flap(times = 2): ThreadGenerator {
    for (let i = 0; i < times; i++) {
      yield* wingPivot().rotation(26, 0.18, easeOutCubic)
      yield* wingPivot().rotation(-8, 0.2, easeInOutCubic)
      yield* wingPivot().rotation(0, 0.24, easeOutCubic)
    }
  }

  function* blink(): ThreadGenerator {
    yield* eye().scale.y(0.08, 0.07)
    yield* waitFor(0.05)
    yield* eye().scale.y(1, 0.09)
  }

  function* pulseGlow(period = 1.6): ThreadGenerator {
    yield* all(
      body()
        .shadowBlur(40, period / 2, easeInOutCubic)
        .to(10, period / 2, easeInOutCubic),
      head()
        .shadowBlur(32, period / 2, easeInOutCubic)
        .to(8, period / 2, easeInOutCubic),
    )
  }

  const beakTipLocal = new Vector2(198, -62)

  function* sing(options?: {
    colors?: string[]
    spread?: number
    stagger?: number
    duration?: number
  }): ThreadGenerator {
    const ringColors = options?.colors ?? [
      colors.body,
      colors.wing,
      colors.accent,
      colors.tail,
    ]
    const spread = options?.spread ?? 900
    const stagger = options?.stagger ?? 0.22
    const duration = options?.duration ?? 1.5
    yield* sequence(
      stagger,
      ...ringColors.map((color) =>
        emitRipple(node, beakTipLocal, color, spread, duration),
      ),
    )
  }

  return {
    node,
    body,
    head,
    wingPivot,
    beakTipLocal,
    scatterNow,
    assemble,
    appear,
    flap,
    blink,
    pulseGlow,
    sing,
  }
}
