---
sidebar_position: 1
---

# Quick Start Guide

Get started with UltraPlonk Verifier in just a few minutes!

## Installation

### For Rust Projects

Add to your `Cargo.toml`:

```toml
[dependencies]
ultraplonk_no_std = "0.5"
hex_literal = "0.4"
```

### For JavaScript/Node.js Projects

```bash
npm install olivmath-ultraplonk-zk-verify
```

Or with yarn:

```bash
yarn add olivmath-ultraplonk-zk-verify
```

## Verify a Proof

### Rust

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

fn main() {
    // Your proof and verification key data
    let proof_data = hex!("15d2...79b3");
    let vk_data = hex!("0000...0000");

    // Public inputs
    let pubs = [hex!("000000000000000000000000000000000000000000000000000000000000000a")];

    // Verify the proof
    match verify::<()>(&vk_data, &proof_data, &pubs) {
        Ok(_) => println!("✅ Proof is valid!"),
        Err(e) => println!("❌ Proof verification failed: {:?}", e),
    }
}
```

### JavaScript

```javascript
import { verify } from 'olivmath-ultraplonk-zk-verify';

const proof = '0x15d2...79b3';
const vk = '0x0000...0000';
const publicInputs = ['0x000000000000000000000000000000000000000000000000000000000000000a'];

try {
    const isValid = verify(vk, proof, publicInputs);
    console.log('✅ Proof is valid:', isValid);
} catch (error) {
    console.error('❌ Proof verification failed:', error);
}
```

## Convert Proof Formats

### From Binary to Hex (JavaScript)

```javascript
import { proofToHex } from 'olivmath-ultraplonk-zk-verify';

// Load binary proof from file or proof generation
const binaryProof = new Uint8Array([...]);

// Convert to hex format
const hexProof = proofToHex(binaryProof);
console.log('Hex proof:', hexProof);
```

### From Binary to Hex (Rust)

```rust
use ultraplonk_no_std::utils;

let binary_data = vec![...];
let hex_string = utils::to_hex(&binary_data);
println!("Hex format: {}", hex_string);
```

## Next Steps

- Learn more in the [Installation Guide](./installation.md)
- Explore [Rust Guide](../guides/rust.md) for advanced usage
- Check out [JavaScript Guide](../guides/javascript.md) for browser integration
- See [API Reference](../api/index.md) for complete documentation

## Common Issues

### "Module not found" (JavaScript)

Make sure you've installed the package:
```bash
npm install olivmath-ultraplonk-zk-verify
```

### Import errors in TypeScript

Add the types to your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["olivmath-ultraplonk-zk-verify"]
  }
}
```

### Proof verification fails

Check that:
- Proof data is in the correct format (hex string for JS, bytes for Rust)
- Verification key matches the proof's circuit
- Public inputs are correctly formatted

## Need Help?

- 📝 [GitHub Issues](https://github.com/olivmath/ultraplonk_verifier/issues)
- 💬 [GitHub Discussions](https://github.com/olivmath/ultraplonk_verifier/discussions)
- 📖 Full [API Reference](../api/index.md)
