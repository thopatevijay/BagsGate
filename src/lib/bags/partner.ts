import { getBagsHeaders, getBagsUrl } from "./client";
import type { PartnerConfigStats } from "./types";

export async function createPartnerConfig(params: {
  wallet: string;
}): Promise<{ transaction: string; partnerConfigPda: string }> {
  const res = await fetch(
    getBagsUrl("/fee-share/partner-config/creation-tx"),
    {
      method: "POST",
      headers: getBagsHeaders(),
      body: JSON.stringify(params),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create partner config: ${error}`);
  }

  return res.json();
}

export async function claimPartnerFees(params: {
  wallet: string;
}): Promise<{ transaction: string }> {
  const res = await fetch(getBagsUrl("/fee-share/partner-config/claim-tx"), {
    method: "POST",
    headers: getBagsHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to claim partner fees: ${error}`);
  }

  return res.json();
}

export async function getPartnerStats(
  wallet: string
): Promise<PartnerConfigStats> {
  const res = await fetch(
    getBagsUrl(`/fee-share/partner-config/stats?wallet=${wallet}`),
    { headers: getBagsHeaders() }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get partner stats: ${error}`);
  }

  return res.json();
}
