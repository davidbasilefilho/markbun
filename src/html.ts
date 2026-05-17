import type { markdown } from "bun";

type Options = markdown.Options;

export interface HtmlOptions {
  /** Enable GFM tables */
  tables?: boolean;
  /** Enable GFM strikethrough */
  strikethrough?: boolean;
  /** Enable GFM task lists */
  tasklists?: boolean;
  /** Treat soft breaks as hard breaks */
  hardSoftBreaks?: boolean;
  /** Enable wiki links (`[[target]]`) */
  wikiLinks?: boolean;
  /** Enable underline (`__text__` → `<u>`) */
  underline?: boolean;
  /** Enable LaTeX math */
  latexMath?: boolean;
  /** Enable heading IDs and autolinks */
  headings?: boolean | { ids?: boolean; autolink?: boolean };
  /** Enable autolinks */
  autolinks?: boolean | { url?: boolean; www?: boolean; email?: boolean };
}

/** Build parser options from partial HTML options. */
function buildOptions(opts: HtmlOptions = {}): Options {
  return {
    tables: opts.tables,
    strikethrough: opts.strikethrough,
    tasklists: opts.tasklists,
    hardSoftBreaks: opts.hardSoftBreaks,
    wikiLinks: opts.wikiLinks,
    underline: opts.underline,
    latexMath: opts.latexMath,
    headings: opts.headings,
    autolinks: opts.autolinks,
  };
}

/**
 * Render markdown to an HTML string.
 *
 * Uses `Bun.markdown.html()` which supports GitHub Flavored Markdown extensions out of the box.
 */
export function renderToHtml(markdown: string, opts: HtmlOptions = {}): string {
  return Bun.markdown.html(markdown, buildOptions(opts));
}
