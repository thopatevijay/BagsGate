"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SwapWidget } from "@/components/swap/swap-widget";
import { formatRelativeTime } from "@/lib/utils/format";

interface ContentItem {
  id: string;
  title: string;
  previewText: string | null;
  contentType: string;
  publishedAt: string | null;
  gateId: string | null;
  gate: {
    id: string;
    name: string;
    requiredAmount: string;
    token: { symbol: string; mintAddress: string };
  } | null;
}

interface Creator {
  id: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  twitterHandle: string | null;
  creatorSlug: string | null;
  tokens: {
    id: string;
    mintAddress: string;
    name: string;
    symbol: string;
    imageUrl: string | null;
    status: string;
  }[];
  content: ContentItem[];
}

export function CreatorProfileClient({ creator }: { creator: Creator }) {
  const primaryToken = creator.tokens[0];

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile + Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={creator.avatarUrl || undefined} />
              <AvatarFallback className="text-xl">
                {(creator.displayName || "?")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{creator.displayName}</h1>
              {creator.bio && (
                <p className="text-muted-foreground mt-1">{creator.bio}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {creator.twitterHandle && (
                  <a
                    href={`https://twitter.com/${creator.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition"
                  >
                    @{creator.twitterHandle}
                  </a>
                )}
                {primaryToken && (
                  <Badge variant="outline">${primaryToken.symbol}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Content List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Content ({creator.content.length})
            </h2>
            {creator.content.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No published content yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {creator.content.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${creator.creatorSlug}/${item.id}`}
                  >
                    <Card className="hover:bg-secondary/50 transition cursor-pointer">
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {item.gateId && (
                                <span className="text-sm">🔒</span>
                              )}
                              <h3 className="font-medium truncate">
                                {item.title}
                              </h3>
                            </div>
                            {item.previewText && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.previewText}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.contentType}
                              </Badge>
                              {item.gate && (
                                <span className="text-xs text-muted-foreground">
                                  Hold {item.gate.requiredAmount} $
                                  {item.gate.token.symbol}
                                </span>
                              )}
                              {item.publishedAt && (
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(item.publishedAt)}
                                </span>
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
          </div>
        </div>

        {/* Right: Swap Widget */}
        <div className="space-y-4">
          {primaryToken ? (
            <SwapWidget
              tokenMint={primaryToken.mintAddress}
              tokenSymbol={primaryToken.symbol}
            />
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No token available yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
