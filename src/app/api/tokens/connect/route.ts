import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import { createToken, getTokenByMint } from "@/lib/db/queries/tokens";
import { getBagsHeaders, getBagsUrl } from "@/lib/bags/client";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const verifiedClaims = await privyClient.verifyAuthToken(token);
    const user = await getUserByPrivyId(verifiedClaims.userId);

    if (!user || user.role !== "CREATOR") {
      return NextResponse.json(
        { error: "Only creators can connect tokens" },
        { status: 403 }
      );
    }

    const { mintAddress } = await req.json();

    if (!mintAddress) {
      return NextResponse.json(
        { error: "mintAddress is required" },
        { status: 400 }
      );
    }

    // Check if token already connected
    const existing = await getTokenByMint(mintAddress);
    if (existing) {
      return NextResponse.json(
        { error: "This token is already connected to BagsGate" },
        { status: 409 }
      );
    }

    // Verify token exists on Bags and get info
    const poolRes = await fetch(
      getBagsUrl(`/solana/bags/pools/token-mint?tokenMint=${mintAddress}`),
      { headers: getBagsHeaders() }
    );

    if (!poolRes.ok) {
      return NextResponse.json(
        { error: "Token not found on Bags" },
        { status: 404 }
      );
    }

    const poolData = await poolRes.json();

    // Get creator info from Bags
    const creatorRes = await fetch(
      getBagsUrl(`/token-launch/creator/v3?tokenMint=${mintAddress}`),
      { headers: getBagsHeaders() }
    );

    let tokenName = mintAddress.slice(0, 8);
    let tokenSymbol = "TOKEN";
    let tokenImage = null;

    if (creatorRes.ok) {
      const creatorData = await creatorRes.json();
      if (creatorData.wallet && creatorData.wallet !== user.walletAddress) {
        return NextResponse.json(
          { error: "You are not the creator of this token" },
          { status: 403 }
        );
      }
    }

    const dbToken = await createToken({
      creatorId: user.id,
      mintAddress,
      name: tokenName,
      symbol: tokenSymbol,
      imageUrl: tokenImage ?? undefined,
      status: "ACTIVE",
    });

    return NextResponse.json({ token: dbToken, pool: poolData });
  } catch (error) {
    console.error("Token connect error:", error);
    return NextResponse.json(
      { error: "Failed to connect token" },
      { status: 500 }
    );
  }
}
