"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const creatorLinks = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/content", label: "Content", icon: "file-text" },
  { href: "/dashboard/gates", label: "Gates", icon: "lock" },
  { href: "/dashboard/earnings", label: "Earnings", icon: "wallet" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "bar-chart" },
  { href: "/dashboard/team", label: "Team", icon: "users" },
  { href: "/dashboard/referrals", label: "Referrals", icon: "share" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export function CreatorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border min-h-[calc(100vh-57px)] p-4">
      <nav className="space-y-1">
        {creatorLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
              pathname === link.href
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

const fanLinks = [
  { href: "/feed", label: "Feed", icon: "rss" },
  { href: "/explore", label: "Explore", icon: "compass" },
  { href: "/portfolio", label: "Portfolio", icon: "wallet" },
  { href: "/notifications", label: "Notifications", icon: "bell" },
];

export function FanSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border min-h-[calc(100vh-57px)] p-4">
      <nav className="space-y-1">
        {fanLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
              pathname === link.href
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
