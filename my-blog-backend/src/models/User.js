/**
 * User model — stores registered accounts.
 * passwordHash is always bcrypt output, never the plain password.
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username:     { type: String, required: true, trim: true, maxlength: 50 },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
