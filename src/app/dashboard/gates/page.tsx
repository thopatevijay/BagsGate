"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GateForm } from "@/components/gates/gate-form";

interface Token {
  id: string;
  name: string;
  symbol: string;
  mintAddress: string;
}

interface GateItem {
  id: string;
  name: string;
  description: string | null;
  gateType: string;
  requiredAmount: string;
  isActive: boolean;
  token: Token;
  _count: { content: number };
}

export default function GatesPage() {
  const { getAccessToken } = usePrivy();
  const [gates, setGates] = useState<GateItem[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };

      const [gatesRes, tokensRes] = await Promise.all([
        fetch("/api/gates", { headers }),
        fetch("/api/tokens", { headers }),
      ]);

      if (gatesRes.ok) {
        const data = await gatesRes.json();
        setGates(data.gates);
      }
      if (tokensRes.ok) {
        const data = await tokensRes.json();
        setTokens(data.tokens);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (showForm) {
    return (
      <div>
        <Button variant="ghost" onClick={() => setShowForm(false)} className="mb-4">
          ← Back to Gates
        </Button>
        <GateForm
          tokens={tokens}
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Token Gates</h1>
        <Button onClick={() => setShowForm(true)}>Create Gate</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : gates.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No gates yet. Create a token gate to start gating your content.
            </p>
            <Button onClick={() => setShowForm(true)}>Create First Gate</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {gates.map((gate) => (
            <Card key={gate.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{gate.name}</h3>
                      <Badge variant="outline">${gate.token.symbol}</Badge>
                      <Badge variant={gate.isActive ? "default" : "secondary"}>
                        {gate.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {gate.gateType} · Hold {gate.requiredAmount} tokens · {gate._count.content} content pieces
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
