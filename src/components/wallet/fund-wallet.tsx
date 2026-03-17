"use client";

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

  if (!authenticated || !walletAddress) return null;

  async function handleFund() {
    if (!walletAddress) return;
    await fundWallet({ address: walletAddress });
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleFund}
      className={className}
    >
      {label}
    </Button>
  );
}
