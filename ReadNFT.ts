import { createPublicClient, http, parseEther } from "viem";
import { mainnet } from "viem/chains";
import { abi, address } from "./abi";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const tokenId = 114;
async function NFTOwner() {
  const owner = await client.readContract({
    address,
    abi,
    functionName: "ownerOf",
    args: [BigInt(tokenId)],
  });

  console.log(`The owner of NFT ${tokenId} is ${owner}`);
}

NFTOwner();
