import { ethers, Contract } from "ethers";
import { CONTRACT_CONFIG } from "../constants";

// @ts-ignore
import {
  initSDK,
  createInstance,
  SepoliaConfig,
} from "https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.js";

// Browser polyfills
if (typeof window !== "undefined" && !window.global) {
  (window as any).global = window;
}

export async function initFhevm() {
  try {
    if (typeof window === "undefined")
      throw new Error("FHE initialization must run in the browser context");

    console.log("Using relayer-sdk for Sepolia");

    // signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    if (!accounts || accounts.length === 0)
      throw new Error("Permission denied");

    const signer = await provider.getSigner();

    // relayer
    await initSDK();

    const config = {
      ...SepoliaConfig,
      network: window.ethereum,
      relayerUrl: "https://relayer.testnet.zama.org",
    };
    const relayer = await createInstance(config);

    console.log("FHEVM instance initialized successfully with relayer-sdk");

    return { signer, relayer };
  } catch (error) {
    console.error("Failed to initialize FHEVM:", error);
    throw error;
  }
}

/**
 * get total count
 */
export async function getTotalLive(relayer, signer, contractAddress) {
  // ⭐ 使用 bytes32 ABI（最关键）
  const contract = new Contract(
    contractAddress,
    ["function getTotalLive() external view returns (bytes32)"],
    signer
  );

  // ⭐ ethers.Contract 会返回正确的 bytes32 ciphertext
  const encryptedHandle = await contract.getTotalLive();

  if (!encryptedHandle || encryptedHandle === "0x") {
    throw new Error("Invalid encrypted handle");
  }

  const value = await relayer.publicDecrypt([encryptedHandle], "uint32");

  return Number(value);
}

/**
 * get Last SignalTime
 */
export const getLastSignalTime = async (
  relayer: any,
  signer: any,
  contractAddress: string
): Promise<number> => {
  const contract = new Contract(contractAddress, CONTRACT_CONFIG.ABI, signer);

  // 1️⃣ 获取加密 handle
  const encryptedHandle: string = await contract.getLastSignalTime();
  console.log("Encrypted handle:", encryptedHandle);

  // 2️⃣ 如果 handle 全零，说明用户还没有signal
  if (/^0x0+$/.test(encryptedHandle)) {
    console.log("User has no lastSignalTime yet");
    return Number(0); // 或返回 0
  }

  // 2️⃣ 生成 keypair
  const keypair = relayer.generateKeypair();

  // 3️⃣ 创建 EIP-712 签名数据
  const startTimestamp = Math.floor(Date.now() / 1000).toString();
  const durationDays = "10";
  const contractAddresses = [contractAddress];

  const eip712 = relayer.createEIP712(
    keypair.publicKey,
    contractAddresses,
    startTimestamp,
    durationDays
  );

  const signature = await signer.signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification:
        eip712.types.UserDecryptRequestVerification,
    },
    eip712.message
  );

  // 4️⃣ 调用 userDecrypt 解密
  const result = await relayer.userDecrypt(
    [{ handle: encryptedHandle, contractAddress }],
    keypair.privateKey,
    keypair.publicKey,
    signature.replace("0x", ""),
    contractAddresses,
    await signer.getAddress(),
    startTimestamp,
    durationDays
  );

  const decryptedValue = Object.values(result)[0];
  console.log("Decrypted lastSignalTime =", decryptedValue);

  return Number(decryptedValue);
};

export async function sendSignal(
  relayer,
  signer,
  contractAddress,
  delta,
  lastSignalPlain
) {
  console.log("准备signal: " + lastSignalPlain);
  const builder = relayer.createEncryptedInput(
    contractAddress,
    await signer.getAddress()
  );

  const contract = new Contract(contractAddress, CONTRACT_CONFIG.ABI, signer);

  const encrypted = await builder.add32(delta).encrypt();
  const tx = await contract.signal(
    encrypted.handles[0],
    encrypted.inputProof,
    lastSignalPlain
  );

  await tx.wait();
  return tx.hash;
}

export const checkIsOnCooldown = (last: number) => {
  const now = Date.now();
  // 24 hours in milliseconds
  const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000;
  const isOnCooldown = now - last < COOLDOWN_PERIOD; // 24h

  return isOnCooldown;
};
