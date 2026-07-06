import {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, Reference, waitFor} from '@motion-canvas/core';

export type TerminalPrintKind = 'normal' | 'muted' | 'success' | 'warning' | 'error';

export type TerminalTokenKind =
  | 'command'
  | 'arg'
  | 'flag'
  | 'path'
  | 'pipe'
  | 'operator';

export interface TerminalTheme {
  background: string;
  header: string;
  border: string;
  borderFocus: string;
  text: string;
  muted: string;
  prompt: string;
  cursor: string;
  command: string;
  flag: string;
  amber: string;
  amberSoft: string;
  success: string;
  warning: string;
  error: string;
}

export interface TerminalOptions {
  width?: number;
  height?: number;
  title?: string;
  prompt?: string;
  fontSize?: number;
  radius?: number;
  padding?: number;
  lineGap?: number;
  typingDelay?: number;
  theme?: Partial<TerminalTheme>;
}

export interface TerminalPrintOptions {
  kind?: TerminalPrintKind;
  typingDelay?: number;
  type?: boolean;
  fadeInDuration?: number;
}

export interface TerminalRunOptions {
  duration?: number;
  afterDelay?: number;
  dimCommand?: boolean;
}

export interface TerminalHighlightOptions {
  color?: string;
  duration?: number;
  hold?: number;
  restore?: boolean;
  command?: string;
  occurrence?: number;
}

export interface TerminalToken {
  text: string;
  kind: TerminalTokenKind;
}

interface TerminalCommandLine {
  kind: 'command';
  command: string;
  rowRef: Reference<Layout>;
  promptRef: Reference<Txt>;
  cursorRef: Reference<Txt>;
  tokens: TerminalToken[];
  tokenRefs: Reference<Txt>[];
}

interface TerminalOutputLine {
  kind: 'output';
  text: string;
  rowRef: Reference<Layout>;
  textRef: Reference<Txt>;
}

export const defaultTerminalTheme: TerminalTheme = {
  background: '#020617',
  header: '#0f172a',
  border: '#334155',
  borderFocus: '#facc15',
  text: '#e2e8f0',
  muted: '#94a3b8',
  prompt: '#22d3ee',
  cursor: '#facc15',
  command: '#e2e8f0',
  flag: '#fde68a',
  amber: '#facc15',
  amberSoft: '#fde68a',
  success: '#86efac',
  warning: '#fbbf24',
  error: '#fca5a5',
};

export function createTerminal(options: TerminalOptions = {}) {
  return new Terminal(options);
}

export class Terminal {
  public readonly node: Rect;

  private readonly frameRef = createRef<Rect>();
  private readonly bodyRef = createRef<Layout>();
  private readonly theme: TerminalTheme;
  private readonly width: number;
  private readonly height: number;
  private readonly title: string;
  private readonly prompt: string;
  private readonly fontSize: number;
  private readonly padding: number;
  private readonly lineGap: number;
  private readonly typingDelay: number;
  private readonly headerHeight = 54;
  private readonly promptWidth = 34;

  private readonly lines: Array<TerminalCommandLine | TerminalOutputLine> = [];
  private activeCommand?: TerminalCommandLine;

  constructor(options: TerminalOptions = {}) {
    this.theme = {...defaultTerminalTheme, ...options.theme};
    this.width = options.width ?? 860;
    this.height = options.height ?? 520;
    this.title = options.title ?? 'terminal';
    this.prompt = options.prompt ?? '$';
    this.fontSize = options.fontSize ?? 30;
    this.padding = options.padding ?? 28;
    this.lineGap = options.lineGap ?? 14;
    this.typingDelay = options.typingDelay ?? 0.035;

    this.node = (
      <Rect
        ref={this.frameRef}
        width={this.width}
        height={this.height}
        radius={options.radius ?? 26}
        fill={this.theme.background}
        stroke={this.theme.border}
        lineWidth={3}
        clip
      >
        <Layout layout direction={'column'} width={this.width} height={this.height}>
          <Layout
            layout
            direction={'row'}
            gap={10}
            alignItems={'center'}
            justifyContent={'flex-start'}
            width={this.width}
            height={this.headerHeight}
            paddingLeft={22}
            fill={this.theme.header}
          >
            <Circle size={13} fill={this.theme.error} opacity={0.9} />
            <Circle size={13} fill={this.theme.warning} opacity={0.9} />
            <Circle size={13} fill={this.theme.success} opacity={0.9} />
            <Txt
              text={this.title}
              fontSize={18}
              fill={this.theme.muted}
              marginLeft={16}
            />
          </Layout>

          <Layout
            ref={this.bodyRef}
            layout
            direction={'column'}
            gap={this.lineGap}
            alignItems={'stretch'}
            justifyContent={'flex-start'}
            width={this.width}
            height={this.height - this.headerHeight}
            padding={this.padding}
          />
        </Layout>
      </Rect>
    ) as Rect;
  }

  *enter(duration = 0.35) {
    this.node.opacity(0);
    this.node.scale(0.96);

    yield* all(this.node.opacity(1, duration), this.node.scale(1, duration));
  }

  *exit(duration = 0.25) {
    yield* all(this.node.opacity(0, duration), this.node.scale(0.96, duration));
  }

  *focus(duration = 0.25) {
    yield* all(
      this.frameRef().stroke(this.theme.borderFocus, duration),
      this.frameRef().lineWidth(5, duration),
    );
  }

  *unfocus(duration = 0.25) {
    yield* all(
      this.frameRef().stroke(this.theme.border, duration),
      this.frameRef().lineWidth(3, duration),
    );
  }

  *dim(opacity = 0.55, duration = 0.25) {
    yield* this.node.opacity(opacity, duration);
  }

  *undim(duration = 0.25) {
    yield* this.node.opacity(1, duration);
  }

  *typeCommand(command: string, typingDelay = this.typingDelay) {
    const line = this.addCommandLine(command);
    this.activeCommand = line;

    yield* line.rowRef().opacity(1, 0.12);

    for (let tokenIndex = 0; tokenIndex < line.tokens.length; tokenIndex++) {
      const token = line.tokens[tokenIndex];
      const tokenRef = line.tokenRefs[tokenIndex];
      let typed = '';

      for (const char of token.text) {
        typed += char;
        tokenRef().text(typed);
        yield* waitFor(typingDelay);
      }

      if (tokenIndex < line.tokens.length - 1) {
        yield* waitFor(typingDelay * 2);
      }
    }
  }

  *run(options: TerminalRunOptions = {}) {
    if (!this.activeCommand) {
      return;
    }

    const duration = options.duration ?? 0.16;
    const afterDelay = options.afterDelay ?? 0.18;
    const opacity = options.dimCommand ?? false ? 0.72 : 1;

    yield* all(
      this.activeCommand.cursorRef().opacity(0, duration),
      this.activeCommand.rowRef().opacity(opacity, duration),
    );
    yield* waitFor(afterDelay);
  }

  *print(text: string, options: TerminalPrintOptions = {}) {
    const line = this.addOutputLine(text, options.kind ?? 'normal');
    const fadeInDuration = options.fadeInDuration ?? 0.12;

    yield* line.rowRef().opacity(1, fadeInDuration);

    if (options.type) {
      const typingDelay = options.typingDelay ?? this.typingDelay * 0.55;
      let typed = '';

      for (const char of text) {
        typed += char;
        line.textRef().text(typed);
        yield* waitFor(typingDelay);
      }

      return;
    }

    line.textRef().text(text);
  }

  *highlightArg(arg: string, options: TerminalHighlightOptions = {}) {
    yield* this.highlightToken(arg, options);
  }

  *highlightToken(tokenText: string, options: TerminalHighlightOptions = {}) {
    const target = this.findCommandLine(options.command) ?? this.activeCommand;

    if (!target) {
      return;
    }

    const occurrence = options.occurrence ?? 0;
    const color = options.color ?? this.theme.amber;
    const duration = options.duration ?? 0.22;
    const hold = options.hold ?? 0;
    const restore = options.restore ?? false;
    const matches = this.matchingTokenIndexes(target, tokenText);
    const match = matches[occurrence];

    if (match === undefined) {
      return;
    }

    const tokenRef = target.tokenRefs[match];
    const originalColor = this.colorForToken(target.tokens[match]);

    yield* all(tokenRef().fill(color, duration), tokenRef().scale(1.08, duration));

    if (hold > 0) {
      yield* waitFor(hold);
    }

    if (restore) {
      yield* all(
        tokenRef().fill(originalColor, duration),
        tokenRef().scale(1, duration),
      );
    }
  }

  token(tokenText: string, options: TerminalHighlightOptions = {}) {
    const target = this.findCommandLine(options.command) ?? this.activeCommand;

    if (!target) {
      return undefined;
    }

    const occurrence = options.occurrence ?? 0;
    const matches = this.matchingTokenIndexes(target, tokenText);
    const match = matches[occurrence];

    if (match === undefined) {
      return undefined;
    }

    return target.tokenRefs[match]();
  }

  private addCommandLine(command: string): TerminalCommandLine {
    const rowRef = createRef<Layout>();
    const promptRef = createRef<Txt>();
    const cursorRef = createRef<Txt>();
    const tokenRefs: Reference<Txt>[] = [];
    const tokens = tokenizeCommand(command);

    const line: TerminalCommandLine = {
      kind: 'command',
      command,
      rowRef,
      promptRef,
      cursorRef,
      tokens,
      tokenRefs,
    };

    this.bodyRef().add(
      <Layout
        ref={rowRef}
        layout
        direction={'row'}
        gap={12}
        alignItems={'center'}
        justifyContent={'flex-start'}
        width={this.width - this.padding * 2}
        opacity={0}
      >
        <Txt
          ref={promptRef}
          text={this.prompt}
          width={this.promptWidth}
          fontFamily={'monospace'}
          fontSize={this.fontSize}
          fill={this.theme.prompt}
        />

        <Layout layout direction={'row'} gap={8} alignItems={'center'}>
          {tokens.map((token, index) => {
            const tokenRef = createRef<Txt>();
            tokenRefs[index] = tokenRef;

            return (
              <Txt
                key={`${token.text}-${index}`}
                ref={tokenRef}
                text={''}
                fontFamily={'monospace'}
                fontSize={this.fontSize}
                fill={this.colorForToken(token)}
              />
            );
          })}
          <Txt
            ref={cursorRef}
            text={'▌'}
            fontFamily={'monospace'}
            fontSize={this.fontSize}
            fill={this.theme.cursor}
          />
        </Layout>
      </Layout>,
    );

    this.lines.push(line);
    return line;
  }

  private addOutputLine(
    text: string,
    kind: TerminalPrintKind,
  ): TerminalOutputLine {
    const rowRef = createRef<Layout>();
    const textRef = createRef<Txt>();

    const line: TerminalOutputLine = {
      kind: 'output',
      text,
      rowRef,
      textRef,
    };

    this.bodyRef().add(
      <Layout
        ref={rowRef}
        layout
        direction={'row'}
        gap={12}
        alignItems={'center'}
        justifyContent={'flex-start'}
        width={this.width - this.padding * 2}
        opacity={0}
      >
        <Txt text={''} width={this.promptWidth} fontSize={this.fontSize} />
        <Txt
          ref={textRef}
          text={''}
          fontFamily={'monospace'}
          fontSize={this.fontSize * 0.78}
          fill={this.colorForPrint(kind)}
          width={this.width - this.padding * 2 - this.promptWidth - 12}
          textWrap
        />
      </Layout>,
    );

    this.lines.push(line);
    return line;
  }

  private findCommandLine(command?: string) {
    if (!command) {
      return undefined;
    }

    for (let index = this.lines.length - 1; index >= 0; index--) {
      const line = this.lines[index];

      if (line.kind === 'command' && line.command === command) {
        return line;
      }
    }

    return undefined;
  }

  private matchingTokenIndexes(line: TerminalCommandLine, tokenText: string) {
    return line.tokens.reduce<number[]>((matches, token, index) => {
      if (token.text === tokenText) {
        matches.push(index);
      }

      return matches;
    }, []);
  }

  private colorForToken(token: TerminalToken) {
    switch (token.kind) {
      case 'command':
        return this.theme.command;
      case 'flag':
        return this.theme.flag;
      case 'pipe':
      case 'operator':
        return this.theme.amberSoft;
      default:
        return this.theme.text;
    }
  }

  private colorForPrint(kind: TerminalPrintKind) {
    switch (kind) {
      case 'muted':
        return this.theme.muted;
      case 'success':
        return this.theme.success;
      case 'warning':
        return this.theme.warning;
      case 'error':
        return this.theme.error;
      default:
        return this.theme.text;
    }
  }
}

export function tokenizeCommand(command: string): TerminalToken[] {
  const parts = command.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];

  return parts.map((text, index) => ({
    text,
    kind: inferTokenKind(text, index),
  }));
}

function inferTokenKind(text: string, index: number): TerminalTokenKind {
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
