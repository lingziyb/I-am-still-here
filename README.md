# I'm Still Here

[Demo Link](https://i-am-still-here.vercel.app) | [Zama Developer Program](https://www.zama.org/programs/developer-program)

> **One-line Introduction:**
> An anonymous check-in button for users inside restricted regions — click every day to tell the world “I’m still here.” Your identity is always encrypted, but everyone can see how many people are persisting like you today.

---

## 🌟 Project Inspiration

In certain environments, people cannot speak freely but still want to be seen. **I'm Still Here** provides a minimal yet powerful way:

* 🔒 **Strong Privacy**: Identity is fully encrypted and untraceable
* ❤️ **Real Social Significance**: Similar to “I am a 1989 Tiananmen witness,” “I care about Xinjiang/Hong Kong” — users can click secretly without speaking publicly
* 🌐 **Global Reach**: Users outside can share, and users inside silently check in daily
* 🔑 **Aligned with Zama Philosophy**: FHE is not just a toy — it is a tool to protect real humans

---

## ⚡ Core Features

1. **Daily Anonymous Check-in**

   * Users click the button to increment the daily count
   * Automatically resets at 00:00 UTC every day

2. **Real-time Total Display**

   * All user check-ins are stored encrypted
   * Total count is publicly visible while individual identities remain private

3. **Encrypted Timestamp Recording**

   * Each user’s last check-in timestamp is encrypted
   * Users can decrypt their own record to keep it private

---

## 🛠 Technical Highlights

**Built on Zama FHEVM with Fully Homomorphic Encryption (FHE):**

* **Smart Contract**

  * Uses `@fhevm/solidity/lib/FHE.sol` to encrypt user check-in data
  * `totalLive` is publicly decryptable while personal data remains encrypted
  * Daily cooldown logic ensures users can only check in once per UTC day

* **Frontend Integration**

  * `Relayer SDK` handles encrypted input and user key decryption
  * Users require no additional key management for secure check-ins

* **Privacy Design**

  * Fully anonymous check-ins; FHE ensures identity and activity data is never exposed on-chain
  * Public count creates community resonance

---

## 🏗 Technical Architecture

```
Browser UI
   │
   ▼
Relayer SDK (Encrypt / Decrypt)
   │
   ▼
Smart Contract (FHEVM)
   │
   ├─ totalLive (Publicly Decryptable)
   └─ lastSignalTime (User Private)
   │
Coprocessors + KMS (Off-chain FHE Execution & Key Management)
```

* **Frontend**: React + Vite + Lucide UI
* **Backend / Blockchain**: Solidity (FHEVM on Sepolia)
* **Encryption Tech**: Zama TFHE + MPC + Threshold KMS

---

## 🛠 Development & Deployment

### Install Dependencies

```bash
npm install
```

### Start Local Development

```bash
npm run dev
```

* Starts Vite dev server at `http://localhost:5173`

### Build Production Version

```bash
npm run build
```

* Compiles TypeScript and bundles frontend assets into `dist/`

### Preview Production Build

```bash
npm run preview
```

* Start local server to preview production build

### Deploy to Sepolia Testnet

```bash
npm run deploy
```

* Deploys `StillHere.sol` using Hardhat script
* Ensure `.env` contains wallet private key and network RPC

---

## 🚀 How to Use

1. Open [I'm Still Here](https://i-am-still-here.vercel.app)
2. Connect your wallet (MetaMask / EIP-712 compatible)
3. Click the “I’m Still Here” button
4. See today’s total increment and your encrypted timestamp recorded

> Resets daily at 00:00 UTC. Come back tomorrow to check in again.

---

## 📜 Contract Information

* **Sepolia Testnet Address**: `0x180d054D7D44FA58e421dA538556E006B7dFb793`
* **Main Methods**:

  * `signal(externalEuint32 encryptedValue, bytes attestation, uint256 lastSignalPlain)`
  * `getTotalLive()`
  * `getLastSignalTime()`

```
[
  {"inputs":[{"internalType":"externalEuint32","name":"encryptedValue","type":"bytes32"},{"internalType":"bytes","name":"attestation","type":"bytes"},{"internalType":"uint256","name":"lastSignalPlain","type":"uint256"}],"name":"signal","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getTotalLive","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getLastSignalTime","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}
]
```

---

## 🌏 Social Impact

* Provides a secure anonymous channel for users to show they are still present
* Encrypted counts let the community feel persistence in silence
* Demonstrates real-world value of FHE — privacy protection is not just a concept, it can save lives

---

## 🔗 Technical References

* [Zama FHEVM Whitepaper](./fhevm_whitepaper_new.pdf)
* [Relayer SDK Guide](https://docs.zama.ai/protocol/relayer-sdk-guides/)
* [Solidity FHE Library](https://github.com/zama-ai/fhevm-solidity)

> Special thanks to [Zama](https://www.zama.org) for providing FHEVM and the Relayer SDK, enabling a truly anonymous social check-in app without exposing user privacy.

---

## ✨ Future Plans

* Multi-language support for global users
* Optimize FHE performance for more real-time encrypted applications
* Expand to other chains to enable cross-chain anonymous check-ins

---

## 🎬 Project Demo

<img width="3584" height="1996" alt="Screenshot 1" src="https://github.com/user-attachments/assets/8a6ce2f8-9d3c-47d3-8c8b-7ba8e7631982" />

<img width="3584" height="1996" alt="image" src="https://github.com/user-attachments/assets/acc57b04-daa9-41e1-b236-3c4968cfa775" />

<img width="3584" height="1996" alt="Screenshot 2" src="https://github.com/user-attachments/assets/38d74ce6-29d3-4156-bd84-abce27cd38e6" />

<img width="3584" height="1996" alt="image" src="https://github.com/user-attachments/assets/e7c58661-a85a-4171-984c-426a97c08180" />

<img width="3584" height="1996" alt="image" src="https://github.com/user-attachments/assets/eaef76ee-5218-416f-87f5-4a64e517aa8c" />

> A minimal interface: a few lines of text + one button, capable of conveying strong social meaning.
