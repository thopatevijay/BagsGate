import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function formatSol(lamports: number | bigint): string {
  const sol = Number(lamports) / LAMPORTS_PER_SOL;
  if (sol < 0.001) return "<0.001 SOL";
  if (sol < 1) return `${sol.toFixed(3)} SOL`;
  if (sol < 1000) return `${sol.toFixed(2)} SOL`;
  return `${sol.toLocaleString(undefined, { maximumFractionDigits: 1 })} SOL`;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  return `${(num / 1_000_000_000).toFixed(1)}B`;
}

export function formatAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(1)}%`;
}

export function formatTokenAmount(
  amount: number | bigint,
  decimals = 9
): string {
  const num = Number(amount) / Math.pow(10, decimals);
  if (num < 0.01) return "<0.01";
  if (num < 1000) return num.toFixed(2);
  return formatNumber(num);
}
