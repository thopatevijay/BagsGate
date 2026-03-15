import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import { getTokensByCreator } from "@/lib/db/queries/tokens";
import { getClaimStats, getLifetimeFees, getClaimablePositions } from "@/lib/bags/fee-share";

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

    const tokens = await getTokensByCreator(user.id);

    // Fetch stats for each token in parallel
    const tokenStats = await Promise.all(
      tokens.map(async (t) => {
        try {
          const [claimStats, lifetimeFees] = await Promise.all([
            getClaimStats({
              tokenMint: t.mintAddress,
              wallet: user.walletAddress!,
            }),
            getLifetimeFees(t.mintAddress),
          ]);

          return {
            tokenId: t.id,
            tokenName: t.name,
            tokenSymbol: t.symbol,
            mintAddress: t.mintAddress,
            totalClaimed: claimStats.totalClaimed,
            totalUnclaimed: claimStats.totalUnclaimed,
            lifetimeFees: lifetimeFees.totalFees,
            claimHistory: claimStats.claims,
          };
        } catch {
          return {
            tokenId: t.id,
            tokenName: t.name,
            tokenSymbol: t.symbol,
            mintAddress: t.mintAddress,
            totalClaimed: "0",
            totalUnclaimed: "0",
            lifetimeFees: "0",
            claimHistory: [],
          };
        }
      })
    );

    // Get all claimable positions
    let claimablePositions: Awaited<ReturnType<typeof getClaimablePositions>> = [];
    try {
      claimablePositions = await getClaimablePositions(user.walletAddress);
    } catch {
      // API may fail if no positions exist
    }

    // Aggregate totals
    const totalClaimed = tokenStats.reduce(
      (sum, s) => sum + parseInt(s.totalClaimed || "0"),
      0
    );
    const totalUnclaimed = tokenStats.reduce(
      (sum, s) => sum + parseInt(s.totalUnclaimed || "0"),
      0
    );
    const totalLifetime = tokenStats.reduce(
      (sum, s) => sum + parseInt(s.lifetimeFees || "0"),
      0
    );

    return NextResponse.json({
      summary: {
        totalClaimed: totalClaimed.toString(),
        totalUnclaimed: totalUnclaimed.toString(),
        totalLifetime: totalLifetime.toString(),
      },
      tokens: tokenStats,
      claimablePositions,
    });
  } catch (error) {
    console.error("Fee stats error:", error);
    return NextResponse.json(
      { error: "Failed to get fee stats" },
      { status: 500 }
    );
  }
}
