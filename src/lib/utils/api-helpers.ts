import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { getUserByPrivyId } from "@/lib/db/queries";
import { rateLimit, getRateLimitKey } from "./rate-limit";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function authenticateRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.replace("Bearer ", "");
    const verifiedClaims = await privyClient.verifyAuthToken(token);
    return getUserByPrivyId(verifiedClaims.userId);
  } catch {
    return null;
  }
}

export function withRateLimit(
  req: NextRequest,
  limit = 60,
  windowMs = 60_000
): NextResponse | null {
  const key = getRateLimitKey(req);
  const result = rateLimit({ key, limit, windowMs });

  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(windowMs / 1000).toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
