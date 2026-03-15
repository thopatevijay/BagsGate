import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import {
  verifyWebhookSignature,
  extractTokenTransfers,
  type HeliusTransferEvent,
} from "@/lib/helius/webhooks";
import { checkTokenBalance } from "@/services/gate-verifier";
import { invalidateBalanceCache } from "@/services/gate-verifier";
import {
  notifyAccessGranted,
  notifyAccessRevoked,
} from "@/services/notification";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    // Verify webhook signature
    const signature = req.headers.get("x-helius-signature") || "";
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const events: HeliusTransferEvent[] = JSON.parse(body);

    for (const event of events) {
      const transfers = extractTokenTransfers(event);

      for (const transfer of transfers) {
        // Invalidate balance cache for both sender and receiver
        invalidateBalanceCache(transfer.from, transfer.mint);
        invalidateBalanceCache(transfer.to, transfer.mint);

        // Find gates for this token mint
        const token = await prisma.token.findUnique({
          where: { mintAddress: transfer.mint },
          include: {
            gates: { where: { isActive: true } },
            creator: {
              select: { displayName: true, creatorSlug: true },
            },
          },
        });

        if (!token || token.gates.length === 0) continue;

        // Check affected wallets (sender might lose access, receiver might gain)
        for (const wallet of [transfer.from, transfer.to]) {
          const user = await prisma.user.findUnique({
            where: { walletAddress: wallet },
          });

          if (!user) continue;

          const balance = await checkTokenBalance(wallet, transfer.mint);

          for (const gate of token.gates) {
            const hasAccess = balance >= gate.requiredAmount;

            // Check existing access grant
            const existingGrant = await prisma.accessGrant.findFirst({
              where: {
                userId: user.id,
                gateId: gate.id,
                revokedAt: null,
              },
            });

            if (hasAccess && !existingGrant) {
              // Grant access
              await prisma.accessGrant.create({
                data: {
                  userId: user.id,
                  gateId: gate.id,
                  tokenBalance: balance,
                },
              });

              await notifyAccessGranted({
                userId: user.id,
                fanName: user.displayName || "Fan",
                creatorName: token.creator.displayName || "Creator",
                creatorSlug: token.creator.creatorSlug || "",
                gateName: gate.name,
              });
            } else if (!hasAccess && existingGrant) {
              // Revoke access
              await prisma.accessGrant.update({
                where: { id: existingGrant.id },
                data: { revokedAt: new Date() },
              });

              await notifyAccessRevoked({
                userId: user.id,
                fanName: user.displayName || "Fan",
                creatorName: token.creator.displayName || "Creator",
                creatorSlug: token.creator.creatorSlug || "",
                gateName: gate.name,
                tokenSymbol: token.symbol,
                requiredAmount: gate.requiredAmount.toString(),
              });
            } else if (hasAccess && existingGrant) {
              // Update balance
              await prisma.accessGrant.update({
                where: { id: existingGrant.id },
                data: { tokenBalance: balance },
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
