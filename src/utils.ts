import { z } from "zod";

import pkg from "../package.json" with { type: "json" };
import { style } from "./ansi";

const BANNER = `${style.bold(style.cyan("markbun"))} ${style.dim("—")} ${style.italic("Render markdown with Bun.markdown")}`;

const USAGE = `
${BANNER}

${style.bold("USAGE")}
  ${style.cyan("markbun")} ${style.dim("[options]")} ${style.yellow("<file>")}

${style.bold("OPTIONS")}
  ${style.cyan("--html")}, ${style.cyan("-H")}         ${style.dim("Output as HTML instead of ANSI")}
  ${style.cyan("--out")}, ${style.cyan("-o")} ${style.yellow("<file>")}  ${style.dim("Write output to file instead of stdout")}
  ${style.cyan("--columns")}, ${style.cyan("-w")} ${style.yellow("<n>")} ${style.dim("Line width for wrapping")}
  ${style.cyan("--no-color")}          ${style.dim("Disable ANSI colors")}
  ${style.cyan("--hyperlinks")}        ${style.dim("Enable clickable links (OSC 8)")}
  ${style.cyan("--light")}             ${style.dim("Use light theme colors")}
  ${style.cyan("--images")}            ${style.dim("Display inline images (Kitty protocol)")}
  ${style.cyan("--version")}, ${style.cyan("-v")}      ${style.dim("Show version")}
  ${style.cyan("--help")}, ${style.cyan("-h")}         ${style.dim("Show this help")}

${style.bold("EXAMPLES")}
  ${style.dim("# Render a file to the terminal")}
  ${style.cyan("markbun")} ${style.yellow("README.md")}

  ${style.dim("# Render from stdin")}
  ${style.cyan("cat README.md | markbun")}

  ${style.dim("# Export to HTML")}
  ${style.cyan("markbun")} ${style.yellow("doc.md")} ${style.cyan("--html")} ${style.cyan("-o")} ${style.yellow("doc.html")}

  ${style.dim("# Custom width, no colors")}
  ${style.cyan("markbun")} ${style.yellow("article.md")} ${style.cyan("--columns")} ${style.yellow("60")} ${style.cyan("--no-color")}
`;

const DEFAULT_COLUMNS = 80;

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
});

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
  return `${style.red("markbun: error")}\n  ${style.yellow(message)}\n\n  For usage information, run: ${style.cyan("markbun --help")}`;
}

/** Parse CLI arguments into structured options with zod validation. */
export function parseArgs(argv: string[]): CliOptions {
  const options: Record<string, unknown> = {
    outputFormat: "ansi",
    columns: DEFAULT_COLUMNS,
    noColor: false,
    hyperlinks: false,
    light: false,
    images: false,
    version: false,
    help: false,
  };

  const args = argv;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;

    switch (arg) {
      case "--html":
      case "-H":
        options.outputFormat = "html";
        break;
      case "--out":
      case "-o": {
        i++;
        options.outFile = args[i];
        break;
      }
      case "--columns":
      case "-w": {
        i++;
        options.columns = parseInt(args[i] ?? "", 10);
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

/** Read markdown input from a file or stdin. */
export async function readInput(file?: string): Promise<string> {
  if (file) {
    return await Bun.file(file).text();
  }

  return await Bun.stdin.text();
}
