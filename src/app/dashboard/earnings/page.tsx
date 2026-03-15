"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatSol, formatRelativeTime } from "@/lib/utils/format";

interface TokenStats {
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
  mintAddress: string;
  totalClaimed: string;
  totalUnclaimed: string;
  lifetimeFees: string;
  claimHistory: { amount: string; timestamp: number; txSignature: string }[];
}

interface Summary {
  totalClaimed: string;
  totalUnclaimed: string;
  totalLifetime: string;
}

interface ClaimablePosition {
  tokenMint: string;
  positionType: string;
  claimableAmount: string;
}

export default function EarningsPage() {
  const { getAccessToken } = usePrivy();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [tokenStats, setTokenStats] = useState<TokenStats[]>([]);
  const [claimablePositions, setClaimablePositions] = useState<ClaimablePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/fees/stats", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        setTokenStats(data.tokens);
        setClaimablePositions(data.claimablePositions || []);
      }
    } catch (err) {
      console.error("Failed to fetch fee stats:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  async function handleClaim(tokenMint: string) {
    setClaiming(tokenMint);
    try {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/fees/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tokenMint }),
      });

      if (!res.ok) throw new Error("Claim failed");

      // Refresh stats after claim
      await fetchStats();
    } catch (err) {
      console.error("Claim failed:", err);
    } finally {
      setClaiming(null);
    }
  }

  async function handleClaimAll() {
    for (const pos of claimablePositions) {
      await handleClaim(pos.tokenMint);
    }
  }

  const totalUnclaimed = parseInt(summary?.totalUnclaimed || "0");
  const totalClaimed = parseInt(summary?.totalClaimed || "0");
  const totalLifetime = parseInt(summary?.totalLifetime || "0");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Earnings & Fees</h1>
        {totalUnclaimed > 0 && (
          <Button
            onClick={handleClaimAll}
            disabled={claiming !== null}
          >
            {claiming ? "Claiming..." : "Claim All Fees"}
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unclaimed Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : formatSol(totalUnclaimed)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Claimed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : formatSol(totalClaimed)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lifetime Fees (All Traders)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : formatSol(totalLifetime)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Per-Token Breakdown */}
      {tokenStats.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold">Per Token</h2>
          {tokenStats.map((ts) => {
            const unclaimed = parseInt(ts.totalUnclaimed || "0");
            return (
              <Card key={ts.tokenId}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{ts.tokenName}</h3>
                        <Badge variant="outline">${ts.tokenSymbol}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Claimed: {formatSol(parseInt(ts.totalClaimed || "0"))}</span>
                        <span>Unclaimed: {formatSol(unclaimed)}</span>
                        <span>Lifetime: {formatSol(parseInt(ts.lifetimeFees || "0"))}</span>
                      </div>
                    </div>
                    {unclaimed > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleClaim(ts.mintAddress)}
                        disabled={claiming === ts.mintAddress}
                      >
                        {claiming === ts.mintAddress ? "Claiming..." : "Claim"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Claim History */}
      <Card>
        <CardHeader>
          <CardTitle>Claim History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : tokenStats.every((ts) => ts.claimHistory.length === 0) ? (
            <p className="text-muted-foreground text-sm">
              No claims yet. Once fans trade your token, fees will accumulate
              and you can claim them here.
            </p>
          ) : (
            <div className="space-y-2">
              {tokenStats.flatMap((ts) =>
                ts.claimHistory.map((claim, i) => (
                  <div
                    key={`${ts.tokenId}-${i}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <span className="text-sm font-medium">
                        {formatSol(parseInt(claim.amount))}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        from ${ts.tokenSymbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(
                          new Date(claim.timestamp * 1000)
                        )}
                      </span>
                      <a
                        href={`https://solscan.io/tx/${claim.txSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-mono"
                      >
                        {claim.txSignature.slice(0, 8)}...
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
