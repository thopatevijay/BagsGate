"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/lib/auth/hooks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils/format";

interface FeedItem {
  id: string;
  title: string;
  previewText: string | null;
  contentType: string;
  publishedAt: string | null;
  body: string | null;
  creator: {
    displayName: string | null;
    creatorSlug: string | null;
    avatarUrl: string | null;
  };
  gate: {
    name: string;
    token: { symbol: string };
  } | null;
  hasAccess: boolean;
}

export default function FeedPage() {
  const { getAccessToken } = usePrivy();
  const { walletAddress } = useAuth();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/feed", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFeed(data.feed);
      }
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading feed...</p>
      ) : feed.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">No content yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Buy creator tokens to unlock content in your feed.
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
          {feed.map((item) => (
            <Link
              key={item.id}
              href={`/${item.creator.creatorSlug}/${item.id}`}
            >
              <Card className="hover:bg-secondary/50 transition cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 mt-0.5">
                      <AvatarImage
                        src={item.creator.avatarUrl || undefined}
                      />
                      <AvatarFallback>
                        {(item.creator.displayName || "?")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {item.creator.displayName}
                        </span>
                        {item.publishedAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(item.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium mb-1">
                        {!item.hasAccess && "🔒 "}{item.title}
                      </h3>
                      {item.previewText && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.previewText}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.contentType}
                        </Badge>
                        {item.hasAccess ? (
                          <Badge variant="default" className="text-xs">
                            Unlocked
                          </Badge>
                        ) : item.gate ? (
                          <span className="text-xs text-muted-foreground">
                            Hold ${item.gate.token.symbol} to unlock
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
