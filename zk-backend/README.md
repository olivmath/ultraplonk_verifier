# zk-backend

This project provides an interface for generating zk-SNARK proofs using UltraPlonk. You can generate proofs and verification keys using two different methods: via CLI or via JavaScript.

## Generating Proofs via CLI

Follow the steps below to generate proofs using the command line:

1. Compile the circuit:

```bash
nargo compile
```

2. Execute the circuit to generate the witness:

```bash
nargo execute
```

3. Generate the proof using the backend:

```bash
bb prove -b ./target/circuit.json -w ./target/circuit.gz -o ./target/bin/proof.bin
```

4. Generate the verification key:

```bash
bb write_vk -b ./target/circuit.json -o ./target/bin/vk.bin
```

5. Convert the proof to hex format:

```bash
noir-cli proof-data -n 1 --input-proof ./target/bin/proof.bin --output-proof ./target/hex/proof.hex --output-pubs ./target/hex/pub.hex
```

6. Convert the verification key to hex format:

```bash
noir-cli key --input ./target/bin/vk.bin --output ./target/hex/vk.hex
```

## Generating Proofs via JavaScript

Alternatively, you can generate proofs using the JavaScript API. Here’s how:

1. Compile the circuit (this step still requires CLI):

```bash
nargo compile
```

2. Execute the circuit to generate the witness:

```javascript
const { witness } = await noir.execute({
  birth_year: 1990,
  current_year: 2025,
});
```

3. Generate the proof and public inputs:

```javascript
const { proof, publicInputs } = await backend.generateProof(witness);
```

4. Obtain the verification key:

```javascript
const vk = await backend.getVerificationKey();
```

## Directory Structure

```
./target/
  ├── circuit.json     # Compiled circuit
  ├── circuit.gz       # Generated witness
  └── bin/
      ├── proof.bin    # Proof (binary)
      └── vk.bin       # Verification key (binary)
./target/hex/
  ├── proof.hex       # Proof in hex format
  ├── pub.hex         # Public inputs in hex format
  └── vk.hex          # Verification key in hex format
```
