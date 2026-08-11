/**
 * Article store — MongoDB operations for articles (no HTTP here).
 * Maps Mongoose documents to the JSON shape the React app expects.
 */
const Article = require('../models/Article');

/** Ensure dates are ISO strings in API responses. */
function toApiDate(value) {
  return value instanceof Date ? value.toISOString() : value;
}

/**
 * Convert a lean Mongoose doc to the public API article object.
 * @param {string|undefined} currentUserId - id of the requesting user, if logged in.
 *   Used to compute `hasUpvoted` without ever exposing the full voter list.
 */
function toApiArticle(doc, currentUserId) {
  if (!doc) return null;

  const upvoterIds = doc.upvoterIds ?? [];

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    author: doc.author,
    createdAt: toApiDate(doc.createdAt),
    content: doc.content,
    upvotes: upvoterIds.length,
    hasUpvoted: currentUserId ? upvoterIds.includes(currentUserId) : false,
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

async function getAll(currentUserId) {
  const docs = await Article.find().sort({ createdAt: 1 }).lean();
  return docs.map((doc) => toApiArticle(doc, currentUserId));
}

async function getBySlug(slug, currentUserId) {
  const doc = await Article.findOne({ slug }).lean();
  return toApiArticle(doc, currentUserId);
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
    upvoterIds: [],
    comments: [],
  });

  return toApiArticle(doc.toObject());
}

/**
 * Toggle an upvote for one user on one article — vote if they haven't,
 * un-vote if they already have. The membership check lives in the query
 * filter itself (`upvoterIds: userId` / `upvoterIds: { $ne: userId }`), so
 * the check-then-flip is one atomic operation with no race condition.
 */
async function toggleUpvote(slug, userId) {
  let doc = await Article.findOneAndUpdate(
    { slug, upvoterIds: userId },
    { $pull: { upvoterIds: userId } },
    { returnDocument: 'after' }
  ).lean();

  if (!doc) {
    doc = await Article.findOneAndUpdate(
      { slug, upvoterIds: { $ne: userId } },
      { $addToSet: { upvoterIds: userId } },
      { returnDocument: 'after' }
    ).lean();
  }

  return toApiArticle(doc, userId);
}

async function addComment(slug, { author = 'Guest', text }, currentUserId) {
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

  return toApiArticle(doc, currentUserId);
}

module.exports = {
  getAll,
  getBySlug,
  create,
  toggleUpvote,
  addComment,
};
