# Backend Auth Roadmap — JWT + bcrypt

A step-by-step guide for adding user authentication to the **my-blog-backend** Express API.
Work through each step in order — each one builds on the previous.

**Project root:** `/home/adri/Music/MERN-course`
**Backend app:** `my-blog-backend/`
**Frontend app:** `my-blog/` (frontend auth wiring comes after this roadmap)

**Commenting:** After each step, add file headers and JSDoc as in existing files.

---

## Tutor Principle

> **Authentication is a two-part handshake: prove who you are (login), then carry a pass (JWT) on every protected request.**

Do not build "my articles" or edit/delete yet — those need ownership logic that depends on auth existing first. Build auth correctly and the rest slots in cleanly.

---

## Concept Primer — Read Before Coding

### What is authentication?

Authentication = "prove to the server that you are who you say you are."
Right now, anyone can write an article. Auth adds a door with a lock.

### What is a JWT (JSON Web Token)?

Think of a JWT like a **stamp on your hand at a nightclub**. The bouncer stamps you once (login), and you show the stamp at every door (protected route). The stamp is cryptographically signed — fake ones are rejected.

A JWT looks like three Base64 strings joined by dots:
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36
[  Header (algorithm) ].[    Payload (data)   ].[  Signature (tamper-proof) ]
```

The payload contains `userId` and an expiry time. The backend can decode it without a database lookup.

### What is bcrypt?

Storing passwords as plain text is catastrophic — if the database leaks, every password is exposed.
**bcrypt** is a one-way hashing function: it scrambles the password into a fixed-length string that cannot be reversed. To check a password at login, bcrypt re-scrambles what the user typed and compares the two hashes.

```
"myPassword123" → bcrypt.hash() → "$2b$10$Kd8j..." (stored in DB)
Login attempt: bcrypt.compare("myPassword123", "$2b$10$Kd8j...") → true ✓
```

### The auth flow (big picture)

```
Register:
  User sends email + password
    → backend hashes password
    → saves User to MongoDB
    → returns JWT

Login:
  User sends email + password
    → backend finds User by email
    → bcrypt compares password to hash
    → if match: returns JWT

Protected request (e.g. write article):
  User sends request + JWT in header
    → auth middleware verifies JWT signature
    → attaches req.user (userId, username) to the request
    → route handler runs; uses req.user.username as article author
```

---

## Current Backend Structure

```
my-blog-backend/src/
├── app.js                   ← Express setup + middleware
├── db/connect.js            ← MongoDB connection
├── middleware/
│   ├── errorHandler.js      ← global error handler (already handles 409/400)
│   └── notFound.js          ← 404 handler
├── models/
│   └── Article.js           ← Article schema (no User model yet)
├── routes/
│   ├── index.js             ← mounts /api/articles + /api/health
│   └── articles.js          ← CRUD routes for articles
└── store/
    └── articleStore.js      ← MongoDB queries for articles
```

### What is missing for auth

| Missing piece | What it does |
|---|---|
| `models/User.js` | Stores email, username, hashed password in MongoDB |
| `routes/auth.js` | Handles `POST /api/auth/register` and `POST /api/auth/login` |
| `middleware/authenticate.js` | Verifies JWT on incoming requests; attaches `req.user` |
| `JWT_SECRET` in `.env` | The secret key used to sign and verify tokens |
| Protect `POST /api/articles` | Only logged-in users can write |

---

## Step 1 — Install the Two New Packages

**Packages:**
- `bcryptjs` — password hashing (pure JS, no native bindings needed)
- `jsonwebtoken` — create and verify JWTs

```bash
cd my-blog-backend
npm install bcryptjs jsonwebtoken
```

**Files changed:** `package.json`, `package-lock.json`

> **Tip:** Always run `npm install` from inside the folder that has the `package.json` for that part of the project. The backend has its own `package.json` separate from the frontend.

**Verification:** After install, check `package.json` — you should see both packages under `"dependencies"`.

---

## Step 2 — Add JWT_SECRET to the Environment

Auth needs a **secret key** to sign JWTs. Anyone with this key can forge tokens, so it must never be committed to git.

### 2a. Add to `.env.example` (safe to commit — no real value)

```
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 2b. Add to `.env` (never committed — your real secret)

```
JWT_SECRET=some-long-random-string-you-make-up
JWT_EXPIRES_IN=7d
```

**Files changed:** `.env.example`, `.env`

> **Tip:** A good JWT secret is at least 32 random characters. In production you'd use a generator. For learning, any long string is fine.

> **Note:** `JWT_EXPIRES_IN=7d` means the token expires after 7 days. After that, the user must log in again. This is a security feature — stolen tokens have a limited life.

---

## Step 3 — Create the User Model

**New file:** `my-blog-backend/src/models/User.js`

The User schema stores:

| Field | Type | Notes |
|---|---|---|
| `username` | String | Displayed as article author |
| `email` | String | Used to log in; must be unique |
| `passwordHash` | String | bcrypt output — never the plain password |
| `createdAt` | Date | Auto-set |

```javascript
// src/models/User.js
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
```

**Files changed:** `src/models/User.js` (new)

> **Tip:** The field is named `passwordHash`, not `password`. This is intentional — it signals to any reader of the code that this is never the raw password. Naming matters.

> **Note:** `unique: true` on `email` tells MongoDB to create an index that rejects duplicate emails. The existing `errorHandler.js` already handles the resulting `11000` error code and returns `{ error: 'Already exists' }`.

---

## Step 4 — Create the Auth Routes

**New file:** `my-blog-backend/src/routes/auth.js`

This file handles two endpoints:

### POST /api/auth/register

1. Read `username`, `email`, `password` from `req.body`
2. Validate — all required, password at least 6 characters
3. Hash the password with `bcrypt.hash(password, 10)` — `10` is the "cost factor" (higher = slower = more secure)
4. Create and save a new `User` document
5. Sign a JWT with `{ userId: user._id, username: user.username }`
6. Return `{ token, user: { id, username, email } }`

### POST /api/auth/login

1. Read `email`, `password` from `req.body`
2. Find user by email — if not found, return 401 (generic message, do not say "email not found")
3. `bcrypt.compare(password, user.passwordHash)` — if false, return 401
4. Sign a JWT and return same shape as register

```javascript
// src/routes/auth.js  (skeleton — you will fill in implementation)
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/** Sign a JWT for the given user. */
function signToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/** POST /api/auth/register */
router.post('/register', async (req, res, next) => {
  // TODO: validate, hash, save, sign, respond
});

/** POST /api/auth/login */
router.post('/login', async (req, res, next) => {
  // TODO: find, compare, sign, respond
});

module.exports = router;
```

**Files changed:** `src/routes/auth.js` (new)

> **Tip:** Always return the **same error message** for "email not found" and "wrong password" — something like `"Invalid credentials"`. If you say "email not found" the attacker learns which emails are registered. This is called an **enumeration attack** and is a real security concern.

---

## Step 5 — Create the Auth Middleware

**New file:** `my-blog-backend/src/middleware/authenticate.js`

This middleware runs before any protected route. It:

1. Reads the `Authorization` header — expected format: `Bearer <token>`
2. Splits off the token string
3. Calls `jwt.verify(token, JWT_SECRET)` — this throws if the token is invalid or expired
4. Attaches the decoded payload to `req.user`
5. Calls `next()` to pass control to the route handler

```javascript
// src/middleware/authenticate.js  (skeleton)
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
```

**Files changed:** `src/middleware/authenticate.js` (new)

> **Tip:** Middleware in Express is just a function with `(req, res, next)`. Calling `next()` says "I'm done, pass to the next handler". Not calling it means the request hangs. You will use this pattern a lot.

> **Note:** `jwt.verify` throws an error if the token is expired, tampered with, or signed with a different secret. The `try/catch` turns that throw into a 401 response.

---

## Step 6 — Mount the Auth Router

**Existing file:** `my-blog-backend/src/routes/index.js`

Add one line to make the auth endpoints available:

```javascript
const authRouter = require('./auth');
// ...
router.use('/auth', authRouter);
```

This makes the endpoints reachable at:
- `POST /api/auth/register`
- `POST /api/auth/login`

**Files changed:** `src/routes/index.js`

---

## Step 7 — Protect the Write Article Route

**Existing file:** `my-blog-backend/src/routes/articles.js`

Add the `authenticate` middleware to `POST /api/articles`:

```javascript
const authenticate = require('../middleware/authenticate');

// Only authenticated users can create articles
router.post('/', authenticate, async (req, res, next) => {
  // req.user.username is now available — use it as the author
  const { title, body } = req.body;  // author no longer comes from body
  const article = await articleStore.create({
    title,
    body,
    author: req.user.username,       // always from the token, not the client
  });
  // ...
});
```

**Files changed:** `src/routes/articles.js`

> **Tip:** The key insight here: `author` no longer trusts the client. The frontend can send whatever it wants in `req.body`, but `req.user.username` comes from the verified JWT — the server controls it. This is why auth matters for ownership.

> **Note:** Upvote and comment routes stay open (no auth needed) for now. This is a deliberate product decision — anyone can upvote and comment. Per-user restrictions come later.

---

## Step 8 — Test Everything with a REST Client

Before touching the frontend, verify the backend works using a tool like:
- **Postman** (GUI app — recommended for beginners)
- **curl** (command-line — shown below)
- **Thunder Client** (VS Code extension)

### Test register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"secret123"}'
# Expect: { token: "...", user: { id, username, email } }
```

### Test login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
# Expect: same shape as register
```

### Test write article (with token)
```bash
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <paste token here>" \
  -d '{"title":"Hello Auth","body":"My first authenticated article."}'
# Expect: 201 with article; author is "alice"
```

### Test write article (without token)
```bash
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Sneaky post","body":"Should fail."}'
# Expect: 401 { error: "Authentication required" }
```

---

## Progress Tracker

- [x] Step 1 — Install bcryptjs + jsonwebtoken
- [x] Step 2 — Add JWT_SECRET to .env files
- [x] Step 3 — Create User model
- [x] Step 4 — Create auth routes (register + login)
- [x] Step 5 — Create authenticate middleware
- [x] Step 6 — Mount auth router in index.js
- [x] Step 7 — Protect POST /api/articles
- [x] Step 8 — Test all endpoints manually

---

## Final Folder Structure (after all steps)

```
my-blog-backend/src/
├── app.js
├── db/connect.js
├── middleware/
│   ├── authenticate.js      ← NEW — JWT verification
│   ├── errorHandler.js
│   └── notFound.js
├── models/
│   ├── Article.js
│   └── User.js              ← NEW — user schema
├── routes/
│   ├── auth.js              ← NEW — register + login
│   ├── articles.js          ← UPDATED — POST protected
│   └── index.js             ← UPDATED — mounts /auth
└── store/
    └── articleStore.js
```

---

## What Comes After This (Frontend Auth)

Once the backend is complete and tested, the frontend needs:

| Task | File |
|---|---|
| `AuthContext` — store token + user in memory | `my-blog/src/hooks/useAuth.js` (new) |
| Login page | `my-blog/src/pages/LoginPage.js` (new) |
| Register page | `my-blog/src/pages/RegisterPage.js` (new) |
| Send `Authorization` header on API calls | `my-blog/src/services/api.js` (update `request()`) |
| Protect `/write` route | `my-blog/src/App.js` (add `<ProtectedRoute>`) |
| Remove author inputs | `WriteArticlePage.js`, `ArticlePage.js` |
| Wire Login link in NavBar | `NavBar.js` (placeholder already exists) |

---

*Last updated: June 2026 — backend auth implementation starting.*
