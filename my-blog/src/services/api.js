const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

export function getArticles() {
  return request('/api/articles');
}

export function getArticle(slug) {
  return request(`/api/articles/${slug}`);
}

export function upvoteArticle(slug) {
  return request(`/api/articles/${slug}/upvote`, { method: 'POST' });
}

export function addComment(slug, { author, text }) {
  return request(`/api/articles/${slug}/comments`, {
    method: 'POST',
    body: JSON.stringify({ author, text }),
  });
}

export function createArticle({ title, body, author }) {
  return request('/api/articles', {
    method: 'POST',
    body: JSON.stringify({ title, body, author }),
  });
}
