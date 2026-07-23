import { Rect, Txt } from "@motion-canvas/2d"
import {
  ThreadGenerator,
  all,
  easeOutCubic,
  easeOutBack,
  waitFor,
} from "@motion-canvas/core"
import { theme } from "../../../theme"
import { World } from "./utils"

export const playCgroups = function* (world: World): ThreadGenerator {
  const { containerA: A, containerB: B } = world.elements ?? {}

  if (!A || !B) {
    return
  }

  const cg1 = theme.primary.base
  const cg2 = theme.danger.base
  // The track must sit INSIDE the host panel and below its title. The host now
  // grows to start under the top breadcrumb strip (top edge at y≈-400), so the
  // bar rides ~116px lower than it used to — still narrower than the panel so it
  // never crosses the border.
  const trackW = 800
  const trackH = 56
  const trackRestY = -274
  const captionRestY = -320

  const seg1 = (<Rect width={0} height={trackH} fill={cg1} />) as Rect
  const seg2 = (<Rect width={0} height={trackH} fill={cg2} />) as Rect
  const track = (
    <Rect
      layout
      direction={"row"}
      alignItems={"center"}
      width={trackW}
      height={trackH}
      radius={14}
      fill={theme.divider}
      stroke={theme.borderStrong}
      lineWidth={2}
      clip
      opacity={0}
      y={trackRestY}
    >
      {seg1}
      {seg2}
    </Rect>
  ) as Rect
  const caption = (
    <Txt
      text={"host CPU & memory"}
      fontSize={22}
      fill={theme.textSoft}
      y={captionRestY}
      opacity={0}
    />
  ) as Txt
  // A heading in the freed top strip names what a cgroup is, echoing the
  // narration: a control group that caps a container's share of the host.
  const heading = (
    <Txt
      text={"cgroups · a control group caps CPU & memory"}
      fontSize={30}
      fill={cg2}
      fontWeight={700}
      y={-452}
      opacity={0}
    />
  ) as Txt
  world.stage().add(track)
  world.stage().add(caption)
  world.stage().add(heading)

  // Drift down into place while fading in, instead of materialising in situ.
  track.y(trackRestY - 30)
  caption.y(captionRestY - 30)

  yield* all(
    heading.opacity(1, 0.6),
    heading.y(-442, 0.6, easeOutCubic),
    track.opacity(1, 0.5),
    track.y(trackRestY, 0.7, easeOutCubic),
    caption.opacity(1, 0.5),
    caption.y(captionRestY, 0.7, easeOutCubic),
  )

  // web-1 is given the larger share; its blue cgroup colour matches its card
  // border, so the segment reads as "web-1's slice".
  yield* all(seg1.width(288, 0.8, easeOutCubic), A.node.stroke(cg1, 0.5))

  // web-2 gets a tighter limit — a smaller pink slice, matching its card.
  yield* all(seg2.width(176, 0.8, easeOutCubic), B.node.stroke(cg2, 0.5))

  // Even under load, web-2 can't exceed its cap: it strains past the limit and
  // the cgroup clamps it straight back, so it can never starve web-1 or the host.
  yield* seg2.width(214, 0.3).to(176, 0.6, easeOutBack)

  yield* waitFor(1)

  // The payoff the narration lands: the two mechanisms answer two different
  // questions. Namespaces shape what a container can SEE; cgroups limit what it
  // can USE.
  const seeUse = (
    <Txt
      text={"namespaces → what it can see        cgroups → what it can use"}
      fontFamily={"monospace"}
      fontSize={26}
      fill={theme.textMuted}
      y={432}
      opacity={0}
    />
  ) as Txt
  world.stage().add(seeUse)
  yield* all(seeUse.opacity(1, 0.6), seeUse.y(422, 0.6, easeOutCubic))

  yield* waitFor(1.2)
}
