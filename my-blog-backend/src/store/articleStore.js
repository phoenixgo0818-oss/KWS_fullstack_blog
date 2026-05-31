const seedArticles = require('../data/seedArticles');

let articles = seedArticles.map((a) => ({ ...a, upvotes: a.upvotes ?? 0 }));

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function uniqueSlug(baseSlug) {
  let slug = baseSlug;
  let n = 1;
  while (articles.some((a) => a.slug === slug)) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }
  return slug;
}

function getAll() {
  return [...articles];
}

function getBySlug(slug) {
  return articles.find((a) => a.slug === slug);
}

function create({ title, body, author = 'Guest' }) {
  const baseSlug = slugify(title) || `post-${Date.now()}`;
  const slug = uniqueSlug(baseSlug);
  const content = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const article = {
    id: slug,
    slug,
    title: title.trim(),
    author,
    createdAt: new Date().toISOString(),
    content: content.length > 0 ? content : ['(No content yet.)'],
    upvotes: 0,
  };

  articles = [article, ...articles];
  return article;
}

function upvote(slug) {
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) return null;
  articles[index] = { ...articles[index], upvotes: articles[index].upvotes + 1 };
  return articles[index];
}

function reset() {
  articles = seedArticles.map((a) => ({ ...a, upvotes: a.upvotes ?? 0 }));
  return getAll();
}

module.exports = {
  getAll,
  getBySlug,
  create,
  upvote,
  reset,
};
