import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";
import { getBagsHeaders, getBagsUrl } from "@/lib/bags/client";

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

    const tokenMint = req.nextUrl.searchParams.get("tokenMint");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
    const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");

    if (!tokenMint) {
      return NextResponse.json(
        { error: "tokenMint is required" },
        { status: 400 }
      );
    }

    // Fetch claim events from Bags API
    const params = new URLSearchParams({
      tokenMint,
      wallet: user.walletAddress,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const res = await fetch(
      getBagsUrl(`/fee-share/token/claim-events?${params}`),
      { headers: getBagsHeaders() }
    );

    if (!res.ok) {
      return NextResponse.json({ events: [] });
    }

    const data = await res.json();

    return NextResponse.json({ events: data });
  } catch (error) {
    console.error("Fee history error:", error);
    return NextResponse.json(
      { error: "Failed to get fee history" },
      { status: 500 }
    );
  }
}
