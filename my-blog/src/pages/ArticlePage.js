import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticlesList from '../components/ArticlesList';
import NotFoundPage from './NotFoundPage';
import * as api from '../services/api';
import { formatDate } from '../utils/formatDate';
import './ArticlePage.css';

const ArticlePage = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [upvoting, setUpvoting] = useState(false);
  const [author, setAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError(null);

    Promise.all([api.getArticles(), api.getArticle(slug)])
      .then(([all, one]) => {
        setArticles(all);
        setArticle(one);
      })
      .catch((err) => {
        if (err.message === 'Article not found') {
          setNotFound(true);
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const updated = await api.upvoteArticle(slug);
      setArticle(updated);
      setArticles((prev) =>
        prev.map((a) => (a.slug === updated.slug ? updated : a))
      );
    } catch (err) {
      setError(err.message);
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
      setArticles((prev) =>
        prev.map((a) => (a.slug === updated.slug ? updated : a))
      );
      setCommentText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading article…</p>;
  if (notFound) return <NotFoundPage />;
  if (error) return <p>Could not load article: {error}</p>;

  const comments = article.comments ?? [];

  return (
    <div className="article-layout">
      <aside className="article-layout__sidebar">
        <ArticlesList articles={articles} activeSlug={slug} />
      </aside>
      <main className="article-layout__main">
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
