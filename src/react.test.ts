import { describe, expect, test } from "bun:test";

import { renderToReact } from "./react";

describe("renderToReact", () => {
  test("returns something for simple markdown", () => {
    const result = renderToReact("# Hello");
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  test("returns something for paragraph", () => {
    const result = renderToReact("Hello world");
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  test("returns something for complex markdown", () => {
    const result = renderToReact("# A\n\n**bold**\n\n- item");
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  test("accepts reactVersion 18 option", () => {
    const result = renderToReact("Hello", undefined, { reactVersion: 18 });
    expect(result).toBeDefined();
  });

  test("returns something for tables", () => {
    const result = renderToReact("| A | B |\n|---|---|\n| 1 | 2 |");
    expect(result).toBeDefined();
  });

  test("returns something for code blocks", () => {
    const result = renderToReact("```ts\nconst x = 1;\n```");
    expect(result).toBeDefined();
  });

  test("returns something for links", () => {
    const result = renderToReact("[Bun](https://bun.sh)");
    expect(result).toBeDefined();
  });

  test("accepts component overrides", () => {
    function CustomH1(props: { children: unknown[] }) {
      return { type: "h1", props };
    }
    const result = renderToReact("# Hello", { h1: CustomH1 });
    expect(result).toBeDefined();
  });

  test("empty string returns something", () => {
    const result = renderToReact("");
    expect(result).toBeDefined();
  });

  test("strikethrough rendering", () => {
    const result = renderToReact("~~struck~~");
    expect(result).toBeDefined();
  });

  test("task list rendering", () => {
    const result = renderToReact("- [x] done\n- [ ] todo");
    expect(result).toBeDefined();
  });
});
