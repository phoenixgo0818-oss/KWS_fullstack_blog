/**
 * API service — all HTTP calls to the Express backend.
 * Base URL: REACT_APP_API_URL or http://localhost:8000
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Shared fetch wrapper: JSON headers, parses body, throws on non-OK responses.
 * @param {string} path - API path (e.g. '/api/articles')
 * @param {RequestInit} [options] - fetch options (method, body, etc.)
 * @returns {Promise<unknown>} Parsed JSON response
 */
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

/** GET /api/articles — list all articles (summary shape). */
export function getArticles() {
  return request('/api/articles');
}

/** GET /api/articles/:slug — single article with full content. */
export function getArticle(slug) {
  return request(`/api/articles/${slug}`);
}

/** POST /api/articles/:slug/upvote — increment upvote count, returns updated article. */
export function upvoteArticle(slug) {
  return request(`/api/articles/${slug}/upvote`, { method: 'POST' });
}

/** POST /api/articles/:slug/comments — add comment, returns updated article. */
export function addComment(slug, { author, text }) {
  return request(`/api/articles/${slug}/comments`, {
    method: 'POST',
    body: JSON.stringify({ author, text }),
  });
}

/**
 * POST /api/articles — create article.
 * @param {{ title: string, body: string, author?: string }} payload
 *   body is plain text; backend splits on blank lines into content[].
 */
export function createArticle({ title, body, author }) {
  return request('/api/articles', {
    method: 'POST',
    body: JSON.stringify({ title, body, author }),
  });
}
