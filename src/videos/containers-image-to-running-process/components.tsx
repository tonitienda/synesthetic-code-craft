import {Circle, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import {containerTheme as c} from './theme';

export function Title({text, sub}: {text: string; sub?: string}) {
  return (
    <Layout layout direction={'column'} gap={14} alignItems={'center'}>
      <Txt text={text} fontSize={58} fontWeight={700} fill={c.text} />
      {sub && <Txt text={sub} fontSize={28} fill={c.muted} />}
    </Layout>
  );
}

export function Card({
  title,
  body,
  color = c.cyan,
  width = 330,
  height = 170,
}: {
  title: string;
  body?: string;
  color?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Rect layout direction={'column'} gap={12} width={width} height={height} radius={24} padding={24} fill={c.panel} stroke={color} lineWidth={4}>
      <Txt text={title} fontSize={36} fontWeight={700} fill={c.text} />
      {body && <Txt text={body} fontSize={24} fill={c.muted} textWrap width={width - 48} />}
    </Rect>
  );
}

export function Arrow({width = 130, color = c.muted}: {width?: number; color?: string}) {
  return <Line points={[[-width / 2, 0], [width / 2, 0]]} stroke={color} lineWidth={5} endArrow arrowSize={12} />;
}

export function Pipeline({items, highlight}: {items: string[]; highlight?: string}) {
  return (
    <Layout layout gap={18} alignItems={'center'}>
      {items.map((item, index) => (
        <Layout key={`${item}-${index}`} layout gap={18} alignItems={'center'}>
          <Txt text={item} fontSize={28} fontWeight={item === highlight ? 700 : 400} fill={item === highlight ? c.amber : c.text} />
          {index < items.length - 1 && <Arrow width={72} color={item === highlight ? c.amber : c.stroke} />}
        </Layout>
      ))}
    </Layout>
  );
}

export function ImageBox({label = 'image'}: {label?: string}) {
  return (
    <Rect layout direction={'column'} gap={10} width={260} height={190} radius={22} padding={22} fill={c.panelAlt} stroke={c.cyan} lineWidth={5}>
      <Txt text={label} fontSize={36} fontWeight={700} fill={c.text} />
      <Txt text={'layers + config'} fontSize={24} fill={c.muted} />
    </Rect>
  );
}

export function RegistryBox() {
  return (
    <Rect layout direction={'column'} gap={16} width={330} height={220} radius={22} padding={24} fill={'#171226'} stroke={c.violet} lineWidth={5}>
      <Txt text={'registry'} fontSize={36} fontWeight={700} fill={c.text} />
      <Rect width={250} height={36} radius={8} fill={'#241b3f'} stroke={c.stroke} lineWidth={2} />
      <Rect width={250} height={36} radius={8} fill={'#241b3f'} stroke={c.stroke} lineWidth={2} />
      <Txt text={'storage + distribution'} fontSize={21} fill={c.muted} />
    </Rect>
  );
}

export function LayerStack({labels = ['base filesystem', 'packages', 'runtime deps', 'app files'], writable}: {labels?: string[]; writable?: string}) {
  return (
    <Layout layout direction={'column'} gap={8} alignItems={'center'}>
      {writable && (
        <Rect width={430} height={48} radius={12} fill={'#3b2d13'} stroke={c.amber} lineWidth={3}>
          <Txt text={writable} fontSize={22} fill={c.text} />
        </Rect>
      )}
      {labels.slice().reverse().map((label, index) => (
        <Rect key={label} width={430 - index * 18} height={46} radius={12} fill={'#102033'} stroke={c.cyan} lineWidth={2} opacity={0.9}>
          <Txt text={label} fontSize={21} fill={c.text} />
        </Rect>
      ))}
    </Layout>
  );
}

export function ProcessBox({label = 'process'}: {label?: string}) {
  return (
    <Circle size={140} fill={'#172554'} stroke={c.green} lineWidth={6}>
      <Txt text={label} fontSize={28} fill={c.text} />
    </Circle>
  );
}

export function ContainerInstance({label = 'container'}: {label?: string}) {
  return (
    <Rect layout direction={'column'} gap={14} width={360} height={290} radius={28} padding={22} fill={'#0b1220'} stroke={c.violet} lineWidth={5}>
      <Txt text={label} fontSize={30} fontWeight={700} fill={c.text} />
      <ProcessBox />
      <Txt text={'filesystem + namespaces + cgroups'} fontSize={18} fill={c.muted} />
    </Rect>
  );
}

export function KernelLayer() {
  return (
    <Rect width={1000} height={90} radius={24} fill={'#1e293b'} stroke={c.stroke} lineWidth={4}>
      <Txt text={'host kernel'} fontSize={34} fill={c.text} />
    </Rect>
  );
}
