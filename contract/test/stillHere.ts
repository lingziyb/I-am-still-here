import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("StillHere", function () {
    let contract: Contract;
    let owner: SignerWithAddress;
    let contractAddress: string;

    const COOLDOWN = 86400; // 24小时冷却期 (秒)
    const SIGNAL_DELTA = 1; // 每次信号增加的值

    // 辅助函数：获取并解密用户的上一次信号时间
async function getDecryptedLastSignalTime(user: SignerWithAddress): Promise<number> {
    const encryptedTime = await contract.connect(user).getLastSignalTime();

    const clearTime = await fhevm.userDecryptEuint(
        FhevmType.euint256,
        encryptedTime,
        contractAddress,
        user
    );

    return Number(clearTime);
}


    // 辅助函数：发送信号交易
    async function sendSignal(user: SignerWithAddress, lastSignalPlain: number) {
        // 1. 加密 Delta (1) 并生成 Proof
        const buildDelta = fhevm.createEncryptedInput(contractAddress, user.address);
        const encryptedDelta = await buildDelta.add32(SIGNAL_DELTA).encrypt();

        // 2. 调用 signal 函数
        return contract.connect(user).signal(
            encryptedDelta.handles[0], // externalEuint32 handle
            encryptedDelta.inputProof, // attestation
            lastSignalPlain            // 明文时间戳 (用于 require 检查)
        );
    }
    
    // 辅助函数：解密总活跃数
async function getDecryptedTotalLive(user: SignerWithAddress): Promise<number> {
    const encryptedTotal = await contract.connect(user).getTotalLive();

    const clearTotal = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encryptedTotal,
        contractAddress,
        user
    );

    return Number(clearTotal);
}


    before(async function () {
        [owner] = await ethers.getSigners();
        await fhevm.initializeCLIApi();

        // 部署合约
        const StillHereFactory = await ethers.getContractFactory("StillHere");
        contract = await StillHereFactory.deploy();
        contractAddress = await contract.getAddress();
        console.log(`\n已部署 StillHere 合约至: ${contractAddress}`);
    });

    it("Case 1: 首次信号应成功，并更新 totalLive 和 lastSignalTime", async function () {
        // 首次信号，上一次信号时间为 0
        const lastSignalPlain = 0; 
        
        await sendSignal(owner, lastSignalPlain);

        // 检查 totalLive 
        const totalLive = await getDecryptedTotalLive(owner);
        expect(totalLive).to.equal(SIGNAL_DELTA, "总活跃数应为 1");

        // 检查 lastSignalTime
        const lastSignal = await getDecryptedLastSignalTime(owner);
        // 检查 lastSignalTime 是否接近当前的区块时间
        const blockTimestamp = (await ethers.provider.getBlock("latest"))!.timestamp;
        expect(lastSignal).to.be.closeTo(blockTimestamp, 5, "上次信号时间应接近当前区块时间");
    });

    it("Case 2: 在冷却期内再次信号，应失败并抛出 'Cooldown not passed'", async function () {
        // 尝试立即再次发送信号 (上一次信号时间已加密存储)
        const currentLastSignal = await getDecryptedLastSignalTime(owner);

        // 冷却期未过，预期交易失败
        await expect(sendSignal(owner, currentLastSignal)).to.be.revertedWith("Cooldown not passed");
        
        // 验证 totalLive 未变
        const totalLive = await getDecryptedTotalLive(owner);
        expect(totalLive).to.equal(SIGNAL_DELTA, "总活跃数应仍为 1");
    });

    it("Case 3: 冷却期过后再次信号，应成功并使 totalLive 增加", async function () {
        // 推进区块时间，超过冷却期 (86400秒)
        await ethers.provider.send("evm_increaseTime", [COOLDOWN + 100]); 
        await ethers.provider.send("evm_mine"); // 挖掘新区块

        // 获取上一次成功的信号时间
        const currentLastSignal = await getDecryptedLastSignalTime(owner);
        
        // 再次发送信号，预期成功
        await sendSignal(owner, currentLastSignal);

        // 检查 totalLive 
        const totalLive = await getDecryptedTotalLive(owner);
        expect(totalLive).to.equal(SIGNAL_DELTA * 2, "总活跃数应为 2");

        // 检查 lastSignalTime 是否更新
        const newLastSignal = await getDecryptedLastSignalTime(owner);
        const newBlockTimestamp = (await ethers.provider.getBlock("latest"))!.timestamp;
        expect(newLastSignal).to.be.closeTo(newBlockTimestamp, 5, "上次信号时间应已更新");
    });
});