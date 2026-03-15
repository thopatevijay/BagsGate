import { Connection } from "@solana/web3.js";

const BAGS_API_URL =
  process.env.NEXT_PUBLIC_BAGS_API_URL ||
  "https://public-api-v2.bags.fm/api/v1";
const BAGS_API_KEY = process.env.BAGS_API_KEY || "";

export function getBagsHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-api-key": BAGS_API_KEY,
  };
}

export function getBagsUrl(path: string): string {
  return `${BAGS_API_URL}${path}`;
}

export function getSolanaConnection(): Connection {
  const rpcUrl =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    "https://api.mainnet-beta.solana.com";
  return new Connection(rpcUrl, "confirmed");
}
