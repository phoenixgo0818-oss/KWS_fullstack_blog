const seedArticles = require('../data/seedArticles');
const Article = require('../models/Article');

let articles = seedArticles.map((a) => ({
  ...a,
  upvotes: a.upvotes ?? 0,
  comments: a.comments ?? [],
}));

function toApiDate(value) {
  return value instanceof Date ? value.toISOString() : value;
}

function toApiArticle(doc) {
  if (!doc) return null;

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    author: doc.author,
    createdAt: toApiDate(doc.createdAt),
    content: doc.content,
    upvotes: doc.upvotes ?? 0,
    comments: (doc.comments ?? []).map((comment) => ({
      id: comment.id,
      author: comment.author,
      text: comment.text,
      createdAt: toApiDate(comment.createdAt),
    })),
  };
}

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

async function getAll() {
  const docs = await Article.find().sort({ createdAt: 1 }).lean();
  return docs.map(toApiArticle);
}

async function getBySlug(slug) {
  const doc = await Article.findOne({ slug }).lean();
  return toApiArticle(doc);
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
    comments: [],
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

function addComment(slug, { author = 'Guest', text }) {
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) return null;

  const comment = {
    id: `comment-${Date.now()}`,
    author: (author || 'Guest').trim() || 'Guest',
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  const comments = [...articles[index].comments, comment];
  articles[index] = { ...articles[index], comments };
  return articles[index];
}

module.exports = {
  getAll,
  getBySlug,
  create,
  upvote,
  addComment,
};
