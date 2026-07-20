/**
 * WriteArticlePage — create new article form. Route: /write (behind ProtectedRoute)
 * POSTs to API then redirects to the new article with justPublished state.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './WriteArticlePage.css';

const WriteArticlePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /** Validate, create article via API, navigate to detail page on success. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      // author is not sent — the backend takes it from the JWT (req.user.username)
      const article = await api.createArticle({ title: title.trim(), body: body.trim() });
      // justPublished triggers success banner + list refetch on ArticlePage
      navigate(`/article/${article.slug}`, { state: { justPublished: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="write-article">
      <h1 className="write-article__title">Write an article</h1>
      <p className="write-article__hint">
        Separate paragraphs with a blank line. Publishing as{' '}
        <strong>{user.username}</strong>.
      </p>

      <form className="write-article__form" onSubmit={handleSubmit}>
        <label className="write-article__label" htmlFor="article-title">
          Title
        </label>
        <input
          id="article-title"
          type="text"
          className="write-article__input"
          placeholder="Article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="write-article__label" htmlFor="article-body">
          Body
        </label>
        <textarea
          id="article-body"
          className="write-article__textarea"
          placeholder="Write your article here…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          required
        />

        {error && <p className="write-article__error">{error}</p>}

        <button
          type="submit"
          className="write-article__submit"
          disabled={submitting || !title.trim() || !body.trim()}
        >
          {submitting ? 'Publishing…' : 'Publish article'}
        </button>
      </form>
    </div>
  );
};

export default WriteArticlePage;
