"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/lib/auth/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBps, formatAddress } from "@/lib/utils/format";

interface Token {
  id: string;
  name: string;
  symbol: string;
  mintAddress: string;
}

interface TeamMember {
  wallet: string;
  bps: number;
}

export default function TeamPage() {
  const { getAccessToken } = usePrivy();
  const { walletAddress } = useAuth();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newWallet, setNewWallet] = useState("");
  const [newBps, setNewBps] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTokens = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/tokens", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens);
        if (data.tokens.length > 0 && !selectedToken) {
          setSelectedToken(data.tokens[0].mintAddress);
        }
      }
    } catch (err) {
      console.error("Failed to fetch tokens:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, selectedToken]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Initialize default members when token selected
  useEffect(() => {
    if (selectedToken && walletAddress && members.length === 0) {
      setMembers([
        { wallet: walletAddress, bps: 7000 },
        {
          wallet: process.env.NEXT_PUBLIC_PLATFORM_WALLET || "platform",
          bps: 3000,
        },
      ]);
    }
  }, [selectedToken, walletAddress, members.length]);

  const totalBps = members.reduce((sum, m) => sum + m.bps, 0);

  function addMember() {
    if (!newWallet || !newBps) return;
    const bps = parseInt(newBps);
    if (bps <= 0 || bps > 10000) return;

    setMembers([...members, { wallet: newWallet, bps }]);
    setNewWallet("");
    setNewBps("");
  }

  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index));
  }

  function updateMemberBps(index: number, bps: number) {
    const updated = [...members];
    updated[index].bps = bps;
    setMembers(updated);
  }

  async function handleSave() {
    if (totalBps !== 10000) {
      setError("Total must be exactly 100% (10,000 BPS)");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/fees/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          tokenMint: selectedToken,
          claimersArray: members.map((m) => m.wallet),
          basisPointsArray: members.map((m) => m.bps),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      setSuccess(
        "Fee-sharing config updated. Sign the transaction in your wallet."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Team Management</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Team Management</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Launch a token first to manage fee-sharing team members.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>

      {/* Token Selector */}
      <div className="mb-6">
        <Label>Token</Label>
        <select
          value={selectedToken}
          onChange={(e) => {
            setSelectedToken(e.target.value);
            setMembers([]);
          }}
          className="w-full max-w-sm bg-secondary border border-border rounded-md px-3 py-2 text-sm mt-1"
        >
          {tokens.map((t) => (
            <option key={t.mintAddress} value={t.mintAddress}>
              {t.name} (${t.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* Fee Share Members */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fee-Sharing Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure how trading fees are split between team members. Total must
            be exactly 100% (10,000 BPS). Max 100 members.
          </p>

          <div className="space-y-3">
            {members.map((member, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-secondary rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate">{formatAddress(member.wallet, 6)}</p>
                  {member.wallet === walletAddress && (
                    <Badge variant="outline" className="text-xs mt-1">
                      You
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={10000}
                    value={member.bps}
                    onChange={(e) =>
                      updateMemberBps(i, parseInt(e.target.value) || 0)
                    }
                    className="w-24 text-right"
                  />
                  <span className="text-sm text-muted-foreground w-14">
                    {formatBps(member.bps)}
                  </span>
                  {member.wallet !== walletAddress && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(i)}
                      className="text-destructive"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className={`flex justify-between p-3 rounded-md ${
              totalBps === 10000
                ? "bg-green-500/10 text-green-500"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            <span className="font-medium">Total</span>
            <span className="font-bold">{formatBps(totalBps)}</span>
          </div>

          {/* Add Member */}
          <div className="border-t border-border pt-4">
            <Label className="mb-2 block">Add Team Member</Label>
            <div className="flex gap-2">
              <Input
                value={newWallet}
                onChange={(e) => setNewWallet(e.target.value)}
                placeholder="Wallet address or @twitter"
                className="flex-1"
              />
              <Input
                type="number"
                value={newBps}
                onChange={(e) => setNewBps(e.target.value)}
                placeholder="BPS"
                className="w-24"
              />
              <Button
                variant="outline"
                onClick={addMember}
                disabled={!newWallet || !newBps}
              >
                Add
              </Button>
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <Button
            onClick={handleSave}
            disabled={saving || totalBps !== 10000}
            className="w-full"
          >
            {saving ? "Updating..." : "Save Fee Configuration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
