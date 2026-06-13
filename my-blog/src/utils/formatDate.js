/**
 * Date formatting helpers for display in the UI.
 */

/**
 * Format an ISO date string for humans (e.g. "Jun 11, 2026").
 * @param {string} isoString - ISO 8601 date from the API
 * @returns {string} Localized date or empty string if missing
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Relative time for lists (e.g. "2 days ago"). Falls back to formatDate after 7 days.
 * @param {string} isoString - ISO 8601 date from the API
 * @returns {string}
 */
export function formatRelativeDate(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  }
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  }
  if (diffDay < 7) {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  }

  return formatDate(isoString);
}
