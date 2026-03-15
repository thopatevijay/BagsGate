import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { upsertUser, isSlugAvailable } from "@/lib/db/queries";

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
    const privyId = verifiedClaims.userId;

    const body = await req.json();
    const { displayName, creatorSlug, bio, role, walletAddress } = body;

    if (!displayName || !role) {
      return NextResponse.json(
        { error: "displayName and role are required" },
        { status: 400 }
      );
    }

    if (role === "CREATOR" && !creatorSlug) {
      return NextResponse.json(
        { error: "creatorSlug is required for creators" },
        { status: 400 }
      );
    }

    if (creatorSlug) {
      const available = await isSlugAvailable(creatorSlug);
      if (!available) {
        return NextResponse.json(
          { error: "This slug is already taken" },
          { status: 409 }
        );
      }
    }

    const user = await upsertUser(privyId, {
      displayName,
      bio,
      role,
      walletAddress,
      creatorSlug,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Onboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
