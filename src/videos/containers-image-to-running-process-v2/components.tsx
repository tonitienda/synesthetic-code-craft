import {Circle, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import {c, layers} from './theme';

export function TitleBlock({title, subtitle}: {title: string; subtitle?: string}) {
  return (
    <Layout layout direction={'column'} gap={12} alignItems={'center'}>
      <Txt text={title} fontSize={54} fontWeight={800} fill={c.text} />
      {subtitle && <Txt text={subtitle} fontSize={25} fill={c.muted} />}
    </Layout>
  );
}

export function Caption({text, tone = 'muted'}: {text: string; tone?: 'muted' | 'strong' | 'warning' | 'ok'}) {
  const fill = tone === 'strong' ? c.text : tone === 'warning' ? c.amber : tone === 'ok' ? c.green : c.muted;
  return <Txt text={text} fontSize={27} fill={fill} textWrap width={1120} textAlign={'center'} />;
}

export function ConceptBox({
  title,
  body,
  tone = 'neutral',
  width = 310,
  height = 165,
}: {
  title: string;
  body?: string;
  tone?: 'neutral' | 'image' | 'registry' | 'runtime' | 'container' | 'warning' | 'process';
  width?: number;
  height?: number;
}) {
  const stroke =
    tone === 'image' ? c.cyan :
    tone === 'registry' ? c.violet :
    tone === 'runtime' ? c.amber :
    tone === 'container' ? c.green :
    tone === 'warning' ? c.red :
    tone === 'process' ? c.green :
    c.stroke;

  return (
    <Rect layout direction={'column'} gap={12} justifyContent={'center'} alignItems={'center'} width={width} height={height} radius={24} padding={22} fill={c.panel} stroke={stroke} lineWidth={4}>
      <Txt text={title} fontSize={33} fontWeight={800} fill={c.text} textAlign={'center'} />
      {body && <Txt text={body} fontSize={21} fill={c.muted} textWrap width={width - 42} textAlign={'center'} />}
    </Rect>
  );
}

export function Arrow({width = 105, color = c.stroke, label}: {width?: number; color?: string; label?: string}) {
  return (
    <Layout layout direction={'column'} gap={8} alignItems={'center'} justifyContent={'center'}>
      {label && <Txt text={label} fontSize={21} fill={color} fontWeight={700} />}
      <Line points={[[-width / 2, 0], [width / 2, 0]]} stroke={color} lineWidth={5} endArrow arrowSize={14} />
    </Layout>
  );
}

export function CommandCallout({command = 'docker run nginx', focus = 'run'}: {command?: string; focus?: string}) {
  const index = focus.length > 0 ? command.indexOf(focus) : -1;
  const hasFocus = index !== -1;
  const before = hasFocus ? command.slice(0, index) : command;
  const after = hasFocus ? command.slice(index + focus.length) : '';

  return (
    <Rect layout gap={8} alignItems={'center'} justifyContent={'center'} width={780} height={138} radius={28} fill={'#020617'} stroke={c.stroke} lineWidth={4}>
      <Txt text={before} fontFamily={'monospace'} fontSize={58} fill={c.text} />
      {hasFocus && (
        <Rect radius={12} padding={[8, 16]} fill={c.amberSoft} stroke={c.amber} lineWidth={3}>
          <Txt text={focus} fontFamily={'monospace'} fontSize={58} fill={c.amber} fontWeight={800} />
        </Rect>
      )}
      <Txt text={after} fontFamily={'monospace'} fontSize={58} fill={c.text} />
    </Rect>
  );
}

export function ImageArtifact({label = 'image', open = false}: {label?: string; open?: boolean}) {
  return (
    <Rect layout direction={'column'} gap={open ? 9 : 12} alignItems={'center'} justifyContent={'center'} width={open ? 360 : 280} height={open ? 285 : 190} radius={26} padding={22} fill={c.panelAlt} stroke={c.cyan} lineWidth={5}>
      <Txt text={label} fontSize={34} fontWeight={800} fill={c.text} />
      <Txt text={'layers + config'} fontSize={22} fill={c.muted} />
      {open && <LayerStack compact />}
    </Rect>
  );
}

export function RegistryShelf() {
  return (
    <Rect layout direction={'column'} gap={13} alignItems={'center'} justifyContent={'center'} width={330} height={235} radius={26} padding={22} fill={c.violetSoft} stroke={c.violet} lineWidth={5}>
      <Txt text={'registry'} fontSize={35} fontWeight={800} fill={c.text} />
      <Rect width={245} height={32} radius={8} fill={'#3b1f66'} stroke={c.stroke} lineWidth={2} />
      <Rect width={245} height={32} radius={8} fill={'#3b1f66'} stroke={c.stroke} lineWidth={2} />
      <Txt text={'storage + distribution'} fontSize={21} fill={c.muted} />
      <Txt text={'not where containers run'} fontSize={18} fill={c.amber} />
    </Rect>
  );
}

export function WorkflowRail({compact = false}: {compact?: boolean}) {
  const stepWidth = compact ? 145 : 170;
  const gap = compact ? 8 : 14;
  return (
    <Layout layout gap={gap} alignItems={'center'} justifyContent={'center'}>
      <ConceptBox title={'build'} body={'produces'} tone={'runtime'} width={stepWidth} height={112} />
      <Arrow width={compact ? 42 : 55} color={c.cyan} />
      <ConceptBox title={'image'} body={'layers + config'} tone={'image'} width={stepWidth} height={112} />
      <Arrow width={compact ? 42 : 55} color={c.violet} label={'push'} />
      <ConceptBox title={'registry'} body={'stores'} tone={'registry'} width={stepWidth} height={112} />
      <Arrow width={compact ? 42 : 55} color={c.violet} label={'pull'} />
      <ConceptBox title={'local image'} body={'artifact'} tone={'image'} width={stepWidth} height={112} />
      <Arrow width={compact ? 42 : 55} color={c.amber} label={'run'} />
      <ConceptBox title={'container'} body={'bounded process'} tone={'container'} width={stepWidth} height={112} />
    </Layout>
  );
}

export function LayerStack({
  writable,
  compact = false,
  shared = false,
}: {
  writable?: string;
  compact?: boolean;
  shared?: boolean;
}) {
  const width = compact ? 250 : 430;
  const height = compact ? 28 : 48;
  return (
    <Layout layout direction={'column'} gap={compact ? 5 : 9} alignItems={'center'}>
      {writable && (
        <Rect width={width + 24} height={height} radius={10} fill={c.amberSoft} stroke={c.amber} lineWidth={3}>
          <Txt text={writable} fontSize={compact ? 15 : 22} fill={c.text} fontWeight={700} />
        </Rect>
      )}
      {layers.slice().reverse().map((label, index) => (
        <Rect key={label} width={width - index * (compact ? 10 : 18)} height={height} radius={10} fill={c.cyanSoft} stroke={shared ? c.green : c.cyan} lineWidth={2} opacity={0.9}>
          <Txt text={`${label} 🔒`} fontSize={compact ? 14 : 20} fill={c.text} />
        </Rect>
      ))}
    </Layout>
  );
}

export function FileToken({label = '/etc/app.conf', variant = 'original'}: {label?: string; variant?: 'original' | 'modified'}) {
  const modified = variant === 'modified';
  return (
    <Rect width={270} height={58} radius={14} fill={modified ? c.amberSoft : c.panelSoft} stroke={modified ? c.amber : c.cyan} lineWidth={3}>
      <Txt text={modified ? `${label}*` : label} fontFamily={'monospace'} fontSize={22} fill={modified ? c.amber : c.text} />
    </Rect>
  );
}

export function ProcessPulse({label = 'process'}: {label?: string}) {
  return (
    <Circle size={132} fill={c.greenSoft} stroke={c.green} lineWidth={6}>
      <Txt text={`●\n${label}`} fontSize={25} fill={c.text} textAlign={'center'} />
    </Circle>
  );
}

export function BoundaryFrame({label, children, tone = 'container'}: {label: string; children: any; tone?: 'container' | 'namespace' | 'cgroup' | 'filesystem'}) {
  const stroke = tone === 'namespace' ? c.violet : tone === 'cgroup' ? c.amber : tone === 'filesystem' ? c.cyan : c.green;
  return (
    <Rect layout direction={'column'} gap={10} alignItems={'center'} justifyContent={'center'} width={420} height={300} radius={28} padding={18} fill={'#02061766'} stroke={stroke} lineWidth={4}>
      <Txt text={label} fontSize={22} fill={stroke} fontWeight={800} />
      {children}
    </Rect>
  );
}

export function ContainerInstance({label = 'container', details = true}: {label?: string; details?: boolean}) {
  return (
    <BoundaryFrame label={label}>
      <ProcessPulse />
      {details && <Txt text={'filesystem view + namespaces + cgroups'} fontSize={18} fill={c.muted} textAlign={'center'} />}
    </BoundaryFrame>
  );
}

export function ContainerPair() {
  return (
    <Layout layout direction={'column'} gap={24} alignItems={'center'}>
      <Layout layout gap={110} alignItems={'center'}>
        <Layout layout direction={'column'} gap={10} alignItems={'center'}>
          <WritableLayer label={'Writable A'} />
          <ContainerInstance label={'Container A'} details={false} />
        </Layout>
        <Layout layout direction={'column'} gap={10} alignItems={'center'}>
          <WritableLayer label={'Writable B'} />
          <ContainerInstance label={'Container B'} details={false} />
        </Layout>
      </Layout>
      <LayerStack shared />
    </Layout>
  );
}

export function WritableLayer({label}: {label: string}) {
  return (
    <Rect width={310} height={54} radius={13} fill={c.amberSoft} stroke={c.amber} lineWidth={3}>
      <Txt text={label} fontSize={22} fill={c.text} fontWeight={800} />
    </Rect>
  );
}

export function KernelLayer() {
  return (
    <Rect layout gap={22} alignItems={'center'} justifyContent={'center'} width={1040} height={92} radius={22} fill={'#111827'} stroke={c.stroke} lineWidth={4}>
      <Txt text={'host kernel'} fontSize={34} fontWeight={800} fill={c.text} />
      <Txt text={'the container is anchored to the host'} fontSize={22} fill={c.muted} />
    </Rect>
  );
}

export function NamespaceSplitView() {
  return (
    <Layout layout gap={70} alignItems={'center'}>
      <ConceptBox title={'host view'} body={'many processes\nmounts\nnetworks\nhostnames'} tone={'neutral'} width={340} height={255} />
      <Arrow width={90} color={c.violet} label={'namespace'} />
      <ConceptBox title={'container view'} body={'shaped processes\nshaped mounts\nshaped network\nshaped hostname'} tone={'container'} width={360} height={255} />
    </Layout>
  );
}

export function ResourceBudgetRing() {
  return (
    <Layout layout gap={24} alignItems={'center'}>
      <ConceptBox title={'CPU'} body={'budget'} tone={'runtime'} width={190} height={125} />
      <ConceptBox title={'memory'} body={'budget'} tone={'runtime'} width={210} height={125} />
      <ProcessPulse />
      <ConceptBox title={'I/O'} body={'budget'} tone={'runtime'} width={190} height={125} />
      <ConceptBox title={'cgroups'} body={'what the process can use'} tone={'runtime'} width={280} height={125} />
    </Layout>
  );
}

export function Formula() {
  return (
    <Layout layout direction={'column'} gap={24} alignItems={'center'}>
      <Layout layout gap={18} alignItems={'center'}>
        <ConceptBox title={'process'} tone={'process'} width={205} height={112} />
        <Txt text={'+'} fontSize={42} fill={c.muted} />
        <ConceptBox title={'filesystem view'} tone={'image'} width={260} height={112} />
        <Txt text={'+'} fontSize={42} fill={c.muted} />
        <ConceptBox title={'namespaces'} tone={'registry'} width={235} height={112} />
        <Txt text={'+'} fontSize={42} fill={c.muted} />
        <ConceptBox title={'cgroups'} tone={'runtime'} width={210} height={112} />
      </Layout>
      <Txt text={'container = process + filesystem view + namespaces + cgroups'} fontSize={37} fontWeight={800} fill={c.text} />
    </Layout>
  );
}

export function SecondaryLoop() {
  return (
    <Layout layout gap={18} alignItems={'center'} opacity={0.7}>
      <ConceptBox title={'writable changes'} tone={'warning'} width={250} height={100} />
      <Arrow width={70} color={c.amber} label={'commit'} />
      <ConceptBox title={'new image layer'} tone={'image'} width={245} height={100} />
      <Txt text={'optional side loop'} fontSize={24} fill={c.muted} />
    </Layout>
  );
}

export function ReadTrace({label = 'read'}: {label?: string}) {
  return <Arrow width={110} color={label === 'write' ? c.amber : c.cyan} label={label} />;
}
