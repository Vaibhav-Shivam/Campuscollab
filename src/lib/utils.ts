/**
 * Utility functions for CampusCollab
 * - Relative time formatting (formatTimeAgo)
 * - Safe UUID generation
 * - Formatting helpers
 */

/**
 * Formats an ISO timestamp or date into human-friendly relative time (e.g. "Just now", "5m ago", "2h ago", "3d ago")
 * or a formatted date if older than a month.
 */
export function formatTimeAgo(dateInput?: string | number | Date | null): string {
  if (!dateInput) return 'Just now';

  // Handle strings that are already pre-formatted relative descriptions
  if (
    typeof dateInput === 'string' &&
    (dateInput.includes('ago') ||
      dateInput.toLowerCase() === 'just now' ||
      dateInput.toLowerCase() === 'recent' ||
      dateInput.toLowerCase() === 'upcoming')
  ) {
    return dateInput;
  }

  const date =
    typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput;

  if (isNaN(date.getTime())) {
    return typeof dateInput === 'string' ? dateInput : 'Just now';
  }

  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - date.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}w ago`;
  }

  // Older dates: format cleanly (e.g. "Sep 20, 2026")
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Cryptographically secure UUID generator
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
