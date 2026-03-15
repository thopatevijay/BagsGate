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
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-border/40">
              <AvatarImage src={creator.avatarUrl || undefined} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                {(creator.displayName || "?")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">{creator.displayName}</h1>
              {creator.bio && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{creator.bio}</p>
              )}
              <div className="flex items-center gap-2.5 mt-3">
                {creator.twitterHandle && (
                  <a
                    href={`https://twitter.com/${creator.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    @{creator.twitterHandle}
                  </a>
                )}
                {primaryToken && (
                  <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary/80 px-1.5 py-0 h-5">
                    ${primaryToken.symbol}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {creator.content.length} {creator.content.length === 1 ? "post" : "posts"}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Content
            </h2>
            {creator.content.length === 0 ? (
              <div className="text-center py-16 border border-border/30 rounded-xl border-dashed">
                <p className="text-sm text-muted-foreground">No published content yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {creator.content.map((item) => (
                  <Link key={item.id} href={`/${creator.creatorSlug}/${item.id}`}>
                    <div className="group bg-card/40 border border-border/40 rounded-xl p-4 card-hover cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            {item.gateId && (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary text-[10px]">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                              </span>
                            )}
                            <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                          </div>
                          {item.previewText && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {item.previewText}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2.5">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-secondary/60">
                              {item.contentType}
                            </Badge>
                            {item.gate && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                Hold {item.gate.requiredAmount} ${item.gate.token.symbol}
                              </span>
                            )}
                            {item.publishedAt && (
                              <span className="text-[10px] text-muted-foreground">
                                {formatRelativeTime(item.publishedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-muted-foreground/30 group-hover:text-primary transition-colors mt-1 shrink-0">
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Swap */}
        <div className="space-y-4">
          {primaryToken ? (
            <div className="sticky top-20">
              <SwapWidget
                tokenMint={primaryToken.mintAddress}
                tokenSymbol={primaryToken.symbol}
              />
            </div>
          ) : (
            <Card className="bg-card/40 border-border/40">
              <CardContent className="py-8 text-center">
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
