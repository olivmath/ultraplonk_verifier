// This is a backend example snippet.
// It requires a server setup with Express.js and other dependencies.

import ultraplonk from "ultraplonk-no-std";

// POST
app.post("/", async (req, res) => {
  // 1. Receive proof, public inputs and vk
  // 2. Convertendo proof e vk para Uint8Array
  // 3. Load ZK circuit
  // 4. Instantiate UltraPlonkBackend from @aztec/bb.js;
  // 5. Verify proofs + public inputs locally with UltraPlonkBackend
  // 6. Convert proofs & vk to ZkVerify compatible format
  const convertedProof = ultraplonk.convert_proof(proof, 1); // <- 1 is the number of public inputs
  const convertedVk = ultraplonk.convert_verification_key(vk);
  // 7. Submit to ZkVerify
  const session = await zkVerifySession
    .start()
    .Volta()
    .withAccount("your seed here");

  const { events } = await session
    .verify()
    .ultraplonk()
    .execute({
      proofData: {
        publicSignals: publicInputs,
        proof: convertedProof,
        vk: convertedVk,
      },
    });

  await new Promise((resolve) => {
    events.on(ZkVerifyEvents.Finalized, (data) => {
      console.log("Proof finalized on zkVerify. ✅", data);
      resolve(data);
    });
  });
});
