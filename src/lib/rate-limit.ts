// Production in-memory sliding window rate limiter
// Protects against credential stuffing, brute force, and abuse

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const MAX_RATE_LIMIT_KEYS = 10000;
const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired entries
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (record.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    }
  }, 60 * 1000);
  if (timer.unref) {
    timer.unref();
  }
}

export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowSeconds: number = 60
): { success: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000
    });
    return {
      success: true,
      remaining: limit - 1,
      resetSeconds: windowSeconds
    };
  }

  if (existing.count >= limit) {
    const resetSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      success: false,
      remaining: 0,
      resetSeconds
    };
  }

  existing.count += 1;
  const resetSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return {
    success: true,
    remaining: limit - existing.count,
    resetSeconds
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}
