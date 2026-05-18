import { describe, expect, test } from "bun:test";

import { render } from "./render";

describe("render", () => {
  test("heading callback receives level metadata", () => {
    const result = render("# Hello", {
      heading: (children, { level }) => `<h${level}>${children}</h${level}>`,
    });
    expect(result).toBe("<h1>Hello</h1>");
  });

  test("heading level 2", () => {
    const result = render("## Hello", {
      heading: (children, { level }) => `<h${level}>${children}</h${level}>`,
    });
    expect(result).toBe("<h2>Hello</h2>");
  });

  test("paragraph callback wraps text", () => {
    const result = render("Hello world", {
      paragraph: (children) => `<p>${children}</p>`,
    });
    expect(result).toBe("<p>Hello world</p>");
  });

  test("strong callback renders bold", () => {
    const result = render("**bold**", {
      strong: (children) => `<b>${children}</b>`,
    });
    expect(result).toBe("<b>bold</b>");
  });

  test("emphasis callback renders italic", () => {
    const result = render("*italic*", {
      emphasis: (children) => `<i>${children}</i>`,
    });
    expect(result).toBe("<i>italic</i>");
  });

  test("code callback receives language", () => {
    const result = render("```ts\nconst x = 1;\n```", {
      code: (children, meta) => `<pre lang="${meta?.language ?? ""}">${children}</pre>`,
    });
    expect(result).toContain('lang="ts"');
    expect(result).toContain("const x = 1");
  });

  test("link callback receives href", () => {
    const result = render("[Bun](https://bun.sh)", {
      link: (children, { href }) => `<a href="${href}">${children}</a>`,
    });
    expect(result).toBe('<a href="https://bun.sh">Bun</a>');
  });

  test("image callback receives src", () => {
    const result = render("![alt](img.png)", {
      image: (children, { src }) => `<img src="${src}" />`,
    });
    expect(result).toBe('<img src="img.png" />');
  });

  test("strikethrough callback", () => {
    const result = render("~~struck~~", {
      strikethrough: (children) => `<del>${children}</del>`,
    });
    expect(result).toBe("<del>struck</del>");
  });

  test("list callback receives ordered metadata", () => {
    const result = render("1. one\n2. two", {
      list: (children, { ordered }) => (ordered ? `<ol>${children}</ol>` : `<ul>${children}</ul>`),
      listItem: (children) => `<li>${children}</li>`,
    });
    expect(result).toBe("<ol><li>one</li><li>two</li></ol>");
  });

  test("unordered list", () => {
    const result = render("- one\n- two", {
      list: (children, { ordered }) => (ordered ? `<ol>${children}</ol>` : `<ul>${children}</ul>`),
      listItem: (children) => `<li>${children}</li>`,
    });
    expect(result).toBe("<ul><li>one</li><li>two</li></ul>");
  });

  test("blockquote callback", () => {
    const result = render("> quote", {
      blockquote: (children) => `<blockquote>${children}</blockquote>`,
    });
    expect(result).toBe("<blockquote>quote</blockquote>");
  });

  test("hr callback", () => {
    const result = render("---", {
      hr: () => "<hr />",
    });
    expect(result).toBe("<hr />");
  });

  test("codespan callback", () => {
    const result = render("`code`", {
      codespan: (children) => `<code>${children}</code>`,
    });
    expect(result).toBe("<code>code</code>");
  });

  test("returning null omits element", () => {
    const result = render("# Title\n\nText", {
      heading: () => null,
      paragraph: (children) => children + "\n",
    });
    expect(result).not.toContain("Title");
    expect(result).toContain("Text");
  });

  test("passes options to Bun markdown parser", () => {
    const result = render(
      "http://www.example.com",
      {
        link: (children, { href }) => `<a href="${href}">${children}</a>`,
      },
      { autolinks: { url: true } },
    );
    expect(result).toBe('<a href="http://www.example.com">http://www.example.com</a>');
  });

  test("unregistered callbacks pass through children", () => {
    const result = render("Hello **world**", {
      paragraph: (children) => `<p>${children}</p>`,
    });
    // strong callback not registered; Bun processes ** internally
    expect(result).toBe("<p>Hello world</p>");
  });

  test("empty string returns empty string", () => {
    expect(render("")).toBe("");
  });

  test("table rendering with callbacks", () => {
    const result = render("| A | B |\n|---|---|\n| 1 | 2 |", {
      table: (children) => `<table>${children}</table>`,
      thead: (children) => `<thead>${children}</thead>`,
      tbody: (children) => `<tbody>${children}</tbody>`,
      tr: (children) => `<tr>${children}</tr>`,
      th: (children) => `<th>${children}</th>`,
      td: (children) => `<td>${children}</td>`,
    });
    expect(result).toContain("<table>");
    expect(result).toContain("<thead>");
    expect(result).toContain("<tbody>");
    expect(result).toContain("<th>A</th>");
    expect(result).toContain("<td>1</td>");
  });

  test("task list marker callback", () => {
    const result = render("- [x] done\n- [ ] todo", {
      listItem: (children, { checked }) => {
        const marker = checked ? "[x]" : "[ ]";
        return `<li>${marker} ${children}</li>`;
      },
    });
    expect(result).toContain("[x] done");
    expect(result).toContain("[ ] todo");
  });

  test("text callback receives plain text", () => {
    const result = render("Hello", {
      text: (text) => text.toUpperCase(),
    });
    expect(result).toBe("HELLO");
  });
});
