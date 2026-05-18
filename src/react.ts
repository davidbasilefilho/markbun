import type { markdown } from "bun";

/** Props for heading components. */
export interface HeadingProps {
  children: unknown[];
  id?: string;
}

/** Props for ordered list components. */
export interface OrderedListProps {
  children: unknown[];
  start: number;
}

/** Props for list item components. */
export interface ListItemProps {
  children: unknown[];
  checked?: boolean;
}

/** Props for code block components. */
export interface CodeBlockProps {
  children: unknown[];
  language?: string;
}

/** Props for table cell components. */
export interface CellProps {
  children: unknown[];
  align?: "left" | "center" | "right";
}

/** Props for link components. */
export interface LinkProps {
  children: unknown[];
  href: string;
  title?: string;
}

/** Props for image components. */
export interface ImageProps {
  src: string;
  alt?: string;
  title?: string;
}

/** Generic children-only props. */
export interface ChildrenProps {
  children: unknown[];
}

/** Component overrides for `renderToReact()`. Maps HTML tag names to custom React components. */
export interface ReactComponents {
  h1?: markdown.Component<HeadingProps>;
  h2?: markdown.Component<HeadingProps>;
  h3?: markdown.Component<HeadingProps>;
  h4?: markdown.Component<HeadingProps>;
  h5?: markdown.Component<HeadingProps>;
  h6?: markdown.Component<HeadingProps>;
  p?: markdown.Component<ChildrenProps>;
  blockquote?: markdown.Component<ChildrenProps>;
  ul?: markdown.Component<ChildrenProps>;
  ol?: markdown.Component<OrderedListProps>;
  li?: markdown.Component<ListItemProps>;
  pre?: markdown.Component<CodeBlockProps>;
  hr?: markdown.Component<{}>;
  html?: markdown.Component<ChildrenProps>;
  table?: markdown.Component<ChildrenProps>;
  thead?: markdown.Component<ChildrenProps>;
  tbody?: markdown.Component<ChildrenProps>;
  tr?: markdown.Component<ChildrenProps>;
  th?: markdown.Component<CellProps>;
  td?: markdown.Component<CellProps>;
  em?: markdown.Component<ChildrenProps>;
  strong?: markdown.Component<ChildrenProps>;
  a?: markdown.Component<LinkProps>;
  img?: markdown.Component<ImageProps>;
  code?: markdown.Component<ChildrenProps>;
  del?: markdown.Component<ChildrenProps>;
  math?: markdown.Component<ChildrenProps>;
  u?: markdown.Component<ChildrenProps>;
  br?: markdown.Component<{}>;
}

/** Options for react rendering — parser options + reactVersion. */
export interface ReactOptions {
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
  reactVersion?: 18 | 19;
}

/**
 * Render markdown to React JSX elements.
 *
 * Uses `Bun.markdown.react()` under the hood. Returns a React Fragment containing the parsed
 * markdown as children.
 *
 * @example
 *   ```ts
 *   const el = renderToReact("# Hello **world**");
 *   ```;
 *
 * @param markdown - The markdown string to render
 * @param components - Optional component overrides keyed by HTML tag name
 * @param options - Parser options and element symbol configuration
 * @returns A React Fragment element
 */
export function renderToReact(
  markdown: string,
  components?: ReactComponents,
  options?: ReactOptions,
): unknown {
  return Bun.markdown.react(
    markdown,
    components as unknown as markdown.ComponentOverrides,
    options as unknown as markdown.ReactOptions,
  );
}
