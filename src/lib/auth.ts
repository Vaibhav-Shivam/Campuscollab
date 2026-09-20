import crypto from 'crypto';
import { cookies } from 'next/headers';

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  college?: string;
  avatar?: string;
  primaryRole?: string;
}

export interface JWTPayload extends SessionUser {
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = 'cc_session';
const DEFAULT_EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Retrieves the cryptographic secret for JWT signing and verification.
 * In production, it strictly throws a fatal error if neither SESSION_SECRET nor JWT_SECRET is configured.
 */
export function getJwtSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[FATAL SECURITY ERROR] SESSION_SECRET or JWT_SECRET must be configured in production environment. Refusing to run with unconfigured secrets.'
      );
    }
    console.warn(
      '[SECURITY WARNING] SESSION_SECRET is not set in environment. Set SESSION_SECRET in .env.local!'
    );
    return 'dev_insecure_local_secret_set_session_secret_in_env_local';
  }
  return secret;
}

/**
 * Modern OWASP-compliant password hashing using scrypt with random per-user salt.
 * Also supports transparent backward compatibility for legacy SHA-256 salted hashes.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // 1. scrypt format: scrypt:<salt>:<derivedKey>
  if (storedHash.startsWith('scrypt:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;
    const [, salt, originalKey] = parts;
    try {
      const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(derivedKey, 'hex'), Buffer.from(originalKey, 'hex'));
    } catch {
      return false;
    }
  }

  // 2. Backward compatibility for legacy SHA-256 salted hashes
  const legacySalt = 'campuscollab_salt_2026';
  const legacyHash = crypto.createHash('sha256').update(password + legacySalt).digest('hex');
  const legacyHashTrimmed = crypto.createHash('sha256').update(password.trim() + legacySalt).digest('hex');

  if (storedHash === legacyHash || storedHash === legacyHashTrimmed) {
    return true;
  }

  return false;
}

/**
 * Check if a stored hash needs to be upgraded from legacy SHA-256 to modern scrypt
 */
export function needsPasswordRehash(storedHash: string): boolean {
  return !storedHash || !storedHash.startsWith('scrypt:');
}

/**
 * Base64URL encoding/decoding helper functions
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Sign a cryptographic JWT using HMAC-SHA256
 */
export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresInSeconds: number = DEFAULT_EXPIRY_SECONDS): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const secret = getJwtSecret();
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${dataToSign}.${signature}`;
}

/**
 * Cryptographically verify an HMAC-SHA256 JWT
 */
export function verifyJWT(token: string): JWTPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const secret = getJwtSecret();
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature.length !== expectedSignature.length) return null;
  const validSig = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!validSig) return null;

  try {
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract verified session from incoming Next.js Request (from Cookie or Bearer header)
 */
export function getSessionFromRequest(request: Request): JWTPayload | null {
  // 1. Check Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const verified = verifyJWT(token);
    if (verified) return verified;
  }

  // 2. Check Cookie: cc_session=<token>
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookiesArr = cookieHeader.split(';');
    for (const c of cookiesArr) {
      const [name, val] = c.trim().split('=');
      if (name === SESSION_COOKIE_NAME && val) {
        const verified = verifyJWT(decodeURIComponent(val));
        if (verified) return verified;
      }
    }
  }

  return null;
}

/**
 * Server-side helper to determine if an email is an administrator
 */
export function isUserAdmin(email: string): boolean {
  const norm = (email || '').trim().toLowerCase();
  if (!norm) return false;
  const configuredAdmin = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!configuredAdmin) return false;
  return norm === configuredAdmin;
}
