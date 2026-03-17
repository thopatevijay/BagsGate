/**
 * Register BagsGate as a Bags Partner
 *
 * Run once to create the partner config PDA.
 * This allows the platform to earn partner fees on all token launches through BagsGate.
 *
 * Usage:
 *   npx tsx scripts/register-partner.ts
 *
 * Prerequisites:
 *   - BAGS_API_KEY set in .env
 *   - PLATFORM_WALLET_ADDRESS set in .env
 *   - Platform wallet must have SOL for the transaction
 *
 * After running:
 *   - Copy the partnerConfigPda from the output
 *   - Set PLATFORM_PARTNER_CONFIG_PDA in .env
 */

import "dotenv/config";

const BAGS_API_URL = process.env.NEXT_PUBLIC_BAGS_API_URL || "https://public-api-v2.bags.fm/api/v1";
const BAGS_API_KEY = process.env.BAGS_API_KEY;
const PLATFORM_WALLET = process.env.PLATFORM_WALLET_ADDRESS;

async function main() {
  if (!BAGS_API_KEY) {
    console.error("Error: BAGS_API_KEY not set in .env");
    process.exit(1);
  }

  if (!PLATFORM_WALLET) {
    console.error("Error: PLATFORM_WALLET_ADDRESS not set in .env");
    process.exit(1);
  }

  console.log("Registering BagsGate as Bags Partner...");
  console.log(`Wallet: ${PLATFORM_WALLET}`);

  const res = await fetch(`${BAGS_API_URL}/fee-share/partner-config/creation-tx`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": BAGS_API_KEY,
    },
    body: JSON.stringify({ wallet: PLATFORM_WALLET }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error(`Failed: ${res.status} — ${error}`);
    process.exit(1);
  }

  const data = await res.json();

  console.log("\nPartner config created!");
  console.log(`Partner Config PDA: ${data.partnerConfigPda}`);
  console.log(`\nTransaction (sign and send): ${data.transaction ? "Yes" : "No"}`);
  console.log(`\nNext steps:`);
  console.log(`1. Sign and send the transaction with your platform wallet`);
  console.log(`2. Set PLATFORM_PARTNER_CONFIG_PDA=${data.partnerConfigPda} in .env`);
}

main().catch(console.error);
