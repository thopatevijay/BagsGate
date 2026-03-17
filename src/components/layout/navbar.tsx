"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/hooks";
import { formatAddress } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { FundWalletButton } from "@/components/wallet/fund-wallet";

export function Navbar() {
  const { authenticated, login, logout, walletAddress } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-gradient">Bags</span>
          <span className="text-foreground">Gate</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/explore" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/50 transition-all">
            Explore
          </Link>
          <Link href="/explore/leaderboard" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/50 transition-all">
            Leaderboard
          </Link>

          {authenticated ? (
            <>
              <Link href="/dashboard" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/50 transition-all">
                Dashboard
              </Link>
              <div className="ml-2 pl-3 border-l border-border/50 flex items-center gap-2">
                <FundWalletButton size="sm" variant="ghost" />
                {walletAddress && (
                  <span className="text-[11px] text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-md font-mono tracking-wider">
                    {formatAddress(walletAddress)}
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="ml-2 pl-3 border-l border-border/50">
              <Button onClick={login} size="sm" className="bg-primary hover:bg-accent-light text-primary-foreground transition-all hover:shadow-[0_0_15px_oklch(0.541_0.281_293.009_/_0.25)]">
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {menuOpen ? (
              <>
                <path d="M4 4l10 10" /><path d="M14 4L4 14" />
              </>
            ) : (
              <>
                <path d="M2 5h14" /><path d="M2 9h14" /><path d="M2 13h14" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl px-5 py-4 space-y-1">
          {[
            { href: "/explore", label: "Explore" },
            { href: "/explore/leaderboard", label: "Leaderboard" },
            ...(authenticated
              ? [
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/portfolio", label: "Portfolio" },
                  { href: "/notifications", label: "Notifications" },
                ]
              : []),
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
            >
              {link.label}
            </Link>
          ))}

          {authenticated ? (
            <div className="pt-2 mt-2 border-t border-border/40">
              {walletAddress && (
                <p className="px-3 py-1 text-[11px] text-muted-foreground font-mono">{formatAddress(walletAddress)}</p>
              )}
              <button onClick={logout} className="w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-all">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3">
              <Button onClick={login} className="w-full bg-primary hover:bg-accent-light">
                Get Started
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
