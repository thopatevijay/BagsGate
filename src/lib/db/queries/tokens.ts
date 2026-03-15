import { prisma } from "../client";
import type { TokenStatus } from "@prisma/client";

export async function createToken(data: {
  creatorId: string;
  mintAddress: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  description?: string;
  feeShareConfigKey?: string;
  partnerConfigKey?: string;
  status?: TokenStatus;
}) {
  return prisma.token.create({ data });
}

export async function getTokenByMint(mintAddress: string) {
  return prisma.token.findUnique({
    where: { mintAddress },
    include: { creator: true, gates: true },
  });
}

export async function getTokensByCreator(creatorId: string) {
  return prisma.token.findMany({
    where: { creatorId },
    include: { gates: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTokenStatus(
  mintAddress: string,
  status: TokenStatus
) {
  return prisma.token.update({
    where: { mintAddress },
    data: { status },
  });
}
