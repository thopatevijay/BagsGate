import { getBagsHeaders, getBagsUrl } from "./client";
import type { ClaimablePosition, ClaimStats } from "./types";

export async function getClaimablePositions(
  wallet: string
): Promise<ClaimablePosition[]> {
  const res = await fetch(
    getBagsUrl(`/token-launch/claimable-positions?wallet=${wallet}`),
    { headers: getBagsHeaders() }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get claimable positions: ${error}`);
  }

  return res.json();
}

export async function generateClaimTransactions(params: {
  wallet: string;
  tokenMint: string;
}): Promise<{ transactions: string[] }> {
  const res = await fetch(getBagsUrl("/token-launch/claim-txs/v3"), {
    method: "POST",
    headers: getBagsHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to generate claim transactions: ${error}`);
  }

  return res.json();
}

export async function getClaimStats(params: {
  tokenMint: string;
  wallet: string;
}): Promise<ClaimStats> {
  const searchParams = new URLSearchParams({
    tokenMint: params.tokenMint,
    wallet: params.wallet,
  });

  const res = await fetch(
    getBagsUrl(`/token-launch/claim-stats?${searchParams.toString()}`),
    { headers: getBagsHeaders() }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get claim stats: ${error}`);
  }

  return res.json();
}

export async function getLifetimeFees(
  tokenMint: string
): Promise<{ totalFees: string }> {
  const res = await fetch(
    getBagsUrl(`/token-launch/lifetime-fees?tokenMint=${tokenMint}`),
    { headers: getBagsHeaders() }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get lifetime fees: ${error}`);
  }

  return res.json();
}
