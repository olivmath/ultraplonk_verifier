---
sidebar_position: 1
---

# Rust Guide

This guide covers everything you need to know about using the UltraPlonk Verifier Rust library.

## Overview

The Rust library provides:

- **Low-level proof verification** - Direct access to the verification engine
- **High performance** - Optimized cryptographic operations
- **No-std support** - Works in embedded and constrained environments
- **Type safety** - Leverages Rust's type system for safety guarantees

## Basic Usage

### 1. Setup Your Project

```bash
cargo new my-zk-verifier
cd my-zk-verifier
cargo add ultraplonk_no_std hex-literal
```

### 2. Create a Simple Verifier

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

fn main() {
    // Your proof data (hex encoded)
    let proof_data = hex!(
        "15d2c8471c8a3c5c9d3e8f0a1b2c3d4e"
        "5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
    );

    // Verification key data
    let vk_data = hex!(
        "0000000000000000000000000000000000000000000000000000000000000000"
        "0000000000000000000000000000000000000000000000000000000000000001"
    );

    // Public inputs
    let public_inputs = [
        hex!("000000000000000000000000000000000000000000000000000000000000000a")
    ];

    // Verify the proof
    match verify::<()>(&vk_data, &proof_data, &public_inputs) {
        Ok(_) => println!("✅ Proof verified successfully!"),
        Err(e) => eprintln!("❌ Verification failed: {:?}", e),
    }
}
```

## Understanding Proof Components

### Proof Data Structure

A proof consists of:
- **Commitments**: Points on the elliptic curve
- **Evaluations**: Field element values
- **Opening proof**: Commitment to the polynomial evaluation at a random point

```rust
// Example: Understanding what gets verified
// The verify function checks:
// 1. Proof format validity
// 2. Public input consistency
// 3. Polynomial commitment properties
// 4. Pairing equation correctness
```

### Verification Key

The verification key encodes:
- Circuit structure information
- Selector values
- Generator points
- Domain size and other parameters

```rust
// VK is generated during circuit compilation
// For Noir circuits compiled with `bb`:
// vk is output as binary or hex format
```

## Advanced Usage

### Handling Multiple Public Inputs

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

fn verify_with_multiple_inputs() {
    let proof_data = hex!("15d2...79b3");
    let vk_data = hex!("0000...0000");

    // Multiple public inputs
    let public_inputs = [
        hex!("000000000000000000000000000000000000000000000000000000000000000a"),
        hex!("000000000000000000000000000000000000000000000000000000000000000b"),
        hex!("000000000000000000000000000000000000000000000000000000000000000c"),
    ];

    match verify::<()>(&vk_data, &proof_data, &public_inputs) {
        Ok(_) => println!("All inputs verified!"),
        Err(e) => eprintln!("Verification failed: {:?}", e),
    }
}
```

### Custom Error Handling

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

fn verify_with_error_handling() {
    let proof_data = hex!("15d2...79b3");
    let vk_data = hex!("0000...0000");
    let public_inputs = [hex!("000000000000000000000000000000000000000000000000000000000000000a")];

    match verify::<()>(&vk_data, &proof_data, &public_inputs) {
        Ok(_) => {
            println!("Proof verified successfully");
            // Process verified proof
        }
        Err(ultraplonk_no_std::errors::ProofError::InvalidProof) => {
            eprintln!("The proof format is invalid");
        }
        Err(ultraplonk_no_std::errors::ProofError::InvalidKey) => {
            eprintln!("The verification key is invalid");
        }
        Err(ultraplonk_no_std::errors::ProofError::VerificationFailed) => {
            eprintln!("The proof does not verify correctly");
        }
        Err(e) => eprintln!("Unexpected error: {:?}", e),
    }
}
```

### No-std Environment

For embedded systems or constrained environments:

```toml
[dependencies]
ultraplonk_no_std = { version = "0.5", default-features = false }
```

```rust
#![no_std]

extern crate alloc;

use ultraplonk_no_std::verify;

fn main() {
    // Your verification code
    // Works without std library!
}
```

### Batch Verification

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

fn verify_multiple_proofs(proofs: Vec<(&[u8], &[u8], &[[u8; 32]])>) -> Vec<bool> {
    proofs
        .iter()
        .map(|(proof_data, vk_data, public_inputs)| {
            verify::<()>(vk_data, proof_data, public_inputs).is_ok()
        })
        .collect()
}
```

## Working with Proof Data

### Parsing Hex Strings

```rust
fn parse_hex_proof(hex_str: &str) -> Vec<u8> {
    // Remove '0x' prefix if present
    let hex = if hex_str.starts_with("0x") || hex_str.starts_with("0X") {
        &hex_str[2..]
    } else {
        hex_str
    };

    // Parse hex to bytes
    hex::decode(hex)
        .expect("Invalid hex string")
}
```

### Loading Proof from File

```rust
use std::fs;

fn load_proof_from_file(path: &str) -> std::io::Result<Vec<u8>> {
    fs::read(path)
}

fn load_proof_from_hex_file(path: &str) -> std::io::Result<Vec<u8>> {
    let hex_content = fs::read_to_string(path)?;
    let proof = parse_hex_proof(hex_content.trim());
    Ok(proof)
}
```

## Performance Optimization

### Proof Caching

```rust
use ultraplonk_no_std::verify;

struct ProofCache {
    vk: Vec<u8>,
}

impl ProofCache {
    fn new(vk_data: Vec<u8>) -> Self {
        ProofCache { vk: vk_data }
    }

    fn verify(&self, proof: &[u8], public_inputs: &[[u8; 32]]) -> Result<(), String> {
        verify::<()>(&self.vk, proof, public_inputs)
            .map_err(|e| format!("Verification failed: {:?}", e))
    }
}
```

### Parallel Verification

```rust
use rayon::prelude::*;

fn verify_proofs_parallel(
    proofs: Vec<(&[u8], &[[u8; 32]])>,
    vk: &[u8],
) -> Vec<bool> {
    proofs
        .par_iter()
        .map(|(proof, inputs)| {
            ultraplonk_no_std::verify::<()>(vk, proof, inputs).is_ok()
        })
        .collect()
}
```

## Integration Examples

### With Web Servers

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

fn verify_proof_from_request(
    proof_hex: String,
    vk_hex: String,
    public_inputs: Vec<String>,
) -> Result<(), String> {
    let proof = hex::decode(proof_hex)
        .map_err(|e| format!("Invalid proof hex: {}", e))?;
    let vk = hex::decode(vk_hex)
        .map_err(|e| format!("Invalid vk hex: {}", e))?;

    // Parse public inputs
    let mut inputs = [[0u8; 32]; 1]; // Adjust size as needed
    if !public_inputs.is_empty() {
        let input = hex::decode(&public_inputs[0])
            .map_err(|e| format!("Invalid input hex: {}", e))?;
        inputs[0].copy_from_slice(&input);
    }

    verify::<()>(&vk, &proof, &inputs)
        .map_err(|e| format!("Verification failed: {:?}", e))
}
```

### With Databases

```rust
use ultraplonk_no_std::verify;

struct ProofRecord {
    id: u64,
    proof: Vec<u8>,
    vk: Vec<u8>,
    public_inputs: Vec<Vec<u8>>,
    verified: bool,
}

impl ProofRecord {
    fn verify(&mut self) -> Result<(), String> {
        // Convert public inputs to fixed-size arrays
        let inputs: Vec<[u8; 32]> = self
            .public_inputs
            .iter()
            .map(|input| {
                let mut arr = [0u8; 32];
                let len = input.len().min(32);
                arr[..len].copy_from_slice(&input[..len]);
                arr
            })
            .collect();

        let inputs_ref: Vec<&[u8; 32]> = inputs.iter().map(|i| i).collect();

        verify::<()>(&self.vk, &self.proof, &inputs_ref)
            .map_err(|e| format!("Verification failed: {:?}", e))?;

        self.verified = true;
        Ok(())
    }
}
```

## Common Patterns

### Verify and Return Status

```rust
fn is_valid_proof(proof: &[u8], vk: &[u8], inputs: &[[u8; 32]]) -> bool {
    ultraplonk_no_std::verify::<()>(vk, proof, inputs).is_ok()
}
```

### Verify with Logging

```rust
fn verify_with_logging(
    proof: &[u8],
    vk: &[u8],
    inputs: &[[u8; 32]],
) -> Result<(), String> {
    println!("Starting proof verification...");
    println!("Proof size: {} bytes", proof.len());
    println!("VK size: {} bytes", vk.len());
    println!("Number of public inputs: {}", inputs.len());

    ultraplonk_no_std::verify::<()>(vk, proof, inputs)
        .map(|_| println!("✅ Proof verified successfully!"))
        .map_err(|e| {
            eprintln!("❌ Verification failed: {:?}", e);
            format!("{:?}", e)
        })
}
```

## Testing

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use hex_literal::hex;

    #[test]
    fn test_valid_proof() {
        let proof = hex!("15d2...79b3");
        let vk = hex!("0000...0000");
        let inputs = [hex!("000000000000000000000000000000000000000000000000000000000000000a")];

        assert!(ultraplonk_no_std::verify::<()>(&vk, &proof, &inputs).is_ok());
    }

    #[test]
    fn test_invalid_proof() {
        let invalid_proof = vec![0u8; 100];
        let vk = hex!("0000...0000");
        let inputs = [hex!("000000000000000000000000000000000000000000000000000000000000000a")];

        assert!(ultraplonk_no_std::verify::<()>(&vk, &invalid_proof, &inputs).is_err());
    }
}
```

## Debugging

### Print Debug Information

```rust
fn debug_proof(proof: &[u8], vk: &[u8]) {
    println!("Proof:");
    println!("  Length: {} bytes", proof.len());
    println!("  First 32 bytes (hex): {}", hex::encode(&proof[..32.min(proof.len())]));

    println!("Verification Key:");
    println!("  Length: {} bytes", vk.len());
    println!("  First 32 bytes (hex): {}", hex::encode(&vk[..32.min(vk.len())]));
}
```

## Next Steps

- [API Reference](../api/index.md) - Complete API documentation
- [Examples](../examples/index.md) - Real-world usage examples
- [JavaScript Guide](./javascript.md) - For JavaScript/browser integration
