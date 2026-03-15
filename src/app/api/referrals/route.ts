import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import {
  generateReferralCode,
  getUserReferralCode,
  getReferralStats,
  trackReferral,
} from "@/services/referral";

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

// GET: Get referral code and stats
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let code = await getUserReferralCode(user.id);
    if (!code) {
      code = await generateReferralCode(user.id);
    }

    const stats = await getReferralStats(user.id);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bagsgate.xyz";

    return NextResponse.json({
      referralCode: code,
      referralLink: `${appUrl}?ref=${code}`,
      stats,
    });
  } catch (error) {
    console.error("Referral GET error:", error);
    return NextResponse.json(
      { error: "Failed to get referral info" },
      { status: 500 }
    );
  }
}

// POST: Track a referral conversion
export async function POST(req: NextRequest) {
  try {
    const { referralCode, referredUserId, tokenId } = await req.json();

    if (!referralCode || !referredUserId) {
      return NextResponse.json(
        { error: "referralCode and referredUserId required" },
        { status: 400 }
      );
    }

    await trackReferral({ referralCode, referredUserId, tokenId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral POST error:", error);
    return NextResponse.json(
      { error: "Failed to track referral" },
      { status: 500 }
    );
  }
}
