const express = require('express');
const mongoose = require('mongoose');
const articlesRouter = require('./articles');

const router = express.Router();

router.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  res.json({
    status: 'ok',
    db: connected ? 'connected' : 'disconnected',
    dbName: connected ? mongoose.connection.name : null,
  });
});

router.use('/articles', articlesRouter);

module.exports = router;
