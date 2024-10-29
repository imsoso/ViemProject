import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import {} from "viem";
/*
使用Viem监听最新区块信息，监听新区块，打印区块高度和区块哈稀值  ，例如 20329474 (0x662022f0...cc0dea26)
*/

const client = createPublicClient({
  chain: mainnet,
  transport: http("https://rpc.flashbots.net"),
});

async function SubscribeNewBlock() {
  const unwatch = client.watchBlocks({
    onBlock: (block) =>
      console.log(`New block: ${block.number} (${block.hash})`),
  });
}

SubscribeNewBlock();
