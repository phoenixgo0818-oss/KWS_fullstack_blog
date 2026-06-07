require('dotenv').config();

const connectDB = require('./src/db/connect');
const app = require('./src/app');

const PORT = Number(process.env.PORT) || 8000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
