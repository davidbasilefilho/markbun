import type { markdown } from "bun";

/** Meta passed to the heading callback. */
export interface HeadingMeta {
  level: number;
  id?: string;
}

/** Meta passed to the code callback. */
export interface CodeBlockMeta {
  language?: string;
}

/** Meta passed to the list callback. */
export interface ListMeta {
  ordered: boolean;
  start?: number;
  depth: number;
}

/** Meta passed to the listItem callback. */
export interface ListItemMeta {
  index: number;
  depth: number;
  ordered: boolean;
  start?: number;
  checked?: boolean;
}

/** Meta passed to th/td callbacks. */
export interface CellMeta {
  align?: "left" | "center" | "right";
}

/** Meta passed to the link callback. */
export interface LinkMeta {
  href: string;
  title?: string;
}

/** Meta passed to the image callback. */
export interface ImageMeta {
  src: string;
  title?: string;
}

/** Custom rendering callbacks for each markdown element type. */
export interface RenderCallbacks {
  heading?: (children: string, meta: HeadingMeta) => string | null | undefined;
  paragraph?: (children: string) => string | null | undefined;
  blockquote?: (children: string) => string | null | undefined;
  code?: (children: string, meta?: CodeBlockMeta) => string | null | undefined;
  list?: (children: string, meta: ListMeta) => string | null | undefined;
  listItem?: (children: string, meta: ListItemMeta) => string | null | undefined;
  hr?: (children: string) => string | null | undefined;
  table?: (children: string) => string | null | undefined;
  thead?: (children: string) => string | null | undefined;
  tbody?: (children: string) => string | null | undefined;
  tr?: (children: string) => string | null | undefined;
  th?: (children: string, meta?: CellMeta) => string | null | undefined;
  td?: (children: string, meta?: CellMeta) => string | null | undefined;
  html?: (children: string) => string | null | undefined;
  strong?: (children: string) => string | null | undefined;
  emphasis?: (children: string) => string | null | undefined;
  link?: (children: string, meta: LinkMeta) => string | null | undefined;
  image?: (children: string, meta: ImageMeta) => string | null | undefined;
  codespan?: (children: string) => string | null | undefined;
  strikethrough?: (children: string) => string | null | undefined;
  text?: (text: string) => string | null | undefined;
}

/** Parser options for render(). */
export interface RenderOptions {
  tables?: boolean;
  strikethrough?: boolean;
  tasklists?: boolean;
  hardSoftBreaks?: boolean;
  wikiLinks?: boolean;
  underline?: boolean;
  latexMath?: boolean;
  collapseWhitespace?: boolean;
  permissiveAtxHeaders?: boolean;
  noIndentedCodeBlocks?: boolean;
  noHtmlBlocks?: boolean;
  noHtmlSpans?: boolean;
  tagFilter?: boolean;
  autolinks?: boolean | { url?: boolean; www?: boolean; email?: boolean };
  headings?: boolean | { ids?: boolean; autolink?: boolean };
}

/**
 * Render markdown with custom callback handlers for each element type.
 *
 * Uses `Bun.markdown.render()` under the hood. Each callback receives the accumulated children as a
 * string and optional metadata, and returns a string. Return `null` or `undefined` to omit the
 * element.
 *
 * @example
 *   ```ts
 *   const html = render("# Hello", {
 *   heading: (children, { level }) => `<h${level}>${children}</h${level}>`,
 *   paragraph: (children) => `<p>${children}</p>`,
 *   });
 *   ```
 *
 * @param markdown - The markdown string to render
 * @param callbacks - Callback functions for each element type
 * @param options - Parser options passed through to Bun
 * @returns The rendered string
 */
export function render(
  markdown: string,
  callbacks?: RenderCallbacks,
  options?: RenderOptions,
): string {
  return Bun.markdown.render(
    markdown,
    callbacks as markdown.RenderCallbacks,
    options as unknown as markdown.Options,
  );
}
