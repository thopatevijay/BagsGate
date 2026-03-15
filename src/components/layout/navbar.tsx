"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/hooks";
import { formatAddress } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { authenticated, login, logout, walletAddress } = useAuth();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          BagsGate
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="text-muted-foreground hover:text-foreground transition text-sm"
          >
            Explore
          </Link>

          {authenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition text-sm"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                {walletAddress && (
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md font-mono">
                    {formatAddress(walletAddress)}
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={login} size="sm">
              Get Started
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
