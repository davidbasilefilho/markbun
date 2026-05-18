import { z } from "zod";

import pkg from "../package.json" with { type: "json" };
import { style } from "./ansi";

export const CLI_NAME = "markbun";
const CLI_HELP_CMD = `${CLI_NAME} --help`;

const BANNER = `${style.bold(style.cyan(CLI_NAME))} ${style.dim("—")} ${style.italic("Render markdown with Bun.markdown")}`;

const USAGE = `
${BANNER}

${style.bold("USAGE")}
  ${style.cyan(CLI_NAME)} ${style.dim("[options]")} ${style.yellow("<file>")}

${style.bold("OPTIONS")}
  ${style.cyan("--html")}, ${style.cyan("-H")}         ${style.dim("Output as HTML instead of ANSI")}
  ${style.cyan("--out")}, ${style.cyan("-o")} ${style.yellow("<file>")}  ${style.dim("Write output to file instead of stdout")}
  ${style.cyan("--columns")}, ${style.cyan("-w")} ${style.yellow("<n>")} ${style.dim("Line width for wrapping")}
  ${style.cyan("--no-color")}          ${style.dim("Disable ANSI colors")}
  ${style.cyan("--hyperlinks")}        ${style.dim("Enable clickable links (OSC 8)")}
  ${style.cyan("--light")}             ${style.dim("Use light theme colors")}
  ${style.cyan("--images")}            ${style.dim("Display inline images (Kitty protocol)")}
  ${style.cyan("--collapse-whitespace")}  ${style.dim("Collapse whitespace in text")}
  ${style.cyan("--permissive-atx")}       ${style.dim("Allow ATX headers without space after #")}
  ${style.cyan("--no-indented-code")}     ${style.dim("Disable indented code blocks")}
  ${style.cyan("--no-html-blocks")}       ${style.dim("Disable HTML blocks")}
  ${style.cyan("--no-html-spans")}        ${style.dim("Disable inline HTML spans")}
  ${style.cyan("--tag-filter")}           ${style.dim("Enable GFM tag filter")}
  ${style.cyan("--version")}, ${style.cyan("-v")}      ${style.dim("Show version")}
  ${style.cyan("--help")}, ${style.cyan("-h")}         ${style.dim("Show this help")}

${style.bold("EXAMPLES")}
  ${style.dim("# Render a file to the terminal")}
  ${style.cyan(CLI_NAME)} ${style.yellow("README.md")}

  ${style.dim("# Render from stdin")}
  ${style.cyan("cat README.md | " + CLI_NAME)}

  ${style.dim("# Export to HTML")}
  ${style.cyan(CLI_NAME)} ${style.yellow("doc.md")} ${style.cyan("--html")} ${style.cyan("-o")} ${style.yellow("doc.html")}

  ${style.dim("# Fetch and render from a URL")}
  ${style.cyan(CLI_NAME)} ${style.yellow("https://raw.githubusercontent.com/.../README.md")}

  ${style.dim("# Custom width, no colors")}
  ${style.cyan(CLI_NAME)} ${style.yellow("article.md")} ${style.cyan("--columns")} ${style.yellow("60")} ${style.cyan("--no-color")}
`;

const DEFAULT_COLUMNS = 80;
const URL_PREFIXES = ["http://", "https://"] as const;

/** Check if a string is an http or https URL. */
function isUrl(value: string): boolean {
  return URL_PREFIXES.some((prefix) => value.startsWith(prefix));
}

const CliOptionsSchema = z.object({
  file: z.string().optional(),
  outputFormat: z.enum(["ansi", "html"]).default("ansi"),
  outFile: z.string().optional(),
  columns: z.number().int().positive().default(DEFAULT_COLUMNS),
  noColor: z.boolean().default(false),
  hyperlinks: z.boolean().default(false),
  light: z.boolean().default(false),
  images: z.boolean().default(false),
  version: z.boolean().default(false),
  help: z.boolean().default(false),
  collapseWhitespace: z.boolean().default(false),
  permissiveAtxHeaders: z.boolean().default(false),
  noIndentedCodeBlocks: z.boolean().default(false),
  noHtmlBlocks: z.boolean().default(false),
  noHtmlSpans: z.boolean().default(false),
  tagFilter: z.boolean().default(false),
});

/** Parsed CLI options after validation. */
export type CliOptions = z.infer<typeof CliOptionsSchema>;

/** Print help text and exit. */
export function printHelp(): void {
  console.log(USAGE);
}

/** Print version and exit. */
export function printVersion(): void {
  console.log(pkg.version);
}

function formatValidationError(message: string): string {
  return `${style.red(CLI_NAME + ": error")}\n  ${style.yellow(message)}\n\n  For usage information, run: ${style.cyan(CLI_HELP_CMD)}`;
}

function formatFileNotFound(file: string): string {
  return `${style.red(CLI_NAME + ": error")}\n  ${style.yellow("file not found")}: ${style.bold(file)}\n\n  For usage information, run: ${style.cyan(CLI_HELP_CMD)}`;
}

function formatFetchError(url: string, detail: string): string {
  return `${style.red(CLI_NAME + ": error")}\n  ${style.yellow("failed to fetch")} ${style.bold(url)}\n  ${style.yellow(detail)}\n\n  For usage information, run: ${style.cyan(CLI_HELP_CMD)}`;
}

/** Format error message when no input source is provided. */
export function formatNoInput(): string {
  return `${style.red(CLI_NAME + ": error")}\n  ${style.yellow("no input provided. Pass a file or pipe markdown via stdin.")}\n\n  For usage information, run: ${style.cyan(CLI_HELP_CMD)}`;
}

/** Parse CLI arguments into structured options with zod validation. */
export function parseArgs(argv: string[]): CliOptions {
  const options: Record<string, unknown> = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;

    switch (arg) {
      case "--html":
      case "-H":
        options.outputFormat = "html";
        break;
      case "--out":
      case "-o": {
        i++;
        options.outFile = argv[i];
        break;
      }
      case "--columns":
      case "-w": {
        i++;
        options.columns = parseInt(argv[i] ?? "", 10);
        break;
      }
      case "--no-color":
        options.noColor = true;
        break;
      case "--hyperlinks":
        options.hyperlinks = true;
        break;
      case "--light":
        options.light = true;
        break;
      case "--images":
        options.images = true;
        break;
      case "--collapse-whitespace":
        options.collapseWhitespace = true;
        break;
      case "--permissive-atx":
        options.permissiveAtxHeaders = true;
        break;
      case "--no-indented-code":
        options.noIndentedCodeBlocks = true;
        break;
      case "--no-html-blocks":
        options.noHtmlBlocks = true;
        break;
      case "--no-html-spans":
        options.noHtmlSpans = true;
        break;
      case "--tag-filter":
        options.tagFilter = true;
        break;
      case "--version":
      case "-v":
        options.version = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        if (!arg.startsWith("-")) {
          options.file = arg;
        } else {
          throw new Error(formatValidationError(`Unknown flag: ${arg}`));
        }
        break;
    }
  }

  const result = CliOptionsSchema.safeParse(options);
  if (!result.success) {
    const first = result.error.issues[0];
    const message = first ? `${first.path.join(".")}: ${first.message}` : "Invalid arguments";
    throw new Error(formatValidationError(message));
  }

  return result.data;
}

/** Fetch markdown content from a URL. */
async function fetchUrl(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error: unknown) {
    const detail = error instanceof TypeError ? "unable to reach server" : String(error);
    throw new Error(formatFetchError(url, detail));
  }

  if (!response.ok) {
    throw new Error(formatFetchError(url, `HTTP ${response.status} ${response.statusText}`));
  }

  return await response.text();
}

/** Read markdown input from a file, URL, or stdin. */
export async function readInput(file?: string): Promise<string> {
  if (file) {
    if (isUrl(file)) {
      return await fetchUrl(file);
    }
    const fileRef = Bun.file(file);
    if (!(await fileRef.exists())) {
      throw new Error(formatFileNotFound(file));
    }
    return await fileRef.text();
  }

  if (process.stdin.isTTY) {
    return "";
  }

  return await Bun.stdin.text();
}
