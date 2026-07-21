import { Layout, Rect, Txt } from "@motion-canvas/2d"
import { createRef, Reference, Vector2 } from "@motion-canvas/core"
import { GlassRectangle } from "./glass"

export type Registry = {
  node: Rect
  imageSlotPosition(): Vector2
}

export type LocalSystem = {
  node: Rect
  label: Reference<Layout>
  title: Reference<Txt>
  slot: Reference<Rect>
}

export function createRegistry(): Registry {
  const slot = createRef<Rect>()

  const node = (
    <GlassRectangle
      layout
      direction={"column"}
      justifyContent={"space-evenly"}
      width={900}
      height={200}
      radius={28}
      border={"#94a3b899"}
      borderWidth={3}
      padding={24}
      gap={22}
      shadowColor={"#38bdf81f"}
      shadowBlur={28}
    >
      <Layout
        layout
        direction={"column"}
        gap={4}
        alignItems={"start"}
        width="100%"
      >
        <Txt
          text={"Remote registry"}
          fontSize={30}
          fill={"#f8fafc"}
          fontWeight={700}
        />
      </Layout>
      <Layout
        layout
        direction={"column"}
        gap={4}
        alignItems={"center"}
        width="100%"
      >
        <Rect
          ref={slot}
          width={230}
          height={100}
          radius={20}
          stroke={"#ffffff24"}
          lineWidth={3}
          fill={"#020617a8"}
          opacity={0}
        />
      </Layout>
    </GlassRectangle>
  ) as Rect

  return {
    node,
    imageSlotPosition() {
      return slot().absolutePosition()
    },
  }
}

export function createLocalsystem(): LocalSystem {
  const slot = createRef<Rect>()
  const label = createRef<Layout>()
  const title = createRef<Txt>()

  const node = (
    <GlassRectangle
      layout
      direction={"column"}
      justifyContent={"space-between"}
      width={"100%"}
      height={200}
      radius={28}
      border={"#94a3b899"}
      borderWidth={3}
      padding={24}
      gap={22}
      shadowColor={"#38bdf81f"}
      shadowBlur={28}
    >
      <Layout
        layout
        direction={"column"}
        gap={4}
        alignItems={"start"}
        width="100%"
        ref={label}
      >
        <Txt
          ref={title}
          text={"Local system"}
          fontSize={30}
          fill={"#f8fafc"}
          fontWeight={700}
        />
      </Layout>
      <Layout
        layout
        direction={"column"}
        gap={4}
        alignItems={"center"}
        width="100%"
      >
        <Rect
          ref={slot}
          width={230}
          height={100}
          radius={20}
          stroke={"#ffffff24"}
          lineWidth={3}
          fill={"#020617a8"}
          opacity={0}
        />
      </Layout>
    </GlassRectangle>
  ) as Rect

  return {
    node,
    label,
    title,
    slot,
  }
}
