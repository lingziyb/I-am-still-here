# I’m Still Here

[Demo 链接](https://i-am-still-here.vercel.app) | [Zama 开发者计划](https://www.zama.org/programs/developer-program)

> **一句话介绍：**
> 一个专属于「墙内用户」的匿名打卡按钮——每天点一下，告诉世界「我还在这里」。你的身份永远加密，但所有人能看到今天还有多少人和你一样在坚持。

---

## 🌟 项目灵感

在某些环境下，人们无法公开表达自己，但仍希望被看见。**I’m Still Here** 提供了极简而强大的方式：

- 🔒 **强隐私需求**：身份完全加密，无法追踪  
- ❤️ **真实社会意义**：类似「我是 8964 见证者」「我是新疆/香港关心者」——敢偷偷点，但不敢公开发声  
- 🌐 **全球传播力**：墙外用户易于分享，墙内用户默默每天打卡  
- 🔑 **完美贴合 Zama 理念**：FHE 不只是玩具，它是保护真实人类的工具

---

## ⚡ 核心功能

1. **每日匿名打卡**  
   - 用户点击按钮，即可为当天计数加一  
   - 每日 UTC 0 点自动归零  

2. **实时总数显示**  
   - 所有用户的累计「还在这里」人数加密存储  
   - 总数对所有人公开，但个人身份永远保密  

3. **加密时间戳记录**  
   - 每个用户的最后一次打卡时间加密存储  
   - 用户可自行解密自己的记录，保证私密性

---

## 🛠 技术亮点

**基于 Zama FHEVM 的全同态加密（FHE）智能合约：**

- **智能合约**  
  - 使用 `@fhevm/solidity/lib/FHE.sol` 加密用户打卡数据  
  - `totalLive` 对所有人可公开解密，个人信息永远加密  
  - 每日冷却逻辑保证用户每天只能打一次卡  

- **前端集成**  
  - `Relayer SDK` 处理加密输入与用户私钥解密  
  - 用户无需额外密钥管理或复杂操作，即可安全打卡  

- **隐私设计**  
  - 完全匿名打卡，FHE 确保身份和行为数据在链上永不泄露  
  - 公共计数对所有人可见，实现社群共鸣

---

## 🏗 技术架构

```
Browser UI
   │
   ▼
Relayer SDK (加密 / 解密)
   │
   ▼
Smart Contract (FHEVM)
   │
   ├─ totalLive (公开解密)
   └─ lastSignalTime (用户私密)
   │
Coprocessors + KMS (off-chain FHE 执行 & key 管理)
```

- **前端**：React + Vite + Lucide UI  
- **后端 / 区块链**：Solidity (FHEVM on Sepolia)  
- **加密技术**：Zama TFHE + MPC + Threshold KMS

---

## 🚀 如何使用

1. 打开 [I’m Still Here](https://i-am-still-here.vercel.app)  
2. 连接钱包（MetaMask / 支持 EIP-712 签名的钱包）  
3. 点击「我还在这里」按钮  
4. 看到今日打卡总人数增加，并记录你的加密时间戳  

> 每天 UTC 0 点自动归零，明天继续坚持。

---

## 📜 合约信息

- **Sepolia 测试网地址**：`0x180d054D7D44FA58e421dA538556E006B7dFb793`  
- **主要方法**：
  - `signal(externalEuint32 encryptedValue, bytes attestation, uint256 lastSignalPlain)`  
  - `getTotalLive()`  
  - `getLastSignalTime()`

---

## 🌏 社会影响

- 提供安全匿名渠道，让用户每天向世界证明存在感  
- 加密计数让社群感受到沉默中的坚持  
- 展示 FHE 技术的真实社会价值——隐私保护不仅是概念，而是救命工具

---

## 🔗 技术参考

- [Zama FHEVM 白皮书](./fhevm_whitepaper_new.pdf)  
- [Relayer SDK 指南](https://docs.zama.ai/protocol/relayer-sdk-guides/)  
- [Solidity FHE Library](https://github.com/zama-ai/fhevm-solidity)

---

## ✨ 未来计划

- 多语言支持，面向全球用户  
- 优化 FHE 性能，实现更多实时加密应用  
- 推广到其他链，实现跨链匿名打卡

---

## 🎬 项目演示

![Screenshot](./screenshot.png)

> 一个极简界面，几行文字 + 一个按钮，即可改变用户感受。

