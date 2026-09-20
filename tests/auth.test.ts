import { describe, it, expect, beforeAll } from 'bun:test';
import { hashPassword, verifyPassword, signJWT, verifyJWT, isUserAdmin, getJwtSecret } from '../src/lib/auth';

beforeAll(() => {
  process.env.SESSION_SECRET = 'test_secret_64_bytes_cryptographically_secure_for_automated_tests';
  process.env.ADMIN_EMAIL = 'mrvaibhavshivam1930@gmail.com';
});

describe('Authentication & Password Security', () => {
  it('correctly hashes and verifies passwords using modern scrypt', () => {
    const password = 'CorrectHorseBatteryStaple2026!';
    const hash = hashPassword(password);

    expect(hash.startsWith('scrypt:')).toBe(true);
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword('WrongPassword123', hash)).toBe(false);
  });

  it('strictly rejects passwords with length >= 6 that do not match stored hash (no bypass)', () => {
    const password = 'RealUserSecretPassword99!';
    const hash = hashPassword(password);

    expect(verifyPassword('random123', hash)).toBe(false);
    expect(verifyPassword('password123', hash)).toBe(false);
    expect(verifyPassword('123456', hash)).toBe(false);
    expect(verifyPassword('abcdef', hash)).toBe(false);
  });

  it('rejects empty or null password hashes', () => {
    expect(verifyPassword('password123', '')).toBe(false);
    expect(verifyPassword('anyPasswordLongEnough', null as any)).toBe(false);
  });
});

describe('Cryptographic JWT Tokens', () => {
  it('signs and verifies valid session tokens', () => {
    const payload = {
      userId: 'student-test-123',
      email: 'student@campus.edu',
      name: 'Alice Student',
      role: 'student' as const,
      college: 'Campus Tech'
    };

    const token = signJWT(payload, 3600);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const verified = verifyJWT(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe('student-test-123');
    expect(verified?.email).toBe('student@campus.edu');
    expect(verified?.role).toBe('student');
  });

  it('rejects tampered JWT tokens', () => {
    const token = signJWT({
      userId: 'student-normal',
      email: 'normal@campus.edu',
      name: 'Normal User',
      role: 'student'
    });

    const parts = token.split('.');
    // Tamper payload to escalate role to admin
    const tamperedPayload = Buffer.from(JSON.stringify({
      userId: 'student-normal',
      email: 'normal@campus.edu',
      name: 'Normal User',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    })).toString('base64').replace(/=/g, '');

    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;
    const result = verifyJWT(tamperedToken);
    expect(result).toBeNull();
  });

  it('rejects expired tokens', () => {
    // Expired 10 seconds ago
    const token = signJWT({
      userId: 'student-expired',
      email: 'expired@campus.edu',
      name: 'Expired User',
      role: 'student'
    }, -10);

    const result = verifyJWT(token);
    expect(result).toBeNull();
  });
});

describe('Role & Admin Authorization', () => {
  it('only recognizes configured ADMIN_EMAIL as admin', () => {
    const configuredAdmin = (process.env.ADMIN_EMAIL || 'mrvaibhavshivam1930@gmail.com').toLowerCase();
    expect(isUserAdmin(configuredAdmin)).toBe(true);
    expect(isUserAdmin('attacker@malicious.com')).toBe(false);
    expect(isUserAdmin('admin@campus.edu')).toBe(false);
    expect(isUserAdmin('')).toBe(false);
  });
});
