/**
 * Seed script — load seedArticles into MongoDB.
 * Run: npm run seed | npm run seed:reset (--reset clears collection first)
 */
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../db/connect');
const Article = require('../models/Article');
const seedArticles = require('../data/seedArticles');

const reset = process.argv.includes('--reset');

/** Map seed data objects to Mongoose document shape. */
function toDocuments() {
  return seedArticles.map((article) => ({
    id: article.id || article.slug,
    slug: article.slug,
    title: article.title,
    author: article.author || 'Guest',
    createdAt: article.createdAt ? new Date(article.createdAt) : new Date(),
    content: article.content,
    upvotes: article.upvotes ?? 0,
    comments: article.comments ?? [],
  }));
}

async function seed() {
  await connectDB();

  if (reset) {
    const { deletedCount } = await Article.deleteMany({});
    console.log(`Reset: cleared ${deletedCount} articles.`);
  } else {
    const existing = await Article.countDocuments();
    if (existing > 0) {
      console.log(`Already seeded (${existing} articles). Skipping.`);
      console.log('To re-seed from scratch, run: npm run seed:reset');
      return;
    }
  }

  const docs = toDocuments();
  await Article.insertMany(docs);
  console.log(`Seeded ${docs.length} articles into MongoDB.`);
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
