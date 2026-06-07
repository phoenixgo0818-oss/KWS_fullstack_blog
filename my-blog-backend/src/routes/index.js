const express = require('express');
const mongoose = require('mongoose');
const articlesRouter = require('./articles');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

router.use('/articles', articlesRouter);

module.exports = router;
