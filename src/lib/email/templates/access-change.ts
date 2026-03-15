export function accessGrantedEmail(params: {
  fanName: string;
  creatorName: string;
  gateName: string;
  creatorUrl: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #22C55E;">Access Granted!</h2>
      <p style="font-size: 16px; color: #333;">
        Hey ${params.fanName}, you now have access to <strong>${params.gateName}</strong> from ${params.creatorName}!
      </p>
      <a href="${params.creatorUrl}"
         style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
        View Content
      </a>
    </div>
  `;
}

export function accessRevokedEmail(params: {
  fanName: string;
  creatorName: string;
  gateName: string;
  tokenSymbol: string;
  requiredAmount: string;
  creatorUrl: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #EF4444;">Access Revoked</h2>
      <p style="font-size: 16px; color: #333;">
        Hey ${params.fanName}, your access to <strong>${params.gateName}</strong> from ${params.creatorName} has been revoked because your $${params.tokenSymbol} balance dropped below the required ${params.requiredAmount} tokens.
      </p>
      <a href="${params.creatorUrl}"
         style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
        Buy More Tokens
      </a>
    </div>
  `;
}
