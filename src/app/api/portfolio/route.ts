import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";
import { checkTokenBalanceCached } from "@/services/gate-verifier";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const verifiedClaims = await privyClient.verifyAuthToken(token);
    const user = await getUserByPrivyId(verifiedClaims.userId);

    if (!user?.walletAddress) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    // Get all tokens with active gates
    const tokens = await prisma.token.findMany({
      where: { status: "ACTIVE" },
      include: {
        creator: {
          select: { displayName: true, creatorSlug: true, avatarUrl: true },
        },
        gates: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            requiredAmount: true,
            _count: { select: { content: true } },
          },
        },
      },
    });

    // Check balances for each token
    const holdings = await Promise.all(
      tokens.map(async (t) => {
        const balance = await checkTokenBalanceCached(
          user.walletAddress!,
          t.mintAddress
        );

        if (balance <= BigInt(0)) return null;

        const accessibleGates = t.gates.filter(
          (g) => balance >= g.requiredAmount
        );

        return {
          token: {
            id: t.id,
            name: t.name,
            symbol: t.symbol,
            mintAddress: t.mintAddress,
            imageUrl: t.imageUrl,
          },
          creator: t.creator,
          balance: balance.toString(),
          accessibleGates: accessibleGates.map((g) => ({
            id: g.id,
            name: g.name,
            contentCount: g._count.content,
          })),
        };
      })
    );

    return NextResponse.json({
      holdings: holdings.filter(Boolean),
    });
  } catch (error) {
    console.error("Portfolio error:", error);
    return NextResponse.json(
      { error: "Failed to get portfolio" },
      { status: 500 }
    );
  }
}
