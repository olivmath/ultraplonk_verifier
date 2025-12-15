---
sidebar_position: 1
---

# API Reference

Complete API documentation for the UltraPlonk Verifier library.

## Rust API

### `ultraplonk_no_std` Crate

#### Main Functions

##### `verify()`

Verifies a UltraPlonk proof against a verification key and public inputs.

```rust
pub fn verify<T>(
    vk: &[u8],
    proof: &[u8],
    public_inputs: &[[u8; 32]],
) -> Result<(), ProofError>
```

**Parameters:**
- `vk: &[u8]` - The verification key bytes
- `proof: &[u8]` - The proof bytes
- `public_inputs: &[[u8; 32]]` - Array of 32-byte public input elements

**Returns:**
- `Ok(())` if the proof is valid
- `Err(ProofError)` if verification fails

**Example:**
```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

let vk = hex!("0000...0000");
let proof = hex!("15d2...79b3");
let inputs = [hex!("000000000000000000000000000000000000000000000000000000000000000a")];

verify::<()>(&vk, &proof, &inputs)?;
```

### Error Types

#### `ProofError`

Enum representing different verification failures.

```rust
pub enum ProofError {
    /// The proof format is invalid
    InvalidProof,
    /// The verification key is invalid
    InvalidKey,
    /// The proof does not verify correctly
    VerificationFailed,
    /// Other cryptographic errors
    CryptoError(String),
}
```

### Utility Functions

#### `utils::to_hex()`

Converts bytes to a hexadecimal string.

```rust
pub fn to_hex(bytes: &[u8]) -> String
```

**Example:**
```rust
use ultraplonk_no_std::utils;

let bytes = vec![0x15, 0xd2, 0xc8];
let hex = utils::to_hex(&bytes);
// hex = "15d2c8"
```

#### `utils::from_hex()`

Converts a hexadecimal string to bytes.

```rust
pub fn from_hex(hex: &str) -> Result<Vec<u8>, std::fmt::Error>
```

**Example:**
```rust
use ultraplonk_no_std::utils;

let hex = "15d2c8";
let bytes = utils::from_hex(hex)?;
// bytes = vec![0x15, 0xd2, 0xc8]
```

---

## JavaScript API

### `olivmath-ultraplonk-zk-verify` Package

#### Main Functions

##### `verify()`

Verifies a UltraPlonk proof in JavaScript/TypeScript.

```typescript
function verify(
    vk: string,
    proof: string,
    publicInputs: string[]
): boolean
```

**Parameters:**
- `vk: string` - Verification key as hex string (with or without "0x" prefix)
- `proof: string` - Proof as hex string (with or without "0x" prefix)
- `publicInputs: string[]` - Array of public inputs as hex strings

**Returns:**
- `true` if the proof is valid
- `false` if the proof is invalid
- Throws `Error` on invalid input formats

**Example:**
```typescript
import { verify } from 'olivmath-ultraplonk-zk-verify';

const isValid = verify(
    '0x0000...0000',
    '0x15d2...79b3',
    ['0x000000000000000000000000000000000000000000000000000000000000000a']
);

console.log('Valid:', isValid);
```

##### `proofToHex()`

Converts a binary proof (Uint8Array) to hex string format.

```typescript
function proofToHex(proof: Uint8Array): string
```

**Parameters:**
- `proof: Uint8Array` - Binary proof data

**Returns:**
- Hex string representation of the proof (with "0x" prefix)

**Example:**
```typescript
import { proofToHex } from 'olivmath-ultraplonk-zk-verify';
import { readFileSync } from 'fs';

const binaryProof = new Uint8Array(readFileSync('proof.bin'));
const hexProof = proofToHex(binaryProof);
// hexProof = "0x15d2c8471c8a3c5c..."
```

##### `vkToHex()`

Converts a binary verification key (Uint8Array) to hex string format.

```typescript
function vkToHex(vk: Uint8Array): string
```

**Parameters:**
- `vk: Uint8Array` - Binary verification key data

**Returns:**
- Hex string representation of the verification key (with "0x" prefix)

**Example:**
```typescript
import { vkToHex } from 'olivmath-ultraplonk-zk-verify';
import { readFileSync } from 'fs';

const binaryVk = new Uint8Array(readFileSync('vk.bin'));
const hexVk = vkToHex(binaryVk);
// hexVk = "0x0000000000..."
```

##### `inputsToHex()`

Converts binary public inputs to hex strings.

```typescript
function inputsToHex(inputs: Uint8Array[]): string[]
```

**Parameters:**
- `inputs: Uint8Array[]` - Array of binary public input values

**Returns:**
- Array of hex strings (each with "0x" prefix)

**Example:**
```typescript
import { inputsToHex } from 'olivmath-ultraplonk-zk-verify';

const binaryInputs = [
    new Uint8Array([0x00, 0x00, ..., 0x0a]),
    new Uint8Array([0x00, 0x00, ..., 0x0b])
];

const hexInputs = inputsToHex(binaryInputs);
// hexInputs = ["0x0000...000a", "0x0000...000b"]
```

### Type Definitions

#### `VerifyOptions` (TypeScript)

Optional configuration for verification.

```typescript
interface VerifyOptions {
    /**
     * Enable additional validation
     * @default false
     */
    strict?: boolean;

    /**
     * Custom error handler
     */
    onError?: (error: Error) => void;
}
```

### Error Handling

#### Thrown Errors

All functions that can fail throw JavaScript `Error` objects:

```typescript
try {
    verify(vk, proof, inputs);
} catch (error) {
    if (error instanceof Error) {
        console.error('Error message:', error.message);
    }
}
```

**Common error messages:**
- `"Invalid proof format"` - Proof data is malformed
- `"Invalid vk format"` - Verification key is malformed
- `"Invalid input format"` - Public inputs are malformed
- `"Verification failed"` - Proof doesn't verify
- `"Invalid hex string"` - Input contains invalid hex characters

---

## Data Format Specifications

### Verification Key Format

The verification key is a binary/hex encoded structure containing:

```
[Field] - Domain size
[Field] - Number of public inputs
[Group] × 2 - Generators
[Group] × n - Selector commitments
[Field] × m - Lookup table values
[... additional parameters ...]
```

**Size:** Typically 5-10 KB depending on circuit

### Proof Format

A proof contains:

```
[Group] × 8 - Main commitments
[Field] × 10 - Evaluations
[Field] × 2 - Opening proof
[... additional data ...]
```

**Size:** Typically 2-4 KB

### Public Input Format

Each public input is:
- 32 bytes (256 bits)
- Field element modulo BN254 prime

### Hex String Format

- Prefix with `0x` (optional)
- Lowercase or uppercase hex digits
- Even number of characters

Example: `0x15d2c8471c8a3c5c` or `15d2c8471c8a3c5c`

---

## Constants

### Field Parameters

```rust
// BN254 field prime
const FIELD_MODULUS: &str =
    "21888242871839275222246405745257275088548364400416034343698204186575808495617";

// BN254 curve order
const CURVE_ORDER: &str =
    "21888242871839275222246405745257275088548364400416034343698204186575808495617";
```

### Domain Sizes

Common SRS (Structured Reference String) sizes:
- `2^16` (65,536 elements) - Small circuits
- `2^17` (131,072 elements) - Medium circuits
- `2^18` (262,144 elements) - Large circuits
- `2^20` (1,048,576 elements) - Extra large circuits

---

## Examples

### Complete Rust Example

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

fn main() {
    let vk = hex!(
        "0000000000000000000000000000000000000000000000000000000000000000"
        "0000000000000000000000000000000000000000000000000000000000000001"
    );

    let proof = hex!(
        "15d2c8471c8a3c5c9d3e8f0a1b2c3d4e"
        "5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
    );

    let public_inputs = [
        hex!("000000000000000000000000000000000000000000000000000000000000000a"),
        hex!("000000000000000000000000000000000000000000000000000000000000000b"),
    ];

    match verify::<()>(&vk, &proof, &public_inputs) {
        Ok(_) => println!("✅ Proof verified!"),
        Err(e) => eprintln!("❌ Error: {:?}", e),
    }
}
```

### Complete TypeScript Example

```typescript
import { verify, proofToHex, vkToHex } from 'olivmath-ultraplonk-zk-verify';

interface ProofData {
    proof: Uint8Array;
    vk: Uint8Array;
    publicInputs: string[];
}

async function verifyProofData(data: ProofData): Promise<boolean> {
    try {
        const hexProof = proofToHex(data.proof);
        const hexVk = vkToHex(data.vk);

        return verify(hexVk, hexProof, data.publicInputs);
    } catch (error) {
        console.error('Verification failed:', error);
        return false;
    }
}
```

---

## Performance Characteristics

### Verification Time

- Single proof verification: ~100-500ms
- Depends on circuit size and hardware
- WASM (JavaScript) ~2-3x slower than native Rust

### Memory Usage

- Rust: ~10-50 MB peak
- JavaScript/WASM: ~20-100 MB peak
- Depends on proof and VK sizes

### Batch Verification

For multiple proofs:
- Process sequentially or in parallel
- Each proof is independent
- Total time scales linearly

---

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 57+     | ✅ Full |
| Firefox | 52+     | ✅ Full |
| Safari  | 11.1+   | ✅ Full |
| Edge    | 79+     | ✅ Full |
| IE 11   | -       | ❌ No   |

---

## See Also

- [Rust Guide](../guides/rust.md) - Detailed Rust usage
- [JavaScript Guide](../guides/javascript.md) - Detailed JavaScript usage
- [Examples](../examples/index.md) - Real-world code examples
