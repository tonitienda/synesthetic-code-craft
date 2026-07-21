import {
  Gradient,
  Layout,
  LayoutProps,
  Rect,
  RectProps,
} from "@motion-canvas/2d"
import {
  all,
  chain,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  ThreadGenerator,
} from "@motion-canvas/core"

export interface GlassRectangleProps
  extends Omit<RectProps, "fill" | "stroke" | "lineWidth"> {
  background?: RectProps["fill"]
  border?: RectProps["stroke"]
  borderWidth?: RectProps["lineWidth"]
  sheen?: boolean
  sheenColor?: string
}

export interface GlassWindowProps extends GlassRectangleProps {
  headerHeight?: number
  headerBackground?: RectProps["fill"]
  headerProps?: RectProps
  bodyProps?: LayoutProps
  shockwaveColor?: string
}

export interface GlassShockwaveOptions {
  duration?: number
  wobble?: number
}

function defaultGlassBackground() {
  return new Gradient({
    type: "linear",
    from: [-420, -260],
    to: [420, 260],
    stops: [
      { offset: 0, color: "#ffffff13" },
      { offset: 0.28, color: "#111b2bdc" },
      { offset: 0.72, color: "#0b1324d2" },
      { offset: 1, color: "#07101bdc" },
    ],
  })
}

/**
 * A reusable translucent surface. Geometry and layout remain ordinary Rect
 * behavior; this class only owns the material treatment.
 */
export class GlassRectangle extends Rect {
  public constructor({
    background,
    border,
    borderWidth,
    sheen = true,
    sheenColor = "#ffffff12",
    ...props
  }: GlassRectangleProps = {}) {
    super({
      radius: 24,
      smoothCorners: true,
      shadowColor: "#00000055",
      shadowBlur: 24,
      ...props,
      fill: background ?? defaultGlassBackground(),
      stroke: border ?? "#ffffff24",
      lineWidth: borderWidth ?? 2,
    })

    if (sheen) {
      const highlight = (
        <Rect
          layout={false}
          width={() => Math.max(0, this.width() - 8)}
          height={() => Math.max(0, this.height() - 8)}
          radius={20}
          fill={
            new Gradient({
              type: "linear",
              from: [-420, -260],
              to: [260, 260],
              stops: [
                { offset: 0, color: sheenColor },
                { offset: 0.34, color: "#ffffff05" },
                { offset: 0.72, color: "#ffffff00" },
              ],
            })
          }
          stroke={"#ffffff14"}
          lineWidth={1}
        />
      ) as Rect
      this.add(highlight)
      highlight.moveToBottom()
    }
  }
}

/**
 * A glass surface with a conventional header/body structure. The shockwave is
 * deliberately one-shot: callers trigger it for an impact such as Enter.
 */
export class GlassWindow extends GlassRectangle {
  public readonly header: Rect
  public readonly body: Layout

  private readonly wave: Rect
  private readonly shockwaveColor: string

  public constructor({
    headerHeight = 54,
    headerBackground = "#0f172acc",
    headerProps = {},
    bodyProps = {},
    shockwaveColor = "#ffffff66",
    children,
    ...props
  }: GlassWindowProps = {}) {
    super({ ...props, children: undefined, clip: props.clip ?? true })

    this.shockwaveColor = shockwaveColor
    this.header = (
      <Rect
        layout
        direction={"row"}
        alignItems={"center"}
        justifyContent={"start"}
        width={() => this.width()}
        height={headerHeight}
        fill={headerBackground}
        {...headerProps}
      />
    ) as Rect
    this.body = (
      <Layout
        layout
        direction={"column"}
        width={() => this.width()}
        height={() => this.height() - headerHeight}
        {...bodyProps}
      >
        {children}
      </Layout>
    ) as Layout

    const structure = (
      <Layout
        layout
        direction={"column"}
        width={() => this.width()}
        height={() => this.height()}
        offset={[-1, -1]}
        x={() => -this.width() / 2}
        y={() => -this.height() / 2}
      >
        {this.header}
        {this.body}
      </Layout>
    ) as Layout

    this.wave = (
      <Rect
        layout={false}
        width={() => Math.max(0, this.width() - 18)}
        height={() => Math.max(0, this.height() - 18)}
        radius={18}
        stroke={this.shockwaveColor}
        lineWidth={2}
        opacity={0}
        scale={0.94}
      />
    ) as Rect

    this.add(structure)
    this.add(this.wave)
  }

  public *shockwave({
    duration = 0.42,
    wobble = 0.45,
  }: GlassShockwaveOptions = {}): ThreadGenerator {
    const restRotation = this.rotation()
    const restScaleX = this.scale.x()
    const restScaleY = this.scale.y()
    const firstBeat = duration * 0.2
    const secondBeat = duration * 0.27
    const thirdBeat = duration * 0.2
    const settle = duration - firstBeat - secondBeat - thirdBeat

    this.wave.opacity(0)
    this.wave.scale(0.94)
    this.wave.stroke(this.shockwaveColor)

    yield* all(
      chain(
        this.rotation(restRotation - wobble, firstBeat, easeOutCubic),
        this.rotation(restRotation + wobble * 0.65, secondBeat, easeInOutCubic),
        this.rotation(restRotation - wobble * 0.22, thirdBeat, easeInOutCubic),
        this.rotation(restRotation, settle, easeOutBack),
      ),
      chain(
        all(
          this.scale.x(restScaleX * 0.994, firstBeat, easeOutCubic),
          this.scale.y(restScaleY * 1.006, firstBeat, easeOutCubic),
        ),
        all(
          this.scale.x(restScaleX * 1.003, secondBeat, easeInOutCubic),
          this.scale.y(restScaleY * 0.997, secondBeat, easeInOutCubic),
        ),
        all(
          this.scale.x(restScaleX, thirdBeat + settle, easeOutBack),
          this.scale.y(restScaleY, thirdBeat + settle, easeOutBack),
        ),
      ),
      this.wave.scale(1.025, duration, easeOutCubic),
      chain(
        this.wave.opacity(0.3, firstBeat, easeOutCubic),
        this.wave.opacity(0, duration - firstBeat, easeOutCubic),
      ),
    )
  }
}
