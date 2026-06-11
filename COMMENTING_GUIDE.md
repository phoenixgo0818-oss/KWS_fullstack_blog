# Code Commenting Guide — MERN Blog Project

Use this guide whenever you add or change code in **my-blog** (frontend) or **my-blog-backend** (API).

**Related docs:** [FRONTEND_ROADMAP.md](FRONTEND_ROADMAP.md)

---

## Why we comment

Comments help **you** (and tutors) understand:

- What a **file** is responsible for
- What an **important function** does, expects, and returns
- **Non-obvious** logic (not every line of code)

Good comments read like short notes to your future self.

---

## When to add comments

| Situation | Comment? |
|-----------|----------|
| New file created | **Yes** — file header |
| New exported function / hook / API endpoint | **Yes** — JSDoc block |
| Complex logic (sliding nav, context, slugify) | **Yes** — inline or above the block |
| Obvious code (`setTitle(e.target.value)`) | **No** |
| CSS file for a component | **Optional** — one-line header |
| Test / mock files | **Brief** header only |

---

## Comment styles

### 1. File header (top of every `.js` file)

```javascript
/**
 * ArticlePage — single article view with sidebar, upvotes, and comments.
 * Route: /article/:slug
 */
```

Include:

- **File name / role** in one line
- **Route**, **endpoint**, or **layer** if relevant (page, service, store, model)

### 2. Function / hook JSDoc (important functions)

```javascript
/**
 * Fetch all articles from the API and store them in context.
 * Called once on app load; use refetch() to reload manually.
 * @returns {Promise<Array>} Resolves with the article list
 */
```

Include:

- **What** it does
- **When** it runs (if not obvious)
- **@param** and **@returns** when helpful

### 3. Inline comments (sparingly)

Use for tricky bits only:

```javascript
// Articles nav stays active on /article/:slug too, not only /articles-list
isActive: ({ pathname }) => pathname.startsWith('/article/'),
```

---

## Folder conventions

| Folder | File header should mention |
|--------|---------------------------|
| `my-blog/src/pages/` | Page purpose + route URL |
| `my-blog/src/components/` | UI role + what props it needs |
| `my-blog/src/hooks/` | What state/data the hook provides |
| `my-blog/src/services/` | API layer; list endpoints |
| `my-blog/src/utils/` | Pure helper; input → output |
| `my-blog-backend/src/routes/` | HTTP method + path |
| `my-blog-backend/src/store/` | Database operations (no HTTP) |
| `my-blog-backend/src/models/` | Mongoose schema shape |
| `my-blog-backend/src/middleware/` | When it runs in the request pipeline |

---

## Checklist after every feature / roadmap step

Before you commit, verify:

- [ ] Every **new or touched** `.js` file has a **file header**
- [ ] Every **new exported function** has a **JSDoc** (or short block above it)
- [ ] **Non-obvious** logic has a one-line explanation
- [ ] Comments are still **true** (update them when code changes)
- [ ] No commented-out dead code left behind

---

## Examples from this project

| File | Header summarizes |
|------|-------------------|
| `services/api.js` | HTTP client for backend; all fetch calls |
| `hooks/useArticles.js` | Shared article list context + hook |
| `store/articleStore.js` | MongoDB CRUD for articles |
| `routes/articles.js` | REST routes under `/api/articles` |

---

## What not to do

- Do not restate the code: `// set loading to true` above `setLoading(true)`
- Do not write novels — 1–3 lines is enough for most comments
- Do not leave TODO without context: use `// TODO(auth): replace Guest with logged-in user`

---

*Keep this guide next to FRONTEND_ROADMAP.md and follow it on every step (5, 6, auth, etc.).*
