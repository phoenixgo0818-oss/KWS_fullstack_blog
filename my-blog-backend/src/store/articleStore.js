/**
 * Article store — MongoDB operations for articles (no HTTP here).
 * Maps Mongoose documents to the JSON shape the React app expects.
 */
const Article = require('../models/Article');

/** Ensure dates are ISO strings in API responses. */
function toApiDate(value) {
  return value instanceof Date ? value.toISOString() : value;
}

/** Convert a lean Mongoose doc to the public API article object. */
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

/** Turn a title into a URL slug (lowercase, hyphens, no special chars). */
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Append -1, -2, … if slug already exists in the database. */
async function uniqueSlug(baseSlug) {
  let slug = baseSlug;
  let n = 1;
  while (await Article.exists({ slug })) {
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

/**
 * Create article from title + body string.
 * Body paragraphs: split on blank lines (\n\n).
 */
async function create({ title, body, author = 'Guest' }) {
  const baseSlug = slugify(title) || `post-${Date.now()}`;
  const slug = await uniqueSlug(baseSlug);
  const content = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const doc = await Article.create({
    id: slug,
    slug,
    title: title.trim(),
    author,
    content: content.length > 0 ? content : ['(No content yet.)'],
    upvotes: 0,
    comments: [],
  });

  return toApiArticle(doc.toObject());
}

async function upvote(slug) {
  const doc = await Article.findOneAndUpdate(
    { slug },
    { $inc: { upvotes: 1 } },
    { returnDocument: 'after' }
  ).lean();

  return toApiArticle(doc);
}

async function addComment(slug, { author = 'Guest', text }) {
  const comment = {
    id: `comment-${Date.now()}`,
    author: (author || 'Guest').trim() || 'Guest',
    text: text.trim(),
    createdAt: new Date(),
  };

  const doc = await Article.findOneAndUpdate(
    { slug },
    { $push: { comments: comment } },
    { returnDocument: 'after' }
  ).lean();

  return toApiArticle(doc);
}

module.exports = {
  getAll,
  getBySlug,
  create,
  upvote,
  addComment,
};
