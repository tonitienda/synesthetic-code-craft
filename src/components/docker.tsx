import { Txt, Rect, Circle, Layout } from "@motion-canvas/2d"
import { createRef, Reference } from "@motion-canvas/core"
import { GlassRectangle } from "./glass"

export type DockerImage = {
  node: Rect
}

// TODO - Make it private
export const containerColors = {
  readonly: "#7dd3fc", // cool blue — inert, read-only image
  writable: "#fbbf24", // warm amber — the container's mutable layer
  process: "#34d399", // green — a live, running process
  processSoft: "#34d39922",
}

export function createDockerImageBox(label: string): DockerImage {
  const node = (
    <GlassRectangle
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      width={220}
      height={86}
      radius={18}
      background={"#0f172ad6"}
      border={"#7dd3fc99"}
      borderWidth={3}
      shadowColor={"#38bdf833"}
      shadowBlur={14}
    >
      <Txt
        text={label}
        fontFamily={"monospace"}
        fontSize={42}
        fill={"#e0f2fe"}
      />
      <Txt text={"Docker Image"} fontSize={20} fill={"#7dd3fc"} marginTop={4} />
    </GlassRectangle>
  ) as Rect

  return {
    node,
  }
}

export type SharedImageBase = { node: Rect }

export type ContainerCard = {
  node: Rect
  titleRef: Reference<Txt>
  process: Rect
  dot: Circle
  writable: Rect
  chipsRow: Reference<Layout>
  badgeRow: Reference<Layout>
}

export function createContainerCard(name: string): ContainerCard {
  const titleRef = createRef<Txt>()
  const chipsRow = createRef<Layout>()
  const badgeRow = createRef<Layout>()
  const processRef = createRef<Rect>()
  const dotRef = createRef<Circle>()
  const writableRef = createRef<Rect>()

  const node = (
    <GlassRectangle
      layout
      direction={"column"}
      alignItems={"stretch"}
      justifyContent={"start"}
      gap={16}
      width={620}
      height={320}
      padding={22}
      radius={22}
      background={"#0b1220d8"}
      border={"#94a3b8aa"}
      borderWidth={3}
      shadowColor={"#00000066"}
      shadowBlur={22}
      opacity={0}
    >
      <Layout
        layout
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Txt
          ref={titleRef}
          text={name}
          fontFamily={"monospace"}
          fontSize={28}
          fill={"#e2e8f0"}
          fontWeight={700}
        />
        <Layout ref={badgeRow} layout direction={"row"} gap={8} />
      </Layout>

      <Rect
        ref={processRef}
        layout
        direction={"row"}
        gap={12}
        alignItems={"center"}
        justifyContent={"center"}
        height={64}
        radius={999}
        fill={containerColors.processSoft}
        stroke={containerColors.process}
        lineWidth={3}
      >
        <Circle ref={dotRef} size={14} fill={containerColors.process} />
        <Txt
          text={"nginx"}
          fontFamily={"monospace"}
          fontSize={26}
          fill={"#ecfdf5"}
        />
        <Txt text={"PID 1"} fontSize={18} fill={containerColors.process} />
      </Rect>

      <Rect
        ref={writableRef}
        layout
        direction={"column"}
        alignItems={"start"}
        justifyContent={"center"}
        gap={8}
        height={110}
        paddingLeft={20}
        paddingRight={20}
        radius={12}
        fill={"#1c130088"}
        stroke={containerColors.writable + "cc"}
        lineWidth={3}
      >
        <Txt
          text={"writable layer"}
          fontSize={20}
          fill={containerColors.writable}
          fontWeight={700}
        />
        <Layout ref={chipsRow} layout direction={"row"} gap={8} />
      </Rect>
    </GlassRectangle>
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
