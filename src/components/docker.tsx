import { Txt, Rect, Circle, Layout } from "@motion-canvas/2d"
import { createRef, Reference } from "@motion-canvas/core"
import { GlassRectangle } from "./glass"
import { theme, Theme } from "../theme"

export type DockerImage = {
  node: Rect
}

// TODO - Make it private
export const containerColors = {
  readonly: theme.primary.base, // cool blue — inert, read-only image
  writable: theme.secondary.base, // warm amber — the container's mutable layer
  process: theme.success.base, // green — a live, running process
  processSoft: theme.success.soft,
}

export function createDockerImageBox(
  label: string,
  selectedTheme: Theme = theme,
): DockerImage {
  const node = (
    <GlassRectangle
      layout
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      width={220}
      height={86}
      radius={18}
      background={selectedTheme.surfaceRaised + "d6"}
      border={selectedTheme.primary.base + "99"}
      borderWidth={3}
    >
      <Txt
        text={label}
        fontFamily={"monospace"}
        fontSize={42}
        fill={selectedTheme.primary.on}
      />
      <Txt
        text={"Docker Image"}
        fontSize={20}
        fill={selectedTheme.primary.base}
        marginTop={4}
      />
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

export function createContainerCard(
  name: string,
  selectedTheme: Theme = theme,
): ContainerCard {
  const colors = {
    readonly: selectedTheme.primary.base,
    writable: selectedTheme.secondary.base,
    process: selectedTheme.success.base,
    processSoft: selectedTheme.success.soft,
  }
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
      background={selectedTheme.surface + "d8"}
      border={selectedTheme.textMuted + "aa"}
      borderWidth={3}
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
          fill={selectedTheme.textSoft}
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
        fill={colors.processSoft}
        stroke={colors.process}
        lineWidth={3}
      >
        <Circle ref={dotRef} size={14} fill={colors.process} />
        <Txt
          text={"nginx"}
          fontFamily={"monospace"}
          fontSize={26}
          fill={selectedTheme.text}
        />
        <Txt text={"PID 1"} fontSize={18} fill={colors.process} />
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
        fill={selectedTheme.secondary.soft}
        stroke={colors.writable + "cc"}
        lineWidth={3}
      >
        <Txt
          text={"writable layer"}
          fontSize={20}
          fill={colors.writable}
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
