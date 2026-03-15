export function feeAlertEmail(params: {
  creatorName: string;
  unclaimedAmount: string;
  claimUrl: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7C3AED;">Fees Ready to Claim</h2>
      <p style="font-size: 16px; color: #333;">
        Hey ${params.creatorName}, you have <strong>${params.unclaimedAmount}</strong> in unclaimed trading fees!
      </p>
      <a href="${params.claimUrl}"
         style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
        Claim Your Fees
      </a>
      <p style="font-size: 12px; color: #999; margin-top: 32px;">
        Fees accumulate from trading activity on your token. Claim anytime from your BagsGate dashboard.
      </p>
    </div>
  `;
}
