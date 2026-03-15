"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/hooks";
import { formatAddress } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { authenticated, login, logout, walletAddress } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          BagsGate
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/explore"
            className="text-muted-foreground hover:text-foreground transition text-sm"
          >
            Explore
          </Link>
          <Link
            href="/explore/leaderboard"
            className="text-muted-foreground hover:text-foreground transition text-sm"
          >
            Leaderboard
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-muted-foreground"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {menuOpen ? (
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border px-4 py-3 space-y-3">
          <Link
            href="/explore"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-muted-foreground hover:text-foreground"
          >
            Explore
          </Link>
          <Link
            href="/explore/leaderboard"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-muted-foreground hover:text-foreground"
          >
            Leaderboard
          </Link>
          {authenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/portfolio"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Portfolio
              </Link>
              <Link
                href="/notifications"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Notifications
              </Link>
              {walletAddress && (
                <p className="text-xs text-muted-foreground font-mono">
                  {formatAddress(walletAddress)}
                </p>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start p-0">
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={login} size="sm" className="w-full">
              Get Started
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
