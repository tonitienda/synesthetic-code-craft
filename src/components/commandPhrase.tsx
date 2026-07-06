import {Layout, Txt} from '@motion-canvas/2d';
import {all, createRef, Reference, waitFor} from '@motion-canvas/core';

export type CommandPhraseTokenKind =
  | 'command'
  | 'arg'
  | 'flag'
  | 'path'
  | 'pipe'
  | 'operator';

export interface CommandPhraseToken {
  text: string;
  kind: CommandPhraseTokenKind;
  fill?: string;
}

export interface CommandPhraseSnapshot {
  text: string;
  tokens: CommandPhraseToken[];
  fontSize?: number;
  gap?: number;
  fontFamily?: string;
}

export interface CommandPhraseTheme {
  text: string;
  command: string;
  flag: string;
  operator: string;
  path: string;
  highlight: string;
  dimmed: string;
}

export interface CommandPhraseOptions {
  fontSize?: number;
  gap?: number;
  fontFamily?: string;
  theme?: Partial<CommandPhraseTheme>;
  opacity?: number;
}

export interface CommandPhraseHighlightOptions {
  color?: string;
  duration?: number;
  hold?: number;
  restore?: boolean;
  occurrence?: number;
}

export interface CommandPhraseRestyleOptions {
  fontSize?: number;
  gap?: number;
  fill?: string;
}

export const defaultCommandPhraseTheme: CommandPhraseTheme = {
  text: '#e2e8f0',
  command: '#e2e8f0',
  flag: '#fde68a',
  operator: '#fde68a',
  path: '#c4b5fd',
  highlight: '#facc15',
  dimmed: '#64748b',
};

export function createCommandPhrase(
  source: string | CommandPhraseSnapshot,
  options: CommandPhraseOptions = {},
) {
  return new CommandPhrase(source, options);
}

export class CommandPhrase {
  public readonly node: Layout;

  private readonly text: string;
  private readonly tokens: CommandPhraseToken[];
  private readonly tokenRefs: Reference<Txt>[] = [];
  private readonly originalFill: string[] = [];
  private readonly theme: CommandPhraseTheme;
  private readonly fontFamily: string;

  constructor(source: string | CommandPhraseSnapshot, options: CommandPhraseOptions = {}) {
    const snapshot = typeof source === 'string' ? snapshotCommandPhrase(source) : source;

    this.text = snapshot.text;
    this.tokens = snapshot.tokens.map(token => ({...token}));
    this.theme = {...defaultCommandPhraseTheme, ...options.theme};
    this.fontFamily = options.fontFamily ?? snapshot.fontFamily ?? 'monospace';

    const fontSize = options.fontSize ?? snapshot.fontSize ?? 30;
    const gap = options.gap ?? snapshot.gap ?? 8;

    this.node = (
      <Layout
        layout
        direction={'row'}
        gap={gap}
        alignItems={'center'}
        justifyContent={'center'}
        opacity={options.opacity ?? 1}
      >
        {this.tokens.map((token, index) => {
          const tokenRef = createRef<Txt>();
          const fill = token.fill ?? this.colorForToken(token);

          this.tokenRefs[index] = tokenRef;
          this.originalFill[index] = fill;

          return (
            <Txt
              key={`${token.text}-${index}`}
              ref={tokenRef}
              text={token.text}
              fontFamily={this.fontFamily}
              fontSize={fontSize}
              fill={fill}
            />
          );
        })}
      </Layout>
    ) as Layout;
  }

  snapshot(): CommandPhraseSnapshot {
    return {
      text: this.text,
      fontFamily: this.fontFamily,
      tokens: this.tokens.map((token, index) => ({
        ...token,
        fill: this.tokenRefs[index]?.().fill() as string,
      })),
    };
  }

  token(tokenText: string, occurrence = 0) {
    const match = this.matchingTokenIndexes(tokenText)[occurrence];

    if (match === undefined) {
      return undefined;
    }

    return this.tokenRefs[match]();
  }

  *highlight(tokenText: string, options: CommandPhraseHighlightOptions = {}) {
    const match = this.matchingTokenIndexes(tokenText)[options.occurrence ?? 0];

    if (match === undefined) {
      return;
    }

    const tokenRef = this.tokenRefs[match];
    const color = options.color ?? this.theme.highlight;
    const duration = options.duration ?? 0.22;
    const hold = options.hold ?? 0;
    const restore = options.restore ?? false;

    yield* all(tokenRef().fill(color, duration), tokenRef().scale(1.08, duration));

    if (hold > 0) {
      yield* waitFor(hold);
    }

    if (restore) {
      yield* all(
        tokenRef().fill(this.originalFill[match], duration),
        tokenRef().scale(1, duration),
      );
    }
  }

  *dimExcept(tokenText: string, duration = 0.22) {
    const matches = new Set(this.matchingTokenIndexes(tokenText));

    yield* all(
      ...this.tokenRefs.map((tokenRef, index) =>
        tokenRef().fill(
          matches.has(index) ? this.originalFill[index] : this.theme.dimmed,
          duration,
        ),
      ),
    );
  }

  *restore(duration = 0.22) {
    yield* all(
      ...this.tokenRefs.map((tokenRef, index) =>
        all(tokenRef().fill(this.originalFill[index], duration), tokenRef().scale(1, duration)),
      ),
    );
  }

  *restyle(style: CommandPhraseRestyleOptions, duration = 0.35) {
    const animations = [];

    if (style.fontSize !== undefined) {
      animations.push(
        ...this.tokenRefs.map(tokenRef => tokenRef().fontSize(style.fontSize!, duration)),
      );
    }

    if (style.fill !== undefined) {
      animations.push(...this.tokenRefs.map(tokenRef => tokenRef().fill(style.fill!, duration)));
    }

    if (style.gap !== undefined) {
      animations.push(this.node.gap(style.gap, duration));
    }

    if (animations.length === 0) {
      return;
    }

    yield* all(...animations);
  }

  *hide(duration = 0.15) {
    yield* this.node.opacity(0, duration);
  }

  *show(duration = 0.15) {
    yield* this.node.opacity(1, duration);
  }

  private matchingTokenIndexes(tokenText: string) {
    return this.tokens.reduce<number[]>((matches, token, index) => {
      if (token.text === tokenText) {
        matches.push(index);
      }

      return matches;
    }, []);
  }

  private colorForToken(token: CommandPhraseToken) {
    switch (token.kind) {
      case 'command':
        return this.theme.command;
      case 'flag':
        return this.theme.flag;
      case 'path':
        return this.theme.path;
      case 'pipe':
      case 'operator':
        return this.theme.operator;
      default:
        return this.theme.text;
    }
  }
}

export function snapshotCommandPhrase(command: string): CommandPhraseSnapshot {
  return {
    text: command,
    tokens: tokenizeCommandPhrase(command),
  };
}

export function tokenizeCommandPhrase(command: string): CommandPhraseToken[] {
  const parts = command.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];

  return parts.map((text, index) => ({
    text,
    kind: inferTokenKind(text, index),
  }));
}

function inferTokenKind(text: string, index: number): CommandPhraseTokenKind {
  if (index === 0) {
    return 'command';
  }

  if (text === '|') {
    return 'pipe';
  }

  if (['&&', '||', '>', '>>', '<'].includes(text)) {
    return 'operator';
  }

  if (text.startsWith('-')) {
    return 'flag';
  }

  if (text.includes('/') || text.startsWith('.')) {
    return 'path';
  }

  return 'arg';
}
