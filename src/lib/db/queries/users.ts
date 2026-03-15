import { prisma } from "../client";
import type { UserRole, SubscriptionTier } from "@prisma/client";

export async function getUserByPrivyId(privyId: string) {
  return prisma.user.findUnique({
    where: { privyId },
    include: { tokens: true },
  });
}

export async function getUserBySlug(slug: string) {
  return prisma.user.findUnique({
    where: { creatorSlug: slug },
    include: { tokens: true },
  });
}

export async function getUserByWallet(walletAddress: string) {
  return prisma.user.findUnique({
    where: { walletAddress },
  });
}

export async function createUser(data: {
  privyId: string;
  displayName: string;
  role: UserRole;
  walletAddress?: string;
  bio?: string;
  creatorSlug?: string;
  avatarUrl?: string;
  twitterHandle?: string;
}) {
  return prisma.user.create({ data });
}

export async function updateUser(
  privyId: string,
  data: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    twitterHandle?: string;
    creatorSlug?: string;
    role?: UserRole;
    walletAddress?: string;
    subscriptionTier?: SubscriptionTier;
  }
) {
  return prisma.user.update({
    where: { privyId },
    data,
  });
}

export async function upsertUser(
  privyId: string,
  data: {
    displayName: string;
    role: UserRole;
    walletAddress?: string;
    bio?: string;
    creatorSlug?: string;
  }
) {
  return prisma.user.upsert({
    where: { privyId },
    update: {
      displayName: data.displayName,
      bio: data.bio,
      role: data.role,
      walletAddress: data.walletAddress,
      creatorSlug: data.role === "CREATOR" ? data.creatorSlug : null,
    },
    create: {
      privyId,
      displayName: data.displayName,
      bio: data.bio,
      role: data.role,
      walletAddress: data.walletAddress,
      creatorSlug: data.role === "CREATOR" ? data.creatorSlug : null,
    },
  });
}

export async function getCreators(params?: {
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { limit = 20, offset = 0, search } = params || {};

  return prisma.user.findMany({
    where: {
      role: "CREATOR",
      ...(search
        ? {
            OR: [
              { displayName: { contains: search, mode: "insensitive" } },
              { creatorSlug: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { tokens: true },
    take: limit,
    skip: offset,
    orderBy: { createdAt: "desc" },
  });
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await prisma.user.findUnique({
    where: { creatorSlug: slug },
    select: { id: true },
  });
  return !existing;
}
