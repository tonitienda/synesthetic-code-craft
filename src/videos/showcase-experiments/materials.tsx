import {
  Circle,
  CubicBezier,
  Gradient,
  Layout,
  Line,
  Rect,
  RectProps,
  Txt,
} from '@motion-canvas/2d';
import {
  all,
  chain,
  createSignal,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  ThreadGenerator,
} from '@motion-canvas/core';
import Matter from 'matter-js';
import {captureMatterTimeline, sampleMatterBody} from './matterTimeline';

export type MaterialKind =
  | 'glass'
  | 'bubble'
  | 'marble'
  | 'wood'
  | 'metal'
  | 'paper'
  | 'frosted'
  | 'acrylic'
  | 'gel'
  | 'eink'
  | 'copper'
  | 'concrete';

export interface MaterialPanelProps extends RectProps {
  material: MaterialKind;
  label?: string;
  description?: string;
  eyebrow?: string;
  minimal?: boolean;
  bare?: boolean;
}

interface MaterialDefinition {
  name: string;
  subtitle: string;
  accent: string;
  fill: RectProps['fill'];
  border: string;
  text: string;
  muted: string;
  radius: number;
  shadow: string;
}

function linearGradient(colors: [string, string, string]) {
  return new Gradient({
    type: 'linear',
    from: [-500, -280],
    to: [500, 280],
    stops: [
      {offset: 0, color: colors[0]},
      {offset: 0.48, color: colors[1]},
      {offset: 1, color: colors[2]},
    ],
  });
}

export const materials: Record<MaterialKind, MaterialDefinition> = {
  glass: {
    name: 'GLASS',
    subtitle: 'clear · cool · precise',
    accent: '#7dd3fc',
    fill: linearGradient(['#ffffff20', '#14243bd9', '#08111fd9']),
    border: '#d8f4ff4d',
    text: '#f4fbff',
    muted: '#a7bed1',
    radius: 30,
    shadow: '#38bdf833',
  },
  bubble: {
    name: 'BUBBLE',
    subtitle: 'bright · buoyant · playful',
    accent: '#f0abfc',
    fill: linearGradient(['#f5d0feee', '#8b5cf6e8', '#312e81f2']),
    border: '#fff7ffcc',
    text: '#fffaff',
    muted: '#ead5f5',
    radius: 52,
    shadow: '#d946ef66',
  },
  marble: {
    name: 'OBSIDIAN MARBLE',
    subtitle: 'dense · veined · luxurious',
    accent: '#d6bd8a',
    fill: linearGradient(['#282827', '#0d0e12', '#201c18']),
    border: '#d8c59e70',
    text: '#f7f1e7',
    muted: '#b8ad9b',
    radius: 20,
    shadow: '#000000aa',
  },
  wood: {
    name: 'WALNUT',
    subtitle: 'warm · crafted · grounded',
    accent: '#f0b36a',
    fill: linearGradient(['#7a452a', '#3e2118', '#24130f']),
    border: '#e9b77d70',
    text: '#fff2df',
    muted: '#d1ad8b',
    radius: 24,
    shadow: '#1a0906aa',
  },
  metal: {
    name: 'BRUSHED METAL',
    subtitle: 'crisp · directional · engineered',
    accent: '#a5f3fc',
    fill: linearGradient(['#66717c', '#202a34', '#0e151d']),
    border: '#d9f5ff80',
    text: '#f4fbff',
    muted: '#afbdc8',
    radius: 16,
    shadow: '#00000099',
  },
  paper: {
    name: 'SOFT PAPER',
    subtitle: 'matte · layered · editorial',
    accent: '#fb7185',
    fill: linearGradient(['#f3eee4', '#d8d0c2', '#aaa194']),
    border: '#fffaf0aa',
    text: '#302d2b',
    muted: '#685f59',
    radius: 14,
    shadow: '#00000055',
  },
  frosted: {
    name: 'FROSTED GLASS',
    subtitle: 'diffuse · private · architectural',
    accent: '#bae6fd',
    fill: linearGradient(['#e0f2fe70', '#7895a6a8', '#273847cc']),
    border: '#f0f9ff9c',
    text: '#f8fdff',
    muted: '#d1e4ed',
    radius: 28,
    shadow: '#7dd3fc30',
  },
  acrylic: {
    name: 'SMOKED ACRYLIC',
    subtitle: 'dark · transparent · technical',
    accent: '#67e8f9',
    fill: linearGradient(['#263648e8', '#101a27ed', '#050a12f5']),
    border: '#a5f3fc66',
    text: '#ecfeff',
    muted: '#8ca7b8',
    radius: 22,
    shadow: '#06b6d455',
  },
  gel: {
    name: 'LUMINOUS GEL',
    subtitle: 'alive · translucent · energetic',
    accent: '#5eead4',
    fill: linearGradient(['#5eead4d9', '#0d9488dc', '#134e4ae8']),
    border: '#ccfbf1dd',
    text: '#f0fdfa',
    muted: '#b8fff2',
    radius: 44,
    shadow: '#2dd4bf70',
  },
  eink: {
    name: 'E-INK',
    subtitle: 'static · legible · declarative',
    accent: '#a1a1aa',
    fill: linearGradient(['#f5f4ef', '#dddcd5', '#c8c6be']),
    border: '#ffffffaa',
    text: '#18181b',
    muted: '#52525b',
    radius: 10,
    shadow: '#00000044',
  },
  copper: {
    name: 'COPPER CIRCUITRY',
    subtitle: 'conductive · warm · connected',
    accent: '#fdba74',
    fill: linearGradient(['#7c3f25', '#321b18', '#171012']),
    border: '#fed7aa88',
    text: '#fff7ed',
    muted: '#ddb08e',
    radius: 18,
    shadow: '#f9731650',
  },
  concrete: {
    name: 'CONCRETE',
    subtitle: 'massive · stable · foundational',
    accent: '#d4d4d8',
    fill: linearGradient(['#6b7076', '#41464c', '#292d32']),
    border: '#e4e4e766',
    text: '#fafafa',
    muted: '#c1c4c8',
    radius: 8,
    shadow: '#000000aa',
  },
};

export class MaterialPanel extends Rect {
  public readonly definition: MaterialDefinition;
  public readonly statusDot: Circle;
  public readonly statusLabel: Txt;
  public readonly material: MaterialKind;

  public constructor({
    material,
    label,
    description,
    eyebrow = 'MATERIAL / 01',
    minimal = false,
    bare = false,
    ...props
  }: MaterialPanelProps) {
    const definition = materials[material];
    super({
      width: 780,
      height: 360,
      radius: definition.radius,
      smoothCorners: true,
      clip: true,
      fill: definition.fill,
      stroke: definition.border,
      lineWidth: 2,
      shadowColor: definition.shadow,
      shadowBlur: material === 'bubble' || material === 'gel' ? 46 : 30,
      ...props,
      children: undefined,
    });
    this.material = material;
    this.definition = definition;

    this.addTexture();

    this.statusDot = new Circle({
      size: 13,
      fill: definition.muted,
      shadowColor: definition.accent,
      shadowBlur: 0,
    });
    this.statusLabel = new Txt({
      text: 'INACTIVE',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: 1.2,
      fill: definition.muted,
    });

    if (bare) {
      return;
    }

    if (minimal) {
      this.add(
        <Layout layout direction={'column'} alignItems={'center'} gap={9}>
          <Txt
            text={label ?? definition.name}
            fontFamily={'JetBrains Mono, monospace'}
            fontSize={22}
            fontWeight={700}
            letterSpacing={1.2}
            fill={definition.text}
          />
          <Txt
            text={description ?? definition.subtitle}
            fontFamily={'Inter, sans-serif'}
            fontSize={16}
            fill={definition.muted}
          />
        </Layout>,
      );
      return;
    }

    this.add(
      <Layout
        layout
        direction={'column'}
        width={() => Math.max(240, this.width() - 64)}
        height={() => Math.max(180, this.height() - 54)}
        gap={22}
      >
        <Layout
          layout
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          width={'100%'}
        >
          <Layout layout direction={'row'} alignItems={'center'} gap={12}>
            {this.statusDot}
            {this.statusLabel}
          </Layout>
          <Txt
            text={eyebrow}
            fontFamily={'JetBrains Mono, monospace'}
            fontSize={15}
            letterSpacing={1.5}
            fill={definition.muted}
          />
        </Layout>
        <Rect
          width={'100%'}
          height={2}
          fill={definition.border}
          opacity={0.72}
        />
        <Layout layout direction={'column'} gap={12}>
          <Txt
            text={label ?? 'surface.render()'}
            fontFamily={'JetBrains Mono, monospace'}
            fontSize={30}
            fontWeight={600}
            fill={definition.text}
          />
          <Txt
            text={description ?? definition.subtitle}
            fontFamily={'Inter, sans-serif'}
            fontSize={21}
            fill={definition.muted}
          />
        </Layout>
        <Layout layout direction={'row'} gap={12} marginTop={8}>
          {['MOVE', 'RESIZE', 'REACT'].map((label, index) => (
            <Rect
              key={label}
              radius={() => Math.max(8, definition.radius * 0.38)}
              padding={[10, 17]}
              fill={index === 0 ? `${definition.accent}22` : '#00000018'}
              stroke={index === 0 ? definition.accent : definition.border}
              lineWidth={1}
            >
              <Txt
                text={label}
                fontFamily={'JetBrains Mono, monospace'}
                fontSize={14}
                fontWeight={700}
                letterSpacing={1}
                fill={index === 0 ? definition.accent : definition.muted}
              />
            </Rect>
          ))}
        </Layout>
      </Layout>,
    );
  }

  private addTexture() {
    const color = this.definition.accent;

    if (this.material === 'glass') {
      this.add(
        <Rect
          layout={false}
          width={() => this.width() * 0.72}
          height={() => this.height() * 1.7}
          x={() => -this.width() * 0.31}
          rotation={-18}
          fill={linearGradient(['#ffffff18', '#ffffff05', '#ffffff00'])}
        />,
      );
      this.add(
        <Rect
          layout={false}
          width={() => Math.max(0, this.width() - 12)}
          height={() => Math.max(0, this.height() - 12)}
          radius={() => Math.max(8, this.radius().x - 5)}
          stroke={'#ffffff24'}
          lineWidth={1}
        />,
      );
    }

    if (this.material === 'bubble') {
      this.add(
        <CubicBezier
          layout={false}
          p0={() => [-this.width() * 0.39, -this.height() * 0.33]}
          p1={() => [-this.width() * 0.29, -this.height() * 0.49]}
          p2={() => [this.width() * 0.03, -this.height() * 0.5]}
          p3={() => [this.width() * 0.2, -this.height() * 0.38]}
          stroke={'#fffaffb8'}
          lineWidth={7}
          lineCap={'round'}
          shadowColor={'#ffffffaa'}
          shadowBlur={12}
          opacity={0.75}
        />,
      );
      this.add(
        <Circle
          layout={false}
          size={[34, 13]}
          x={() => this.width() * 0.32}
          y={() => -this.height() * 0.29}
          rotation={-18}
          fill={'#ffffffd4'}
          shadowColor={'#ffffff'}
          shadowBlur={14}
        />,
      );
      this.add(
        <Circle
          layout={false}
          size={() => Math.max(this.width(), this.height()) * 0.72}
          x={() => this.width() * 0.42}
          y={() => this.height() * 0.48}
          fill={new Gradient({
            type: 'radial',
            from: [0, 0],
            to: [0, 0],
            fromRadius: 10,
            toRadius: 260,
            stops: [
              {offset: 0, color: '#1e1b4b55'},
              {offset: 1, color: '#1e1b4b00'},
            ],
          })}
        />,
      );
    }

    if (this.material === 'marble') {
      const veins: Array<Array<[number, number]>> = [
        [[-430, -90], [-240, -50], [-70, -86], [110, 12], [430, -12]],
        [[-390, 165], [-190, 75], [20, 112], [180, 54], [420, 105]],
        [[-260, -210], [-165, -80], [-205, 48], [-85, 210]],
      ];
      for (const points of veins) {
        this.add(
          <Line
            layout={false}
            points={points}
            stroke={color}
            lineWidth={2}
            opacity={0.22}
          />,
        );
      }
    }

    if (this.material === 'wood') {
      for (let y = -150; y <= 150; y += 32) {
        this.add(
          <Line
            layout={false}
            points={[
              [-460, y],
              [-260, y + 10],
              [-60, y - 6],
              [160, y + 8],
              [460, y - 3],
            ]}
            stroke={y % 64 === 0 ? '#efb67a' : '#160907'}
            lineWidth={2}
            opacity={0.18}
          />,
        );
      }
    }

    if (this.material === 'metal') {
      for (let x = -460; x <= 460; x += 18) {
        this.add(
          <Line
            layout={false}
            points={[[x, -240], [x + 42, 240]]}
            stroke={x % 36 === 0 ? '#ffffff' : '#071018'}
            lineWidth={1}
            opacity={0.07}
          />,
        );
      }
      this.add(
        <Rect
          layout={false}
          width={() => this.width() * 0.22}
          height={() => this.height() * 1.5}
          x={() => -this.width() * 0.18}
          rotation={-12}
          fill={'#ffffff0b'}
        />,
      );
    }

    if (this.material === 'paper') {
      for (let index = 0; index < 38; index += 1) {
        const x = ((index * 83) % 860) - 430;
        const y = ((index * 47) % 380) - 190;
        this.add(
          <Line
            layout={false}
            points={[[x, y], [x + 8 + (index % 9), y + (index % 3) - 1]]}
            stroke={index % 2 === 0 ? '#ffffff' : '#594f47'}
            lineWidth={1}
            opacity={0.12}
          />,
        );
      }
    }

    if (this.material === 'frosted') {
      this.add(
        <Rect
          layout={false}
          width={() => this.width() * 0.62}
          height={() => this.height() * 1.6}
          x={() => -this.width() * 0.28}
          rotation={-16}
          fill={'#ffffff16'}
        />,
      );
      for (let index = 0; index < 32; index += 1) {
        this.add(
          <Circle
            layout={false}
            size={2 + (index % 3)}
            x={((index * 97) % 820) - 410}
            y={((index * 53) % 360) - 180}
            fill={'#ffffff'}
            opacity={0.11}
          />,
        );
      }
    }

    if (this.material === 'acrylic') {
      this.add(
        <Rect
          layout={false}
          width={() => Math.max(0, this.width() - 12)}
          height={() => Math.max(0, this.height() - 12)}
          radius={() => Math.max(7, this.radius().x - 5)}
          stroke={'#dffbff22'}
          lineWidth={1}
        />,
      );
      this.add(
        <Rect
          layout={false}
          width={() => this.width() * 0.16}
          height={() => this.height() * 1.7}
          x={() => -this.width() * 0.24}
          rotation={-20}
          fill={'#ffffff0b'}
        />,
      );
    }

    if (this.material === 'gel') {
      this.add(
        <CubicBezier
          layout={false}
          p0={() => [-this.width() * 0.43, -this.height() * 0.31]}
          p1={() => [-this.width() * 0.26, -this.height() * 0.49]}
          p2={() => [this.width() * 0.06, -this.height() * 0.5]}
          p3={() => [this.width() * 0.25, -this.height() * 0.37]}
          stroke={'#ecfff9a6'}
          lineWidth={6}
          lineCap={'round'}
          shadowColor={'#99f6e4aa'}
          shadowBlur={16}
        />,
      );
      this.add(
        <Circle
          layout={false}
          size={[30, 11]}
          x={() => this.width() * 0.31}
          y={() => -this.height() * 0.28}
          rotation={-16}
          fill={'#ffffffb0'}
          shadowColor={color}
          shadowBlur={14}
        />,
      );
    }

    if (this.material === 'eink') {
      for (let y = -180; y <= 180; y += 12) {
        this.add(
          <Line
            layout={false}
            points={[[-460, y], [460, y]]}
            stroke={y % 24 === 0 ? '#18181b' : '#ffffff'}
            lineWidth={1}
            opacity={0.035}
          />,
        );
      }
    }

    if (this.material === 'copper') {
      const traces: Array<Array<[number, number]>> = [
        [[-450, -120], [-260, -120], [-210, -70], [30, -70], [90, -10], [450, -10]],
        [[-450, 130], [-130, 130], [-65, 65], [180, 65], [235, 120], [450, 120]],
        [[-340, -220], [-340, 5], [-270, 75], [-270, 220]],
      ];
      for (const points of traces) {
        this.add(
          <Line
            layout={false}
            points={points}
            stroke={color}
            lineWidth={3}
            opacity={0.24}
            lineCap={'round'}
          />,
        );
      }
      for (const [x, y] of [[-210, -70], [90, -10], [-65, 65], [235, 120]]) {
        this.add(
          <Circle
            layout={false}
            size={11}
            x={x}
            y={y}
            fill={color}
            opacity={0.42}
          />,
        );
      }
    }

    if (this.material === 'concrete') {
      for (let index = 0; index < 42; index += 1) {
        this.add(
          <Circle
            layout={false}
            size={2 + (index % 5)}
            x={((index * 109) % 880) - 440}
            y={((index * 61) % 390) - 195}
            fill={index % 3 === 0 ? '#ffffff' : '#111827'}
            opacity={0.1}
          />,
        );
      }
      this.add(
        <Line
          layout={false}
          points={[[-430, 120], [-280, 92], [-190, 130], [-45, 105]]}
          stroke={'#181b1f'}
          lineWidth={2}
          opacity={0.28}
        />,
      );
    }
  }

  public *setActive(active: boolean, duration = 0.35): ThreadGenerator {
    const color = active ? this.definition.accent : this.definition.muted;
    this.statusLabel.text(active ? 'ACTIVE' : 'INACTIVE');
    yield* all(
      this.statusDot.fill(color, duration),
      this.statusDot.shadowBlur(active ? 18 : 0, duration),
      this.statusLabel.fill(color, duration),
      this.stroke(active ? this.definition.accent : this.definition.border, duration),
      this.lineWidth(active ? 3 : 2, duration),
      this.opacity(active ? 1 : 0.56, duration),
    );
  }

  public *react(): ThreadGenerator {
    const amounts: Record<MaterialKind, [number, number, number]> = {
      glass: [0.992, 1.008, 0.38],
      bubble: [1.055, 0.94, 0.55],
      marble: [0.997, 1.003, 0.5],
      wood: [1.008, 0.992, 0.42],
      metal: [0.988, 1.012, 0.28],
      paper: [1.018, 0.975, 0.46],
      frosted: [0.994, 1.006, 0.4],
      acrylic: [0.99, 1.01, 0.34],
      gel: [1.04, 0.955, 0.56],
      eink: [1.004, 0.996, 0.32],
      copper: [0.99, 1.01, 0.3],
      concrete: [0.998, 1.002, 0.52],
    };
    const [scaleX, scaleY, duration] = amounts[this.material];
    yield* chain(
      all(
        this.scale.x(scaleX, duration * 0.34, easeOutCubic),
        this.scale.y(scaleY, duration * 0.34, easeOutCubic),
      ),
      all(
        this.scale.x(1, duration * 0.66, easeOutBack),
        this.scale.y(1, duration * 0.66, easeOutBack),
      ),
    );
  }

  public *enter(): ThreadGenerator {
    if (this.material === 'marble' || this.material === 'concrete') {
      const targetX = this.x();
      const targetY = this.y();
      const width = this.width();
      const height = this.height();
      const duration = this.material === 'marble' ? 1.12 : 1.08;
      const engine = Matter.Engine.create({
        gravity: {x: 0, y: 1, scale: 0.002},
      });
      const body = Matter.Bodies.rectangle(
        targetX,
        targetY - 220,
        width,
        height,
        {
          density: this.material === 'marble' ? 0.009 : 0.012,
          restitution: this.material === 'marble' ? 0.08 : 0.02,
          friction: 0.82,
          chamfer: {radius: Math.min(20, this.definition.radius)},
        },
      );
      const ground = Matter.Bodies.rectangle(
        targetX,
        targetY + height / 2 + 10,
        width + 320,
        20,
        {isStatic: true},
      );
      Matter.Body.setAngle(body, this.material === 'marble' ? 0.02 : 0);
      Matter.Composite.add(engine.world, [body, ground]);
      const timeline = captureMatterTimeline(engine, [body], duration);
      const progress = createSignal(0);
      const sample = () => sampleMatterBody(timeline, body, progress());

      this.opacity(0);
      this.position(() => [sample().x, sample().y]);
      this.rotation(() => sample().angle * 180 / Math.PI);
      yield* all(
        this.opacity(1, 0.34, easeOutCubic),
        progress(1, duration),
      );

      // Preserve the physical landing, then snap to the exact authored layout
      // contract so downstream resize/split choreography remains stable.
      this.position([targetX, targetY]);
      this.rotation(0);
      return;
    }

    const entries: Record<MaterialKind, [number, number, number, number]> = {
      glass: [70, -1, 0.96, 0.72],
      bubble: [110, -3, 0.76, 0.88],
      marble: [-170, 0, 1, 0.92],
      wood: [45, -7, 0.94, 0.78],
      metal: [0, 0, 0.98, 0.5],
      paper: [-90, 4, 0.94, 0.76],
      frosted: [65, -1, 0.96, 0.74],
      acrylic: [0, 0, 0.98, 0.54],
      gel: [95, -2, 0.8, 0.86],
      eink: [-65, 2, 0.97, 0.62],
      copper: [0, 0, 0.98, 0.54],
      concrete: [-150, 0, 1, 0.9],
    };
    const [startY, startRotation, startScale, duration] = entries[this.material];
    const targetY = this.y();
    const targetX = this.x();
    this.opacity(0);
    this.y(targetY + startY);
    this.rotation(startRotation);
    this.scale(startScale);
    if (this.material === 'metal' || this.material === 'acrylic' || this.material === 'copper') {
      this.x(targetX - 150);
    }
    yield* all(
      this.opacity(1, duration * 0.55, easeOutCubic),
      this.x(
        targetX,
        duration,
        this.material === 'metal' || this.material === 'acrylic' || this.material === 'copper'
          ? easeOutBack
          : easeOutCubic,
      ),
      this.y(targetY, duration, easeOutBack),
      this.rotation(0, duration, easeOutBack),
      this.scale(1, duration, easeOutBack),
    );
  }
}
