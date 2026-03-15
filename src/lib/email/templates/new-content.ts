export function newContentEmail(params: {
  creatorName: string;
  contentTitle: string;
  contentUrl: string;
  isGated: boolean;
  tokenSymbol?: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7C3AED;">New Content from ${params.creatorName}</h2>
      <p style="font-size: 16px; color: #333;">
        <strong>${params.creatorName}</strong> just published: <strong>${params.contentTitle}</strong>
      </p>
      ${
        params.isGated
          ? `<p style="font-size: 14px; color: #666;">
              This content requires holding <strong>$${params.tokenSymbol}</strong> to access.
            </p>`
          : ""
      }
      <a href="${params.contentUrl}"
         style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
        View Content
      </a>
      <p style="font-size: 12px; color: #999; margin-top: 32px;">
        You're receiving this because you hold tokens from ${params.creatorName} on BagsGate.
      </p>
    </div>
  `;
}
