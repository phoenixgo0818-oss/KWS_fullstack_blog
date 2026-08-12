/**
 * EditArticlePage — edit an existing article. Route: /edit/:slug (behind ProtectedRoute)
 * Loads the article, pre-fills the form, PATCHes on submit.
 * Server re-checks ownership on every request — this page's own check is just UX.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/api';
import { useArticles } from '../hooks/useArticles';
import LoadingMessage from '../components/LoadingMessage';
import ErrorMessage from '../components/ErrorMessage';
import './WriteArticlePage.css';

const EditArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { updateArticle } = useArticles();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Load the article once, pre-fill the form, and bounce non-owners away.
  useEffect(() => {
    api
      .getArticle(slug)
      .then((article) => {
        if (!article.isOwner) {
          setForbidden(true);
          return;
        }
        setTitle(article.title);
        setBody(article.content.join('\n\n'));
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const updated = await api.updateArticle(slug, { title: title.trim(), body: body.trim() });
      updateArticle(updated);
      navigate(`/article/${slug}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingMessage message="Loading article…" />;
  if (loadError) {
    return <ErrorMessage message={loadError} prefix="Could not load article" />;
  }
  if (forbidden) {
    return <ErrorMessage message="You can only edit your own articles." />;
  }

  return (
    <div className="write-article">
      <h1 className="write-article__title">Edit article</h1>
      <p className="write-article__hint">
        Separate paragraphs with a blank line.
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

        {submitError && <p className="write-article__error">{submitError}</p>}

        <button
          type="submit"
          className="write-article__submit"
          disabled={submitting || !title.trim() || !body.trim()}
        >
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;
