import {Circle, Layout, Rect, Txt} from "@motion-canvas/2d"
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core"
import {
  ContainerCard,
  SharedImageBase,
} from "../../../components/docker"
import {createFileChip} from "../../../components/filesystem"
import {containerColors, theme} from "../theme"
import {World, rotatePhaseToken, Theme} from "./utils"

const PRIVATE_GAP = 32

// Build web-2 from the same panel, process and writable-layer vocabulary as the
// existing container. Its private nodes use the same vertical coordinates; only
// their horizontal footprint differs from the original full-width state.
function createPrivateContainer(
  name: string,
  width: number,
  height: number,
  processY: number,
  writableY: number,
  writableHeight: number,
): ContainerCard {
  const titleRef = createRef<Txt>()
  const processRef = createRef<Rect>()
  const dotRef = createRef<Circle>()
  const writableRef = createRef<Rect>()
  const chipsRow = createRef<Layout>()
  const badgeRow = createRef<Layout>()

  const node = (
    <Rect
      layout
      direction={"column"}
      alignItems={"start"}
      justifyContent={"start"}
      width={width}
      height={height}
      padding={32}
      gap={52}
      radius={28}
      fill={theme.surfaceRaised + "88"}
      stroke={theme.danger.base}
      lineWidth={3}
      opacity={0}
    >
      <Txt
        ref={titleRef}
        text={name}
        fontSize={28}
        fill={containerColors.writable}
        fontWeight={700}
      />
      <Layout layout={false} y={processY}>
        <Rect
          ref={processRef}
          layout
          direction={"row"}
          gap={14}
          alignItems={"center"}
          justifyContent={"center"}
          width={width - 64}
          height={78}
          radius={999}
          fill={containerColors.processSoft}
          stroke={containerColors.process}
          lineWidth={3}
        >
          <Circle ref={dotRef} size={16} fill={containerColors.process} />
          <Txt
            text={"nginx"}
            fontFamily={"monospace"}
            fontSize={34}
            fill={theme.text}
          />
          <Txt
            text={"PID 1"}
            fontSize={22}
            fill={containerColors.process}
          />
        </Rect>
      </Layout>
      <Layout layout={false} y={writableY}>
        <Rect
          ref={writableRef}
          layout
          direction={"column"}
          alignItems={"start"}
          justifyContent={"center"}
          gap={10}
          width={width - 64}
          height={writableHeight}
          paddingLeft={26}
          paddingRight={26}
          radius={12}
          fill={theme.secondary.soft}
          stroke={containerColors.writable + "cc"}
          lineWidth={3}
        >
          <Txt
            text={"writable layer (read-write)"}
            fontSize={24}
            fill={containerColors.writable}
            fontWeight={700}
          />
          <Layout ref={chipsRow} layout direction={"row"} gap={10} />
        </Rect>
      </Layout>
      <Layout
        layout={false}
        x={width / 2 - 190}
        y={-height / 2 + 50}
      >
        <Layout ref={badgeRow} layout direction={"row"} gap={8} />
      </Layout>
    </Rect>
  ) as Rect

  return {
    node,
    titleRef,
    process: processRef(),
    dot: dotRef(),
    writable: writableRef(),
    chipsRow,
    badgeRow,
  }
}

export const playMultipleContainers = function* (
  world: World,
): ThreadGenerator {
  const {imageFs, containerA: A} = world.elements ?? {}

  if (!imageFs || !A) {
    return
  }

  yield* rotatePhaseToken(world, "run", Theme.text)

  // Capture every position before removing anything from the original layout.
  // This prevents layout reflow from moving the private or shared layers.
  const sharedLayers = imageFs.layers.map((layer) => ({
    node: layer.node,
    absolute: layer.node.absolutePosition(),
  }))
  const processAbsolute = A.process.absolutePosition()
  const writableAbsolute = A.writable.absolutePosition()

  for (const layer of sharedLayers) {
    layer.node.remove()
    world.stage().add(layer.node)
    layer.node.absolutePosition(layer.absolute)
  }

  // The process and writable layer also leave layout, but remain the exact same
  // nodes at the exact same vertical positions. They only narrow and move left.
  A.process.remove()
  world.overlay().add(A.process)
  A.process.absolutePosition(processAbsolute)
  A.writable.remove()
  world.overlay().add(A.writable)
  A.writable.absolutePosition(writableAbsolute)

  const sharedCenterX =
    sharedLayers.reduce((sum, {node}) => sum + node.position().x, 0) /
    sharedLayers.length
  const originalWidth = A.node.width()
  const privateWidth = (originalWidth - PRIVATE_GAP) / 2
  const privateInnerWidth = privateWidth - 64
  const horizontalOffset = (privateWidth + PRIVATE_GAP) / 2
  const aTargetX = sharedCenterX - horizontalOffset
  const bTargetX = sharedCenterX + horizontalOffset
  const panelY = A.node.y()
  const panelHeight = A.node.height()
  const processY = A.process.y()
  const writableY = A.writable.y()

  yield* all(
    A.titleRef().text("web-1", 0.5),
    A.node.width(privateWidth, 1.2, easeInOutCubic),
    A.node.x(aTargetX, 1.2, easeOutBack),
    A.process.width(privateInnerWidth, 1.2, easeInOutCubic),
    A.process.x(aTargetX, 1.2, easeOutBack),
    A.writable.width(privateInnerWidth, 1.2, easeInOutCubic),
    A.writable.x(aTargetX, 1.2, easeOutBack),
  )

  yield* waitFor(1.3)

  const B = createPrivateContainer(
    "web-2",
    privateWidth,
    panelHeight,
    processY - panelY,
    writableY - panelY,
    A.writable.height(),
  )
  B.node.position([bTargetX, panelY])
  B.node.scale(0.72)
  world.overlay().add(B.node)

  const baseNode = imageFs.layers[0].node
  const base: SharedImageBase = {node: baseNode}
  const baseRestStroke = base.node.stroke()
  yield* all(
    base.node
      .stroke(theme.primary.base, 0.35, easeOutCubic)
      .to(baseRestStroke, 0.7),
    B.node.opacity(1, 0.5, easeOutCubic),
    B.node.scale(1, 0.78, easeOutBack),
  )

  const chipA = createFileChip("web-1.log", containerColors.writable)
  chipA.scale(0.8)
  A.chipsRow().add(chipA)

  yield* all(chipA.opacity(1, 0.4), chipA.scale(1, 0.4, easeOutBack))
  yield* waitFor(1.4)

  const rail = world.elements.phaseRail
  if (rail) {
    yield* rail.retract()
  }

  world.elements.sharedImage = base
  world.elements.containerA = A
  world.elements.containerB = B
}
