import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  try {
    const sortBy = req.nextUrl.searchParams.get("sort") || "content";
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

    const creators = await prisma.user.findMany({
      where: { role: "CREATOR" },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        creatorSlug: true,
        bio: true,
        createdAt: true,
        tokens: {
          select: { symbol: true, name: true, mintAddress: true },
        },
        _count: {
          select: {
            content: { where: { isPublished: true } },
            gates: { where: { isActive: true } },
          },
        },
      },
      take: limit,
    });

    // Sort based on criteria
    const sorted = creators.sort((a, b) => {
      switch (sortBy) {
        case "content":
          return b._count.content - a._count.content;
        case "gates":
          return b._count.gates - a._count.gates;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return b._count.content - a._count.content;
      }
    });

    const leaderboard = sorted.map((c, index) => ({
      rank: index + 1,
      id: c.id,
      displayName: c.displayName,
      avatarUrl: c.avatarUrl,
      creatorSlug: c.creatorSlug,
      bio: c.bio,
      tokenSymbol: c.tokens[0]?.symbol || null,
      contentCount: c._count.content,
      gateCount: c._count.gates,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to get leaderboard" },
      { status: 500 }
    );
  }
}
