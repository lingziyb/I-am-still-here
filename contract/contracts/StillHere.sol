// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {
    FHE,
    euint32,
    externalEuint32,
    euint256
} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract StillHere is ZamaEthereumConfig {
    euint32 private totalLive;
    mapping(address => euint256) private lastSignalTime;

    // uint256 private constant COOLDOWN = 86400;

    constructor() {
        totalLive = FHE.asEuint32(0);
        FHE.allowThis(totalLive);
        FHE.makePubliclyDecryptable(totalLive);
    }

    function signal(
        externalEuint32 encryptedValue,
        bytes calldata attestation,
        uint256 lastSignalPlain
    ) external {
        if (lastSignalPlain != 0) {

            // 冷却逻辑：每日 UTC 0 点刷新
            uint256 lastDay = lastSignalPlain / 1 days; // 上一次签到的 UTC 日
            uint256 todayDay = block.timestamp / 1 days; // 当前 UTC 日
            require(todayDay > lastDay, "Can only signal once per UTC day");
        }

        // 接收 delta（但 不做验证）
        euint32 delta = FHE.fromExternal(encryptedValue, attestation);

        // totalLive += delta;
        totalLive = FHE.add(totalLive, delta);

        FHE.allowThis(totalLive);
        FHE.makePubliclyDecryptable(totalLive);

        euint256 ct = FHE.asEuint256(block.timestamp);
        lastSignalTime[msg.sender] = ct;

        FHE.allowThis(ct);
        FHE.allow(ct, msg.sender);
    }

    function getTotalLive() external view returns (euint32) {
        return totalLive;
    }

    function getLastSignalTime() external view returns (euint256) {
        return lastSignalTime[msg.sender];
    }
}
