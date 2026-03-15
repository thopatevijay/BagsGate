"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Creator {
  id: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  creatorSlug: string | null;
  tokenSymbol: string | null;
  contentCount: number;
}

export function ExploreClient({ creators }: { creators: Creator[] }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "content">("newest");

  const filtered = useMemo(() => {
    let result = creators;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.displayName?.toLowerCase().includes(q) ||
          c.creatorSlug?.toLowerCase().includes(q) ||
          c.tokenSymbol?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "content") {
      result = [...result].sort((a, b) => b.contentCount - a.contentCount);
    }
    return result;
  }, [creators, search, sortBy]);

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Explore Creators</h1>
        <p className="text-sm text-muted-foreground">
          Discover creators and unlock exclusive content by holding their tokens.
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <Input
            placeholder="Search creators, tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card/60 border-border/50 h-10"
          />
        </div>
        <div className="flex bg-card/60 border border-border/50 rounded-lg p-0.5">
          {(["newest", "content"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                sortBy === s
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "newest" ? "Newest" : "Most Content"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/60 border border-border/40 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <h3 className="font-semibold mb-1">
            {search ? "No results" : "No creators yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {search
              ? `No creators match "${search}".`
              : "Be the first to launch a token and start gating content."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((creator) => (
            <Link key={creator.id} href={`/${creator.creatorSlug}`}>
              <div className="group bg-card/50 border border-border/40 rounded-xl p-5 card-hover cursor-pointer h-full">
                <div className="flex items-start gap-3.5">
                  <Avatar className="h-11 w-11 border border-border/40">
                    <AvatarImage src={creator.avatarUrl || undefined} />
                    <AvatarFallback className="bg-secondary text-xs font-medium">
                      {(creator.displayName || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {creator.displayName}
                    </h3>
                    {creator.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {creator.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2.5">
                      {creator.tokenSymbol && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-mono border-primary/20 text-primary/80">
                          ${creator.tokenSymbol}
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        {creator.contentCount} {creator.contentCount === 1 ? "post" : "posts"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
