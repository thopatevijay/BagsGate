"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenLaunchWizard } from "@/components/token/launch-wizard";
import { ConnectToken } from "@/components/token/connect-token";

interface Token {
  id: string;
  name: string;
  symbol: string;
  mintAddress: string;
  status: string;
}

export default function SettingsPage() {
  const { getAccessToken } = usePrivy();
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTokenSetup, setShowTokenSetup] = useState(false);

  const fetchTokens = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/tokens", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens);
      }
    } catch (err) {
      console.error("Failed to fetch tokens:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Token Management */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Tokens</CardTitle>
            {!showTokenSetup && (
              <Button size="sm" onClick={() => setShowTokenSetup(true)}>
                Add Token
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showTokenSetup ? (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTokenSetup(false)}
                className="mb-4"
              >
                ← Back
              </Button>
              <Tabs defaultValue="launch">
                <TabsList className="mb-4">
                  <TabsTrigger value="launch">Launch New Token</TabsTrigger>
                  <TabsTrigger value="connect">Connect Existing</TabsTrigger>
                </TabsList>
                <TabsContent value="launch">
                  <TokenLaunchWizard
                    onSuccess={() => {
                      setShowTokenSetup(false);
                      fetchTokens();
                    }}
                  />
                </TabsContent>
                <TabsContent value="connect">
                  <ConnectToken
                    onSuccess={() => {
                      setShowTokenSetup(false);
                      fetchTokens();
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          ) : loading ? (
            <p className="text-muted-foreground text-sm">Loading tokens...</p>
          ) : tokens.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm mb-3">
                No tokens yet. Launch a new token or connect an existing one.
              </p>
              <Button onClick={() => setShowTokenSetup(true)}>
                Set Up Token
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-md"
                >
                  <div>
                    <span className="font-medium">
                      {token.name} (${token.symbol})
                    </span>
                    <p className="text-xs text-muted-foreground font-mono">
                      {token.mintAddress}
                    </p>
                  </div>
                  <Badge
                    variant={
                      token.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {token.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Settings placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Profile editing and notification preferences coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
