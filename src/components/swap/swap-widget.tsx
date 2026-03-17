"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSol } from "@/lib/utils/format";
import { SOL_MINT } from "@/lib/utils/constants";
import { FundWalletButton } from "@/components/wallet/fund-wallet";

interface SwapWidgetProps {
  tokenMint: string;
  tokenSymbol: string;
  mode?: "buy" | "sell";
  onSuccess?: () => void;
}

interface Quote {
  requestId: string;
  inAmount: string;
  outAmount: string;
  minOutAmount: string;
  priceImpactPct: string;
  slippageBps: number;
}

export function SwapWidget({
  tokenMint,
  tokenSymbol,
  mode: initialMode = "buy",
  onSuccess,
}: SwapWidgetProps) {
  const { walletAddress, login, authenticated } = useAuth();
  const [mode, setMode] = useState<"buy" | "sell">(initialMode);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [error, setError] = useState("");

  const inputMint = mode === "buy" ? SOL_MINT : tokenMint;
  const outputMint = mode === "buy" ? tokenMint : SOL_MINT;

  const fetchQuote = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const lamports =
        mode === "buy"
          ? Math.floor(parseFloat(amount) * 1e9)
          : Math.floor(parseFloat(amount) * 1e9); // Assumes 9 decimals

      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: lamports.toString(),
      });

      const res = await fetch(`/api/tokens/swap/quote?${params}`);
      if (!res.ok) throw new Error("Failed to get quote");

      const data = await res.json();
      setQuote(data.quote);
    } catch {
      setError("Failed to get price quote");
    } finally {
      setLoading(false);
    }
  }, [amount, mode, inputMint, outputMint]);

  useEffect(() => {
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [fetchQuote]);

  async function handleSwap() {
    if (!quote || !walletAddress) return;
    setSwapping(true);
    setError("");

    try {
      const res = await fetch("/api/tokens/swap/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: walletAddress,
        }),
      });

      if (!res.ok) throw new Error("Swap failed");

      setAmount("");
      setQuote(null);
      onSuccess?.();
    } catch {
      setError("Swap failed. Please try again.");
    } finally {
      setSwapping(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {mode === "buy" ? "Buy" : "Sell"} ${tokenSymbol}
          </CardTitle>
          <div className="flex bg-secondary rounded-md p-0.5">
            <button
              onClick={() => setMode("buy")}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                mode === "buy"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setMode("sell")}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                mode === "sell"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Sell
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">
            {mode === "buy" ? "You pay (SOL)" : `You sell ($${tokenSymbol})`}
          </Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="text-lg"
          />
        </div>

        {quote && (
          <div className="bg-secondary p-3 rounded-md space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">You receive</span>
              <span className="font-medium">
                {mode === "buy"
                  ? `${(parseInt(quote.outAmount) / 1e9).toFixed(2)} $${tokenSymbol}`
                  : formatSol(parseInt(quote.outAmount))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Min. received</span>
              <span className="text-xs">
                {(parseInt(quote.minOutAmount) / 1e9).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price impact</span>
              <span className="text-xs">{quote.priceImpactPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-xs">
                {(quote.slippageBps / 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-xs text-muted-foreground text-center">
            Getting quote...
          </p>
        )}

        {error && <p className="text-destructive text-xs">{error}</p>}

        {!authenticated ? (
          <Button onClick={login} className="w-full">
            Sign In to {mode === "buy" ? "Buy" : "Sell"}
          </Button>
        ) : (
          <Button
            onClick={handleSwap}
            disabled={!quote || swapping || loading}
            className="w-full"
          >
            {swapping
              ? "Swapping..."
              : quote
                ? `${mode === "buy" ? "Buy" : "Sell"} $${tokenSymbol}`
                : "Enter amount"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
