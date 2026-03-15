const rateMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(params: {
  key: string;
  limit?: number;
  windowMs?: number;
}): { success: boolean; remaining: number } {
  const { key, limit = 60, windowMs = 60_000 } = params;
  const now = Date.now();

  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

export function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateMap.entries()) {
    if (now > entry.resetAt) {
      rateMap.delete(key);
    }
  }
}, 60_000);
