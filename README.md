# BagsGate — Token-Gated Creator Access on Bags.fm

**Patreon on Solana.** Creators gate exclusive content behind their Bags token. Fans buy to access. Everyone earns through fee-sharing.

---

## The Problem

Creators monetize through platforms like Patreon, Substack, and YouTube memberships. These platforms:

- **Take 12–30% cuts** from creator earnings
- **Pay out in 30–60 days** — not instantly
- **Own the fan relationship** — creators can't take their audience elsewhere
- **Fans lose money** — cancel a subscription, and every dollar spent is gone

Meanwhile, social tokens on Solana exist but have **no utility beyond speculation**. There's no reason to hold a creator's token — so they pump and dump.

## The Solution

BagsGate connects these two worlds:

1. **Creator launches a token** on Bags with built-in fee-sharing
2. **Creator gates content** behind token ownership (hold 100 $ALICE to access)
3. **Fans buy the token** to unlock exclusive posts, media, and files
4. **Every buy and sell** generates trading fees — creator earns a share automatically, forever
5. **Fans hold an asset**, not a subscription — they can sell anytime and get value back

### Why This Is Better

| | Patreon | BagsGate |
|---|---|---|
| Platform cut | 12–30% | 0% (creators set their own fee splits) |
| Payout speed | 30–60 days | Instant (on-chain) |
| Fan leaves | Money gone | Sells token, gets value back |
| Revenue model | Monthly subscriptions | Fee-sharing on every trade, forever |
| Audience ownership | Platform owns it | Creator owns it (on-chain) |

## How It Uses Bags

BagsGate integrates **all three tiers** of the Bags ecosystem:

### 1. Token Launch API
- Creators launch social tokens directly from BagsGate via `/token-launch/create-token-info` → `/fee-share/config` → `/token-launch/create-launch-transaction`
- Full 4-step launch flow with fee-sharing configuration

### 2. Fee-Sharing System
- Every token launch includes mandatory fee-sharing config
- Default splits: Creator 70% / Platform 20% / Referrer 10%
- Up to 100 fee claimers per token (team members, collaborators)
- One-click fee claiming via `/token-launch/claim-txs/v3`

### 3. Trading / Swap API
- Embedded swap widget on creator profiles using `/trade/quote` and `/trade/swap`
- Fans buy/sell tokens without leaving BagsGate
- Auto-slippage, price impact display, minimum received

### 4. Partner System
- BagsGate registers as a Bags Partner via `/fee-share/partner-config`
- Platform earns partner fees on every token launched through BagsGate

### Bags API Endpoints Used
```
Token:    /token-launch/create-token-info, /token-launch/create-launch-transaction
Fees:     /fee-share/config, /fee-share/admin/update-config, /fee-share/admin/list
Claiming: /token-launch/claimable-positions, /token-launch/claim-txs/v3, /token-launch/claim-stats, /token-launch/lifetime-fees
Trading:  /trade/quote, /trade/swap
Partner:  /fee-share/partner-config/creation-tx, /fee-share/partner-config/claim-tx, /fee-share/partner-config/stats
Pools:    /solana/bags/pools, /solana/bags/pools/token-mint
Creators: /token-launch/creator/v3, /token-launch/fee-share/wallet/v2
Events:   /fee-share/token/claim-events
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│              BagsGate (Next.js 16)              │
│         Vercel · TypeScript · Tailwind          │
├─────────────────────────────────────────────────┤
│                                                 │
│  Auth          Blockchain      Data             │
│  ┌──────┐     ┌──────────┐   ┌─────────┐      │
│  │Privy │     │ Bags SDK │   │Supabase │      │
│  │Email │     │ Token    │   │Postgres │      │
│  │Social│     │ Swap     │   │Prisma   │      │
│  │Wallet│     │ Fees     │   │         │      │
│  └──────┘     │ Partner  │   └─────────┘      │
│               └──────────┘                     │
│  Real-time     Monitoring     Email            │
│  ┌──────┐     ┌──────────┐   ┌──────┐         │
│  │Helius│     │ PostHog  │   │Resend│         │
│  │RPC   │     │Analytics │   │Email │         │
│  │Hooks │     └──────────┘   └──────┘         │
│  └──────┘                                      │
└─────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
    ┌─────────┐   ┌──────────┐  ┌──────────┐
    │  Solana  │   │ Bags.fm  │  │  Helius  │
    │Mainnet   │   │   API    │  │   RPC    │
    └─────────┘   └──────────┘  └──────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Privy (email/social + embedded Solana wallets) |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Blockchain | Solana + Bags SDK |
| RPC | Helius (mainnet, webhooks, DAS) |
| File Storage | Vercel Blob |
| Email | Resend |
| Analytics | PostHog |
| Deployment | Vercel |

## Features

### For Creators
- **Token Launch Wizard** — create a social token on Bags with guided fee-sharing setup
- **Content Gating** — gate posts, images, videos, files behind token ownership
- **Three Gate Types** — amount-based, tiered (Bronze/Silver/Gold), time-limited
- **Rich Text Editor** — Tiptap editor with formatting, links, images
- **Earnings Dashboard** — unclaimed fees, claim history, per-token breakdown
- **One-Click Fee Claiming** — claim all accumulated trading fees instantly
- **Team Management** — add team members to fee-sharing, adjust splits (up to 100 claimers)
- **Referral System** — generate referral links, track conversions, earn from referrals
- **Analytics** — fan growth, revenue, token performance

### For Fans
- **Email Sign-up** — no wallet extension needed, Privy creates one automatically
- **Explore & Search** — discover creators, search by name/token
- **Buy Tokens** — embedded swap widget on creator profiles
- **Access Gated Content** — server-side verification, real-time access grant/revoke
- **Portfolio** — view all held tokens and accessible content
- **Content Feed** — all accessible content from held tokens
- **Notifications** — new content alerts, access changes, fee milestones

### Platform
- **Bags Partner Integration** — earn partner fees on all transactions
- **Admin Dashboard** — platform metrics, user management
- **Creator Leaderboard** — ranked by content, gates, activity
- **Dynamic OG Images** — branded social sharing for creator profiles
- **PWA Support** — installable on mobile
- **Real-Time Access** — Helius webhooks monitor token transfers, grant/revoke access instantly
- **Security** — rate limiting, CSP headers, server-side gate verification

## Database Schema

8 tables: `users`, `tokens`, `gates`, `content`, `access_grants`, `fee_claims`, `referrals`, `notifications`

Full schema in `prisma/schema.prisma`.

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Accounts: [Privy](https://dashboard.privy.io), [Bags](https://dev.bags.fm), [Supabase](https://supabase.com), [Helius](https://dashboard.helius.dev)

### Setup

```bash
# Clone
git clone https://github.com/thopatevijay/BagsGate.git
cd BagsGate

# Install
npm install

# Configure environment
cp .env.example .env
# Fill in all required values (see .env.example for descriptions)

# Create database tables
# Option A: Run prisma db push (if direct connection works)
npx prisma db push

# Option B: Copy prisma/migration.sql into Supabase SQL Editor and run

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

### Required Environment Variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_PRIVY_APP_ID` | [Privy Dashboard](https://dashboard.privy.io) |
| `PRIVY_APP_SECRET` | Privy Dashboard → App Settings |
| `BAGS_API_KEY` | [dev.bags.fm](https://dev.bags.fm) |
| `DATABASE_URL` | [Supabase](https://supabase.com) → Project Settings → Database |
| `HELIUS_API_KEY` | [Helius Dashboard](https://dashboard.helius.dev) |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Helius provides mainnet RPC URL |

## Future Vision

BagsGate is designed as a product with a roadmap, not a weekend hack:

1. **Mobile App** — React Native with Privy SDK for native iOS/Android
2. **Creator Analytics Pro** — token price correlation with content drops, fan cohort analysis
3. **NFT Gating** — gate content behind NFT ownership in addition to tokens
4. **Live Streaming** — token-gated live streams with real-time chat
5. **DAO Governance** — token holders vote on creator decisions
6. **Cross-Chain** — support tokens on multiple chains via Wormhole
7. **Fiat On-Ramp** — buy creator tokens directly with credit card
8. **API & SDK** — let other apps embed BagsGate token gates

## Category

**Social Finance** — BagsGate creates a new monetization model for creators using Bags fee-sharing as the revenue engine, replacing subscriptions with token-gated access.

Also applicable: **Bags API**, **Fee Sharing**, **DeFi**

## Links

- **GitHub**: [github.com/thopatevijay/BagsGate](https://github.com/thopatevijay/BagsGate)
- **Bags.fm**: [bags.fm](https://bags.fm)
- **Bags Docs**: [docs.bags.fm](https://docs.bags.fm)
