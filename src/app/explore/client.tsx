"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Explore Creators</h1>
      <p className="text-muted-foreground mb-6">
        Discover creators and unlock exclusive content by holding their tokens.
      </p>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Search by name, slug, or token..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex bg-secondary rounded-md p-0.5">
          <button
            onClick={() => setSortBy("newest")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              sortBy === "newest"
                ? "bg-background text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy("content")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              sortBy === "content"
                ? "bg-background text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Most Content
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              {search ? "No results found" : "No creators yet"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              {search
                ? `No creators match "${search}". Try a different search.`
                : "Be the first to launch a token and start gating content."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((creator) => (
            <Link key={creator.id} href={`/${creator.creatorSlug}`}>
              <Card className="hover:bg-secondary/50 transition cursor-pointer h-full">
                <CardContent className="py-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={creator.avatarUrl || undefined} />
                      <AvatarFallback>
                        {(creator.displayName || "?")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {creator.displayName}
                      </h3>
                      {creator.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {creator.bio}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {creator.tokenSymbol && (
                          <Badge variant="outline" className="text-xs">
                            ${creator.tokenSymbol}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {creator.contentCount} posts
                        </span>
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
  );
}
