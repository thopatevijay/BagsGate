"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";

export function useAuth() {
  const { user, authenticated, login, logout, ready } = usePrivy();
  const { wallets } = useWallets();

  // Find the embedded Privy wallet
  const solanaWallet =
    wallets.find((w) => w.walletClientType === "privy") ??
    wallets[0] ??
    null;

  // Fallback: get wallet address from Privy user object
  const walletFromUser = user?.wallet?.address ?? null;
  const walletAddress = solanaWallet?.address ?? walletFromUser;

  return {
    user,
    authenticated,
    ready,
    login,
    logout,
    solanaWallet,
    walletAddress,
  };
}
