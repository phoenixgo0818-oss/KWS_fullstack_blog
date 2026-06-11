/**
 * Express app setup — middleware, API routes, 404 and error handlers.
 * Exported for server.js; not started here.
 */
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'KWS Phoenix Blog API',
    docs: '/api/health',
  });
});

app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
