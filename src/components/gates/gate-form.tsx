"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Token {
  id: string;
  name: string;
  symbol: string;
  mintAddress: string;
}

export function GateForm({
  tokens,
  onSuccess,
}: {
  tokens: Token[];
  onSuccess?: () => void;
}) {
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tokenId, setTokenId] = useState(tokens[0]?.id || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gateType, setGateType] = useState<"AMOUNT" | "TIERED" | "TIME_LIMITED">("AMOUNT");
  const [requiredAmount, setRequiredAmount] = useState("");
  const [expiresAfterHours, setExpiresAfterHours] = useState("");
  const [tiers, setTiers] = useState([
    { name: "Bronze", requiredAmount: 10 },
    { name: "Silver", requiredAmount: 100 },
    { name: "Gold", requiredAmount: 1000 },
  ]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const res = await fetch("/api/gates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          tokenId,
          name,
          description: description || undefined,
          gateType,
          requiredAmount: parseInt(requiredAmount),
          tierConfig: gateType === "TIERED" ? tiers : undefined,
          expiresAfterHours:
            gateType === "TIME_LIMITED"
              ? parseInt(expiresAfterHours)
              : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create gate");
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (tokens.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            You need to launch or connect a token before creating gates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Token Gate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="token">Token</Label>
            <select
              id="token"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm"
            >
              {tokens.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (${t.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="gateName">Gate Name</Label>
            <Input
              id="gateName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Exclusive Members"
              required
            />
          </div>

          <div>
            <Label htmlFor="gateDesc">Description (optional)</Label>
            <Textarea
              id="gateDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do holders get access to?"
              rows={2}
            />
          </div>

          <div>
            <Label>Gate Type</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(["AMOUNT", "TIERED", "TIME_LIMITED"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setGateType(type)}
                  className={`py-2 px-3 rounded-md border text-sm transition ${
                    gateType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {type === "AMOUNT" && "Amount"}
                  {type === "TIERED" && "Tiered"}
                  {type === "TIME_LIMITED" && "Time Limited"}
                </button>
              ))}
            </div>
          </div>

          {gateType === "AMOUNT" && (
            <div>
              <Label htmlFor="amount">Required Token Amount</Label>
              <Input
                id="amount"
                type="number"
                min={1}
                value={requiredAmount}
                onChange={(e) => setRequiredAmount(e.target.value)}
                placeholder="100"
                required
              />
            </div>
          )}

          {gateType === "TIERED" && (
            <div className="space-y-3">
              <Label>Tiers</Label>
              {tiers.map((tier, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={tier.name}
                    onChange={(e) => {
                      const newTiers = [...tiers];
                      newTiers[i].name = e.target.value;
                      setTiers(newTiers);
                    }}
                    placeholder="Tier name"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={tier.requiredAmount}
                    onChange={(e) => {
                      const newTiers = [...tiers];
                      newTiers[i].requiredAmount = parseInt(e.target.value) || 0;
                      setTiers(newTiers);
                    }}
                    placeholder="Amount"
                    className="w-32"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setTiers([...tiers, { name: "", requiredAmount: 0 }])
                }
              >
                Add Tier
              </Button>
            </div>
          )}

          {gateType === "TIME_LIMITED" && (
            <>
              <div>
                <Label htmlFor="amount">Required Token Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min={1}
                  value={requiredAmount}
                  onChange={(e) => setRequiredAmount(e.target.value)}
                  placeholder="100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expires">Access Duration (hours)</Label>
                <Input
                  id="expires"
                  type="number"
                  min={1}
                  value={expiresAfterHours}
                  onChange={(e) => setExpiresAfterHours(e.target.value)}
                  placeholder="72"
                  required
                />
              </div>
            </>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={loading || !name || !tokenId} className="w-full">
            {loading ? "Creating Gate..." : "Create Gate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
