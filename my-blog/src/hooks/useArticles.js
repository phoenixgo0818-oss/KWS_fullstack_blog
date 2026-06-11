import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as api from '../services/api';

const ArticlesContext = createContext(null);

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
}
