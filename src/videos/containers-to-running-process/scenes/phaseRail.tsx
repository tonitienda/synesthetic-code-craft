import { Layout, Rect, Txt } from "@motion-canvas/2d"
import {
  all,
  cancel,
  createRef,
  delay,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  sequence,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import { breathe } from "../../../choreography"
import { colors, PhaseRail } from "./utils"

// Where the rail lives once it has graduated from the teaching cards: a compact
// breadcrumb in the reserved strip along the very top of the frame. The host
// panel grows to start just *under* this strip, so the rail owns its own row
// (no more competing with the host title). It stays left of the registry, which
// still occupies the top-right during the image scenes, and retires once `run`
// is complete.
const RAIL_Y = -470
const RAIL_X = -340
const RAIL_SCALE = 0.55

const AMBER = colors.amber
const AMBER_DIM = "#a16207" // the dim end of the active pill's breathing pulse
const SLATE = "#334155" // an upcoming (not-yet-reached) step
const MUTED = "#64748b"
const GREEN = "#34d399" // a completed step
const GREEN_DIM = "#1f6f52"

type Step = {
  name: string
  card: Rect
  title: Txt
  gloss: Txt
}

function createStepCard(name: string, gloss: string): Step {
  const cardRef = createRef<Rect>()
  const titleRef = createRef<Txt>()
  const glossRef = createRef<Txt>()

  const card = (
    <Rect
      ref={cardRef}
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={12}
      width={380}
      height={190}
      paddingLeft={20}
      paddingRight={20}
      radius={20}
      fill={"#0f172acc"}
      stroke={AMBER + "99"}
      lineWidth={3}
      shadowColor={"#00000055"}
      shadowBlur={18}
      opacity={0}
    >
      <Txt
        ref={titleRef}
        text={`docker ${name}`}
        fontFamily={"monospace"}
        fontSize={34}
        fill={AMBER}
        fontWeight={700}
      />
      <Txt ref={glossRef} text={gloss} fontSize={23} fill={"#cbd5e1"} />
    </Rect>
  ) as Rect

  return { name, card, title: titleRef(), gloss: glossRef() }
}

/**
 * The phase rail: the three `docker run` sub-steps (pull → create → start),
 * first taught as full cards, then graduated into a persistent breadcrumb that
 * lights the phase we're currently looking at.
 *
 * - `reveal()` brings the teaching cards in.
 * - `dock()` collapses them into the compact rail at the top.
 * - `activate(name)` lights that step (amber + breathing), settles the previous
 *   one as completed (green + check). An unknown name — e.g. the `run` umbrella
 *   — just closes out the last active step.
 */
export function createPhaseRail(): PhaseRail {
  const steps = [
    createStepCard("pull", "download image layers"),
    createStepCard("create", "add a writable layer"),
    createStepCard("start", "launch the process"),
  ]
  steps.forEach((s) => s.card.scale(0.85))

  const chevrons = [0, 1].map(
    () => (<Txt text={"›"} fontSize={48} fill={MUTED} opacity={0} />) as Txt,
  )

  const children: (Rect | Txt)[] = []
  steps.forEach((s, i) => {
    children.push(s.card)
    if (i < chevrons.length) {
      children.push(chevrons[i])
    }
  })

  const row = (
    <Layout layout direction={"row"} gap={40} alignItems={"center"} y={210}>
      {children}
    </Layout>
  ) as Layout

  let activeHandle: ThreadGenerator | null = null
  let activeStep: Step | null = null

  function* reveal(): ThreadGenerator {
    yield* sequence(
      1.1,
      ...steps.map((s, i) =>
        all(
          s.card.opacity(1, 1),
          s.card.scale(1, 1, easeOutBack),
          i > 0 ? delay(0.2, chevrons[i - 1].opacity(0.6, 0.5)) : waitFor(0),
        ),
      ),
    )
  }

  function* dock(): ThreadGenerator {
    yield* all(
      row.y(RAIL_Y, 1.1, easeInOutCubic),
      row.x(RAIL_X, 1.1, easeInOutCubic),
      row.scale(RAIL_SCALE, 1.1, easeInOutCubic),
      row.gap(16, 1.1, easeInOutCubic),
      ...chevrons.map((ch) => ch.opacity(0.5, 0.8)),
      // Shed the teaching detail: glosses fade, the pills settle to the neutral
      // "not yet reached" look, and each title drops its `docker ` prefix.
      ...steps.flatMap((s) => [
        s.gloss.opacity(0, 0.5),
        s.card.stroke(SLATE, 0.9),
        s.card.opacity(0.5, 0.9),
        s.title.fill(MUTED, 0.9),
        delay(0.5, s.title.text(s.name, 0)),
      ]),
    )
  }

  function* activate(name: string): ThreadGenerator {
    // Close out whichever step was live: stop its breathing and settle it to a
    // completed check.
    if (activeStep) {
      const prev = activeStep
      if (activeHandle) {
        cancel(activeHandle)
        activeHandle = null
      }
      prev.title.text(`✓ ${prev.name}`)
      yield* all(
        prev.card.stroke(GREEN_DIM, 0.3),
        prev.card.opacity(0.75, 0.3),
        prev.title.fill(GREEN, 0.3),
      )
      activeStep = null
    }

    const next = steps.find((s) => s.name === name)
    if (!next) {
      // The `run` umbrella (or any non-step): the last step is already closed.
      return
    }

    activeStep = next
    yield* all(
      next.card.stroke(AMBER, 0.3),
      next.card.opacity(1, 0.3),
      next.title.fill(AMBER, 0.3),
      // One elastic pop as it becomes the current phase.
      next.card.scale(1.12, 0.18, easeOutCubic).to(1, 0.32, easeOutBack),
    )
    // Then it settles into a live breathing outline — colour, never size.
    activeHandle = yield breathe(next.card, {
      from: AMBER,
      to: AMBER_DIM,
      period: 1.4,
    })
  }

  function* retract(): ThreadGenerator {
    // The run phases are done; the breadcrumb has served its purpose and bows
    // out (rising slightly as it fades) before the deeper-dive scenes take over
    // the top of the frame.
    if (activeHandle) {
      cancel(activeHandle)
      activeHandle = null
    }
    yield* all(
      row.opacity(0, 0.7, easeInOutCubic),
      row.y(RAIL_Y - 46, 0.7, easeInOutCubic),
    )
    row.remove()
  }

  return { node: row, reveal, dock, activate, retract }
}
