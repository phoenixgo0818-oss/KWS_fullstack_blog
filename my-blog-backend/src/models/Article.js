const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    author: { type: String, default: 'Guest' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, default: 'Guest' },
    createdAt: { type: Date, default: Date.now },
    content: { type: [String], required: true },
    upvotes: { type: Number, default: 0 },
    comments: { type: [commentSchema], default: [] },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Article', articleSchema);
