"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/hooks";

function OnboardContent() {
  const { authenticated, ready, walletAddress } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const suggestedRole = searchParams.get("role") || "FAN";

  const [role, setRole] = useState<"FAN" | "CREATOR">(
    suggestedRole === "creator" ? "CREATOR" : "FAN"
  );
  const [displayName, setDisplayName] = useState("");
  const [creatorSlug, setCreatorSlug] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!ready) return null;
  if (!authenticated) {
    router.push("/login");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          creatorSlug: role === "CREATOR" ? creatorSlug : undefined,
          bio: bio || undefined,
          role,
          walletAddress,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to complete onboarding");
      }

      router.push(role === "CREATOR" ? "/dashboard" : "/explore");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-2">Complete your profile</h1>
        <p className="text-muted mb-8">Tell us a bit about yourself.</p>

        {/* Role Selection */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("FAN")}
            className={`flex-1 py-3 px-4 rounded-lg border font-medium transition ${
              role === "FAN"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:border-muted"
            }`}
          >
            I&apos;m a Fan
          </button>
          <button
            type="button"
            onClick={() => setRole("CREATOR")}
            className={`flex-1 py-3 px-4 rounded-lg border font-medium transition ${
              role === "CREATOR"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:border-muted"
            }`}
          >
            I&apos;m a Creator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent transition"
            />
          </div>

          {role === "CREATOR" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Creator Slug
              </label>
              <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden focus-within:border-accent transition">
                <span className="pl-4 text-muted text-sm">bagsgate.xyz/</span>
                <input
                  type="text"
                  value={creatorSlug}
                  onChange={(e) =>
                    setCreatorSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="your-name"
                  required
                  className="flex-1 bg-transparent px-1 py-2.5 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Bio <span className="text-muted">(optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell fans about yourself..."
              rows={3}
              maxLength={500}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent transition resize-none"
            />
          </div>

          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !displayName}
            className="w-full bg-accent hover:bg-accent-light disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Setting up..." : "Continue"}
          </button>
        </form>

        {walletAddress && (
          <p className="text-xs text-muted mt-4 text-center">
            Wallet: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function OnboardPage() {
  return (
    <Suspense>
      <OnboardContent />
    </Suspense>
  );
}
