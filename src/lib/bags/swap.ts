import { getBagsHeaders, getBagsUrl } from "./client";
import type { TradeQuote, SwapResponse } from "./types";

export async function getQuote(params: {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageMode?: "auto" | "manual";
  slippageBps?: number;
}): Promise<TradeQuote> {
  const searchParams = new URLSearchParams({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount.toString(),
  });

  if (params.slippageMode) {
    searchParams.set("slippageMode", params.slippageMode);
  }
  if (params.slippageBps !== undefined) {
    searchParams.set("slippageBps", params.slippageBps.toString());
  }

  const res = await fetch(
    getBagsUrl(`/trade/quote?${searchParams.toString()}`),
    { headers: getBagsHeaders() }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get quote: ${error}`);
  }

  return res.json();
}

export async function executeSwap(params: {
  quoteResponse: TradeQuote;
  userPublicKey: string;
}): Promise<SwapResponse> {
  const res = await fetch(getBagsUrl("/trade/swap"), {
    method: "POST",
    headers: getBagsHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to execute swap: ${error}`);
  }

  return res.json();
}
