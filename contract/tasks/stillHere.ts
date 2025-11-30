import { task } from "hardhat/config";
import { FhevmType } from "@fhevm/hardhat-plugin";

//
// SEND SIGNAL
//
task("task:send-signal", "Send encrypted signal")
  .addParam("contract")
  .addParam("value")
  .setAction(async (args, hre) => {
    const { ethers, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const contract = await ethers.getContractAt("StillHere", args.contract);
    const [signer] = await ethers.getSigners();

    const builder = fhevm.createEncryptedInput(args.contract, signer.address);
    const encrypted = await builder.add32(parseInt(args.value)).encrypt();

    // 上次信号明文（本地 mock = 0）
    const lastSignalPlain = 0;

    const tx = await contract.signal(
      encrypted.handles[0],
      encrypted.inputProof,
      lastSignalPlain
    );

    await tx.wait();
    console.log("Signal sent:", tx.hash);
  });


//
// READ STATUS
//
task("task:read-status", "Read encrypted FHE fields")
  .addParam("contract")
  .setAction(async (args, hre) => {
    const { ethers, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const contract = await ethers.getContractAt("StillHere", args.contract);
    const [signer] = await ethers.getSigners();

    //
    // Read encrypted euint values (not bytes32)
    //
    const encryptedTotal = await contract.getTotalLive();
    const encryptedLast = await contract.getLastSignalTime();

    console.log("Encrypted totalLive:", encryptedTotal);
    console.log("Encrypted lastSignalTime:", encryptedLast);

    //
    // Decrypt using userDecryptEuint (like FHECounter example)
    //
    const total = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedTotal,
      args.contract,
      signer
    );

    const last = await fhevm.userDecryptEuint(
      FhevmType.euint256,
      encryptedLast,
      args.contract,
      signer
    );

    console.log("Decrypted totalLive:", total);
    console.log("Decrypted lastSignalTime:", last);
  });
