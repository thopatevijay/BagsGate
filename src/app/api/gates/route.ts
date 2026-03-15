import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { prisma } from "@/lib/db/client";
import { getUserByPrivyId } from "@/lib/db/queries";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const verifiedClaims = await privyClient.verifyAuthToken(token);
  return getUserByPrivyId(verifiedClaims.userId);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "CREATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tokenId, name, description, gateType, requiredAmount, tierConfig, expiresAfterHours } = body;

    if (!tokenId || !name || !gateType || !requiredAmount) {
      return NextResponse.json(
        { error: "tokenId, name, gateType, and requiredAmount are required" },
        { status: 400 }
      );
    }

    // Verify token belongs to this creator
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
    });

    if (!token || token.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Token not found or not owned by you" },
        { status: 403 }
      );
    }

    const gate = await prisma.gate.create({
      data: {
        creatorId: user.id,
        tokenId,
        name,
        description,
        gateType,
        requiredAmount: BigInt(requiredAmount),
        tierConfig: tierConfig || undefined,
        expiresAfterHours: expiresAfterHours || undefined,
      },
    });

    return NextResponse.json({
      gate: {
        ...gate,
        requiredAmount: gate.requiredAmount.toString(),
      },
    });
  } catch (error) {
    console.error("Create gate error:", error);
    return NextResponse.json(
      { error: "Failed to create gate" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gates = await prisma.gate.findMany({
      where: { creatorId: user.id },
      include: { token: true, _count: { select: { content: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      gates: gates.map((g) => ({
        ...g,
        requiredAmount: g.requiredAmount.toString(),
      })),
    });
  } catch (error) {
    console.error("Get gates error:", error);
    return NextResponse.json(
      { error: "Failed to get gates" },
      { status: 500 }
    );
  }
}
