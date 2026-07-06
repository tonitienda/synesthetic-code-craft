import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {createTerminal} from '../components';
import {liftCommandPhrase} from '../choreography';

const colors = {
  bg: '#090b1a',
  text: '#f8fafc',
  muted: '#94a3b8',
  amber: '#facc15',
};

export default makeScene2D(function* (view) {
  view.fill(colors.bg);

  const overlay = createRef<Layout>();
  const explainer = createRef<Txt>();
  const terminal = createTerminal({
    title: 'local shell',
    width: 900,
    height: 360,
    fontSize: 34,
  });

  terminal.node.y(120);
  terminal.node.opacity(0);

  view.add(terminal.node);
  view.add(<Layout ref={overlay} width={'100%'} height={'100%'} />);
  view.add(
    <Txt
      ref={explainer}
      text={''}
      y={210}
      fontSize={38}
      fill={colors.muted}
      opacity={0}
    />,
  );

  yield* terminal.enter();
  yield* terminal.focus();
  yield* terminal.typeCommand('docker run nginx');
  yield* terminal.run();

  yield* waitFor(0.35);
  yield* terminal.print("Unable to find image 'nginx:latest' locally", {
    kind: 'muted',
  });
  yield* waitFor(0.25);
  yield* terminal.print('latest: Pulling from library/nginx', {kind: 'muted'});
  yield* waitFor(0.45);

  const sourceCommand = terminal.command('docker run nginx');

  if (!sourceCommand) {
    return;
  }

  // Pattern: create an overlay phrase from the terminal command, hide the original,
  // then keep directing the overlay phrase as the new title-like actor.
  const lifted = liftCommandPhrase(sourceCommand, {
    overlay: overlay(),
    to: [0, -260],
    duration: 0.85,
    restyle: {
      fontSize: 76,
      gap: 18,
    },
  });

  yield* all(lifted.animation, terminal.exit(0.7));

  explainer().text("But what does 'run' really do?");
  yield* explainer().opacity(1, 0.35);

  yield* lifted.phrase.highlight('docker', {hold: 0.45, restore: true});
  explainer().text('docker: the command-line client');
  yield* waitFor(0.45);

  yield* lifted.phrase.highlight('nginx', {hold: 0.45, restore: true});
  explainer().text('nginx: an image name, pulled if needed');
  yield* waitFor(0.45);

  yield* lifted.phrase.highlight('run', {hold: 0.45, restore: true});
  explainer().text('run: prepare boundaries, then start a process');
  yield* waitFor(1);

  yield* all(lifted.phrase.dimExcept('run'), explainer().fill(colors.amber, 0.25));
  yield* waitFor(0.9);
});
