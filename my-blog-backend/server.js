require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./src/db/connect');
const app = require('./src/app');

const PORT = Number(process.env.PORT) || 8000;

let server;

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
