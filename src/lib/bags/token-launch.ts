import { getBagsHeaders, getBagsUrl } from "./client";
import type { TokenLaunchInfo, FeeShareConfig, FeeShareConfigParams } from "./types";

export async function createTokenInfo(params: {
  name: string;
  symbol: string;
  description: string;
  imageUrl?: string;
  image?: File;
  telegram?: string;
  twitter?: string;
  website?: string;
}): Promise<TokenLaunchInfo> {
  const formData = new FormData();
  formData.append("name", params.name);
  formData.append("symbol", params.symbol);
  formData.append("description", params.description);

  if (params.image) {
    formData.append("image", params.image);
  } else if (params.imageUrl) {
    formData.append("imageUrl", params.imageUrl);
  }

  if (params.telegram) formData.append("telegram", params.telegram);
  if (params.twitter) formData.append("twitter", params.twitter);
  if (params.website) formData.append("website", params.website);

  const res = await fetch(getBagsUrl("/token-launch/create-token-info"), {
    method: "POST",
    headers: { "x-api-key": process.env.BAGS_API_KEY || "" },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create token info: ${error}`);
  }

  return res.json();
}

export async function configureFeeShare(
  params: FeeShareConfigParams
): Promise<FeeShareConfig> {
  const res = await fetch(getBagsUrl("/fee-share/config"), {
    method: "POST",
    headers: getBagsHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to configure fee share: ${error}`);
  }

  return res.json();
}

export async function createLaunchTransaction(params: {
  ipfs: string;
  tokenMint: string;
  wallet: string;
  initialBuyLamports: number;
  configKey: string;
  tipWallet?: string;
  tipLamports?: number;
}): Promise<string> {
  const res = await fetch(
    getBagsUrl("/token-launch/create-launch-transaction"),
    {
      method: "POST",
      headers: getBagsHeaders(),
      body: JSON.stringify(params),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create launch transaction: ${error}`);
  }

  const data = await res.json();
  return data.transaction;
}
