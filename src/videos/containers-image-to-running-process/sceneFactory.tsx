import {Layout} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {makeScene2D} from '@motion-canvas/2d';
import {Title} from './components';
import {containerTheme as c} from './theme';

export interface ContainersPanel {
  element: any;
  hold?: number;
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
 * The previous implementation compressed each act into one static slide. This
 * factory intentionally gives every scene a sequence of diagram states with
 * long readable holds, so the Motion Canvas project tracks the 7–10 minute
 * source timeline rather than a short deck of title cards.
 */
export function makeContainersScene({title, sub, panels, introHold = 2, outroHold = 2}: ContainersSceneConfig) {
  return makeScene2D(function* (view) {
    view.fill(c.bg);

    const heading = createRef<Layout>();
    const panelRefs = panels.map(() => createRef<Layout>());

    view.add(
      <Layout layout direction={'column'} gap={42} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} padding={70}>
        <Layout ref={heading} opacity={0} y={-24}>
          <Title text={title} sub={sub} />
        </Layout>
        {panels.map((panel, index) => (
          <Layout key={`panel-${index}`} ref={panelRefs[index]} opacity={0} y={28}>
            {panel.element}
          </Layout>
        ))}
      </Layout>,
    );

    yield* all(heading().opacity(1, 0.8), heading().y(0, 0.8));
    yield* waitFor(introHold);

    for (let index = 0; index < panels.length; index++) {
      if (index > 0) {
        yield* all(panelRefs[index - 1]().opacity(0.18, 0.45), panelRefs[index - 1]().y(-10, 0.45));
      }
      yield* all(panelRefs[index]().opacity(1, 0.85), panelRefs[index]().y(0, 0.85));
      yield* waitFor(panels[index].hold ?? 8);
    }

    yield* waitFor(outroHold);
    yield* all(heading().opacity(0, 0.5), ...panelRefs.map(ref => ref().opacity(0, 0.5)));
  });
}
