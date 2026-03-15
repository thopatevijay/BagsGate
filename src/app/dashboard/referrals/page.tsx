"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";

interface ReferralStats {
  totalReferred: number;
  referrals: {
    referredName: string | null;
    referredAt: string;
    feeBps: number;
  }[];
}

export default function ReferralsPage() {
  const { getAccessToken } = usePrivy();
  const [referralLink, setReferralLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReferrals = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/referrals", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReferralLink(data.referralLink);
        setReferralCode(data.referralCode);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch referrals:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareTwitter() {
    const text = encodeURIComponent(
      "Check out my gated content on BagsGate! Buy my token to unlock exclusive posts."
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  }

  function shareTelegram() {
    const text = encodeURIComponent(
      "Check out my gated content on BagsGate!"
    );
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`,
      "_blank"
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Referrals</h1>

      {/* Referral Link */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share your referral link to earn a share of trading fees from
            referred users.
          </p>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : (
            <>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="font-mono text-sm" />
                <Button onClick={copyLink} variant="outline">
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={shareTwitter}>
                  Share on Twitter
                </Button>
                <Button variant="outline" size="sm" onClick={shareTelegram}>
                  Share on Telegram
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Referral Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : (
            <div className="space-y-4">
              <div className="bg-secondary p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Total Referred</p>
                <p className="text-3xl font-bold">
                  {stats?.totalReferred || 0}
                </p>
              </div>

              {stats && stats.referrals.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Referrals</h3>
                  {stats.referrals.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm">
                        {r.referredName || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.referredAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No referrals yet. Share your link to get started.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
