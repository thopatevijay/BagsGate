import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { prisma } from "@/lib/db/client";
import { getUserByPrivyId } from "@/lib/db/queries";
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
      return NextResponse.json({ feed: [] });
    }

    // Get all published content
    const allContent = await prisma.content.findMany({
      where: { isPublished: true },
      include: {
        creator: {
          select: { displayName: true, creatorSlug: true, avatarUrl: true },
        },
        gate: {
          include: { token: { select: { mintAddress: true, symbol: true } } },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });

    // Check access for gated content
    const feed = await Promise.all(
      allContent.map(async (content) => {
        let hasAccess = true;

        if (content.gate) {
          const balance = await checkTokenBalanceCached(
            user.walletAddress!,
            content.gate.token.mintAddress
          );
          hasAccess = balance >= content.gate.requiredAmount;
        }

        return {
          id: content.id,
          title: content.title,
          previewText: content.previewText,
          contentType: content.contentType,
          publishedAt: content.publishedAt,
          body: hasAccess ? content.body : null,
          creator: content.creator,
          gate: content.gate
            ? {
                name: content.gate.name,
                token: { symbol: content.gate.token.symbol },
              }
            : null,
          hasAccess,
        };
      })
    );

    return NextResponse.json({ feed });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json(
      { error: "Failed to get feed" },
      { status: 500 }
    );
  }
}
