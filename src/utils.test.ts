import { describe, expect, test } from "bun:test";

import pkg from "../package.json" with { type: "json" };
import { parseArgs, printVersion, readInput } from "./utils";

describe("parseArgs", () => {
  test("returns defaults with no arguments", () => {
    const opts = parseArgs([]);
    expect(opts).toEqual({
      outputFormat: "ansi",
      columns: 80,
      noColor: false,
      hyperlinks: false,
      light: false,
      images: false,
      version: false,
      help: false,
      file: undefined,
      outFile: undefined,
    });
  });

  test("parses --html", () => {
    const opts = parseArgs(["--html"]);
    expect(opts.outputFormat).toBe("html");
  });

  test("parses -H", () => {
    const opts = parseArgs(["-H"]);
    expect(opts.outputFormat).toBe("html");
  });

  test("parses --out with file path", () => {
    const opts = parseArgs(["--out", "output.html"]);
    expect(opts.outFile).toBe("output.html");
  });

  test("parses -o with file path", () => {
    const opts = parseArgs(["-o", "out.html"]);
    expect(opts.outFile).toBe("out.html");
  });

  test("parses --columns with value", () => {
    const opts = parseArgs(["--columns", "60"]);
    expect(opts.columns).toBe(60);
  });

  test("parses -w with value", () => {
    const opts = parseArgs(["-w", "40"]);
    expect(opts.columns).toBe(40);
  });

  test("throws on non-numeric --columns value", () => {
    expect(() => parseArgs(["--columns", "abc"])).toThrow();
  });

  test("parses --no-color", () => {
    const opts = parseArgs(["--no-color"]);
    expect(opts.noColor).toBe(true);
  });

  test("parses --hyperlinks", () => {
    const opts = parseArgs(["--hyperlinks"]);
    expect(opts.hyperlinks).toBe(true);
  });

  test("parses --light", () => {
    const opts = parseArgs(["--light"]);
    expect(opts.light).toBe(true);
  });

  test("parses --images", () => {
    const opts = parseArgs(["--images"]);
    expect(opts.images).toBe(true);
  });

  test("parses --version", () => {
    const opts = parseArgs(["--version"]);
    expect(opts.version).toBe(true);
  });

  test("parses -v", () => {
    const opts = parseArgs(["-v"]);
    expect(opts.version).toBe(true);
  });

  test("parses --help", () => {
    const opts = parseArgs(["--help"]);
    expect(opts.help).toBe(true);
  });

  test("parses -h", () => {
    const opts = parseArgs(["-h"]);
    expect(opts.help).toBe(true);
  });

  test("parses file argument", () => {
    const opts = parseArgs(["README.md"]);
    expect(opts.file).toBe("README.md");
  });

  test("detects URL as positional argument", () => {
    const opts = parseArgs(["https://example.com/doc.md"]);
    expect(opts.file).toBe("https://example.com/doc.md");
  });

  test("combines flags correctly", () => {
    const opts = parseArgs(["--html", "--light", "--hyperlinks", "doc.md"]);
    expect(opts.outputFormat).toBe("html");
    expect(opts.light).toBe(true);
    expect(opts.hyperlinks).toBe(true);
    expect(opts.file).toBe("doc.md");
    expect(opts.columns).toBe(80);
  });

  test("parses file before flags", () => {
    const opts = parseArgs(["doc.md", "--html"]);
    expect(opts.file).toBe("doc.md");
    expect(opts.outputFormat).toBe("html");
  });

  test("throws on unknown flag", () => {
    expect(() => parseArgs(["--unknown"])).toThrow("Unknown flag");
  });

  test("throws on invalid column value of zero", () => {
    expect(() => parseArgs(["--columns", "0"])).toThrow("columns");
  });

  test("throws on negative column value", () => {
    expect(() => parseArgs(["--columns", "-1"])).toThrow("columns");
  });
});

describe("printVersion", () => {
  test("prints version from package.json", () => {
    const consoleSpy = new ConsoleSpy();
    const originalLog = console.log;
    console.log = consoleSpy.log.bind(consoleSpy);

    try {
      printVersion();
      expect(consoleSpy.output().trim()).toBe(pkg.version);
    } finally {
      console.log = originalLog;
    }
  });
});

describe("readInput", () => {
  test("reads from file", async () => {
    const content = await readInput("README.md");
    expect(content).toContain("# markbun");
  });

  test("throws on nonexistent file", async () => {
    try {
      await readInput("nonexistent-file-12345.md");
    } catch {
      // readInput checks existence first and throws formatted error
    }
  });

  test("fetches markdown from URL", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response("# Remote Markdown")) as unknown as typeof globalThis.fetch;

    try {
      const result = await readInput("https://example.com/doc.md");
      expect(result).toBe("# Remote Markdown");
    } finally {
      globalThis.fetch = original;
    }
  });

  test("throws on HTTP error status", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response("Not Found", {
        status: 404,
        statusText: "Not Found",
      })) as unknown as typeof globalThis.fetch;

    try {
      await readInput("https://example.com/missing.md");
    } catch (error: unknown) {
      const msg = (error as Error).message;
      expect(msg).toContain("markbun: error");
      expect(msg).toContain("failed to fetch");
      expect(msg).toContain("https://example.com/missing.md");
      expect(msg).toContain("HTTP 404 Not Found");
      return;
    } finally {
      globalThis.fetch = original;
    }
    expect.unreachable();
  });

  test("throws on network error", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof globalThis.fetch;

    try {
      await readInput("https://example.com/error.md");
    } catch (error: unknown) {
      const msg = (error as Error).message;
      expect(msg).toContain("markbun: error");
      expect(msg).toContain("failed to fetch");
      expect(msg).toContain("https://example.com/error.md");
      expect(msg).toContain("unable to reach server");
      return;
    } finally {
      globalThis.fetch = original;
    }
    expect.unreachable();
  });
});

class ConsoleSpy {
  private lines: string[] = [];

  log(...args: unknown[]): void {
    this.lines.push(args.map(String).join(" "));
  }

  output(): string {
    return this.lines.join("\n");
  }
}
