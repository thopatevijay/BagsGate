-- BagsGate Database Schema
-- Run this in Supabase SQL Editor if prisma db push doesn't work

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FAN', 'CREATOR', 'ADMIN');
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'BUSINESS');
CREATE TYPE "TokenStatus" AS ENUM ('PRE_LAUNCH', 'ACTIVE', 'MIGRATED');
CREATE TYPE "GateType" AS ENUM ('AMOUNT', 'TIERED', 'TIME_LIMITED');
CREATE TYPE "ContentType" AS ENUM ('POST', 'IMAGE', 'VIDEO', 'FILE', 'LINK');
CREATE TYPE "NotificationType" AS ENUM ('NEW_CONTENT', 'FEE_CLAIMABLE', 'ACCESS_REVOKED', 'ACCESS_GRANTED', 'MILESTONE', 'REFERRAL_SIGNUP', 'SYSTEM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "privy_id" TEXT NOT NULL,
    "wallet_address" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'FAN',
    "display_name" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "twitter_handle" TEXT,
    "creator_slug" TEXT,
    "subscription_tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "mint_address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "image_url" TEXT,
    "description" TEXT,
    "fee_share_config_key" TEXT,
    "partner_config_key" TEXT,
    "status" "TokenStatus" NOT NULL DEFAULT 'PRE_LAUNCH',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "gates" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "gate_type" "GateType" NOT NULL,
    "required_amount" BIGINT NOT NULL,
    "tier_config" JSONB,
    "expires_after_hours" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "gates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "gate_id" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "content_type" "ContentType" NOT NULL,
    "media_url" TEXT,
    "preview_text" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "access_grants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gate_id" TEXT NOT NULL,
    "token_balance" BIGINT NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    CONSTRAINT "access_grants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "fee_claims" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "amount_lamports" BIGINT NOT NULL,
    "amount_usd" DECIMAL(18,6),
    "tx_signature" TEXT NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fee_claims_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "referrer_id" TEXT NOT NULL,
    "referred_id" TEXT NOT NULL,
    "token_id" TEXT,
    "referral_code" TEXT NOT NULL,
    "fee_bps" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "users_privy_id_key" ON "users"("privy_id");
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");
CREATE UNIQUE INDEX "users_creator_slug_key" ON "users"("creator_slug");
CREATE UNIQUE INDEX "tokens_mint_address_key" ON "tokens"("mint_address");
CREATE UNIQUE INDEX "referrals_referral_code_key" ON "referrals"("referral_code");

-- Foreign Keys
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "gates" ADD CONSTRAINT "gates_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "gates" ADD CONSTRAINT "gates_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "content" ADD CONSTRAINT "content_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "content" ADD CONSTRAINT "content_gate_id_fkey" FOREIGN KEY ("gate_id") REFERENCES "gates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "access_grants" ADD CONSTRAINT "access_grants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "access_grants" ADD CONSTRAINT "access_grants_gate_id_fkey" FOREIGN KEY ("gate_id") REFERENCES "gates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "fee_claims" ADD CONSTRAINT "fee_claims_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "fee_claims" ADD CONSTRAINT "fee_claims_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
