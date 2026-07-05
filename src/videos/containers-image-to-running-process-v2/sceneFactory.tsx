import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {TitleBlock} from './components';
import {c} from './theme';

export interface Moment {
  label: string;
  element: any;
  hold?: number;
}

export interface SceneConfig {
  title: string;
  subtitle?: string;
  moments: Moment[];
}

export function makeContainersV2Scene({title, subtitle, moments}: SceneConfig) {
  return makeScene2D(function* (view) {
    view.fill(c.bg);

    const heading = createRef<Layout>();
    const content = createRef<Layout>();
    const footer = createRef<Txt>();
    const progress = createRef<Rect>();
    const momentRefs = moments.map(() => createRef<Layout>());

    view.add(
      <Layout width={'100%'} height={'100%'}>
        <Rect width={'100%'} height={'100%'} fill={c.bg} />
        <Rect x={-520} y={-300} width={560} height={560} radius={280} fill={'#0c4a6e22'} />
        <Rect x={520} y={300} width={620} height={620} radius={310} fill={'#2e106522'} />

        <Layout layout direction={'column'} gap={26} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={58}>
          <Layout ref={heading} opacity={0} y={-18}>
            <TitleBlock title={title} subtitle={subtitle} />
          </Layout>

          <Layout ref={content} width={'100%'} height={610} alignItems={'center'} justifyContent={'center'}>
            {moments.map((moment, index) => (
              <Layout key={`moment-${index}`} ref={momentRefs[index]} opacity={0} scale={0.97} y={18}>
                {moment.element}
              </Layout>
            ))}
          </Layout>

          <Layout layout direction={'column'} gap={10} alignItems={'center'}>
            <Rect width={920} height={5} radius={4} fill={c.strokeSoft}>
              <Rect ref={progress} x={-460} width={0} height={5} radius={4} fill={c.cyan} />
            </Rect>
            <Txt ref={footer} text={''} fontSize={20} fill={c.muted} opacity={0} />
          </Layout>
        </Layout>
      </Layout>,
    );

    yield* all(heading().opacity(1, 0.7), heading().y(0, 0.7));
    yield* waitFor(0.4);

    for (let index = 0; index < moments.length; index++) {
      footer().text(moments[index].label);
      const nextWidth = 920 * ((index + 1) / moments.length);
      yield* all(
        footer().opacity(1, 0.3),
        progress().width(nextWidth, 0.55),
      );

      if (index > 0) {
        yield* all(
          momentRefs[index - 1]().opacity(0, 0.45),
          momentRefs[index - 1]().scale(0.985, 0.45),
          momentRefs[index - 1]().y(-18, 0.45),
        );
      }

      yield* all(
        momentRefs[index]().opacity(1, 0.75),
        momentRefs[index]().scale(1, 0.75),
        momentRefs[index]().y(0, 0.75),
      );
      yield* waitFor(moments[index].hold ?? 2.2);
    }

    yield* waitFor(0.6);
    yield* all(
      heading().opacity(0, 0.45),
      footer().opacity(0, 0.45),
      content().opacity(0, 0.45),
    );
  });
}
