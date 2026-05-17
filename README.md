# markbun

**Render markdown beautifully in your terminal** — powered by Bun's native [`Bun.markdown`](https://bun.sh/docs/runtime/markdown) engine.

No extra dependencies. Fast. ANSI-colored terminal output and HTML export.

## Install

```bash
# via npm
npm install -g markbun

# or with bun
bun install -g markbun

# or directly from source
bun link
```

## Usage

```bash
# Render a file to the terminal
markbun README.md

# Render from stdin
cat README.md | markbun

# Export to HTML
markbun doc.md --html -o doc.html

# Custom line width
markbun article.md --columns 60

# Disable colors (plain text)
markbun README.md --no-color

# Enable clickable links
markbun README.md --hyperlinks

# Light terminal theme
markbun README.md --light
```

## Options

| Flag                  | Description                            |
| --------------------- | -------------------------------------- |
| `--html`, `-H`        | Output as HTML instead of ANSI         |
| `--out`, `-o <file>`  | Write output to file                   |
| `--columns`, `-w <n>` | Line width for wrapping (default: 80)  |
| `--no-color`          | Disable ANSI colors                    |
| `--hyperlinks`        | Enable clickable OSC 8 hyperlinks      |
| `--light`             | Use light terminal theme colors        |
| `--images`            | Display inline images (Kitty protocol) |
| `--version`, `-v`     | Show version                           |
| `--help`, `-h`        | Show help                              |

## Features

- **Terminal rendering** via `Bun.markdown.ansi()` — headings, lists, tables, code blocks with syntax highlighting, blockquotes, links, images, and horizontal rules
- **HTML export** via `Bun.markdown.html()` — GitHub Flavored Markdown support (tables, strikethrough, task lists)
- **Stdin support** — pipe markdown directly into the tool
- **Zero extra dependencies** — everything comes from Bun's standard library

## Development

```bash
# Install dependencies
bun install

# Run in development
bun start -- README.md

# Lint and format
bun run check

# Build for distribution (JavaScript)
bun run build

# Build a standalone executable
bun run build:compile
```

The `build:compile` script creates a native binary (`markbun`) for the current platform using Bun's `--compile` flag.

## Publishing

```bash
bun run build
npm publish
```

The `prepublishOnly` hook runs the build automatically.

## License

Apache 2.0
