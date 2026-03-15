import crypto from "crypto";

const WEBHOOK_SECRET = process.env.HELIUS_WEBHOOK_SECRET || "";

export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  if (!WEBHOOK_SECRET) return true; // Skip in dev if no secret

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(body);
  const expectedSignature = hmac.digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export interface HeliusTransferEvent {
  type: string;
  source: string;
  signature: string;
  timestamp: number;
  tokenTransfers: {
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    mint: string;
  }[];
  nativeTransfers: {
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }[];
}

export function extractTokenTransfers(event: HeliusTransferEvent) {
  return event.tokenTransfers.map((t) => ({
    from: t.fromUserAccount,
    to: t.toUserAccount,
    amount: t.tokenAmount,
    mint: t.mint,
    signature: event.signature,
    timestamp: event.timestamp,
  }));
}
