import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import { createToken } from "@/lib/db/queries/tokens";
import {
  createTokenInfo,
  configureFeeShare,
  createLaunchTransaction,
} from "@/lib/bags/token-launch";
import { DEFAULT_FEE_SPLITS } from "@/lib/utils/constants";

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
        { error: "Only creators can launch tokens" },
        { status: 403 }
      );
    }

    if (!user.walletAddress) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, symbol, description, imageUrl, twitter, website, telegram, initialBuyLamports, feeShares } = body;

    // Step 1: Create token info on Bags
    const tokenInfo = await createTokenInfo({
      name,
      symbol,
      description,
      imageUrl,
      twitter,
      website,
      telegram,
    });

    // Step 2: Configure fee sharing
    const claimersArray = feeShares
      ? feeShares.map((s: { wallet: string }) => s.wallet)
      : [user.walletAddress, process.env.PLATFORM_WALLET_ADDRESS!];

    const basisPointsArray = feeShares
      ? feeShares.map((s: { bps: number }) => s.bps)
      : [DEFAULT_FEE_SPLITS.creator, DEFAULT_FEE_SPLITS.platform + DEFAULT_FEE_SPLITS.referral];

    const feeConfig = await configureFeeShare({
      payer: user.walletAddress,
      baseMint: tokenInfo.tokenMint,
      claimersArray,
      basisPointsArray,
      partner: process.env.PLATFORM_WALLET_ADDRESS,
      partnerConfig: process.env.PLATFORM_PARTNER_CONFIG_PDA,
    });

    // Step 3: Create launch transaction
    const launchTx = await createLaunchTransaction({
      ipfs: tokenInfo.tokenMetadata,
      tokenMint: tokenInfo.tokenMint,
      wallet: user.walletAddress,
      initialBuyLamports: initialBuyLamports || 0,
      configKey: feeConfig.meteoraConfigKey,
    });

    // Step 4: Save token to DB (status will update after user signs)
    const dbToken = await createToken({
      creatorId: user.id,
      mintAddress: tokenInfo.tokenMint,
      name,
      symbol,
      imageUrl,
      description,
      feeShareConfigKey: feeConfig.meteoraConfigKey,
      status: "PRE_LAUNCH",
    });

    return NextResponse.json({
      token: dbToken,
      tokenMint: tokenInfo.tokenMint,
      feeShareTransactions: feeConfig.transactions,
      feeShareBundles: feeConfig.bundles,
      launchTransaction: launchTx,
      needsFeeShareCreation: feeConfig.needsCreation,
    });
  } catch (error) {
    console.error("Token launch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to launch token" },
      { status: 500 }
    );
  }
}
