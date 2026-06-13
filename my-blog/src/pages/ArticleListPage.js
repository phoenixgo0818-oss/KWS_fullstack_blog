/**
 * ArticleListPage — all articles with search and sort. Route: /articles-list
 */
import { useMemo, useState } from 'react';
import ArticlesList from '../components/ArticlesList';
import LoadingMessage from '../components/LoadingMessage';
import ErrorMessage from '../components/ErrorMessage';
import { useArticles } from '../hooks/useArticles';
import {
  SORT_OPTIONS,
  filterArticlesByTitle,
  sortArticles,
} from '../utils/articleUtils';
import './ArticleListPage.css';

const ArticleListPage = () => {
  const { articles, loading, error } = useArticles();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);

  const displayedArticles = useMemo(() => {
    const filtered = filterArticlesByTitle(articles, searchQuery);
    return sortArticles(filtered, sortBy);
  }, [articles, searchQuery, sortBy]);

  if (loading) return <LoadingMessage message="Loading articles…" />;
  if (error) {
    return <ErrorMessage message={error} prefix="Could not load articles" />;
  }

  return (
    <>
      <h1>Articles</h1>

      <div className="article-list-toolbar">
        <label className="article-list-toolbar__search">
          <span className="article-list-toolbar__label">Search</span>
          <input
            type="search"
            className="article-list-toolbar__input"
            placeholder="Filter by title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search articles by title"
          />
        </label>

        <label className="article-list-toolbar__sort">
          <span className="article-list-toolbar__label">Sort by</span>
          <select
            className="article-list-toolbar__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort articles"
          >
            <option value={SORT_OPTIONS.NEWEST}>Newest first</option>
            <option value={SORT_OPTIONS.OLDEST}>Oldest first</option>
            <option value={SORT_OPTIONS.UPVOTES}>Most upvoted</option>
          </select>
        </label>
      </div>

      {searchQuery.trim() && displayedArticles.length === 0 ? (
        <p className="article-list-toolbar__no-results">
          No articles match &ldquo;{searchQuery.trim()}&rdquo;.
        </p>
      ) : (
        <ArticlesList articles={displayedArticles} />
      )}

      {articles.length > 0 && (
        <p className="article-list-toolbar__count" aria-live="polite">
          Showing {displayedArticles.length} of {articles.length} articles
        </p>
      )}
    </>
  );
};

export default ArticleListPage;
