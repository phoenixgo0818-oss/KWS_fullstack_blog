/**
 * Client-side sort and filter helpers for article lists.
 */

/** Sort keys used on ArticleListPage. */
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  UPVOTES: 'upvotes',
};

/**
 * Return a new array sorted by the chosen field (does not mutate input).
 * @param {Array} articles
 * @param {'newest'|'oldest'|'upvotes'} sortBy
 */
export function sortArticles(articles, sortBy) {
  const copy = [...articles];

  switch (sortBy) {
    case SORT_OPTIONS.OLDEST:
      return copy.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    case SORT_OPTIONS.UPVOTES:
      return copy.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
    case SORT_OPTIONS.NEWEST:
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
}

/**
 * Filter articles whose title contains the query (case-insensitive).
 * @param {Array} articles
 * @param {string} query
 */
export function filterArticlesByTitle(articles, query) {
  const q = query.trim().toLowerCase();
  if (!q) return articles;
  return articles.filter((a) => a.title.toLowerCase().includes(q));
}

/**
 * Newest articles first, limited to n items (for HomePage preview).
 * @param {Array} articles
 * @param {number} [limit=5]
 */
export function getRecentArticles(articles, limit = 5) {
  return sortArticles(articles, SORT_OPTIONS.NEWEST).slice(0, limit);
}
