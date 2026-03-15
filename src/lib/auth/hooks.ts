"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";

export function useAuth() {
  const { user, authenticated, login, logout, ready } = usePrivy();
  const { wallets } = useWallets();

  const solanaWallet =
    wallets.find((w) => w.walletClientType === "privy") ?? wallets[0] ?? null;

  return {
    user,
    authenticated,
    ready,
    login,
    logout,
    solanaWallet,
    walletAddress: solanaWallet?.address ?? null,
  };
}
