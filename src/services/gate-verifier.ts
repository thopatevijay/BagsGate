import { PublicKey } from "@solana/web3.js";
import { getSolanaConnection } from "@/lib/bags/client";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

interface GateCheckResult {
  hasAccess: boolean;
  balance: bigint;
  requiredAmount: bigint;
  deficit: bigint;
}

export async function checkTokenBalance(
  walletAddress: string,
  tokenMint: string
): Promise<bigint> {
  const connection = getSolanaConnection();
  const wallet = new PublicKey(walletAddress);
  const mint = new PublicKey(tokenMint);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
    mint,
    programId: TOKEN_PROGRAM_ID,
  });

  if (tokenAccounts.value.length === 0) return BigInt(0);

  let totalBalance = BigInt(0);
  for (const account of tokenAccounts.value) {
    const amount = account.account.data.parsed.info.tokenAmount.amount;
    totalBalance += BigInt(amount);
  }

  return totalBalance;
}

export async function verifyGateAccess(
  walletAddress: string,
  tokenMint: string,
  requiredAmount: bigint
): Promise<GateCheckResult> {
  const balance = await checkTokenBalance(walletAddress, tokenMint);
  const hasAccess = balance >= requiredAmount;
  const deficit = hasAccess ? BigInt(0) : requiredAmount - balance;

  return {
    hasAccess,
    balance,
    requiredAmount,
    deficit,
  };
}

export async function verifyTieredAccess(
  walletAddress: string,
  tokenMint: string,
  tiers: { name: string; requiredAmount: number }[]
): Promise<{ currentTier: string | null; balance: bigint }> {
  const balance = await checkTokenBalance(walletAddress, tokenMint);

  const sortedTiers = [...tiers].sort(
    (a, b) => b.requiredAmount - a.requiredAmount
  );

  for (const tier of sortedTiers) {
    if (balance >= BigInt(tier.requiredAmount)) {
      return { currentTier: tier.name, balance };
    }
  }

  return { currentTier: null, balance };
}

// Cache for balance checks (60s TTL)
const balanceCache = new Map<
  string,
  { balance: bigint; timestamp: number }
>();
const CACHE_TTL = 60_000;

export async function checkTokenBalanceCached(
  walletAddress: string,
  tokenMint: string
): Promise<bigint> {
  const key = `${walletAddress}:${tokenMint}`;
  const cached = balanceCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.balance;
  }

  const balance = await checkTokenBalance(walletAddress, tokenMint);
  balanceCache.set(key, { balance, timestamp: Date.now() });
  return balance;
}

export function invalidateBalanceCache(
  walletAddress: string,
  tokenMint: string
) {
  balanceCache.delete(`${walletAddress}:${tokenMint}`);
}
