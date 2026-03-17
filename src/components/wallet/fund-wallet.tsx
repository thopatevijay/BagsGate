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
      await fundWallet({ address: walletAddress });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to open funding";

      if (message.includes("not enabled")) {
        setError(
          "Funding not enabled. Send SOL directly to your wallet: " +
            walletAddress
        );
      } else {
        setError(message);
      }
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
          <p className="mb-1 font-medium text-[#eeeef0]">Fund your wallet</p>
          <p>{error}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(walletAddress || "");
              setError("Address copied!");
              setTimeout(() => setError(""), 2000);
            }}
            className="mt-2 text-[#7c3aed] hover:underline text-xs"
          >
            Copy wallet address
          </button>
        </div>
      )}
    </div>
  );
}
