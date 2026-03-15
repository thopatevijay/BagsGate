export const APP_NAME = "BagsGate";
export const APP_DESCRIPTION =
  "Token-gated creator access platform on Bags.fm. Creators gate content behind their token, fans buy to access, everyone earns through fee-sharing.";

export const SOL_MINT = "So11111111111111111111111111111111111111112";

export const DEFAULT_FEE_SPLITS = {
  creator: 7000, // 70%
  platform: 2000, // 20%
  referral: 1000, // 10%
} as const;

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: "Free",
    price: 0,
    maxGates: 1,
    platformFeeBps: 2000,
    features: ["1 token gate", "Basic analytics", "Community support"],
  },
  PRO: {
    name: "Pro",
    price: 19,
    maxGates: -1, // unlimited
    platformFeeBps: 1500,
    features: [
      "Unlimited gates",
      "Advanced analytics",
      "Priority support",
      "Custom preview text",
    ],
  },
  BUSINESS: {
    name: "Business",
    price: 49,
    maxGates: -1,
    platformFeeBps: 1000,
    features: [
      "Everything in Pro",
      "Custom branding",
      "API access",
      "Auto-claim fees",
      "Team management",
    ],
  },
} as const;

export const BAGS_PROGRAMS = {
  FEE_SHARE_V2: "FEE2tBhCKAt7shrod19QttSVREUYPiyMzoku1mL1gqVK",
  METEORA_DAMM_V2: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG",
  METEORA_DBC: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN",
  PUBLIC_LUT: "Eq1EVs15EAWww1YtPTtWPzJRLPJoS6VYP9oW9SbNr3yp",
} as const;
