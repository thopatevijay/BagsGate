import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import { getTokensByCreator } from "@/lib/db/queries/tokens";
import { getBagsHeaders, getBagsUrl } from "@/lib/bags/client";

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

// GET: List admin tokens and their fee configs
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user?.walletAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tokens where user is admin
    const res = await fetch(
      getBagsUrl(`/fee-share/admin/list?wallet=${user.walletAddress}`),
      { headers: getBagsHeaders() }
    );

    if (!res.ok) {
      return NextResponse.json({ adminTokens: [] });
    }

    const data = await res.json();

    return NextResponse.json({ adminTokens: data });
  } catch (error) {
    console.error("Team list error:", error);
    return NextResponse.json(
      { error: "Failed to get team info" },
      { status: 500 }
    );
  }
}

// POST: Update fee-sharing config (add/remove members, adjust BPS)
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user?.walletAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tokenMint, claimersArray, basisPointsArray } = await req.json();

    if (!tokenMint || !claimersArray || !basisPointsArray) {
      return NextResponse.json(
        { error: "tokenMint, claimersArray, and basisPointsArray are required" },
        { status: 400 }
      );
    }

    // Validate BPS sum
    const totalBps = basisPointsArray.reduce(
      (sum: number, bps: number) => sum + bps,
      0
    );
    if (totalBps !== 10000) {
      return NextResponse.json(
        { error: "Basis points must sum to exactly 10,000" },
        { status: 400 }
      );
    }

    // Verify user is the admin of this token
    const tokens = await getTokensByCreator(user.id);
    const token = tokens.find((t) => t.mintAddress === tokenMint);
    if (!token) {
      return NextResponse.json(
        { error: "You are not the admin of this token" },
        { status: 403 }
      );
    }

    const res = await fetch(getBagsUrl("/fee-share/admin/update-config"), {
      method: "POST",
      headers: getBagsHeaders(),
      body: JSON.stringify({
        wallet: user.walletAddress,
        baseMint: tokenMint,
        claimersArray,
        basisPointsArray,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: `Failed to update config: ${error}` },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json({ transaction: data });
  } catch (error) {
    console.error("Team update error:", error);
    return NextResponse.json(
      { error: "Failed to update team config" },
      { status: 500 }
    );
  }
}
