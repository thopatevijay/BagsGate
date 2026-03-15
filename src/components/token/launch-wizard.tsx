"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/lib/auth/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Step = "info" | "fees" | "review" | "launching" | "success";

interface TokenFormData {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  twitter: string;
  website: string;
  initialBuyLamports: number;
  creatorBps: number;
  platformBps: number;
  referralBps: number;
}

export function TokenLaunchWizard({ onSuccess }: { onSuccess?: () => void }) {
  const { getAccessToken } = usePrivy();
  const { walletAddress } = useAuth();
  const [step, setStep] = useState<Step>("info");
  const [error, setError] = useState("");
  const [tokenMint, setTokenMint] = useState("");

  const [form, setForm] = useState<TokenFormData>({
    name: "",
    symbol: "",
    description: "",
    imageUrl: "",
    twitter: "",
    website: "",
    initialBuyLamports: 0,
    creatorBps: 7000,
    platformBps: 2000,
    referralBps: 1000,
  });

  function updateForm(fields: Partial<TokenFormData>) {
    setForm((prev) => ({ ...prev, ...fields }));
  }

  const totalBps = form.creatorBps + form.platformBps + form.referralBps;

  async function handleLaunch() {
    setStep("launching");
    setError("");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const res = await fetch("/api/tokens/launch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: form.name,
          symbol: form.symbol,
          description: form.description,
          imageUrl: form.imageUrl || undefined,
          twitter: form.twitter || undefined,
          website: form.website || undefined,
          initialBuyLamports: form.initialBuyLamports,
          feeShares: [
            { wallet: walletAddress, bps: form.creatorBps },
            {
              wallet: process.env.NEXT_PUBLIC_PLATFORM_WALLET || walletAddress,
              bps: form.platformBps + form.referralBps,
            },
          ],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to launch token");
      }

      const data = await res.json();
      setTokenMint(data.tokenMint);
      setStep("success");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("review");
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {step === "info" && "Token Information"}
          {step === "fees" && "Fee Sharing Configuration"}
          {step === "review" && "Review & Launch"}
          {step === "launching" && "Launching Token..."}
          {step === "success" && "Token Launched!"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Step 1: Token Info */}
        {step === "info" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                placeholder="My Creator Token"
                maxLength={32}
              />
              <p className="text-xs text-muted-foreground mt-1">{form.name.length}/32</p>
            </div>
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={form.symbol}
                onChange={(e) =>
                  updateForm({ symbol: e.target.value.toUpperCase() })
                }
                placeholder="MCT"
                maxLength={10}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="What is this token about?"
                maxLength={1000}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => updateForm({ imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitter">Twitter (optional)</Label>
                <Input
                  id="twitter"
                  value={form.twitter}
                  onChange={(e) => updateForm({ twitter: e.target.value })}
                  placeholder="@handle"
                />
              </div>
              <div>
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => updateForm({ website: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <Button
              onClick={() => setStep("fees")}
              disabled={!form.name || !form.symbol || !form.description}
              className="w-full"
            >
              Next: Configure Fees
            </Button>
          </div>
        )}

        {/* Step 2: Fee Sharing */}
        {step === "fees" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Split trading fees between you, the platform, and referrers. Must
              total 100% (10,000 BPS).
            </p>
            <div>
              <Label>Your Share ({(form.creatorBps / 100).toFixed(1)}%)</Label>
              <Input
                type="range"
                min={1000}
                max={9000}
                step={100}
                value={form.creatorBps}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateForm({
                    creatorBps: val,
                    platformBps: 10000 - val - form.referralBps,
                  });
                }}
              />
            </div>
            <div>
              <Label>
                Platform Share ({(form.platformBps / 100).toFixed(1)}%)
              </Label>
              <Input
                type="range"
                min={500}
                max={5000}
                step={100}
                value={form.platformBps}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateForm({
                    platformBps: val,
                    creatorBps: 10000 - val - form.referralBps,
                  });
                }}
              />
            </div>
            <div>
              <Label>
                Referral Share ({(form.referralBps / 100).toFixed(1)}%)
              </Label>
              <Input
                type="range"
                min={0}
                max={2000}
                step={100}
                value={form.referralBps}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateForm({
                    referralBps: val,
                    creatorBps: 10000 - val - form.platformBps,
                  });
                }}
              />
            </div>
            <div className="bg-secondary p-3 rounded-md text-sm">
              <p>Total: {(totalBps / 100).toFixed(1)}% {totalBps !== 10000 && "(must be 100%)"}</p>
            </div>
            <div>
              <Label>Initial Buy (SOL)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.initialBuyLamports / 1e9 || ""}
                onChange={(e) =>
                  updateForm({
                    initialBuyLamports: Math.floor(
                      parseFloat(e.target.value || "0") * 1e9
                    ),
                  })
                }
                placeholder="0.0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your first purchase of your own token (optional)
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("info")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep("review")}
                disabled={totalBps !== 10000}
                className="flex-1"
              >
                Next: Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && (
          <div className="space-y-4">
            <div className="bg-secondary p-4 rounded-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{form.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symbol</span>
                <span className="font-medium">${form.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Fee Share</span>
                <span className="font-medium">
                  {(form.creatorBps / 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Initial Buy</span>
                <span className="font-medium">
                  {form.initialBuyLamports > 0
                    ? `${(form.initialBuyLamports / 1e9).toFixed(2)} SOL`
                    : "None"}
                </span>
              </div>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("fees")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleLaunch} className="flex-1">
                Launch Token
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Launching */}
        {step === "launching" && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              Creating your token on Bags...
            </p>
          </div>
        )}

        {/* Step 5: Success */}
        {step === "success" && (
          <div className="text-center py-8 space-y-4">
            <div className="text-4xl">🎉</div>
            <h3 className="text-xl font-bold">
              ${form.symbol} is live!
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              {tokenMint}
            </p>
            <p className="text-sm text-muted-foreground">
              Next step: create a token gate and start publishing content.
            </p>
            <Button onClick={onSuccess} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
