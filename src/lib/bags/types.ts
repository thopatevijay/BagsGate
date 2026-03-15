export interface TokenLaunchInfo {
  tokenMint: string;
  tokenMetadata: string;
  tokenLaunch: {
    status: "PRE_LAUNCH" | "PRE_GRAD" | "MIGRATING" | "MIGRATED";
  };
}

export interface FeeShareConfig {
  needsCreation: boolean;
  feeShareAuthority: string;
  meteoraConfigKey: string;
  transactions: string[];
  bundles: string[][];
}

export interface FeeShareConfigParams {
  payer: string;
  baseMint: string;
  claimersArray: string[];
  basisPointsArray: number[];
  partner?: string;
  partnerConfig?: string;
  tipWallet?: string;
  tipLamports?: number;
}

export interface TradeQuote {
  requestId: string;
  inAmount: string;
  outAmount: string;
  minOutAmount: string;
  priceImpactPct: string;
  slippageBps: number;
  routePlan: RoutePlanStep[];
  platformFee: string;
  simulatedComputeUnits: number;
}

export interface RoutePlanStep {
  venue: string;
  inAmount: string;
  outAmount: string;
  inputMint: string;
  outputMint: string;
  marketKey: string;
}

export interface SwapResponse {
  swapTransaction: string;
  computeUnitLimit: number;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}

export interface ClaimablePosition {
  tokenMint: string;
  positionType: string;
  claimableAmount: string;
}

export interface ClaimStats {
  totalClaimed: string;
  totalUnclaimed: string;
  claims: ClaimEvent[];
}

export interface ClaimEvent {
  amount: string;
  timestamp: number;
  txSignature: string;
}

export interface PoolInfo {
  tokenMint: string;
  meteoraDbc: string;
  meteoraDammV2: string;
}

export interface CreatorInfo {
  provider: string;
  username: string;
  wallet: string;
  profileImage: string;
  royaltyPercentage: number;
}

export interface PartnerConfigStats {
  claimed: string;
  unclaimed: string;
}
