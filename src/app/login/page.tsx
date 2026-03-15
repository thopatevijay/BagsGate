"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-3">Welcome to BagsGate</h1>
        <p className="text-muted mb-8">
          Sign in with your email or social account. We&apos;ll create a wallet
          for you automatically.
        </p>
        <button
          onClick={login}
          className="w-full bg-accent hover:bg-accent-light text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
        >
          Sign In
        </button>
        <p className="text-sm text-muted mt-4">
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
