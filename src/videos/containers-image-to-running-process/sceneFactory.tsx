import { Layout, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';
import { Title } from './components';
import { containerTheme as c } from './theme';

export interface ContainersPanel {
  element: any;
  hold?: number;
  note?: string;
}

export interface ContainersSceneConfig {
  title: string;
  sub?: string;
  panels: ContainersPanel[];
  introHold?: number;
  outroHold?: number;
}

/**
 * Shared pacing for the containers video.
 *
 * This helper is intentionally video-local. It keeps the repeated scene chrome
 * out of individual acts, but the act files still own the source-specific
 * diagram states and hold durations. Panels are overlaid in one content well so
 * each reveal reads as an animated evolution of the same diagram, not as a
 * vertically stacked slide deck.
 */
export function makeContainersScene({
  title,
  sub,
  panels,
  introHold = 2,
  outroHold = 2,
}: ContainersSceneConfig) {
  return makeScene2D(function* (view) {
    view.fill(c.bg);

    const heading = createRef<Layout>();
    const progress = createRef<Txt>();
    const panelRefs = panels.map(() => createRef<Layout>());

    view.add(
      <Layout
        layout
        direction={'column'}
        gap={34}
        alignItems={'center'}
        justifyContent={'center'}
        width={'100%'}
        height={'100%'}
        padding={70}
      >
        <Layout ref={heading} opacity={0} y={-24}>
          <Title text={title} sub={sub} />
        </Layout>
        <Layout
          width={'100%'}
          height={610}
          alignItems={'center'}
          justifyContent={'center'}
        >
          {panels.map((panel, index) => (
            <Layout
              key={`panel-${index}`}
              ref={panelRefs[index]}
              opacity={0}
              scale={0.96}
              x={36}
            >
              {panel.element}
            </Layout>
          ))}
        </Layout>
        <Txt ref={progress} opacity={0} fontSize={22} fill={c.muted} />
      </Layout>,
    );

    yield* all(heading().opacity(1, 0.8), heading().y(0, 0.8));
    yield* waitFor(introHold);

    for (let index = 0; index < panels.length; index++) {
      const panel = panels[index];
      const label =
        panel.note ?? `source moment ${index + 1} / ${panels.length}`;

      progress().text(label);
      yield* all(progress().opacity(0.7, 0.35), progress().y(0, 0.35));

      if (index > 0) {
        yield* all(
          panelRefs[index - 1]().opacity(0, 0.45),
          panelRefs[index - 1]().x(-36, 0.45),
          panelRefs[index - 1]().scale(0.98, 0.45),
        );
      }

      yield* all(
        panelRefs[index]().opacity(1, 0.85),
        panelRefs[index]().x(0, 0.85),
        panelRefs[index]().scale(1, 0.85),
      );
      yield* waitFor(panel.hold ?? 8);
    }

    yield* waitFor(outroHold);
    yield* all(
      heading().opacity(0, 0.5),
      progress().opacity(0, 0.5),
      ...panelRefs.map((ref) => ref().opacity(0, 0.5)),
    );
  });
}
