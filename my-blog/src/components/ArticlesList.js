import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import './ArticlesList.css';

const ArticlesList = ({ articles, activeSlug, showHeading = false }) => {
  return (
    <nav className="articles-list" aria-label="Articles">
      {showHeading && <h2 className="articles-list__heading">Articles</h2>}
      <ul className="articles-list__items">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              to={`/article/${article.slug}`}
              className={
                article.slug === activeSlug
                  ? 'articles-list__link articles-list__link--active'
                  : 'articles-list__link'
              }
            >
              <span className="articles-list__text">
                <span className="articles-list__title">{article.title}</span>
                <span className="articles-list__meta">
                  {article.author ?? 'Guest'} · {formatDate(article.createdAt)}
                </span>
              </span>
              <span className="articles-list__counts">
                <span className="articles-list__upvotes">{article.upvotes ?? 0}</span>
                <span className="articles-list__comments">
                  {(article.comments ?? []).length}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ArticlesList;
