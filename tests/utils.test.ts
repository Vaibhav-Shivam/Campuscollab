import { describe, it, expect } from 'bun:test';
import { formatTimeAgo, generateUUID } from '../src/lib/utils';

describe('Timestamp & ID Utilities (Audit Item #24)', () => {
  it('formats recent timestamps as Just now', () => {
    const justNowIso = new Date().toISOString();
    expect(formatTimeAgo(justNowIso)).toBe('Just now');
  });

  it('formats minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatTimeAgo(fiveMinutesAgo)).toBe('5m ago');
  });

  it('formats hours ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    expect(formatTimeAgo(threeHoursAgo)).toBe('3h ago');
  });

  it('formats days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString();
    expect(formatTimeAgo(twoDaysAgo)).toBe('2d ago');
  });

  it('preserves human relative strings safely', () => {
    expect(formatTimeAgo('Just now')).toBe('Just now');
    expect(formatTimeAgo('3 days ago')).toBe('3 days ago');
    expect(formatTimeAgo('Recent')).toBe('Recent');
  });

  it('generates standard RFC4122 compliant UUIDs', () => {
    const id1 = generateUUID();
    const id2 = generateUUID();
    expect(typeof id1).toBe('string');
    expect(id1).not.toBe(id2);
    // UUID v4 regex pattern
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(id1)).toBe(true);
    expect(uuidRegex.test(id2)).toBe(true);
  });
});
