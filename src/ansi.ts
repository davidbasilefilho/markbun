import type { markdown } from "bun";

type AnsiTheme = markdown.AnsiTheme;

/** ANSI styling helpers for CLI chrome (help text, etc.) */
const style = {
  bold: (s: string) => `\x1b[1m${s}\x1b[22m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[22m`,
  italic: (s: string) => `\x1b[3m${s}\x1b[23m`,
  underline: (s: string) => `\x1b[4m${s}\x1b[24m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[39m`,
  green: (s: string) => `\x1b[32m${s}\x1b[39m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[39m`,
  red: (s: string) => `\x1b[31m${s}\x1b[39m`,
  magenta: (s: string) => `\x1b[35m${s}\x1b[39m`,
  reset: (s: string) => `\x1b[0m${s}\x1b[0m`,
};

export interface RenderOptions {
  /** Line width for wrapping (0 = no wrap) */
  columns?: number;
  /** Disable ANSI colors */
  colors?: boolean;
  /** Enable clickable OSC 8 hyperlinks */
  hyperlinks?: boolean;
  /** Use light theme colors */
  light?: boolean;
  /** Display inline images via Kitty Graphics Protocol */
  kittyGraphics?: boolean;
}

/** Build an ANSI theme from partial render options. */
function buildTheme(opts: RenderOptions = {}): AnsiTheme {
  return {
    colors: opts.colors,
    hyperlinks: opts.hyperlinks,
    light: opts.light,
    columns: opts.columns,
    kittyGraphics: opts.kittyGraphics,
  };
}

/**
 * Render markdown to an ANSI-formatted terminal string.
 *
 * Uses Bun's built-in `Bun.markdown.ansi()` for rich formatting with syntax-highlighted code
 * blocks, styled tables, and proper indentation.
 */
export function renderToAnsi(markdown: string, opts: RenderOptions = {}): string {
  const theme = buildTheme(opts);
  return Bun.markdown.ansi(markdown, theme);
}

/** Render markdown to plain text (no ANSI codes, no box drawing). */
export function renderToPlain(markdown: string): string {
  return Bun.markdown.ansi(markdown, { colors: false });
}

export { style };
