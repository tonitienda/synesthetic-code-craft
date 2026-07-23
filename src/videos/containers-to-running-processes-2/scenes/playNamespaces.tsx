import { Line, Rect, Txt } from "@motion-canvas/2d"
import {
  ThreadGenerator,
  all,
  delay,
  easeOutCubic,
  sequence,
  waitFor,
} from "@motion-canvas/core"
import { theme } from "../../../theme"
import { containerColors } from "../../../components/docker"
import { World } from "./utils"

const NS = theme.accent.base // violet — namespaces throughout the video

// A namespace badge that can be dimmed (present but idle) or lit (the resource
// currently under discussion). Colour, not size, carries the emphasis.
function createNsBadge(text: string): Rect {
  return (
    <Rect
      layout
      alignItems={"center"}
      justifyContent={"center"}
      paddingLeft={12}
      paddingRight={12}
      height={32}
      radius={8}
      fill={NS + "18"}
      stroke={NS + "66"}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={text} fontFamily={"monospace"} fontSize={17} fill={NS} />
    </Rect>
  ) as Rect
}

// A small labelled chip added to a card to make one namespace concrete — e.g.
// the "/" root a mount namespace exposes, or the "eth0" a network namespace does.
function createNsChip(text: string): Rect {
  return (
    <Rect
      layout
      alignItems={"center"}
      justifyContent={"center"}
      paddingLeft={12}
      paddingRight={12}
      height={34}
      radius={8}
      fill={NS + "1f"}
      stroke={NS + "aa"}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={text}
        fontFamily={"monospace"}
        fontSize={19}
        fill={theme.textSoft}
      />
    </Rect>
  ) as Rect
}

// Brighten a badge to its "active" look, or return it to rest. Colour + opacity
// carry the emphasis — never a resize.
function light(node: Rect, on: boolean, d = 0.35): ThreadGenerator {
  return all(
    node.stroke(on ? NS : NS + "66", d),
    node.fill(on ? NS + "33" : NS + "18", d),
    node.opacity(on ? 1 : 0.55, d),
  )
}

export const playNamespaces = function* (world: World): ThreadGenerator {
  const {
    containerA: A,
    containerB: B,
    sharedImage,
    localSystem,
  } = world.elements ?? {}

  if (!A || !B) {
    return
  }

  // A caption in the freed top strip carries the definition the narration is
  // giving; it rewrites itself as each namespace comes up.
  const caption = (
    <Txt
      text={"namespaces · a private view of one kind of resource"}
      fontSize={30}
      fill={NS}
      fontWeight={700}
      y={-452}
      opacity={0}
    />
  ) as Txt
  world.stage().add(caption)

  yield* all(caption.opacity(1, 0.6), caption.y(-442, 0.6, easeOutCubic))

  // The three namespaces the narration names, added to both containers. They
  // arrive dimmed — present, but not yet the one we're looking at.
  const labels = ["mnt", "pid", "net"]
  const badgesA = labels.map((label) => createNsBadge(label))
  const badgesB = labels.map((label) => createNsBadge(label))
  badgesA.forEach((badge) => A.badgeRow().add(badge))
  badgesB.forEach((badge) => B.badgeRow().add(badge))

  yield* all(
    sequence(0.12, ...badgesA.map((b) => b.opacity(0.55, 0.3))),
    sequence(0.12, ...badgesB.map((b) => b.opacity(0.55, 0.3))),
  )
  yield* waitFor(0.6)

  // ── MOUNT NAMESPACE ────────────────────────────────────────────────────────
  // Each container treats its own stack — shared image + its own writable layer —
  // as its entire filesystem, starting at "/". Light the mnt badge on both, drop
  // a "/" root chip into each writable layer, and flash the shared image below to
  // say: same image underneath, a separate rooted view on top.
  yield* caption.text(
    "mount namespace · each container's own stack is its whole filesystem, at /",
    0.5,
  )

  const rootA = createNsChip("/")
  const rootB = createNsChip("/")
  A.chipsRow().add(rootA)
  B.chipsRow().add(rootB)

  yield* all(
    light(badgesA[0], true),
    light(badgesB[0], true),
    delay(0.15, all(rootA.opacity(1, 0.4), rootB.opacity(1, 0.4))),
    sharedImage
      ? sharedImage.node
          .stroke(containerColors.readonly, 0.4)
          .to(containerColors.readonly + "99", 0.6)
      : waitFor(0),
  )
  yield* waitFor(1)
  yield* all(light(badgesA[0], false), light(badgesB[0], false))

  // ── PID NAMESPACE ──────────────────────────────────────────────────────────
  // Each container sees only its own processes; its main one is PID 1, and
  // neither can see the other's. A dashed divider rises between the two cards to
  // make the "can't see across" boundary literal, while both process pills pulse.
  yield* caption.text(
    "pid namespace · each sees only its own processes — its main one is PID 1",
    0.5,
  )

  const divX = (A.node.x() + B.node.x()) / 2
  const halfH = A.node.height() / 2 + 40
  const divider = (
    <Line
      points={[
        [divX, A.node.y() - halfH],
        [divX, A.node.y() + halfH],
      ]}
      stroke={NS}
      lineWidth={3}
      lineDash={[10, 12]}
      end={0}
      opacity={0.9}
    />
  ) as Line
  world.stage().add(divider)

  yield* all(
    light(badgesA[1], true),
    light(badgesB[1], true),
    divider.end(1, 0.6, easeOutCubic),
    // Colour-pulse the status dots so both processes read as alive and
    // independent, rather than resizing them.
    A.dot.fill(theme.success.on, 0.4).to(containerColors.process, 0.4),
    B.dot.fill(theme.success.on, 0.4).to(containerColors.process, 0.4),
  )
  yield* waitFor(1)
  yield* all(
    light(badgesA[1], false),
    light(badgesB[1], false),
    divider.opacity(0, 0.5),
  )
  divider.remove()

  // ── NETWORK NAMESPACE ──────────────────────────────────────────────────────
  // Its own interfaces, routes and ports. Light the net badge and give each card
  // its own private interface + port.
  yield* caption.text(
    "network namespace · its own interfaces, routes and ports",
    0.5,
  )

  const netA = createNsChip("eth0 · :80")
  const netB = createNsChip("eth0 · :80")
  A.chipsRow().add(netA)
  B.chipsRow().add(netB)

  yield* all(
    light(badgesA[2], true),
    light(badgesB[2], true),
    delay(0.15, all(netA.opacity(1, 0.4), netB.opacity(1, 0.4))),
  )
  yield* waitFor(1)
  yield* all(light(badgesA[2], false), light(badgesB[2], false))

  // ── SAME KERNEL ────────────────────────────────────────────────────────────
  // Namespaces don't make a new kernel — they're different views of the one
  // kernel underneath. Bring all badges up together and pulse the host panel to
  // name the single kernel every view is drawn from.
  yield* caption.text("namespaces are different views of the same kernel", 0.5)

  yield* all(
    ...badgesA.map((b) => light(b, true, 0.4)),
    ...badgesB.map((b) => light(b, true, 0.4)),
    localSystem
      ? localSystem.node.stroke(NS, 0.5).to(theme.textMuted + "99", 0.7)
      : waitFor(0),
  )
  yield* all(
    ...badgesA.map((b) => light(b, false, 0.5)),
    ...badgesB.map((b) => light(b, false, 0.5)),
  )

  yield* waitFor(0.6)

  // Hand off to cgroups: the caption steps aside so it never collides with the
  // cgroups track, which rides lower inside the host panel.
  yield* caption.opacity(0, 0.5)
  caption.remove()
}
