import { describe, expect, test } from "bun:test";

import { renderToHtml } from "./html";

describe("renderToHtml", () => {
  test("renders heading to HTML", () => {
    const result = renderToHtml("# Hello");
    expect(result).toContain("<h1>");
    expect(result).toContain("Hello");
  });

  test("renders bold text", () => {
    const result = renderToHtml("**bold**");
    expect(result).toContain("<strong>");
    expect(result).toContain("bold");
  });

  test("renders empty string", () => {
    expect(renderToHtml("")).toBe("");
  });

  test("renders paragraph", () => {
    const result = renderToHtml("Hello world");
    expect(result).toContain("<p>");
    expect(result).toContain("Hello world");
  });

  test("renders code block with language", () => {
    const result = renderToHtml("```ts\nconst x = 1;\n```");
    expect(result).toContain("<pre><code");
    expect(result).toContain("const x = 1");
  });

  test("renders unordered list", () => {
    const result = renderToHtml("- item one\n- item two");
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>");
    expect(result).toContain("item one");
  });

  test("collapseWhitespace option is accepted", () => {
    const result = renderToHtml("Hello   world", { collapseWhitespace: true });
    expect(result).toContain("Hello");
  });

  test("permissiveAtxHeaders allows headers without space after #", () => {
    const result = renderToHtml("#Hello", { permissiveAtxHeaders: true });
    expect(result).toContain("<h1>");
  });

  test("noIndentedCodeBlocks disables indented code blocks", () => {
    const result = renderToHtml("    code", { noIndentedCodeBlocks: true });
    expect(result).not.toContain("<pre><code");
  });

  test("noHtmlBlocks prevents raw HTML block parsing", () => {
    const result = renderToHtml("<div>hello</div>", { noHtmlBlocks: true });
    // When noHtmlBlocks is true, HTML is not treated as raw block — gets wrapped in <p>
    expect(result).toContain("<p>");
  });

  test("noHtmlSpans disables inline HTML", () => {
    const result = renderToHtml("Hello <b>world</b>", { noHtmlSpans: true });
    expect(result).not.toContain("<b>");
  });

  test("tagFilter enables GFM tag filter", () => {
    const result = renderToHtml("<script>alert(1)</script>", { tagFilter: true });
    expect(result).not.toContain("<script>");
  });
});
