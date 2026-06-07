const express = require('express');
const articleStore = require('../store/articleStore');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const articles = await articleStore.getAll();
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

router.post('/:slug/upvote', (req, res) => {
  const article = articleStore.upvote(req.params.slug);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(article);
});

router.post('/:slug/comments', (req, res) => {
  const { text, author } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  const article = articleStore.addComment(req.params.slug, { text, author });
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.status(201).json(article);
});

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

router.post('/', (req, res) => {
  const { title, body, author } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!body || typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({ error: 'Body is required' });
  }

  const article = articleStore.create({ title, body, author });
  res.status(201).json(article);
});

module.exports = router;
