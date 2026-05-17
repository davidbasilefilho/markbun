# Code Examples

Demonstrates fenced code blocks with syntax highlighting and inline code.

## TypeScript

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

async function greet(user: User): Promise<string> {
  const message = `Hello, ${user.name}!`;
  console.log(message);
  return message;
}
```

## Python

```python
def fibonacci(n: int) -> list[int]:
    sequence = []
    a, b = 0, 1
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

print(fibonacci(10))
```

## Rust

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().map(|x| x * 2).sum();
    println!("Sum of doubled values: {}", sum);
}
```

## Inline Code

Use `bun run build` to compile, or `npm publish` to distribute.

Inline `code()` with `arguments` and `nested() -> calls`.
