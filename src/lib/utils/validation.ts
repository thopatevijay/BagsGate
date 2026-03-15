import { z } from "zod";

export const createProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional(),
  twitterHandle: z
    .string()
    .regex(/^[a-zA-Z0-9_]{1,15}$/, "Invalid Twitter handle")
    .optional(),
  creatorSlug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be under 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  role: z.enum(["FAN", "CREATOR"]),
});

export const createTokenSchema = z.object({
  name: z
    .string()
    .min(1, "Token name is required")
    .max(32, "Token name must be under 32 characters"),
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(10, "Symbol must be under 10 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be under 1000 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  telegram: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional(),
  initialBuyLamports: z
    .number()
    .min(0, "Initial buy must be positive")
    .default(0),
  feeShares: z
    .array(
      z.object({
        wallet: z.string(),
        bps: z.number().min(0).max(10000),
      })
    )
    .refine(
      (shares) => shares.reduce((sum, s) => sum + s.bps, 0) === 10000,
      "Fee shares must total exactly 10,000 basis points (100%)"
    ),
});

export const createGateSchema = z.object({
  tokenId: z.string().uuid(),
  name: z
    .string()
    .min(1, "Gate name is required")
    .max(100, "Gate name must be under 100 characters"),
  description: z.string().max(500).optional(),
  gateType: z.enum(["AMOUNT", "TIERED", "TIME_LIMITED"]),
  requiredAmount: z
    .number()
    .min(1, "Required amount must be at least 1")
    .transform((v) => BigInt(v)),
  tierConfig: z
    .array(
      z.object({
        name: z.string(),
        requiredAmount: z.number().min(1),
      })
    )
    .optional(),
  expiresAfterHours: z.number().min(1).optional(),
});

export const createContentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),
  body: z.string().min(1, "Content body is required"),
  contentType: z.enum(["POST", "IMAGE", "VIDEO", "FILE", "LINK"]),
  gateId: z.string().uuid().optional(),
  mediaUrl: z.string().url().optional(),
  previewText: z.string().max(500).optional(),
  isPublished: z.boolean().default(false),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type CreateTokenInput = z.infer<typeof createTokenSchema>;
export type CreateGateInput = z.infer<typeof createGateSchema>;
export type CreateContentInput = z.infer<typeof createContentSchema>;
