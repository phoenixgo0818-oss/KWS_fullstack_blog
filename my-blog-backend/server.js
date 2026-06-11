/**
 * Server entry point — connects MongoDB, starts Express, handles graceful shutdown.
 * Run: node server.js (or npm start from my-blog-backend)
 */
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./src/db/connect');
const app = require('./src/app');

const PORT = Number(process.env.PORT) || 8000;

let server;

/** Connect DB then listen on PORT. Exits process on failure. */
async function start() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

/** Close HTTP server and MongoDB connection on SIGINT/SIGTERM. */
async function shutdown(signal) {
  console.log(`${signal} received — shutting down`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
