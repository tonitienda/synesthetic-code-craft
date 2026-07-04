import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

const palette = {bg: '#070814', panel: '#10172a', text: '#f8fafc', muted: '#cbd5e1', cyan: '#22d3ee', pink: '#f472b6', green: '#34d399', red: '#fb7185'};

export default makeScene2D(function* (view) {
  view.fill(palette.bg);
  const title = createRef<Txt>();
  const network = createRef<Layout>();
  const problem = createRef<Rect>();

  view.add(
    <Layout layout direction={'column'} gap={44} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70}>
      <Txt ref={title} text={'2. Depth builds features — and creates blame'} fontSize={70} fontWeight={700} fill={palette.text} opacity={0} />
      <Layout ref={network} layout gap={68} alignItems={'center'} opacity={0}>
        {[3, 4, 4, 2].map((count, layer) => (
          <Layout layout direction={'column'} gap={26} alignItems={'center'}>
            {Array.from({length: count}).map((_, i) => (
              <Circle size={70} fill={palette.panel} stroke={[palette.cyan, palette.pink, palette.green, palette.red][layer]} lineWidth={6}>
                <Txt text={layer === 0 ? `x${i + 1}` : layer === 3 ? `ŷ${i + 1}` : ''} fontSize={26} fill={palette.text} />
              </Circle>
            ))}
          </Layout>
        ))}
      </Layout>
      <Layout width={1120} height={210}>
        <Line points={[[-520, 0], [520, 0]]} stroke={'#334155'} lineWidth={6} endArrow />
        <Txt x={-390} y={-55} text={'edges'} fontSize={32} fill={palette.muted} />
        <Txt x={-70} y={-55} text={'parts'} fontSize={32} fill={palette.muted} />
        <Txt x={260} y={-55} text={'concepts'} fontSize={32} fill={palette.muted} />
        <Txt x={0} y={60} text={'More layers can represent richer functions, but every weight now shares responsibility for the error.'} fontSize={36} fill={palette.text} />
      </Layout>
      <Rect ref={problem} width={1180} height={110} radius={26} fill={'#3b1020'} opacity={0}>
        <Txt text={'Training question: which earlier weight caused the final mistake?'} fontSize={42} fill={palette.text} />
      </Rect>
    </Layout>,
  );

  yield* title().opacity(1, 0.7);
  yield* network().opacity(1, 1);
  yield* problem().opacity(1, 0.8);
  yield* waitFor(1.2);
});
