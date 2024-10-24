import { createPublicClient, http, formatUnits } from "viem";
import { mainnet } from "viem/chains";
import { parseAbiItem } from "viem";

// USDC Contract Address on Ethereum Mainnet
const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// Create a client to interact with the Ethereum blockchain
const client = createPublicClient({
  chain: mainnet,
  transport: http("https://rpc.flashbots.net"),
});

async function getUSDCTransfers() {
  console.log("Searching for the latest 100 blocks with USDC transfers...");

  const filter = await client.createEventFilter({
    address: USDC_CONTRACT_ADDRESS,
    event: parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ),
    fromBlock: BigInt(await client.getBlockNumber()) - BigInt(100),
    toBlock: "latest",
  });

  const transferEvents = await client.getFilterLogs({ filter });

  for (const log of transferEvents) {
    const { from, to, value } = log.args || {};
    if (from && to && value) {
      const usdcAmount = formatUnits(value, 6); // USDC has 6 decimals
      console.log(
        `从 ${from} 转账给 ${to} ${usdcAmount} USDC, 交易ID：${log.transactionHash}`
      );
    } else {
      console.log("日志解析错误：", log);
    }
  }
}

// Call the function to get USDC transfer events
getUSDCTransfers();
