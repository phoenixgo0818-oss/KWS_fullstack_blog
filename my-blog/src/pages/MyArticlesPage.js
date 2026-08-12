/**
 * MyArticlesPage — articles written by the logged-in user, with edit/delete.
 * Route: /my-articles (behind ProtectedRoute)
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import { useArticles } from '../hooks/useArticles';
import LoadingMessage from '../components/LoadingMessage';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate } from '../utils/formatDate';
import './MyArticlesPage.css';

const MyArticlesPage = () => {
  const { articles, loading, error, refetch, removeArticle } = useArticles();
  const [deletingSlug, setDeletingSlug] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Refetch on mount so `isOwner` is accurate even if the list was cached
  // from before this user logged in.
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myArticles = articles.filter((article) => article.isOwner);

  const handleDelete = async (slug) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;

    setDeletingSlug(slug);
    setDeleteError(null);
    try {
      await api.deleteArticle(slug);
      removeArticle(slug);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingSlug(null);
    }
  };

  if (loading) return <LoadingMessage message="Loading your articles…" />;
  if (error) {
    return <ErrorMessage message={error} prefix="Could not load articles" />;
  }

  return (
    <div className="my-articles">
      <h1>My Articles</h1>

      {deleteError && <ErrorMessage message={deleteError} prefix="Could not delete" />}

      {myArticles.length === 0 ? (
        <p className="my-articles__empty">
          You haven&rsquo;t written anything yet.{' '}
          <Link to="/write">Write your first article</Link>.
        </p>
      ) : (
        <ul className="my-articles__list">
          {myArticles.map((article) => (
            <li key={article.slug} className="my-articles__item">
              <Link to={`/article/${article.slug}`} className="my-articles__title">
                {article.title}
              </Link>
              <span className="my-articles__meta">
                {formatDate(article.createdAt)} · {article.upvotes} upvotes ·{' '}
                {article.comments.length} comments
              </span>
              <span className="my-articles__actions">
                <Link to={`/edit/${article.slug}`} className="my-articles__edit">
                  Edit
                </Link>
                <button
                  type="button"
                  className="my-articles__delete"
                  onClick={() => handleDelete(article.slug)}
                  disabled={deletingSlug === article.slug}
                >
                  {deletingSlug === article.slug ? 'Deleting…' : 'Delete'}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyArticlesPage;
