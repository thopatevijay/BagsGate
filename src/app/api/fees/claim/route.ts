import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import { generateClaimTransactions } from "@/lib/bags/fee-share";

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

    if (!user?.walletAddress) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const { tokenMint } = await req.json();

    if (!tokenMint) {
      return NextResponse.json(
        { error: "tokenMint is required" },
        { status: 400 }
      );
    }

    const result = await generateClaimTransactions({
      wallet: user.walletAddress,
      tokenMint,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json(
      { error: "Failed to generate claim transactions" },
      { status: 500 }
    );
  }
}
