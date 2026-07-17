import { Rect, Txt } from "@motion-canvas/2d"
import {
  ThreadGenerator,
  all,
  easeOutCubic,
  easeOutBack,
  waitFor,
} from "@motion-canvas/core"
import { World } from "./utils"

export const playCgroups = function* (world: World): ThreadGenerator {
  const { containerA: A, containerB: B } = world.elements ?? {}

  if (!A || !B) {
    return
  }

  const cg1 = "#38bdf8"
  const cg2 = "#f472b6"
  // The track must sit INSIDE the host panel (900 wide, top edge at y≈-516,
  // title row down to y≈-456), so keep it narrower than the panel and below
  // the title — otherwise it crosses the panel border and collides with the
  // "Your machine — the host" label.
  const trackW = 800
  const trackH = 56
  const trackRestY = -390
  const captionRestY = -436

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
      fill={"#1e293b"}
      stroke={"#475569"}
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
      fill={"#cbd5e1"}
      y={captionRestY}
      opacity={0}
    />
  ) as Txt
  world.stage().add(track)
  world.stage().add(caption)

  // Drift down into place while fading in, instead of materialising in situ.
  track.y(trackRestY - 30)
  caption.y(captionRestY - 30)

  yield* all(
    track.opacity(1, 0.5),
    track.y(trackRestY, 0.7, easeOutCubic),
    caption.opacity(1, 0.5),
    caption.y(captionRestY, 0.7, easeOutCubic),
  )

  yield* all(seg1.width(288, 0.8, easeOutCubic), A.node.stroke(cg1, 0.5))

  yield* all(seg2.width(176, 0.8, easeOutCubic), B.node.stroke(cg2, 0.5))

  // web-2 tries to grab more, but the cgroup clamps it back.
  yield* seg2.width(214, 0.3).to(176, 0.6, easeOutBack)

  yield* waitFor(1.5)
}
