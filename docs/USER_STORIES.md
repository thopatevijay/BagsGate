# BagsGate — User Stories

## What is BagsGate?

BagsGate is a token-gated creator access platform built on Bags.fm (Solana). Creators launch a social token and gate their exclusive content behind it. Fans buy the token to unlock access. Every buy and sell generates trading fees that are automatically split between the creator, the platform, and referrers — forever.

**Simple version:** Patreon, but instead of a monthly subscription, fans hold a creator's token to access exclusive content. Creators earn on every trade, not just on signups.

---

## Who is it for?

### 1. Creators (content creators, artists, educators, streamers, musicians)
People who have an audience and want to monetize beyond ads, sponsorships, and platform cuts.

### 2. Fans (supporters, community members, collectors)
People who follow creators and are willing to pay for exclusive access — many already pay for Patreon, Discord Nitro, Substack, etc.

### 3. Traders (crypto-native users already on Bags/Solana)
People who trade social tokens and want token utility beyond speculation.

---

## User Stories

### Epic 1: Creator Onboarding

#### US-1.1: Sign Up as a Creator
**As a** content creator
**I want to** sign up using my email or Twitter account
**So that** I can start setting up my gated content page without needing a crypto wallet or browser extension

**Acceptance Criteria:**
- Creator can sign up with email, Google, Twitter, or Apple
- A Solana wallet is automatically created for the creator (via Privy embedded wallet)
- Creator is prompted to choose their role: "I'm a Creator" or "I'm a Fan"
- No wallet extension (Phantom, etc.) is required

#### US-1.2: Set Up Creator Profile
**As a** new creator
**I want to** set up my public profile with name, bio, avatar, and social links
**So that** fans can find me and understand what I offer

**Acceptance Criteria:**
- Creator can set: display name, bio (max 500 chars), avatar (upload or URL), social links (Twitter, YouTube, etc.)
- Creator picks a unique slug (e.g., bagsgate.xyz/alice)
- Profile is publicly visible after setup
- Profile can be edited anytime from settings

#### US-1.3: Launch a New Token on Bags
**As a** creator without an existing token
**I want to** launch a new social token on Bags directly from BagsGate
**So that** I can start gating content and earning fees immediately

**Acceptance Criteria:**
- Guided wizard: token name, symbol, image, description
- Fee-sharing configuration: creator %, platform %, referral % (defaults: 70/20/10)
- Option to add team members to fee-sharing (up to 100 claimers)
- Initial buy amount (creator's first purchase of their own token)
- One-click launch — token is live on Bags after confirmation
- Creator sees success screen with token details and link

#### US-1.4: Connect an Existing Bags Token
**As a** creator who already has a token on Bags
**I want to** connect my existing token to BagsGate
**So that** I can use it for content gating without launching a new one

**Acceptance Criteria:**
- Creator enters their token mint address
- System verifies the creator is the token creator (via Bags API)
- Token details are fetched and displayed for confirmation
- Token is linked to creator's BagsGate profile

---

### Epic 2: Content Creation & Gating

#### US-2.1: Create Gated Content
**As a** creator
**I want to** publish content that only token holders can access
**So that** fans have a reason to buy and hold my token

**Acceptance Criteria:**
- Creator can create content with: title, body (rich text), media (images, videos, files)
- Creator assigns a gate to the content (or makes it public)
- Content has a public preview (visible to everyone) and gated body (visible only to token holders)
- Content is publishable immediately or schedulable for later

#### US-2.2: Configure Token Gates
**As a** creator
**I want to** set how many tokens a fan needs to hold to access my content
**So that** I can create different tiers of exclusivity

**Acceptance Criteria:**
- **Amount Gate**: hold X tokens to access (e.g., "Hold 100 $ALICE")
- **Tiered Gates**: multiple levels (Bronze = 10, Silver = 100, Gold = 1000)
- **Time-Limited Gate**: hold tokens + access expires after N days
- Gates can be created, edited, and deleted
- Each piece of content is assigned to one gate (or no gate for public content)

#### US-2.3: Manage Content
**As a** creator
**I want to** see all my published and draft content in one place
**So that** I can edit, unpublish, or delete content as needed

**Acceptance Criteria:**
- Content list view with: title, gate, status (draft/published), date, views
- Inline edit and delete actions
- Filter by: gate, status, content type
- Drag-and-drop reordering of content on public profile page

#### US-2.4: Upload Media
**As a** creator
**I want to** upload images, videos, and files to attach to my gated content
**So that** I can share exclusive media with my token holders

**Acceptance Criteria:**
- Supported: images (JPG, PNG, GIF, WebP), videos (MP4, embedded YouTube/Vimeo), files (PDF, ZIP)
- Max file size: 50MB for images, 500MB for videos, 100MB for files
- Upload progress indicator
- Media is stored securely and only served to users who pass the gate check

---

### Epic 3: Fan Experience

#### US-3.1: Discover Creators
**As a** fan
**I want to** browse and search for creators on BagsGate
**So that** I can find creators whose content I want to access

**Acceptance Criteria:**
- Homepage shows: trending creators, new creators, top earners
- Category browsing (Art, Music, Education, Tech, Gaming, etc.)
- Search by creator name or token symbol
- Each creator card shows: name, avatar, token price, holder count, content count

#### US-3.2: View Creator Profile
**As a** fan
**I want to** visit a creator's public profile page
**So that** I can see what they offer before buying their token

**Acceptance Criteria:**
- Public page at bagsgate.xyz/[creatorSlug]
- Shows: creator bio, social links, token info (price, holders, market cap)
- Lists all content: public content fully visible, gated content shows preview + lock icon
- Prominent "Buy Token to Unlock" CTA for gated content

#### US-3.3: Buy a Creator's Token
**As a** fan
**I want to** buy a creator's token directly on BagsGate
**So that** I can unlock their gated content without leaving the site

**Acceptance Criteria:**
- Embedded swap widget on creator's page
- Fan enters SOL amount → sees token amount they'll receive
- Shows: price, fees, slippage, minimum received
- One-click buy (signs transaction with Privy embedded wallet)
- After purchase: content unlocks immediately without page reload

#### US-3.4: Fund My Wallet
**As a** fan who is new to crypto
**I want to** add funds to my wallet using a credit card or bank transfer
**So that** I can buy tokens without already owning crypto

**Acceptance Criteria:**
- On-ramp integration (MoonPay/Privy on-ramp)
- Fan can buy SOL with credit card, debit card, or bank transfer
- SOL is deposited directly into their embedded wallet
- Clear instructions for first-time users

#### US-3.5: Access Gated Content
**As a** fan who holds enough tokens
**I want to** view the creator's exclusive content
**So that** I get value from holding their token

**Acceptance Criteria:**
- Gate check happens server-side (not client-side — no cheating)
- If fan holds enough tokens → content is fully visible
- If fan doesn't hold enough → sees preview + "You need X more tokens" message
- Access is verified in real-time (if fan sells tokens, access is revoked)

#### US-3.6: View My Portfolio
**As a** fan
**I want to** see all the tokens I hold and what content I can access
**So that** I can manage my creator subscriptions in one place

**Acceptance Criteria:**
- List of all held Bags tokens with: name, symbol, amount, current value
- For each token: list of accessible gated content
- Warning if balance is close to dropping below a gate threshold
- Quick links to buy more or sell

#### US-3.7: Sell Tokens
**As a** fan
**I want to** sell a creator's token when I no longer want access
**So that** I can get my SOL back (unlike a Patreon subscription which is just gone)

**Acceptance Criteria:**
- Sell widget on portfolio page
- Warning: "Selling below X tokens will revoke access to [Gate Name]"
- One-click sell via Bags swap API
- Access revoked in real-time after sale

---

### Epic 4: Revenue & Fee Management

#### US-4.1: View Earnings Dashboard
**As a** creator
**I want to** see how much I've earned from trading fees
**So that** I can track my revenue over time

**Acceptance Criteria:**
- Total earned (all time), total unclaimed, total claimed
- Chart: earnings over time (daily/weekly/monthly)
- Per-token breakdown (if creator has multiple tokens)
- Per-claimer breakdown (if team members share fees)

#### US-4.2: Claim Fees
**As a** creator
**I want to** claim my accumulated trading fees with one click
**So that** I receive my earnings in my wallet

**Acceptance Criteria:**
- "Claim All" button that generates and signs claim transactions via Bags API
- Shows amount to be claimed before confirming
- Transaction confirmation + success message with tx signature
- Claim history with dates and amounts

#### US-4.3: Manage Team Fee Splits
**As a** creator with a team
**I want to** add team members to my fee-sharing configuration
**So that** my collaborators automatically earn their share of trading fees

**Acceptance Criteria:**
- Add team members by wallet address or social handle (Twitter, GitHub)
- Set each member's share in basis points (must total 10,000)
- Remove or adjust member shares
- Team members can claim their own fees independently

#### US-4.4: Auto-Claim Fees (Premium)
**As a** creator on a premium plan
**I want to** have my fees automatically claimed on a schedule
**So that** I don't have to manually claim every time

**Acceptance Criteria:**
- Premium feature: auto-claim when unclaimed fees exceed threshold
- Configurable threshold (e.g., claim when > 1 SOL unclaimed)
- Configurable frequency (daily, weekly)
- Email notification when auto-claim executes

---

### Epic 5: Referral System

#### US-5.1: Generate Referral Link
**As a** fan or creator
**I want to** generate a unique referral link
**So that** I can earn fees when people I refer trade tokens

**Acceptance Criteria:**
- Unique referral link per user (e.g., bagsgate.xyz/alice?ref=bob)
- Referral link works for: creator profiles and specific content
- Copy-to-clipboard button
- Shareable to Twitter, Telegram, etc.

#### US-5.2: Track Referral Earnings
**As a** referrer
**I want to** see how many people I've referred and how much I've earned
**So that** I know my referral efforts are paying off

**Acceptance Criteria:**
- Referral dashboard: total clicks, signups, active holders
- Earnings: total earned from referral fee-sharing
- Per-referral breakdown

#### US-5.3: Earn from Referrals
**As a** referrer
**I want to** earn a share of trading fees when my referred users trade
**So that** I'm incentivized to bring more people to the platform

**Acceptance Criteria:**
- Referrer is added to the fee-sharing config with their allocated BPS
- Referrer earns on every trade made by their referred users
- Earnings are claimable via the same fee claiming flow

---

### Epic 6: Notifications

#### US-6.1: Get Notified of New Content
**As a** fan
**I want to** be notified when a creator I follow publishes new gated content
**So that** I don't miss exclusive drops

**Acceptance Criteria:**
- In-app notification when new content is published
- Email notification (optional, configurable)
- Notification links directly to the content

#### US-6.2: Get Notified of Fee Milestones
**As a** creator
**I want to** be notified when my unclaimed fees reach a threshold
**So that** I can claim my earnings at the right time

**Acceptance Criteria:**
- Configurable threshold (e.g., notify when > 0.5 SOL unclaimed)
- In-app + email notification
- One-click claim from notification

#### US-6.3: Get Warned Before Losing Access
**As a** fan
**I want to** be warned if my token balance is close to the gate threshold
**So that** I can buy more tokens before losing access

**Acceptance Criteria:**
- Warning when balance is within 10% of minimum required
- In-app notification + optional email
- Quick "Buy More" action from notification

---

### Epic 7: Creator Discovery & Social

#### US-7.1: Browse Trending Creators
**As a** visitor (not logged in)
**I want to** see which creators are trending on BagsGate
**So that** I can discover interesting creators to follow

**Acceptance Criteria:**
- Public homepage with trending creators (by volume, new holders, content frequency)
- No login required to browse
- Each card links to the creator's public profile

#### US-7.2: Creator Leaderboard
**As a** visitor or user
**I want to** see a leaderboard of top creators
**So that** I can find the most successful creators on the platform

**Acceptance Criteria:**
- Sortable by: holders, volume, earnings, content count
- Filterable by category
- Public page, SEO-indexed

#### US-7.3: Share Creator Profile
**As a** fan
**I want to** share a creator's profile on social media
**So that** I can spread the word and earn referral fees

**Acceptance Criteria:**
- Share buttons: Twitter, Telegram, copy link
- Rich preview (OG image with creator name, avatar, token stats)
- Auto-appends referral code if user is logged in

---

### Epic 8: Platform Administration

#### US-8.1: View Platform Metrics
**As a** platform admin
**I want to** see platform-wide metrics
**So that** I can track growth and health of BagsGate

**Acceptance Criteria:**
- Dashboard with: total creators, total fans, total volume, total revenue
- Growth charts: new users/day, new creators/day, volume/day
- Top creators and tokens by various metrics

#### US-8.2: Moderate Content
**As a** platform admin
**I want to** flag and remove inappropriate content
**So that** the platform stays safe and trustworthy

**Acceptance Criteria:**
- Content moderation queue (user reports)
- Admin can: flag, hide, or delete content
- Creator is notified when content is moderated
- Appeal process (creator can contest moderation)

#### US-8.3: Manage Creator Verification
**As a** platform admin
**I want to** verify creators who meet quality standards
**So that** fans can trust verified creators

**Acceptance Criteria:**
- Verified badge on creator profiles
- Verification criteria: identity confirmed, active content, minimum holder count
- Admin can grant/revoke verification

---

### Epic 9: Subscription Plans (Platform Revenue)

#### US-9.1: View Pricing Plans
**As a** creator
**I want to** see what premium features are available
**So that** I can decide whether to upgrade

**Acceptance Criteria:**
- Pricing page with 3 tiers:
  - **Free**: 1 gate, basic analytics, 20% platform fee share
  - **Pro ($19/mo)**: unlimited gates, advanced analytics, 15% platform fee share
  - **Business ($49/mo)**: custom branding, API access, 10% platform fee share, auto-claim
- Clear comparison table
- Upgrade button on each tier

#### US-9.2: Subscribe to a Plan
**As a** creator
**I want to** subscribe to a premium plan
**So that** I can unlock advanced features

**Acceptance Criteria:**
- Payment via credit card (Stripe)
- Or payment via SOL/USDC (crypto checkout)
- Immediate access to premium features after payment
- Monthly billing cycle with renewal notifications

#### US-9.3: Manage Subscription
**As a** creator on a paid plan
**I want to** manage my subscription (upgrade, downgrade, cancel)
**So that** I'm in control of my spending

**Acceptance Criteria:**
- View current plan and next billing date
- Upgrade/downgrade with prorated billing
- Cancel with access until end of billing period
- Billing history with invoices

---

### Epic 10: Security & Trust

#### US-10.1: Server-Side Gate Verification
**As a** platform
**I want to** verify token holdings server-side for every content access
**So that** users cannot bypass gates by manipulating the frontend

**Acceptance Criteria:**
- Every content request checks token balance on-chain via Helius RPC
- Cached for 60 seconds to reduce RPC calls (configurable)
- Cache invalidated immediately on Helius webhook (token transfer detected)
- Failed verification returns 403 with "insufficient tokens" message

#### US-10.2: Real-Time Access Revocation
**As a** platform
**I want to** revoke content access instantly when a fan sells tokens below the gate threshold
**So that** the gate system is trustworthy and enforceable

**Acceptance Criteria:**
- Helius webhook monitors token transfers for all gated tokens
- When a fan's balance drops below gate threshold → access revoked immediately
- Fan sees "Access Revoked" message with option to buy more tokens
- Creator's analytics updated in real-time

#### US-10.3: Secure File Delivery
**As a** platform
**I want to** serve gated media files securely
**So that** non-token-holders cannot access files via direct URL

**Acceptance Criteria:**
- Media files served via signed URLs (time-limited, user-specific)
- No direct public URLs for gated content
- Signed URLs expire after 1 hour
- Server checks gate access before generating signed URL

---

## User Flow Diagrams

### Flow 1: Creator Launches Token + Gates Content
```
Creator visits BagsGate
  → Signs up with email (Privy creates wallet)
  → Selects "I'm a Creator"
  → Sets up profile (name, bio, avatar, slug)
  → Launches token wizard:
      → Names token, uploads image
      → Configures fee splits (creator 70%, platform 20%, referral 10%)
      → Sets initial buy amount
      → Confirms → Token is live on Bags
  → Creates a gate: "Hold 100 $ALICE to access"
  → Writes first exclusive post
  → Publishes → Post is gated
  → Shares creator page link on Twitter
```

### Flow 2: Fan Discovers, Buys, and Accesses Content
```
Fan clicks creator's shared link
  → Sees creator profile: bio, token info, content previews
  → Sees locked content: "Hold 100 $ALICE to unlock"
  → Clicks "Buy $ALICE"
  → Signs up with email (Privy creates wallet)
  → Funds wallet via credit card (on-ramp)
  → Buys $ALICE via embedded Bags swap
  → Content unlocks instantly
  → Fan reads exclusive content
  → Fan gets notified when new content drops
```

### Flow 3: Creator Claims Earnings
```
Creator opens BagsGate dashboard
  → Sees earnings: "$847 unclaimed from $ALICE trading fees"
  → Clicks "Claim All"
  → Signs transaction (Privy wallet)
  → Funds arrive in wallet
  → Claim appears in history
```

### Flow 4: Referrer Earns from Sharing
```
Fan generates referral link for a creator
  → Shares link on Twitter
  → New fan clicks link → signs up → buys token
  → Referrer's wallet is in the fee-sharing config
  → Every trade by referred fan → referrer earns BPS
  → Referrer claims earnings from referral dashboard
```

---

## Out of Scope (Not Building Now)

- Native mobile apps (iOS/Android) — PWA covers mobile for now
- Multi-chain support — Solana only
- NFT gating — token gating only (NFTs may come later)
- Live streaming — content is static/uploaded, not live
- Direct messaging between creators and fans
- Auction/bidding mechanics for content
- DAO governance for platform decisions
