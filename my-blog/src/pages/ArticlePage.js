import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ArticlesList from '../components/ArticlesList';
import LoadingMessage from '../components/LoadingMessage';
import ErrorMessage from '../components/ErrorMessage';
import NotFoundPage from './NotFoundPage';
import { useArticles } from '../hooks/useArticles';
import * as api from '../services/api';
import { formatDate } from '../utils/formatDate';
import './ArticlePage.css';

const ArticlePage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const justPublished = location.state?.justPublished === true;
  const {
    articles,
    loading: listLoading,
    error: listError,
    updateArticle,
    refetch,
  } = useArticles();

  const [article, setArticle] = useState(null);
  const [articleLoading, setArticleLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [articleError, setArticleError] = useState(null);
  const [upvoting, setUpvoting] = useState(false);
  const [author, setAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (justPublished) {
      refetch();
    }
  }, [justPublished, refetch]);

  useEffect(() => {
    setArticleLoading(true);
    setNotFound(false);
    setArticleError(null);

    api
      .getArticle(slug)
      .then(setArticle)
      .catch((err) => {
        if (err.message === 'Article not found') {
          setNotFound(true);
        } else {
          setArticleError(err.message);
        }
      })
      .finally(() => setArticleLoading(false));
  }, [slug]);

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const updated = await api.upvoteArticle(slug);
      setArticle(updated);
      updateArticle(updated);
    } catch (err) {
      setArticleError(err.message);
    } finally {
      setUpvoting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const updated = await api.addComment(slug, {
        author: author.trim() || 'Guest',
        text: commentText,
      });
      setArticle(updated);
      updateArticle(updated);
      setCommentText('');
    } catch (err) {
      setArticleError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const loading = listLoading || articleLoading;
  const error = listError || articleError;

  if (loading) return <LoadingMessage message="Loading article…" />;
  if (notFound) return <NotFoundPage />;
  if (error) {
    return <ErrorMessage message={error} prefix="Could not load article" />;
  }

  const comments = article.comments ?? [];

  return (
    <div className="article-layout">
      <aside className="article-layout__sidebar">
        <ArticlesList articles={articles} activeSlug={slug} />
      </aside>
      <main className="article-layout__main">
        {justPublished && (
          <p className="article-published-banner" role="status">
            Article published successfully.
          </p>
        )}
        <h1>{article.title}</h1>
        <p className="article-meta">
          <span>By {article.author ?? 'Guest'}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.createdAt}>
            {formatDate(article.createdAt)}
          </time>
        </p>
        <div className="article-upvote">
          <button
            type="button"
            className="article-upvote__btn"
            onClick={handleUpvote}
            disabled={upvoting}
            aria-label="Upvote"
          >
            👍
          </button>
          <span className="article-upvote__count">
            {article.upvotes} {article.upvotes === 1 ? 'upvote' : 'upvotes'}
          </span>
        </div>
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}

        <section className="article-comments">
          <h2 className="article-comments__heading">
            Comments ({comments.length})
          </h2>

          <form className="article-comments__form" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              className="article-comments__input"
              placeholder="Your name (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={50}
            />
            <textarea
              className="article-comments__textarea"
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              required
            />
            <button
              type="submit"
              className="article-comments__submit"
              disabled={submitting || !commentText.trim()}
            >
              {submitting ? 'Posting…' : 'Post comment'}
            </button>
          </form>

          {comments.length === 0 ? (
            <p className="article-comments__empty">No comments yet.</p>
          ) : (
            <ul className="article-comments__list">
              {comments.map((comment) => (
                <li key={comment.id} className="article-comments__item">
                  <p className="article-comments__meta">
                    <strong>{comment.author}</strong>
                    <span>{formatDate(comment.createdAt)}</span>
                  </p>
                  <p className="article-comments__text">{comment.text}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default ArticlePage;
