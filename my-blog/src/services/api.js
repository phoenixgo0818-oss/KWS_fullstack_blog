/**
 * API service — all HTTP calls to the Express backend.
 * Base URL: REACT_APP_API_URL or http://localhost:8000
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'kws_phoenix_blog_token';

/** Read the stored JWT, if any. */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** Persist the JWT after register/login. */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Remove the stored JWT (logout). */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Shared fetch wrapper: JSON headers, parses body, throws on non-OK responses.
 * Attaches the stored JWT as a Bearer token when one is present.
 * @param {string} path - API path (e.g. '/api/articles')
 * @param {RequestInit} [options] - fetch options (method, body, etc.)
 * @returns {Promise<unknown>} Parsed JSON response
 */
async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
 * POST /api/articles — create article. Requires a logged-in user (JWT sent via request()).
 * @param {{ title: string, body: string }} payload
 *   body is plain text; backend splits on blank lines into content[].
 *   author is not sent — the backend derives it from the token.
 */
export function createArticle({ title, body }) {
  return request('/api/articles', {
    method: 'POST',
    body: JSON.stringify({ title, body }),
  });
}

/**
 * POST /api/auth/register — create an account.
 * @param {{ username: string, email: string, password: string }} payload
 * @returns {Promise<{ token: string, user: { id, username, email } }>}
 */
export function register({ username, email, password }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

/**
 * POST /api/auth/login — verify credentials and get a JWT.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ token: string, user: { id, username, email } }>}
 */
export function login({ email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
