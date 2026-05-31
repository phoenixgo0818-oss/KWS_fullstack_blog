const express = require('express');
const articleStore = require('../store/articleStore');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(articleStore.getAll());
});

router.post('/:slug/upvote', (req, res) => {
  const article = articleStore.upvote(req.params.slug);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(article);
});

router.get('/:slug', (req, res) => {
  const article = articleStore.getBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(article);
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
