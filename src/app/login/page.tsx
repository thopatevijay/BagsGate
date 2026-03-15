"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/hooks";

function LoginContent() {
  const { authenticated, ready, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (ready && authenticated) {
      const role = searchParams.get("role");
      router.push(role ? `/onboard?role=${role}` : "/onboard");
    }
  }, [ready, authenticated, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[oklch(0.541_0.281_293.009_/_0.06)] blur-[120px]" />
      </div>

      <div className="relative max-w-sm w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight mb-6">
            <span className="text-gradient">Bags</span>
            <span className="text-foreground">Gate</span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with email or social account.
            <br />
            We&apos;ll create a wallet for you automatically.
          </p>
        </div>

        <button
          onClick={login}
          className="w-full bg-primary hover:bg-accent-light text-primary-foreground py-3 rounded-xl font-semibold transition-all hover:shadow-[0_0_25px_oklch(0.541_0.281_293.009_/_0.3)] animate-pulse-glow"
        >
          Sign In
        </button>

        <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
          No wallet extension needed. No crypto experience required.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
