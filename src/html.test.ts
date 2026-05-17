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
});
