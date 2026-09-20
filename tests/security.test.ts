import { describe, it, expect } from 'bun:test';
import { checkRateLimit } from '../src/lib/rate-limit';
import crypto from 'crypto';

describe('Rate Limiter', () => {
  it('allows requests within limit and blocks excess requests', () => {
    const key = `test-ip-${Date.now()}`;
    const limit = 5;

    for (let i = 0; i < limit; i++) {
      const res = checkRateLimit(key, limit, 60);
      expect(res.success).toBe(true);
    }

    // Next request exceeds limit
    const blocked = checkRateLimit(key, limit, 60);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetSeconds).toBeGreaterThan(0);
  });
});

describe('Constant Time Passkey Comparison', () => {
  it('safely validates administrator passkey without timing leak', () => {
    const configuredKey = 'SecureAdminSecret2026!';
    const correctInput = 'SecureAdminSecret2026!';
    const wrongInput = 'WrongAdminSecret2026!';

    const isMatchCorrect =
      correctInput.length === configuredKey.length &&
      crypto.timingSafeEqual(Buffer.from(correctInput), Buffer.from(configuredKey));

    const isMatchWrong =
      wrongInput.length === configuredKey.length &&
      crypto.timingSafeEqual(Buffer.from(wrongInput), Buffer.from(configuredKey));

    expect(isMatchCorrect).toBe(true);
    expect(isMatchWrong).toBe(false);
  });
});
