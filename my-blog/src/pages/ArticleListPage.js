/**
 * ArticleListPage — all articles. Route: /articles-list
 * Reads shared list from useArticles(); no local fetch logic.
 */
import ArticlesList from '../components/ArticlesList';
import LoadingMessage from '../components/LoadingMessage';
import ErrorMessage from '../components/ErrorMessage';
import { useArticles } from '../hooks/useArticles';

const ArticleListPage = () => {
  const { articles, loading, error } = useArticles();

  if (loading) return <LoadingMessage message="Loading articles…" />;
  if (error) {
    return <ErrorMessage message={error} prefix="Could not load articles" />;
  }

  return (
    <>
      <h1>Articles</h1>
      <ArticlesList articles={articles} />
    </>
  );
};

export default ArticleListPage;
