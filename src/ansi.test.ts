import { describe, expect, test } from "bun:test";

import { renderToAnsi, renderToPlain, style } from "./ansi";

describe("renderToPlain", () => {
  test("renders markdown without ANSI codes", () => {
    const result = renderToPlain("# Hello");
    expect(result).not.toContain("\x1b[");
    expect(result).toContain("Hello");
  });

  test("renders multiple paragraphs", () => {
    const result = renderToPlain("Line one\n\nLine two");
    expect(result).toContain("Line one");
    expect(result).toContain("Line two");
  });

  test("renders empty string", () => {
    expect(renderToPlain("")).toBe("");
  });
});

describe("renderToAnsi", () => {
  test("renders markdown with ANSI codes by default", () => {
    const result = renderToAnsi("# Hello");
    expect(result).toContain("Hello");
  });

  test("respects columns option", () => {
    const result = renderToAnsi("# Narrow", { columns: 20 });
    expect(result).toContain("Narrow");
  });

  test("renders empty string", () => {
    expect(renderToAnsi("")).toBe("");
  });
});

describe("style", () => {
  test("bold wraps text in ANSI bold sequences", () => {
    expect(style.bold("text")).toBe("\x1b[1mtext\x1b[22m");
  });

  test("dim wraps text in ANSI dim sequences", () => {
    expect(style.dim("text")).toBe("\x1b[2mtext\x1b[22m");
  });

  test("green wraps text in ANSI green sequences", () => {
    expect(style.green("text")).toBe("\x1b[32mtext\x1b[39m");
  });

  test("red wraps text in ANSI red sequences", () => {
    expect(style.red("text")).toBe("\x1b[31mtext\x1b[39m");
  });

  test("reset wraps text in ANSI reset sequences", () => {
    expect(style.reset("text")).toBe("\x1b[0mtext\x1b[0m");
  });
});
