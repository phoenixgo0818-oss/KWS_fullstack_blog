/**
 * Article routes — REST API under /api/articles.
 * Delegates persistence to articleStore (MongoDB).
 */
const express = require('express');
const articleStore = require('../store/articleStore');

const router = express.Router();

/** GET /api/articles — list all articles (oldest first). */
router.get('/', async (req, res, next) => {
  try {
    const articles = await articleStore.getAll();
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

/** POST /api/articles/:slug/upvote — increment upvotes by 1. */
router.post('/:slug/upvote', async (req, res, next) => {
  try {
    const article = await articleStore.upvote(req.params.slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
});

/** POST /api/articles/:slug/comments — body: { text, author? }. */
router.post('/:slug/comments', async (req, res, next) => {
  try {
    const { text, author } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const article = await articleStore.addComment(req.params.slug, { text, author });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
});

/** GET /api/articles/:slug — single article by slug. */
router.get('/:slug', async (req, res, next) => {
  try {
    const article = await articleStore.getBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/articles — create article.
 * Body: { title, body, author? } — body is split into content[] paragraphs.
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, body, author } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!body || typeof body !== 'string' || !body.trim()) {
      return res.status(400).json({ error: 'Body is required' });
    }

    const article = await articleStore.create({ title, body, author });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
