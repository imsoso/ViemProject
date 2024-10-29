import { createPublicClient, http, parseAbiItem, formatUnits } from "viem";
import { mainnet } from "viem/chains";
import {} from "viem";
/*
1、使用Viem监听最新区块信息，监听新区块，打印区块高度和区块哈稀值  ，例如 20329474 (0x662022f0...cc0dea26)

2、实时采集并打印最新 USDT Token（0xdac17f958d2ee523a2206206994597c13d831ec7） Transfer 流水
如在 20329474 区块 0xe52ff...7ddcf 交易中从 0x65eDc7E1...5518AeF12 转账 50 USDT 到 0xa2D30559...30348f472
*/
const USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const client = createPublicClient({
  chain: mainnet,
  transport: http("https://rpc.flashbots.net"),
});

async function SubscribeNewBlock() {
  const unwatchBlocks = client.watchBlocks({
    onBlock: (block) =>
      console.log(`New block: ${block.number} (${block.hash})`),
  });

  const unwatchEvents = client.watchEvent({
    address: USDT_CONTRACT_ADDRESS,
    event: parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ),

    onLogs: (logs) => {
      logs.forEach((log) => {
        const { from, to, value } = log.args;
        if (value !== undefined) {
          console.log(
            `在${log.blockNumber} 区块 ${
              log.blockHash
            } 交易中 ${from} 转账 ${formatUnits(value, 6)} USDT 到 ${to}`
          );
        } else {
          console.log(`从 ${from} 转账 unknown value 到 ${to}`);
        }
      });
    },
  });
}
SubscribeNewBlock();
