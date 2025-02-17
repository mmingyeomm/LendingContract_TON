import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import { PoolStorage } from "../wrappers/PoolStorage"; // Import the PoolStorage wrapper

export async function run() {
  // Initialize TON RPC client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // Open PoolStorage instance by address
  const poolStorageAddress = Address.parse("kQBqYaM8OtVDu-Il5oXkAch2d_kqm9wqzvebdxun9ULqIX7m"); // Replace with your PoolStorage contract address
  const poolStorage = new PoolStorage(poolStorageAddress);
  const poolStorageContract = client.open(poolStorage);

  // Call the getStoredData() method on-chain
  const storedData = await poolStorageContract.getStoredData();

  // Display the results
  console.log("Supply Cell:", storedData.supplyCell.toString());
  console.log("User Address:", storedData.address.toString());
  console.log("User Amount:", storedData.value.toString());
}
