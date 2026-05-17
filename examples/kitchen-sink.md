# markbun — Kitchen Sink

Everything Bun.markdown can render, in one file.

## Inline Styles

**Bold**, _italic_, **_both_**, ~~strike~~, `code`, **underline**, and combined **`code in bold`** ~~**_everything_**~~

## Headings

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Lists

### Bullet

- Level 1
  - Level 2
    - Level 3
      - Level 4
- Back to level 1

### Numbered

1. First
2. Second
   1. Sub-item A
   2. Sub-item B
3. Third

## Code

### Fenced Block

```ts
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### Indented Block

    This is an indented code block.
    No language specified.
    Just monospace text.

## Blockquotes

> Single line quote.

> Multi-line quote.
>
> Second paragraph with **bold** and `code`.

> Nested blockquotes
>
> > Deep inside
> >
> > > Even deeper

## Tables

| Simple | Table  |
| ------ | ------ |
| Cell 1 | Cell 2 |
| Cell 3 | Cell 4 |

| Aligned |  Data  |
| :------ | :----: |
| Left    | Center |

## Links

Standard: [Bun](https://bun.sh)
With title: [Bun](https://bun.sh "Fast JavaScript runtime")
Autolink: https://bun.sh

## Horizontal Rules

---

---

---

## Task Lists

- [x] Completed task
- [ ] Pending task
- [x] Another done task

## HTML Passthrough

<div style="color: red">Raw HTML passes through by default</div>

## Mixed Content

1. Start with a **bold** statement
2. Then add some _italic_ nuance
3. Quote someone: > "Markdown is great"
4. Show some `code`
5. Add a table to present data

| #   | Item | Notes        |
| --- | ---- | ------------ |
| 1   | Task | ~~obsolete~~ |
| 2   | Todo | ✅ Done      |

Final paragraph to wrap it all up.
