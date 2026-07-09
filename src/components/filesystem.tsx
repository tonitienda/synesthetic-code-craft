import { Layout, Rect, Txt } from "@motion-canvas/2d"
import { all, createRef, delay, Reference } from "@motion-canvas/core"

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
      <Txt text={label} fontSize={26} fill={"#f8fafc"} fontWeight={700} />
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
        fill={"#0f172a88"}
        stroke={"#7dd3fc99"}
        lineWidth={3}
        shadowColor={"#38bdf833"}
        shadowBlur={14}
        //backdropBlur={8}
        opacity={0}
      >
        {this.label}
      </Rect>
    ) as Rect
  }
}

// Composes, manages and animates a filesystem representation. Each layer is a FileSystemLayer, and the layers are stacked vertically. The layers can be animated to appear one by one, or all at once.
class FileSystem {
  layers: FileSystemLayer[]
  node: Rect
  layersContainer: Reference<Layout>

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
        fill={"#0f172a88"}
        stroke={"#7dd3fc99"}
        lineWidth={3}
        shadowColor={"#38bdf833"}
        shadowBlur={14}
        //backdropBlur={8}
      >
        <Txt text={title} fontSize={28} fill={"#38bdf8"} fontWeight={700} />
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
    return all(
      ...this.layers.map((layer, index) =>
        delay(index * 0.2, layer.node.opacity(1, duration)),
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
          layer.node.height(0, duration),
          layer.node.lineWidth(0, duration),
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
