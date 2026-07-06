import {waitFor} from '@motion-canvas/core';
import {Terminal, TerminalPrintOptions, TerminalRunOptions} from '../components/terminal';

export interface DockerChoreographyDefaults {
  tag?: string;
  pullOutputDelay?: number;
  runOutputDelay?: number;
}

export interface DockerPullOptions extends DockerChoreographyDefaults {
  command?: string;
  printProgress?: boolean;
}

export interface DockerRunOptions extends DockerChoreographyDefaults {
  args?: string[];
  command?: string;
  detached?: boolean;
  output?: string | string[] | false;
}

export function createDockerTerminal(
  terminal: Terminal,
  defaults: DockerChoreographyDefaults = {},
) {
  return new DockerTerminal(terminal, defaults);
}

export class DockerTerminal {
  constructor(
    private readonly terminal: Terminal,
    private readonly defaults: DockerChoreographyDefaults = {},
  ) {}

  *pull(image: string, options: DockerPullOptions = {}) {
    yield* dockerPull(this.terminal, image, {...this.defaults, ...options});
  }

  *run(image: string, options: DockerRunOptions = {}) {
    yield* dockerRun(this.terminal, image, {...this.defaults, ...options});
  }
}

export function* dockerPull(
  terminal: Terminal,
  image: string,
  options: DockerPullOptions = {},
) {
  const tag = options.tag ?? 'latest';
  const command = options.command ?? `docker pull ${image}`;
  const taggedImage = withTag(image, tag);
  const repository = repositoryName(image);
  const printProgress = options.printProgress ?? true;

  yield* terminal.typeCommand(command);
  yield* terminal.run();

  yield* waitFor(options.pullOutputDelay ?? 0.8);
  yield* terminal.print(`Using default tag: ${tag}`, muted());

  if (printProgress) {
    yield* waitFor(0.3);
    yield* terminal.print(`${tag}: Pulling from ${repository}`, muted());

    yield* waitFor(0.45);
    yield* terminal.print('Digest: sha256:••••••••••••••••', muted());
  }

  yield* waitFor(0.35);
  yield* terminal.print(`Status: Downloaded newer image for ${taggedImage}`, {
    kind: 'success',
  });
}

export function* dockerRun(
  terminal: Terminal,
  image: string,
  options: DockerRunOptions = {},
) {
  const args = options.args ?? [];
  const command = options.command ?? ['docker', 'run', ...args, image].join(' ');
  const tag = options.tag ?? 'latest';
  const taggedImage = withTag(image, tag);

  yield* terminal.typeCommand(command);
  yield* terminal.run(runOptions());

  if (options.output === false) {
    return;
  }

  yield* waitFor(options.runOutputDelay ?? 0.45);

  const output = options.output ?? defaultRunOutput(taggedImage, options.detached);
  const lines = Array.isArray(output) ? output : [output];

  for (const [index, line] of lines.entries()) {
    if (index > 0) {
      yield* waitFor(0.25);
    }

    yield* terminal.print(line, {kind: 'success'});
  }
}

function defaultRunOutput(taggedImage: string, detached = false) {
  if (detached) {
    return '4f1b7c2a9d5e';
  }

  return `Started container process from ${taggedImage}`;
}

function withTag(image: string, defaultTag: string) {
  if (image.includes(':')) {
    return image;
  }

  return `${image}:${defaultTag}`;
}

function repositoryName(image: string) {
  const [withoutTag] = image.split(':');

  if (withoutTag.includes('/')) {
    return withoutTag;
  }

  return `library/${withoutTag}`;
}

function muted(): TerminalPrintOptions {
  return {kind: 'muted'};
}

function runOptions(): TerminalRunOptions {
  return {afterDelay: 0.12};
}
