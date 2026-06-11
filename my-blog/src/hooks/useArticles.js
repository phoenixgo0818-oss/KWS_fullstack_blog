/**
 * Shared article list — React Context + hook.
 * Fetches GET /api/articles once at app level; pages read via useArticles().
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as api from '../services/api';

const ArticlesContext = createContext(null);

/**
 * Provider: loads the article list on mount and shares it with child components.
 * Wrap in App.js inside the Router.
 */
export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Reload the full article list from the API.
   * @returns {Promise<Array>} Resolves with articles; rejects on network/API error
   */
  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);

    return api
      .getArticles()
      .then((data) => {
        setArticles(data);
        return data;
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  /** Replace one article in the cached list (after upvote, comment, etc.). */
  const updateArticle = useCallback((updated) => {
    setArticles((prev) =>
      prev.map((a) => (a.slug === updated.slug ? updated : a))
    );
  }, []);

  const value = {
    articles,
    loading,
    error,
    refetch,
    setArticles,
    updateArticle,
  };

  return (
    <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>
  );
}

/**
 * Access the shared article list and helpers.
 * Must be used inside <ArticlesProvider>.
 * @returns {{ articles, loading, error, refetch, setArticles, updateArticle }}
 */
export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
}
