import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { verifyGateAccess, verifyTieredAccess } from "@/services/gate-verifier";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wallet = req.nextUrl.searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "wallet parameter required" },
        { status: 400 }
      );
    }

    const gate = await prisma.gate.findUnique({
      where: { id },
      include: { token: true },
    });

    if (!gate) {
      return NextResponse.json({ error: "Gate not found" }, { status: 404 });
    }

    if (gate.gateType === "TIERED" && gate.tierConfig) {
      const tiers = gate.tierConfig as { name: string; requiredAmount: number }[];
      const result = await verifyTieredAccess(
        wallet,
        gate.token.mintAddress,
        tiers
      );
      return NextResponse.json({
        hasAccess: result.currentTier !== null,
        currentTier: result.currentTier,
        balance: result.balance.toString(),
      });
    }

    const result = await verifyGateAccess(
      wallet,
      gate.token.mintAddress,
      gate.requiredAmount
    );

    return NextResponse.json({
      hasAccess: result.hasAccess,
      balance: result.balance.toString(),
      requiredAmount: result.requiredAmount.toString(),
      deficit: result.deficit.toString(),
    });
  } catch (error) {
    console.error("Gate verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify gate access" },
      { status: 500 }
    );
  }
}
