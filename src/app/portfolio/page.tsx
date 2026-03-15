"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Holding {
  token: {
    id: string;
    name: string;
    symbol: string;
    mintAddress: string;
    imageUrl: string | null;
  };
  creator: {
    displayName: string | null;
    creatorSlug: string | null;
    avatarUrl: string | null;
  };
  balance: string;
  accessibleGates: {
    id: string;
    name: string;
    contentCount: number;
  }[];
}

export default function PortfolioPage() {
  const { getAccessToken } = usePrivy();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/portfolio", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHoldings(data.holdings);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Portfolio</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading portfolio...</p>
        ) : holdings.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">No tokens held</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Buy creator tokens to unlock gated content. Your holdings will
                appear here.
              </p>
              <Link
                href="/explore"
                className="text-primary underline text-sm"
              >
                Explore Creators
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {holdings.map((h) => (
              <Link key={h.token.id} href={`/${h.creator.creatorSlug}`}>
                <Card className="hover:bg-secondary/50 transition cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {h.token.symbol[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {h.token.name}{" "}
                            <span className="text-muted-foreground">
                              ${h.token.symbol}
                            </span>
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            by {h.creator.displayName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(parseInt(h.balance) / 1e9).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {h.accessibleGates.length > 0 ? (
                            <Badge variant="default" className="text-xs">
                              {h.accessibleGates.reduce(
                                (sum, g) => sum + g.contentCount,
                                0
                              )}{" "}
                              posts unlocked
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              No gates unlocked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
