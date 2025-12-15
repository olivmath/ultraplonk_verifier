---
sidebar_position: 2
---

# JavaScript Guide

This guide covers how to use the UltraPlonk Verifier in JavaScript and TypeScript projects.

## Overview

The JavaScript library (`olivmath-ultraplonk-zk-verify`) provides:

- **WASM-based verification** - High-performance cryptography via WebAssembly
- **Proof conversion** - Convert between binary and hex formats
- **Browser & Node.js support** - Works in any JavaScript environment
- **TypeScript support** - Full type definitions included

## Installation

```bash
npm install olivmath-ultraplonk-zk-verify
```

## Basic Usage

### Simple Proof Verification

```javascript
import { verify } from 'olivmath-ultraplonk-zk-verify';

const proof = '0x15d2c8471c8a3c5c9d3e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b';
const vk = '0x0000000000000000000000000000000000000000000000000000000000000000';
const publicInputs = ['0x000000000000000000000000000000000000000000000000000000000000000a'];

try {
    const isValid = verify(vk, proof, publicInputs);
    console.log('✅ Proof is valid:', isValid);
} catch (error) {
    console.error('❌ Verification failed:', error.message);
}
```

### TypeScript

```typescript
import { verify } from 'olivmath-ultraplonk-zk-verify';

interface ProofData {
    proof: string;
    vk: string;
    publicInputs: string[];
}

function verifyProof(data: ProofData): boolean {
    return verify(data.vk, data.proof, data.publicInputs);
}

const proofData: ProofData = {
    proof: '0x15d2...79b3',
    vk: '0x0000...0000',
    publicInputs: ['0x000000000000000000000000000000000000000000000000000000000000000a'],
};

const isValid = verifyProof(proofData);
console.log('Valid:', isValid);
```

## Format Conversion

### Binary to Hex Conversion

```javascript
import { proofToHex, vkToHex } from 'olivmath-ultraplonk-zk-verify';

// Convert proof from binary (Uint8Array) to hex string
const binaryProof = new Uint8Array([0x15, 0xd2, 0xc8, ...]);
const hexProof = proofToHex(binaryProof);
console.log('Proof (hex):', hexProof);

// Convert verification key from binary to hex
const binaryVk = new Uint8Array([0x00, 0x00, ...]);
const hexVk = vkToHex(binaryVk);
console.log('VK (hex):', hexVk);
```

### File-based Conversion

```javascript
import { readFileSync } from 'fs';
import { proofToHex } from 'olivmath-ultraplonk-zk-verify';

// Load proof from binary file
function loadProofFromFile(filePath) {
    const binaryData = readFileSync(filePath);
    const uint8Array = new Uint8Array(binaryData);
    return proofToHex(uint8Array);
}

const hexProof = loadProofFromFile('./proof.bin');
console.log('Hex proof:', hexProof);
```

## Working with Noir Proofs

### From Noir Circuit to Verification

```javascript
import { verify, proofToHex } from 'olivmath-ultraplonk-zk-verify';
import { readFileSync } from 'fs';

function verifyNoirProof(proofPath, vkPath) {
    // Load binary files
    const proofBinary = new Uint8Array(readFileSync(proofPath));
    const vkBinary = new Uint8Array(readFileSync(vkPath));

    // Convert to hex
    const proofHex = proofToHex(proofBinary);
    const vkHex = proofToHex(vkBinary);

    // Extract public inputs from proof
    // (implementation depends on your circuit structure)
    const publicInputs = ['0x000000000000000000000000000000000000000000000000000000000000000a'];

    // Verify
    try {
        const isValid = verify(vkHex, proofHex, publicInputs);
        return { valid: isValid, proofHex, vkHex };
    } catch (error) {
        throw new Error(`Verification failed: ${error.message}`);
    }
}

// Usage
const result = verifyNoirProof('./proof.bin', './vk.bin');
console.log('Verification result:', result);
```

### With Noir JavaScript Backend

```javascript
import { proofToHex } from 'olivmath-ultraplonk-zk-verify';
import { Noir } from '@noir-lang/noir_js';

async function generateAndVerifyProof(circuit, inputs) {
    const noir = new Noir(circuit);

    // Generate proof
    const { proof, vk } = await noir.generateProof(inputs);

    // Convert to hex if needed
    const proofHex = proofToHex(proof);
    const vkHex = proofToHex(vk);

    console.log('Proof (hex):', proofHex);
    console.log('VK (hex):', vkHex);

    return { proofHex, vkHex };
}
```

## Browser Integration

### HTML Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>UltraPlonk Verifier</title>
</head>
<body>
    <h1>Proof Verification</h1>

    <input type="text" id="proofInput" placeholder="Proof (hex)" />
    <input type="text" id="vkInput" placeholder="VK (hex)" />
    <input type="text" id="inputsInput" placeholder="Public inputs (hex, comma-separated)" />

    <button onclick="verifyProof()">Verify</button>

    <div id="result"></div>

    <script type="module">
        import { verify } from 'olivmath-ultraplonk-zk-verify';

        window.verifyProof = () => {
            const proof = document.getElementById('proofInput').value;
            const vk = document.getElementById('vkInput').value;
            const inputsStr = document.getElementById('inputsInput').value;

            const inputs = inputsStr.split(',').map(s => s.trim());

            try {
                const isValid = verify(vk, proof, inputs);
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = isValid
                    ? '<h2 style="color: green;">✅ Proof is valid!</h2>'
                    : '<h2 style="color: red;">❌ Proof is invalid!</h2>';
            } catch (error) {
                document.getElementById('result').innerHTML =
                    `<h2 style="color: red;">Error: ${error.message}</h2>`;
            }
        };
    </script>
</body>
</html>
```

### React Component

```typescript
import React, { useState } from 'react';
import { verify } from 'olivmath-ultraplonk-zk-verify';

interface VerificationResult {
    isValid: boolean;
    error?: string;
}

export function ProofVerifier() {
    const [proof, setProof] = useState('');
    const [vk, setVk] = useState('');
    const [inputs, setInputs] = useState('');
    const [result, setResult] = useState<VerificationResult | null>(null);

    const handleVerify = () => {
        try {
            const publicInputs = inputs.split(',').map(s => s.trim());
            const isValid = verify(vk, proof, publicInputs);
            setResult({ isValid });
        } catch (error) {
            setResult({
                isValid: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    return (
        <div>
            <input
                placeholder="Proof (hex)"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
            />
            <input
                placeholder="VK (hex)"
                value={vk}
                onChange={(e) => setVk(e.target.value)}
            />
            <input
                placeholder="Public inputs (hex, comma-separated)"
                value={inputs}
                onChange={(e) => setInputs(e.target.value)}
            />
            <button onClick={handleVerify}>Verify</button>

            {result && (
                <div style={{ color: result.isValid ? 'green' : 'red' }}>
                    {result.isValid ? '✅ Proof is valid!' : '❌ Proof is invalid!'}
                    {result.error && <p>Error: {result.error}</p>}
                </div>
            )}
        </div>
    );
}
```

## Server Integration

### Express.js API

```javascript
import express from 'express';
import { verify } from 'olivmath-ultraplonk-zk-verify';

const app = express();
app.use(express.json());

app.post('/verify', (req, res) => {
    try {
        const { proof, vk, publicInputs } = req.body;

        if (!proof || !vk || !publicInputs) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const isValid = verify(vk, proof, publicInputs);
        res.json({ valid: isValid });
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### API Endpoint

```typescript
import { Request, Response } from 'express';
import { verify } from 'olivmath-ultraplonk-zk-verify';

interface VerifyRequest {
    proof: string;
    vk: string;
    publicInputs: string[];
}

export async function verifyProofEndpoint(
    req: Request<any, any, VerifyRequest>,
    res: Response
) {
    try {
        const { proof, vk, publicInputs } = req.body;

        // Validate inputs
        if (!proof || !vk || !Array.isArray(publicInputs)) {
            return res.status(400).json({
                error: 'Invalid request: missing or invalid fields'
            });
        }

        // Verify proof
        const isValid = verify(vk, proof, publicInputs);

        res.json({
            valid: isValid,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
```

## Error Handling

### Comprehensive Error Handling

```typescript
import { verify } from 'olivmath-ultraplonk-zk-verify';

enum VerificationError {
    InvalidProof = 'INVALID_PROOF',
    InvalidVk = 'INVALID_VK',
    InvalidInput = 'INVALID_INPUT',
    VerificationFailed = 'VERIFICATION_FAILED',
    Unknown = 'UNKNOWN',
}

function verifyWithErrorHandling(
    proof: string,
    vk: string,
    inputs: string[]
): { valid: boolean; error?: VerificationError } {
    try {
        // Validate inputs
        if (!proof || typeof proof !== 'string') {
            return { valid: false, error: VerificationError.InvalidProof };
        }
        if (!vk || typeof vk !== 'string') {
            return { valid: false, error: VerificationError.InvalidVk };
        }
        if (!Array.isArray(inputs) || inputs.some(i => typeof i !== 'string')) {
            return { valid: false, error: VerificationError.InvalidInput };
        }

        // Verify
        const isValid = verify(vk, proof, inputs);

        if (!isValid) {
            return { valid: false, error: VerificationError.VerificationFailed };
        }

        return { valid: true };
    } catch (error) {
        console.error('Verification error:', error);
        return { valid: false, error: VerificationError.Unknown };
    }
}
```

## Testing

### Jest Tests

```typescript
import { verify, proofToHex } from 'olivmath-ultraplonk-zk-verify';

describe('UltraPlonk Verifier', () => {
    const validProof = '0x15d2c8471c8a3c5c9d3e8f0a1b2c3d4e';
    const validVk = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const validInputs = ['0x000000000000000000000000000000000000000000000000000000000000000a'];

    test('should verify valid proof', () => {
        const result = verify(validVk, validProof, validInputs);
        expect(result).toBe(true);
    });

    test('should reject invalid proof', () => {
        const invalidProof = '0x00000000000000000000000000000000';
        expect(() => verify(validVk, invalidProof, validInputs)).toThrow();
    });

    test('should convert binary to hex', () => {
        const binary = new Uint8Array([0x15, 0xd2, 0xc8]);
        const hex = proofToHex(binary);
        expect(hex.startsWith('0x')).toBe(true);
    });
});
```

## Performance Tips

### Caching

```typescript
import { verify } from 'olivmath-ultraplonk-zk-verify';

class VerifierCache {
    private cache: Map<string, boolean> = new Map();

    verify(vk: string, proof: string, inputs: string[]): boolean {
        const key = `${vk}:${proof}:${inputs.join(',')}`;

        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const result = verify(vk, proof, inputs);
        this.cache.set(key, result);
        return result;
    }

    clear() {
        this.cache.clear();
    }
}
```

### Parallel Verification

```typescript
import { verify } from 'olivmath-ultraplonk-zk-verify';

async function verifyProofsParallel(
    proofs: Array<{ vk: string; proof: string; inputs: string[] }>
): Promise<boolean[]> {
    return Promise.all(
        proofs.map(p => Promise.resolve(verify(p.vk, p.proof, p.inputs)))
    );
}
```

## Next Steps

- [API Reference](../api/index.md) - Complete API documentation
- [Examples](../examples/index.md) - Real-world usage examples
- [Rust Guide](./rust.md) - For backend integration
