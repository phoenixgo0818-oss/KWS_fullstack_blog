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
