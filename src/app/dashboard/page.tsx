"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Fans", value: "0", change: null },
  { label: "Unclaimed Fees", value: "0 SOL", change: null },
  { label: "Volume (24h)", value: "$0", change: null },
  { label: "Gated Content", value: "0", change: null },
];

const quickActions = [
  { label: "Launch Token", href: "/dashboard/settings", desc: "Create your social token on Bags" },
  { label: "Create Gate", href: "/dashboard/gates", desc: "Set token requirements for access" },
  { label: "Write Content", href: "/dashboard/content", desc: "Publish gated posts for holders" },
  { label: "Share Link", href: "/dashboard/referrals", desc: "Invite fans with your referral link" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s your creator overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card/60 border-border/50">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {s.label}
              </p>
              <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="bg-card/40 border-border/40 card-hover cursor-pointer group">
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-0.5 group-hover:text-primary transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {action.desc}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground/40 group-hover:text-primary transition-colors">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardContent className="py-6 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Get started</h3>
              <p className="text-sm text-muted-foreground">
                Launch your token, create a gate, and publish your first content to start earning.
              </p>
            </div>
            <Button className="bg-primary hover:bg-accent-light shrink-0">
              <Link href="/dashboard/settings">Launch Token</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
