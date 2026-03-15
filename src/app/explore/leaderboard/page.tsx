"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface LeaderboardEntry {
  rank: number;
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  creatorSlug: string | null;
  tokenSymbol: string | null;
  contentCount: number;
  gateCount: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState("content");
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/creators/leaderboard?sort=${sortBy}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.leaderboard);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">Creator Leaderboard</h1>
        <p className="text-muted-foreground mb-6">
          Top creators ranked by activity on BagsGate.
        </p>

        {/* Sort */}
        <div className="flex gap-2 mb-6">
          {["content", "gates", "newest"].map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
                sortBy === s
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {s === "content"
                ? "Most Content"
                : s === "gates"
                  ? "Most Gates"
                  : "Newest"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground">No creators yet.</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <Link key={entry.id} href={`/${entry.creatorSlug}`}>
                <Card className="hover:bg-secondary/50 transition cursor-pointer">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-muted-foreground w-8 text-right">
                        {entry.rank}
                      </span>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {(entry.displayName || "?")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {entry.displayName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {entry.tokenSymbol && (
                          <Badge variant="outline">${entry.tokenSymbol}</Badge>
                        )}
                        <span>{entry.contentCount} posts</span>
                        <span>{entry.gateCount} gates</span>
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
