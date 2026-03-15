import { prisma } from "@/lib/db/client";
import { nanoid } from "@/lib/utils/nanoid";

export async function generateReferralCode(userId: string): Promise<string> {
  const existing = await prisma.referral.findFirst({
    where: { referrerId: userId, referredId: userId },
    select: { referralCode: true },
  });

  if (existing) return existing.referralCode;

  const code = nanoid(8);

  // Create a self-referral record to store the code
  await prisma.referral.create({
    data: {
      referrerId: userId,
      referredId: userId,
      referralCode: code,
      feeBps: 0,
    },
  });

  return code;
}

export async function getUserReferralCode(
  userId: string
): Promise<string | null> {
  const ref = await prisma.referral.findFirst({
    where: { referrerId: userId },
    select: { referralCode: true },
    orderBy: { createdAt: "asc" },
  });

  return ref?.referralCode ?? null;
}

export async function trackReferral(params: {
  referralCode: string;
  referredUserId: string;
  tokenId?: string;
  feeBps?: number;
}): Promise<void> {
  const referral = await prisma.referral.findUnique({
    where: { referralCode: params.referralCode },
  });

  if (!referral) return;

  // Don't track self-referrals
  if (referral.referrerId === params.referredUserId) return;

  // Check if already referred
  const existing = await prisma.referral.findFirst({
    where: {
      referrerId: referral.referrerId,
      referredId: params.referredUserId,
    },
  });

  if (existing) return;

  await prisma.referral.create({
    data: {
      referrerId: referral.referrerId,
      referredId: params.referredUserId,
      tokenId: params.tokenId,
      referralCode: `${params.referralCode}-${nanoid(4)}`,
      feeBps: params.feeBps || 0,
    },
  });
}

export async function getReferralStats(userId: string) {
  const referrals = await prisma.referral.findMany({
    where: {
      referrerId: userId,
      NOT: { referredId: userId }, // Exclude self-referral code record
    },
    include: {
      referred: {
        select: { displayName: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    totalReferred: referrals.length,
    referrals: referrals.map((r) => ({
      referredName: r.referred.displayName,
      referredAt: r.createdAt,
      feeBps: r.feeBps,
    })),
  };
}
