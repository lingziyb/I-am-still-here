import { ethers, Contract } from "ethers";
import { CONTRACT_CONFIG } from "../constants";

// @ts-ignore
import { initSDK, createInstance, SepoliaConfig } from "https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.js";

const STORAGE_KEY = "still_here_last_signal";

// Browser polyfills
if (typeof window !== "undefined" && !window.global) {
  (window as any).global = window;
}

export async function initFhevmNoSign() {
  await initSDK();

  const config = {
    ...SepoliaConfig,
    relayerUrl: "https://relayer.testnet.zama.org",
  };
  const relayer = await createInstance(config);

  console.log("FHEVM instance initialized successfully with relayer-sdk");

  return { relayer };
}

export async function getTotalLiveNoSign(relayer: any) {
  const provider = new ethers.JsonRpcProvider(
    "https://ethereum-sepolia.publicnode.com"
  );

  const contract = new Contract(
    CONTRACT_CONFIG.ADDRESS,
    ["function getTotalLive() external view returns (bytes32)"],
    provider
  );

  const encryptedHandle = await contract.getTotalLive();
  console.log(444, relayer, contract, encryptedHandle)

  if (!encryptedHandle || encryptedHandle === "0x") {
    throw new Error("Invalid encrypted handle");
  }

  const value = await relayer.publicDecrypt([encryptedHandle], "uint32");
  console.log(555, value)

  return Number(value);
}

/**
 * get Last SignalTime
 */
export const getLastSignalTime = async (
  relayer: any,
  signer: any
): Promise<number> => {
  const contract = new Contract(
    CONTRACT_CONFIG.ADDRESS,
    CONTRACT_CONFIG.ABI,
    signer
  );

  // 1️⃣ get encrypt handle
  const encryptedHandle: string = await contract.getLastSignalTime();
  console.log("Encrypted handle:", encryptedHandle);

  // 2️⃣ if handle 0，user not signal
  if (/^0x0+$/.test(encryptedHandle)) {
    console.log("User has no lastSignalTime yet");
    return Number(0); // 或返回 0
  }

  // 2️⃣ generate keypair
  const keypair = relayer.generateKeypair();

  // 3️⃣ create EIP-712 signdata
  const startTimestamp = Math.floor(Date.now() / 1000).toString();
  const durationDays = "10";
  const contractAddresses = [CONTRACT_CONFIG.ADDRESS];

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

  // 4️⃣ userDecrypt decrypt
  const result = await relayer.userDecrypt(
    [{ handle: encryptedHandle, contractAddress: CONTRACT_CONFIG.ADDRESS }],
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

export async function connectWallet() {
  if (typeof window === "undefined")
    throw new Error("FHE initialization must run in the browser context");

  // signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);

  if (!accounts || accounts.length === 0) throw new Error("Permission denied");

  const signer = await provider.getSigner();

  return signer;
}

export async function sendSignal(relayer, delta, signer, lastSignalPlain) {
  // sendSignal
  console.log("signal: " + lastSignalPlain);
  
  const builder = relayer.createEncryptedInput(
    CONTRACT_CONFIG.ADDRESS,
    await signer.getAddress()
  );

  const contract = new Contract(
    CONTRACT_CONFIG.ADDRESS,
    CONTRACT_CONFIG.ABI,
    signer
  );

  const encrypted = await builder.add32(delta).encrypt();
  const tx = await contract.signal(
    encrypted.handles[0],
    encrypted.inputProof,
    lastSignalPlain
  );

  await tx.wait();
  return tx.hash;
}

export const checkIsOnCooldown = () => {
  const now = Date.now();
  const nextUTC0 = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate() + 1,
    0,
    0,
    0,
    0
  );

  return now < nextUTC0;
};

export const getLocalSignalTime = () => {
  const lastSignal = localStorage.getItem(STORAGE_KEY) || "";
  const lastTime = lastSignal ? parseInt(lastSignal, 10) : 0;

  return lastTime;
};

export const setLocalSignalTime = (time: number) => {
  localStorage.setItem(STORAGE_KEY, time.toString());
};
