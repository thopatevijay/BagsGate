import { prisma } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/client";
import { newContentEmail } from "@/lib/email/templates/new-content";
import { feeAlertEmail } from "@/lib/email/templates/fee-alert";
import {
  accessGrantedEmail,
  accessRevokedEmail,
} from "@/lib/email/templates/access-change";
import type { NotificationType } from "@prisma/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bagsgate.xyz";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
}): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
    },
  });
}

export async function notifyNewContent(params: {
  creatorId: string;
  creatorName: string;
  creatorSlug: string;
  contentId: string;
  contentTitle: string;
  isGated: boolean;
  tokenSymbol?: string;
  tokenMint?: string;
}): Promise<void> {
  // Find fans who hold the creator's token (via access grants)
  const fans = await prisma.accessGrant.findMany({
    where: {
      gate: { creatorId: params.creatorId },
      revokedAt: null,
    },
    select: { userId: true, user: { select: { id: true } } },
    distinct: ["userId"],
  });

  const contentUrl = `${APP_URL}/${params.creatorSlug}/${params.contentId}`;

  // Create in-app notifications
  await Promise.all(
    fans.map((fan) =>
      createNotification({
        userId: fan.userId,
        type: "NEW_CONTENT",
        title: `New content from ${params.creatorName}`,
        body: params.contentTitle,
      })
    )
  );
}

export async function notifyAccessGranted(params: {
  userId: string;
  fanName: string;
  creatorName: string;
  creatorSlug: string;
  gateName: string;
}): Promise<void> {
  await createNotification({
    userId: params.userId,
    type: "ACCESS_GRANTED",
    title: `Access granted: ${params.gateName}`,
    body: `You now have access to ${params.gateName} from ${params.creatorName}`,
  });
}

export async function notifyAccessRevoked(params: {
  userId: string;
  fanName: string;
  creatorName: string;
  creatorSlug: string;
  gateName: string;
  tokenSymbol: string;
  requiredAmount: string;
}): Promise<void> {
  await createNotification({
    userId: params.userId,
    type: "ACCESS_REVOKED",
    title: `Access revoked: ${params.gateName}`,
    body: `Your balance dropped below ${params.requiredAmount} $${params.tokenSymbol}. Buy more to regain access.`,
  });
}

export async function notifyFeeClaimable(params: {
  userId: string;
  creatorName: string;
  unclaimedAmount: string;
}): Promise<void> {
  await createNotification({
    userId: params.userId,
    type: "FEE_CLAIMABLE",
    title: "Fees ready to claim",
    body: `You have ${params.unclaimedAmount} in unclaimed trading fees`,
  });
}

export async function notifyMilestone(params: {
  userId: string;
  milestone: string;
  details: string;
}): Promise<void> {
  await createNotification({
    userId: params.userId,
    type: "MILESTONE",
    title: params.milestone,
    body: params.details,
  });
}
