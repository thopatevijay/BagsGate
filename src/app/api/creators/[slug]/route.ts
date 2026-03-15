import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const creator = await prisma.user.findUnique({
      where: { creatorSlug: slug },
      select: {
        id: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        twitterHandle: true,
        creatorSlug: true,
        createdAt: true,
        tokens: {
          select: {
            id: true,
            mintAddress: true,
            name: true,
            symbol: true,
            imageUrl: true,
            status: true,
          },
        },
        content: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            previewText: true,
            contentType: true,
            publishedAt: true,
            gateId: true,
            gate: {
              select: {
                id: true,
                name: true,
                requiredAmount: true,
                gateType: true,
                token: { select: { symbol: true, mintAddress: true } },
              },
            },
          },
          orderBy: { publishedAt: "desc" },
        },
        gates: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            requiredAmount: true,
            gateType: true,
            token: { select: { symbol: true, mintAddress: true } },
          },
        },
      },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Serialize BigInt
    const serialized = {
      ...creator,
      gates: creator.gates.map((g) => ({
        ...g,
        requiredAmount: g.requiredAmount.toString(),
      })),
      content: creator.content.map((c) => ({
        ...c,
        gate: c.gate
          ? { ...c.gate, requiredAmount: c.gate.requiredAmount.toString() }
          : null,
      })),
    };

    return NextResponse.json({ creator: serialized });
  } catch (error) {
    console.error("Get creator error:", error);
    return NextResponse.json(
      { error: "Failed to get creator" },
      { status: 500 }
    );
  }
}
