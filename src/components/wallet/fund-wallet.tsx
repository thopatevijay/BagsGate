"use client";

import { useState } from "react";
import { useFundWallet } from "@privy-io/react-auth";
import { useAuth } from "@/lib/auth/hooks";
import { Button } from "@/components/ui/button";

export function FundWalletButton({
  size = "default",
  variant = "outline",
  className,
  label = "Fund Wallet",
}: {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  label?: string;
}) {
  const { walletAddress, authenticated } = useAuth();
  const { fundWallet } = useFundWallet();
  const [error, setError] = useState("");

  if (!authenticated || !walletAddress) return null;

  async function handleFund() {
    if (!walletAddress) return;
    setError("");

    try {
      await fundWallet({
        address: walletAddress,
        options: {
          fundingParams: {
            tokenAddress: "So11111111111111111111111111111111111111112",
            chain: "solana",
          },
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to open funding";
      setError(message);
    }
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handleFund}
        className={className}
      >
        {label}
      </Button>
      {error && (
        <div className="absolute top-full mt-2 right-0 z-50 w-72 p-3 rounded-lg bg-[#141620] border border-[#252838] text-xs text-[#8b8fa3] shadow-lg">
          <p className="mb-1 font-medium text-[#eeeef0]">Error</p>
          <p>{error}</p>
          <button
            onClick={() => setError("")}
            className="mt-2 text-[#7c3aed] hover:underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
