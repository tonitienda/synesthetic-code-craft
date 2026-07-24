import { Txt, Layout, Rect, Circle } from "@motion-canvas/2d"
import {
  ThreadGenerator,
  all,
  easeInOutCubic,
  easeOutBack,
  sequence,
  waitFor,
  easeOutCubic,
  delay,
} from "@motion-canvas/core"
import { World, colors } from "./utils"
import { containerColors, theme } from "../theme"

// Accent colours echo the motifs the video already used, so every formula term
// can be traced back to something the viewer has already seen.
const termColors = {
  process: containerColors.process, // green — the running process
  filesystem: containerColors.readonly, // cyan — the image layers
  namespaces: theme.accent.base, // purple — namespaces (see playNamespaces)
  cgroups: theme.danger.base, // pink — cgroups (see playCgroups)
}

const FORMULA_Y = 70
const TERM_W = 210
const TERM_H = 156

function termShell(title: string, color: string, inner: Layout | Rect): Rect {
  return (
    <Rect
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={14}
      width={TERM_W}
      height={TERM_H}
      radius={18}
      fill={theme.surfaceRaised + "cc"}
      stroke={color + "99"}
      lineWidth={3}
      opacity={0}
    >
      {inner}
      <Txt text={title} fontSize={22} fill={color} fontWeight={700} />
    </Rect>
  ) as Rect
}

// A mini running process — a green pill with a live status dot.
function processTerm(): Rect {
  const pill = (
    <Rect
      layout
      direction={"row"}
      gap={8}
      alignItems={"center"}
      justifyContent={"center"}
      paddingLeft={18}
      paddingRight={18}
      height={48}
      radius={999}
      fill={containerColors.processSoft}
      stroke={containerColors.process}
      lineWidth={2}
    >
      <Circle size={12} fill={containerColors.process} />
      <Txt
        text={"nginx"}
        fontFamily={"monospace"}
        fontSize={20}
        fill={theme.text}
      />
    </Rect>
  ) as Rect
  return termShell("process", termColors.process, pill)
}

// A mini image — a small stack of read-only cyan layers.
function filesystemTerm(): Rect {
  const stack = (
    <Layout layout direction={"column"} gap={6}>
      {[0, 1, 2].map(() => (
        <Rect
          width={124}
          height={15}
          radius={4}
          fill={theme.surfaceRaised}
          stroke={termColors.filesystem + "aa"}
          lineWidth={2}
        />
      ))}
    </Layout>
  ) as Layout
  return termShell("filesystem view", termColors.filesystem, stack)
}

// A mini boundary — the namespace "lens" that reshapes the view inside it.
function namespacesTerm(): Rect {
  const boundary = (
    <Rect
      width={128}
      height={66}
      radius={12}
      fill={theme.bg + "00"}
      stroke={termColors.namespaces}
      lineWidth={3}
    >
      <Rect
        width={70}
        height={30}
        radius={6}
        fill={termColors.namespaces + "22"}
        stroke={termColors.namespaces + "88"}
        lineWidth={2}
      />
    </Rect>
  ) as Rect
  return termShell("namespaces", termColors.namespaces, boundary)
}

// A mini resource ring — the cgroup budget that constrains the process.
function cgroupsTerm(): Rect {
  const ring = (
    <Circle
      size={66}
      lineWidth={7}
      stroke={termColors.cgroups}
      fill={theme.bg + "00"}
      startAngle={-90}
      endAngle={200}
    />
  ) as Circle
  return termShell("cgroups", termColors.cgroups, ring)
}

// The composed whole — a container, hinting at its three material layers.
function containerCard(): Rect {
  return (
    <Rect
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={12}
      width={240}
      height={TERM_H + 28}
      radius={22}
      fill={theme.surface + "dd"}
      stroke={theme.textMuted}
      lineWidth={3}
    >
      <Txt
        text={"container"}
        fontFamily={"monospace"}
        fontSize={28}
        fill={theme.textSoft}
        fontWeight={700}
      />
      <Layout layout direction={"column"} gap={6}>
        <Rect
          width={150}
          height={16}
          radius={5}
          fill={containerColors.process + "33"}
          stroke={containerColors.process + "aa"}
          lineWidth={2}
        />
        <Rect
          width={150}
          height={16}
          radius={5}
          fill={containerColors.writable + "33"}
          stroke={containerColors.writable + "aa"}
          lineWidth={2}
        />
        <Rect
          width={150}
          height={16}
          radius={5}
          fill={containerColors.readonly + "33"}
          stroke={containerColors.readonly + "aa"}
          lineWidth={2}
        />
      </Layout>
    </Rect>
  ) as Rect
}

function operator(sym: string): Txt {
  return (
    <Txt
      text={sym}
      fontSize={44}
      fill={colors.muted}
      fontWeight={700}
      opacity={0}
    />
  ) as Txt
}

export const playClosingScene = function* (world: World): ThreadGenerator {
  // 1) Calmly clear the working diagram. The closing content lives in the
  // background layer, which shows through once the front layers fade out.
  yield* all(
    world.stage().opacity(0, 1.4, easeInOutCubic),
    world.overlay().opacity(0, 1.4, easeInOutCubic),
  )

  // 2) Full circle: the very command we started with.
  const cmd = (
    <Txt
      text={"$ docker run nginx"}
      fontFamily={"monospace"}
      fontSize={66}
      fill={theme.textSoft}
      y={-300}
      opacity={0}
      scale={0.9}
    />
  ) as Txt
  world.background().add(cmd)
  yield* all(cmd.opacity(1, 0.6), cmd.scale(1, 0.6, easeOutBack))

  // 3) The closing argument: a container is not one thing, it is a composition.
  // Everything is assembled from motifs already shown in the video.
  const container = containerCard()
  const process = processTerm()
  const filesystem = filesystemTerm()
  const namespaces = namespacesTerm()
  const cgroups = cgroupsTerm()
  const eq = operator("=")
  const plus = [operator("+"), operator("+"), operator("+")]

  // Manual layout so terms can emerge from — and later collapse back into — the
  // container, which layout flow can't express.
  const containerX = -520
  const eqX = -378
  const termX = [-248, 12, 272, 532]
  const plusX = [-118, 142, 402]

  container.position([0, FORMULA_Y]) // starts centred and whole
  process.position([containerX, FORMULA_Y])
  filesystem.position([containerX, FORMULA_Y])
  namespaces.position([containerX, FORMULA_Y])
  cgroups.position([containerX, FORMULA_Y])
  eq.position([eqX, FORMULA_Y])
  plus[0].position([plusX[0], FORMULA_Y])
  plus[1].position([plusX[1], FORMULA_Y])
  plus[2].position([plusX[2], FORMULA_Y])

  const terms = [process, filesystem, namespaces, cgroups]
  terms.forEach((t) => t.scale(0.6))
  ;[container, eq, ...plus, ...terms].forEach((n) => world.background().add(n))

  // Present the whole container first.
  yield* all(container.opacity(1, 0.6), container.scale(1, 0.6, easeOutBack))
  yield* waitFor(0.8)

  // DECOMPOSE — slide the container to the left of an "=", then let the four
  // terms emerge from it into their slots.
  yield* all(
    container.position([containerX, FORMULA_Y], 0.7, easeInOutCubic),
    delay(0.4, eq.opacity(1, 0.4)),
  )

  yield* sequence(
    0.22,
    ...terms.map((term, i) =>
      all(
        term.position([termX[i], FORMULA_Y], 0.6, easeOutCubic),
        term.scale(1, 0.6, easeOutBack),
        term.opacity(1, 0.4),
        i > 0 ? delay(0.1, plus[i - 1].opacity(1, 0.35)) : waitFor(0),
      ),
    ),
  )

  // Hold long enough to read the whole equation.
  yield* waitFor(2.2)

  // RECOMPOSE — the terms collapse back into the container, proving the
  // argument is reversible: container ⇄ process + filesystem + namespaces +
  // cgroups.
  yield* all(
    ...terms.map((term) =>
      all(
        term.position([containerX, FORMULA_Y], 0.7, easeInOutCubic),
        term.scale(0.6, 0.7, easeOutCubic),
        term.opacity(0, 0.6),
      ),
    ),
    eq.opacity(0, 0.5),
    ...plus.map((p) => p.opacity(0, 0.5)),
    delay(0.35, container.position([0, FORMULA_Y], 0.7, easeInOutCubic)),
    delay(0.5, container.scale(1.06, 0.3).to(1, 0.3, easeOutBack)),
  )
  terms.forEach((t) => t.remove())

  yield* waitFor(0.8)

  // 4) Outro card.
  yield* all(cmd.opacity(0, 0.8), container.opacity(0, 0.8))
  cmd.remove()
  container.remove()

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
  )

  yield* waitFor(2)
}
