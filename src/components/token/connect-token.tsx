"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConnectToken({ onSuccess }: { onSuccess?: () => void }) {
  const { getAccessToken } = usePrivy();
  const [mintAddress, setMintAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConnect() {
    setLoading(true);
    setError("");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const res = await fetch("/api/tokens/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ mintAddress }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to connect token");
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Connect Existing Token</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Already have a token on Bags? Enter its mint address to connect it to
          your BagsGate profile.
        </p>
        <div>
          <Label htmlFor="mint">Token Mint Address</Label>
          <Input
            id="mint"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value.trim())}
            placeholder="Enter Solana token mint address..."
            className="font-mono text-sm"
          />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button
          onClick={handleConnect}
          disabled={loading || mintAddress.length < 32}
          className="w-full"
        >
          {loading ? "Connecting..." : "Connect Token"}
        </Button>
      </CardContent>
    </Card>
  );
}
