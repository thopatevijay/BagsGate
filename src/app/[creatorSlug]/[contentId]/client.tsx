"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SwapWidget } from "@/components/swap/swap-widget";
import { FundWalletButton } from "@/components/wallet/fund-wallet";
import { formatDate } from "@/lib/utils/format";

interface ContentData {
  id: string;
  title: string;
  body: string;
  contentType: string;
  mediaUrl: string | null;
  previewText: string | null;
  publishedAt: string | null;
  creator: {
    displayName: string | null;
    creatorSlug: string | null;
    avatarUrl: string | null;
  };
  gate: {
    id: string;
    name: string;
    requiredAmount: string;
    token: { mintAddress: string; symbol: string; name: string };
  } | null;
}

export function ContentViewClient({ content }: { content: ContentData }) {
  const { walletAddress, authenticated, login } = useAuth();
  const [hasAccess, setHasAccess] = useState(!content.gate);
  const [checking, setChecking] = useState(!!content.gate);
  const [deficit, setDeficit] = useState("0");

  useEffect(() => {
    if (!content.gate || !walletAddress) {
      setChecking(false);
      return;
    }

    async function checkAccess() {
      try {
        const res = await fetch(
          `/api/gates/${content.gate!.id}/verify?wallet=${walletAddress}`
        );
        if (res.ok) {
          const data = await res.json();
          setHasAccess(data.hasAccess);
          setDeficit(data.deficit || "0");
        }
      } catch {
        setHasAccess(false);
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, [content.gate, walletAddress]);

  const isGated = !!content.gate;

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Back link */}
          <Link
            href={`/${content.creator.creatorSlug}`}
            className="text-sm text-muted-foreground hover:text-foreground transition mb-4 inline-block"
          >
            ← Back to {content.creator.displayName}
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={content.creator.avatarUrl || undefined} />
                <AvatarFallback>
                  {(content.creator.displayName || "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {content.creator.displayName}
              </span>
              {content.publishedAt && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(content.publishedAt)}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{content.contentType}</Badge>
              {isGated && (
                <Badge variant={hasAccess ? "default" : "outline"}>
                  {hasAccess ? "🔓 Unlocked" : "🔒 Gated"}
                </Badge>
              )}
            </div>
          </div>

          {/* Content Body */}
          {checking ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Checking access...</p>
              </CardContent>
            </Card>
          ) : hasAccess ? (
            <div>
              {content.mediaUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  {content.contentType === "IMAGE" ? (
                    <img
                      src={content.mediaUrl}
                      alt={content.title}
                      className="w-full max-h-[500px] object-cover"
                    />
                  ) : content.contentType === "VIDEO" ? (
                    <video
                      src={content.mediaUrl}
                      controls
                      className="w-full"
                    />
                  ) : (
                    <a
                      href={content.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Download File
                    </a>
                  )}
                </div>
              )}
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content.body }}
              />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>This content is gated</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.previewText && (
                  <p className="text-muted-foreground italic">
                    &ldquo;{content.previewText}&rdquo;
                  </p>
                )}
                <p className="text-sm">
                  Hold{" "}
                  <span className="font-bold">
                    {content.gate!.requiredAmount} ${content.gate!.token.symbol}
                  </span>{" "}
                  to unlock this content.
                  {parseInt(deficit) > 0 && (
                    <span className="text-muted-foreground">
                      {" "}
                      You need {deficit} more.
                    </span>
                  )}
                </p>
                {!authenticated ? (
                  <Button onClick={login} className="w-full">
                    Sign In to Buy Tokens
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <FundWalletButton variant="outline" className="flex-1" label="Fund Wallet with Card" />
                    <p className="flex-1 text-xs text-muted-foreground flex items-center justify-center">
                      Then use the swap widget to buy ${content.gate!.token.symbol} →
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Swap */}
        <div>
          {content.gate && (
            <SwapWidget
              tokenMint={content.gate.token.mintAddress}
              tokenSymbol={content.gate.token.symbol}
              onSuccess={() => window.location.reload()}
            />
          )}
        </div>
      </div>
    </main>
  );
}
