const HELIUS_API_KEY = process.env.HELIUS_API_KEY || "";
const HELIUS_BASE_URL = "https://api.helius.xyz/v0";

export function getHeliusUrl(path: string): string {
  return `${HELIUS_BASE_URL}${path}?api-key=${HELIUS_API_KEY}`;
}

export async function createWebhook(params: {
  webhookURL: string;
  accountAddresses: string[];
  transactionTypes?: string[];
  webhookType?: "enhanced" | "raw" | "rawDevnet";
}): Promise<{ webhookID: string }> {
  const res = await fetch(getHeliusUrl("/webhooks"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      webhookURL: params.webhookURL,
      transactionTypes: params.transactionTypes || ["TRANSFER"],
      accountAddresses: params.accountAddresses,
      webhookType: params.webhookType || "enhanced",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create webhook: ${error}`);
  }

  return res.json();
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  const res = await fetch(getHeliusUrl(`/webhooks/${webhookId}`), {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete webhook");
  }
}

export async function updateWebhook(
  webhookId: string,
  params: {
    accountAddresses?: string[];
  }
): Promise<void> {
  const res = await fetch(getHeliusUrl(`/webhooks/${webhookId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to update webhook");
  }
}
