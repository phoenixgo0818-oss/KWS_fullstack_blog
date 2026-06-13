/**
 * HomePage — landing intro + recent articles preview. Route: /
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ArticlesList from '../components/ArticlesList';
import LoadingMessage from '../components/LoadingMessage';
import ErrorMessage from '../components/ErrorMessage';
import { useArticles } from '../hooks/useArticles';
import { getRecentArticles } from '../utils/articleUtils';
import './StaticPage.css';
import './HomePage.css';

const RECENT_LIMIT = 5;

const HomePage = () => {
  const { articles, loading, error } = useArticles();

  const recentArticles = useMemo(
    () => getRecentArticles(articles, RECENT_LIMIT),
    [articles]
  );

  return (
    <div className="static-page home-page">
      <p className="static-page__lead">
        KWS Phoenix Blog is a space for learning and documenting full-stack web
        development with the MERN stack—MongoDB, Express, React, and Node. Here
        you will find practical notes on frontends, APIs, databases, and putting
        the pieces together into apps you can actually ship, not just tutorials
        tied to a single course project.
      </p>
      <Link to="/articles-list" className="static-page__cta">
        Browse all articles
      </Link>

      <section className="home-page__recent" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="home-page__recent-heading">
          Recent articles
        </h2>

        {loading && <LoadingMessage message="Loading recent articles…" />}
        {error && (
          <ErrorMessage message={error} prefix="Could not load articles" />
        )}
        {!loading && !error && (
          <>
            {recentArticles.length > 0 ? (
              <ArticlesList articles={recentArticles} showHeading={false} />
            ) : (
              <p className="home-page__empty">
                No articles yet.{' '}
                <Link to="/write">Write the first one</Link>.
              </p>
            )}
            {articles.length > RECENT_LIMIT && (
              <Link to="/articles-list" className="home-page__more">
                View all {articles.length} articles
              </Link>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
