import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticlesList from '../components/ArticlesList';
import NotFoundPage from './NotFoundPage';
import * as api from '../services/api';
import './ArticlePage.css';

const ArticlePage = () => {
  const { articleId } = useParams();
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [upvoting, setUpvoting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError(null);

    Promise.all([api.getArticles(), api.getArticle(articleId)])
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
  }, [articleId]);

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const updated = await api.upvoteArticle(articleId);
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

  if (loading) return <p>Loading article…</p>;
  if (notFound) return <NotFoundPage />;
  if (error) return <p>Could not load article: {error}</p>;

  return (
    <div className="article-layout">
      <aside className="article-layout__sidebar">
        <ArticlesList articles={articles} activeArticleId={articleId} />
      </aside>
      <main className="article-layout__main">
        <h1>{article.title}</h1>
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
      </main>
    </div>
  );
};

export default ArticlePage;
