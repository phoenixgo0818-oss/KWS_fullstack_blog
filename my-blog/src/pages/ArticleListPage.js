import { useEffect, useState } from 'react';
import ArticlesList from '../components/ArticlesList';
import * as api from '../services/api';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getArticles()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading articles…</p>;
  if (error) return <p>Could not load articles: {error}</p>;

  return (
    <>
      <h1>Articles</h1>
      <ArticlesList articles={articles} />
    </>
  );
};

export default ArticleListPage;
