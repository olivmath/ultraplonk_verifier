---
sidebar_position: 1
---

# Examples

Real-world usage examples for the UltraPlonk Verifier library.

## Table of Contents

- [Rust Examples](#rust-examples)
- [JavaScript Examples](#javascript-examples)
- [Full Workflow Examples](#full-workflow-examples)

---

## Rust Examples

### Example 1: Simple Proof Verification

A minimal example showing how to verify a single proof.

**File:** `examples/simple_verify.rs`

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

fn main() {
    // Load proof and verification key data
    let proof_data = hex!(
        "15d2c8471c8a3c5c9d3e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
    );

    let vk_data = hex!(
        "0000000000000000000000000000000000000000000000000000000000000000"
        "0000000000000000000000000000000000000000000000000000000000000001"
    );

    // Public input
    let public_inputs = [
        hex!("000000000000000000000000000000000000000000000000000000000000000a")
    ];

    // Verify
    match verify::<()>(&vk_data, &proof_data, &public_inputs) {
        Ok(_) => println!("✅ Proof is valid!"),
        Err(e) => eprintln!("❌ Verification failed: {:?}", e),
    }
}
```

**Run:**
```bash
cargo run --example simple_verify
```

---

### Example 2: Batch Verification

Verify multiple proofs efficiently.

**File:** `examples/batch_verify.rs`

```rust
use ultraplonk_no_std::verify;
use hex_literal::hex;

struct ProofBatch {
    proof: Vec<u8>,
    vk: Vec<u8>,
    public_inputs: Vec<[u8; 32]>,
}

fn verify_batch(batch: &[ProofBatch]) -> Vec<bool> {
    batch
        .iter()
        .map(|item| {
            verify::<()>(&item.vk, &item.proof, &item.public_inputs)
                .is_ok()
        })
        .collect()
}

fn main() {
    // Create sample proofs
    let batches = vec![
        ProofBatch {
            proof: hex!("15d2c8471c8a3c5c9d3e8f0a1b2c3d4e").to_vec(),
            vk: hex!("0000000000000000000000000000000000000000000000000000000000000000").to_vec(),
            public_inputs: vec![
                hex!("000000000000000000000000000000000000000000000000000000000000000a")
            ],
        },
        // Add more batches...
    ];

    // Verify all
    let results = verify_batch(&batches);

    for (i, valid) in results.iter().enumerate() {
        println!("Proof {}: {}", i, if *valid { "✅ Valid" } else { "❌ Invalid" });
    }
}
```

---

### Example 3: File-based Verification

Load proofs and keys from files.

**File:** `examples/file_verify.rs`

```rust
use ultraplonk_no_std::verify;
use std::fs;

fn load_hex_file(path: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let content = fs::read_to_string(path)?;
    let hex_str = content.trim();

    // Remove 0x prefix if present
    let hex = if hex_str.starts_with("0x") {
        &hex_str[2..]
    } else {
        hex_str
    };

    hex::decode(hex).map_err(|e| Box::new(e) as Box<dyn std::error::Error>)
}

fn verify_from_files(
    proof_file: &str,
    vk_file: &str,
    input_file: &str,
) -> Result<bool, Box<dyn std::error::Error>> {
    let proof = load_hex_file(proof_file)?;
    let vk = load_hex_file(vk_file)?;

    // Load public inputs (one per line, hex format)
    let input_content = fs::read_to_string(input_file)?;
    let mut inputs = Vec::new();

    for line in input_content.lines() {
        let hex_str = line.trim();
        if !hex_str.is_empty() {
            let bytes = load_hex_file(&format!("echo {} | xxd -r -p", hex_str))?;
            if bytes.len() == 32 {
                let mut arr = [0u8; 32];
                arr.copy_from_slice(&bytes);
                inputs.push(arr);
            }
        }
    }

    Ok(verify::<()>(&vk, &proof, &inputs).is_ok())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let is_valid = verify_from_files("./proof.hex", "./vk.hex", "./inputs.hex")?;
    println!("Proof valid: {}", is_valid);
    Ok(())
}
```

---

### Example 4: Web Server Integration

Verify proofs via an HTTP API.

**File:** `examples/web_server.rs`

```rust
use ultraplonk_no_std::verify;

// Example using actix-web framework
// Add to Cargo.toml: actix-web = "4"

#[actix_web::post("/verify")]
async fn verify_endpoint(
    req: web::Json<VerifyRequest>,
) -> impl Responder {
    match hex::decode(&req.proof) {
        Ok(proof) => match hex::decode(&req.vk) {
            Ok(vk) => {
                // Parse public inputs
                let inputs: Vec<[u8; 32]> = req
                    .public_inputs
                    .iter()
                    .filter_map(|hex_input| {
                        hex::decode(hex_input)
                            .ok()
                            .and_then(|bytes| {
                                if bytes.len() == 32 {
                                    let mut arr = [0u8; 32];
                                    arr.copy_from_slice(&bytes);
                                    Some(arr)
                                } else {
                                    None
                                }
                            })
                    })
                    .collect();

                match verify::<()>(&vk, &proof, &inputs) {
                    Ok(_) => HttpResponse::Ok().json(VerifyResponse {
                        valid: true,
                        error: None,
                    }),
                    Err(_) => HttpResponse::Ok().json(VerifyResponse {
                        valid: false,
                        error: Some("Verification failed".to_string()),
                    }),
                }
            }
            Err(_) => HttpResponse::BadRequest().json(VerifyResponse {
                valid: false,
                error: Some("Invalid VK format".to_string()),
            }),
        },
        Err(_) => HttpResponse::BadRequest().json(VerifyResponse {
            valid: false,
            error: Some("Invalid proof format".to_string()),
        }),
    }
}

#[derive(serde::Deserialize)]
struct VerifyRequest {
    proof: String,
    vk: String,
    public_inputs: Vec<String>,
}

#[derive(serde::Serialize)]
struct VerifyResponse {
    valid: bool,
    error: Option<String>,
}
```

---

## JavaScript Examples

### Example 1: Browser Verification

HTML page for verifying proofs in a browser.

**File:** `examples/browser_verify.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UltraPlonk Verifier</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        textarea {
            resize: vertical;
            min-height: 100px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
        .result {
            margin-top: 20px;
            padding: 10px;
            border-radius: 4px;
        }
        .result.valid {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .result.invalid {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <h1>UltraPlonk Proof Verifier</h1>

    <div class="form-group">
        <label for="vk">Verification Key (hex):</label>
        <textarea id="vk" placeholder="0x0000..."></textarea>
    </div>

    <div class="form-group">
        <label for="proof">Proof (hex):</label>
        <textarea id="proof" placeholder="0x15d2..."></textarea>
    </div>

    <div class="form-group">
        <label for="inputs">Public Inputs (hex, one per line):</label>
        <textarea id="inputs" placeholder="0x0000..."></textarea>
    </div>

    <button onclick="verifyProof()">Verify Proof</button>

    <div id="result"></div>

    <script type="module">
        import { verify } from 'https://unpkg.com/olivmath-ultraplonk-zk-verify';

        window.verifyProof = async () => {
            const vk = document.getElementById('vk').value.trim();
            const proof = document.getElementById('proof').value.trim();
            const inputsText = document.getElementById('inputs').value.trim();

            const inputs = inputsText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            const resultDiv = document.getElementById('result');

            try {
                const isValid = verify(vk, proof, inputs);

                if (isValid) {
                    resultDiv.className = 'result valid';
                    resultDiv.innerHTML = '<h2>✅ Proof is valid!</h2>';
                } else {
                    resultDiv.className = 'result invalid';
                    resultDiv.innerHTML = '<h2>❌ Proof is invalid!</h2>';
                }
            } catch (error) {
                resultDiv.className = 'result invalid';
                resultDiv.innerHTML = `<h2>Error: ${error.message}</h2>`;
            }
        };
    </script>
</body>
</html>
```

---

### Example 2: Node.js File Processing

Process proofs from files in Node.js.

**File:** `examples/process_proofs.js`

```javascript
import { verify, proofToHex, vkToHex } from 'olivmath-ultraplonk-zk-verify';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadAndVerifyProof(proofPath, vkPath, inputsPath) {
    console.log('Loading proof data...');

    // Load binary files
    const proofBuffer = readFileSync(proofPath);
    const vkBuffer = readFileSync(vkPath);
    const inputsBuffer = readFileSync(inputsPath, 'utf-8');

    // Convert to hex
    const proofHex = proofToHex(new Uint8Array(proofBuffer));
    const vkHex = vkToHex(new Uint8Array(vkBuffer));

    // Parse public inputs (newline-separated hex strings)
    const publicInputs = inputsBuffer
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    console.log('Proof hex:', proofHex.substring(0, 50) + '...');
    console.log('VK hex:', vkHex.substring(0, 50) + '...');
    console.log('Number of public inputs:', publicInputs.length);

    // Verify
    try {
        console.log('\nVerifying proof...');
        const isValid = verify(vkHex, proofHex, publicInputs);

        if (isValid) {
            console.log('✅ Proof verified successfully!');
            return { valid: true };
        } else {
            console.log('❌ Proof verification failed!');
            return { valid: false };
        }
    } catch (error) {
        console.error('❌ Verification error:', error.message);
        return { valid: false, error: error.message };
    }
}

// Usage
const result = loadAndVerifyProof(
    resolve('./proof.bin'),
    resolve('./vk.bin'),
    resolve('./inputs.txt')
);

process.exit(result.valid ? 0 : 1);
```

---

### Example 3: Express Server with Batch Verification

HTTP API for verifying multiple proofs.

**File:** `examples/express_server.js`

```javascript
import express from 'express';
import { verify } from 'olivmath-ultraplonk-zk-verify';

const app = express();
app.use(express.json());

// Single proof verification
app.post('/verify', (req, res) => {
    try {
        const { proof, vk, publicInputs } = req.body;

        if (!proof || !vk || !publicInputs) {
            return res.status(400).json({
                error: 'Missing required fields: proof, vk, publicInputs'
            });
        }

        const isValid = verify(vk, proof, publicInputs);

        res.json({
            valid: isValid,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// Batch verification
app.post('/verify-batch', (req, res) => {
    try {
        const { proofs } = req.body;

        if (!Array.isArray(proofs)) {
            return res.status(400).json({
                error: 'Expected proofs array'
            });
        }

        const results = proofs.map((item, index) => {
            try {
                const isValid = verify(item.vk, item.proof, item.publicInputs);
                return { index, valid: isValid, error: null };
            } catch (error) {
                return { index, valid: false, error: error.message };
            }
        });

        res.json({
            results,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

**Usage:**

```bash
# Single verification
curl -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -d '{
    "proof": "0x15d2...",
    "vk": "0x0000...",
    "publicInputs": ["0x000a..."]
  }'

# Batch verification
curl -X POST http://localhost:3000/verify-batch \
  -H "Content-Type: application/json" \
  -d '{
    "proofs": [
      {"proof": "0x15d2...", "vk": "0x0000...", "publicInputs": ["0x000a..."]},
      {"proof": "0x...", "vk": "0x...", "publicInputs": ["0x..."]}
    ]
  }'
```

---

## Full Workflow Examples

### Noir Circuit → Proof → Verification

Complete workflow from circuit to verification.

**Circuit:** `circuit.nr`

```noir
fn main(x: pub Field, y: Field) {
    assert(y * y == x);
}
```

**JavaScript:** `workflow.js`

```javascript
import { Noir } from '@noir-lang/noir_js';
import { verify, proofToHex, vkToHex } from 'olivmath-ultraplonk-zk-verify';

async function completeWorkflow() {
    // 1. Compile circuit
    console.log('1. Compiling circuit...');
    const circuit = require('./circuit.nr');
    const noir = new Noir(circuit);

    // 2. Generate proof
    console.log('2. Generating proof...');
    const input = {
        x: 4n,
        y: 2n,
    };
    const { proof, vk } = await noir.generateProof(input);

    // 3. Convert to hex
    console.log('3. Converting to hex format...');
    const proofHex = proofToHex(proof);
    const vkHex = vkToHex(vk);

    // 4. Extract public inputs
    const publicInputs = ['0x0000000000000000000000000000000000000000000000000000000000000004'];

    // 5. Verify
    console.log('4. Verifying proof...');
    const isValid = verify(vkHex, proofHex, publicInputs);

    console.log('Result:', isValid ? '✅ Valid' : '❌ Invalid');

    return {
        proofHex,
        vkHex,
        publicInputs,
        isValid
    };
}

completeWorkflow().catch(console.error);
```

---

## See Also

- [Quick Start Guide](../getting-started/quickstart.md)
- [Rust Guide](../guides/rust.md)
- [JavaScript Guide](../guides/javascript.md)
- [API Reference](../api/index.md)
