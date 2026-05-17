#!/usr/bin/env bun
import { renderToAnsi, renderToPlain, style } from "./ansi";
import { renderToHtml } from "./html";
import { parseArgs, printHelp, printVersion, readInput } from "./utils";

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  if (opts.version) {
    printVersion();
    process.exit(0);
  }

  const markdown = await readInput(opts.file);

  if (!markdown.trim()) {
    console.error(style.yellow("No markdown content to render."));
    process.exit(1);
  }

  let output: string;

  if (opts.outputFormat === "html") {
    output = renderToHtml(markdown);
  } else if (opts.noColor) {
    output = renderToPlain(markdown);
  } else {
    output = renderToAnsi(markdown, {
      columns: opts.columns,
      hyperlinks: opts.hyperlinks,
      light: opts.light,
      kittyGraphics: opts.images,
    });
  }

  if (opts.outFile) {
    await Bun.write(opts.outFile, output);
    console.error(style.green(`Written to ${style.bold(opts.outFile)}`));
  } else {
    process.stdout.write(output);
  }
}

main().catch((err: unknown) => {
  if (err instanceof Error && err.message.startsWith(style.red("markbun: error"))) {
    console.error(err.message);
  } else {
    console.error(style.red("Error:"), err instanceof Error ? err.message : String(err));
  }
  process.exit(1);
});
