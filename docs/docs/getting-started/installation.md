---
sidebar_position: 2
---

# Installation Guide

## Prerequisites

### For Rust

- Rust 1.56 or later ([Install Rust](https://rustup.rs/))
- Cargo package manager (comes with Rust)

Check your Rust version:
```bash
rustc --version
cargo --version
```

### For JavaScript

- Node.js 14 or later ([Download Node.js](https://nodejs.org/))
- npm, yarn, or pnpm package manager

Check your Node.js version:
```bash
node --version
npm --version
```

## Installation

### Rust Installation

#### Option 1: Add to existing Cargo project

Navigate to your Rust project and add the dependency:

```bash
cargo add ultraplonk_no_std
cargo add hex-literal
```

Or manually edit `Cargo.toml`:

```toml
[dependencies]
ultraplonk_no_std = "0.5"
hex-literal = "0.4"
```

#### Option 2: Create new Rust project with the library

```bash
cargo new my-zk-project
cd my-zk-project
cargo add ultraplonk_no_std
cargo add hex-literal
```

#### No-std Environment

The library works in `no_std` environments. To use without the standard library:

```toml
[dependencies]
ultraplonk_no_std = { version = "0.5", default-features = false }
```

### JavaScript Installation

#### Using npm

```bash
npm install olivmath-ultraplonk-zk-verify
```

#### Using yarn

```bash
yarn add olivmath-ultraplonk-zk-verify
```

#### Using pnpm

```bash
pnpm add olivmath-ultraplonk-zk-verify
```

#### TypeScript Support

The package includes TypeScript type definitions. Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "lib": ["ES2020"],
    "target": "ES2020"
  }
}
```

## Verify Installation

### Rust

Create a test file `src/main.rs`:

```rust
use ultraplonk_no_std::verify;

fn main() {
    println!("✅ UltraPlonk library imported successfully!");
}
```

Run it:

```bash
cargo run
```

### JavaScript

Create a test file `test.js`:

```javascript
import { verify } from 'olivmath-ultraplonk-zk-verify';

console.log('✅ UltraPlonk library imported successfully!');
```

Run it:

```bash
node test.js
```

Or in a browser environment, import in your HTML:

```html
<script type="module">
  import { verify } from 'olivmath-ultraplonk-zk-verify';
  console.log('✅ UltraPlonk library imported successfully!');
</script>
```

## Updating the Library

### Rust

```bash
cargo update
```

Or to a specific version:

```bash
cargo add ultraplonk_no_std@0.6
```

### JavaScript

```bash
npm update olivmath-ultraplonk-zk-verify
```

Or to a specific version:

```bash
npm install olivmath-ultraplonk-zk-verify@0.2.0
```

## Troubleshooting

### "Failed to fetch crate" (Rust)

Ensure you have internet connectivity and crates.io is accessible:

```bash
cargo search ultraplonk_no_std
```

### "Module not found" (JavaScript)

Clear your package cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### "WASM initialization failed" (JavaScript)

Ensure you're using a JavaScript runtime that supports WebAssembly:
- Node.js 8.0+
- Modern browsers (Chrome, Firefox, Safari, Edge)

For older environments, use the Rust library instead.

### Compilation errors (Rust)

Make sure your Rust version is up to date:

```bash
rustup update
```

If you're using WASM, ensure you have the wasm target:

```bash
rustup target add wasm32-unknown-unknown
```

## Next Steps

- [Quick Start Guide](./quickstart.md) - Start verifying proofs
- [Rust Guide](../guides/rust.md) - Learn Rust library features
- [JavaScript Guide](../guides/javascript.md) - Learn JavaScript integration
- [Examples](../examples/index.md) - See real-world usage examples

## Getting Help

If you encounter any issues:

1. Check the [Quick Start Guide](./quickstart.md) for common issues
2. Search [GitHub Issues](https://github.com/olivmath/ultraplonk_verifier/issues)
3. Open a new issue with:
   - Your OS and version
   - Rust/Node.js version
   - Full error message
   - Minimal code example to reproduce
