export const APP_TITLE = "Still Here";
export const APP_SUBTITLE = "Alive.";
export const ZAMA_NETWORK_NAME = "Ethereum Sepolia";

export const FHE_EXPLANATION = `
  This is a distress signal based on Zama FHE (Fully Homomorphic Encryption).
  
  When you click the button:
  1. Your device requests Zama Gateway authorization (EIP-712).
  2. An encrypted '1' (ciphertext) is generated locally.
  3. Your address, IP, and identity are completely unlinkable to this '1'.
  
  No one knows who you are. No one knows where you are.
  But the whole world knows: You are still here.
`;

export const CONTRACT_CONFIG = {
  ADDRESS: "0x180d054D7D44FA58e421dA538556E006B7dFb793",
  ABI: [
    {
      inputs: [
        {
          internalType: "externalEuint32",
          name: "encryptedValue",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "attestation",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "lastSignalPlain",
          type: "uint256",
        },
      ],
      name: "signal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ZamaProtocolUnsupported",
      type: "error",
    },
    {
      inputs: [],
      name: "confidentialProtocolId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getLastSignalTime",
      outputs: [
        {
          internalType: "euint256",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTotalLive",
      outputs: [
        {
          internalType: "euint32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};
