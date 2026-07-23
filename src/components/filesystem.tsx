import { Layout, Rect, Txt } from "@motion-canvas/2d"
import {
  all,
  createRef,
  delay,
  easeInCubic,
  easeOutBack,
  Reference,
} from "@motion-canvas/core"
import { theme } from "../theme"

// A persisted file that lives inside the writable layer after a write.
export function createFileChip(text: string, color: string): Rect {
  return (
    <Rect
      layout
      alignItems={"center"}
      justifyContent={"center"}
      paddingLeft={12}
      paddingRight={12}
      height={34}
      radius={8}
      fill={color + "22"}
      stroke={color + "aa"}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={text} fontFamily={"monospace"} fontSize={20} fill={color} />
    </Rect>
  ) as Rect
}

class FileSystemLayer {
  node: Rect
  label: Txt

  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    label: string,
  ) {
    this.label = (
      <Txt text={label} fontSize={26} fill={theme.text} fontWeight={700} />
    ) as Txt

    this.node = (
      <Rect
        layout
        direction={"column"}
        alignItems={"start"}
        justifyContent={"center"}
        width={width}
        height={height}
        paddingLeft={26}
        radius={12}
        fill={theme.surfaceRaised + "88"}
        stroke={theme.primary.base + "99"}
        lineWidth={3}
        //backdropBlur={8}
        opacity={0}
      >
        {this.label}
      </Rect>
    ) as Rect
  }
}

// Composes, manages and animates a filesystem representation. Each layer is a FileSystemLayer, and the layers are stacked vertically. The layers can be animated to appear one by one, or all at once.
export class FileSystem {
  layers: FileSystemLayer[]
  node: Rect
  layersContainer: Reference<Layout>
  titleRef: Reference<Txt>

  constructor(
    layers: FileSystemLayer[],
    width: number,
    height: number,
    x: number,
    y: number,
    title: string,
  ) {
    this.layers = layers
    this.layersContainer = createRef<Layout>()
    this.titleRef = createRef<Txt>()
    this.node = (
      <Rect
        layout
        direction={"column"}
        alignItems={"start"}
        justifyContent={"start"}
        width={width}
        height={height}
        x={x}
        y={y}
        padding={32}
        gap={52}
        radius={28}
        fill={theme.surfaceRaised + "88"}
        stroke={theme.primary.base + "99"}
        lineWidth={3}
        //backdropBlur={8}
      >
        <Txt
          ref={this.titleRef}
          text={title}
          fontSize={28}
          fill={theme.primary.base}
          fontWeight={700}
        />
        <Layout
          ref={this.layersContainer}
          layout
          direction={"column"}
          gap={12}
          alignItems={"center"}
          justifyContent={"end"}
          width={"100%"}
          height={"100%"}
        >
          {[...this.layers].reverse().map((layer) => layer.node)}
        </Layout>
      </Rect>
    ) as Rect
  }

  appear(duration: number) {
    // Each layer pops in with a small overshoot, staggered bottom-up, so the
    // stack reads as layers landing on top of each other rather than a fade.
    this.layers.forEach((layer) => layer.node.scale(0.92))
    return all(
      ...this.layers.map((layer, index) =>
        delay(
          index * 0.2,
          all(
            layer.node.opacity(1, duration),
            layer.node.scale(1, duration, easeOutBack),
          ),
        ),
      ),
    )
  }

  *collapse(label: string, duration: number) {
    const survivingLayer = this.layers[0]
    const collapsingLayers = this.layers.slice(1)
    const originalHeight = survivingLayer.node.height()

    yield* all(
      survivingLayer.label.text(label, duration),
      ...collapsingLayers.map((layer) =>
        all(
          layer.label.opacity(0, duration),
          // easeInCubic makes the layers squeeze shut faster and faster, so the
          // flattening reads as compression rather than a uniform shrink.
          layer.node.height(0, duration, easeInCubic),
          layer.node.lineWidth(0, duration, easeInCubic),
        ),
      ),
    )

    collapsingLayers.forEach((layer) => layer.node.remove())

    this.layers = [survivingLayer]
  }
}

export const createFileSystemLayers = (
  width: number,
  height: number,
  x: number,
  y: number,
  title: string,
  labels: string[],
): FileSystem => {
  const panelPadding = 32
  const titleAreaHeight = 86
  const layerGap = 12
  const layerWidth = width - panelPadding * 2
  const layersHeight =
    height - panelPadding * 2 - titleAreaHeight - layerGap * (labels.length - 1)
  const layerHeight = layersHeight / labels.length
  const layers = labels.map(
    (label) => new FileSystemLayer(layerWidth, layerHeight, 0, 0, label),
  )
  return new FileSystem(layers, width, height, x, y, title)
}
