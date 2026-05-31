import { Link } from 'react-router-dom';
import './ArticlesList.css';

const ArticlesList = ({ articles, activeArticleId, showHeading = false }) => {
  return (
    <nav className="articles-list" aria-label="Articles">
      {showHeading && <h2 className="articles-list__heading">Articles</h2>}
      <ul className="articles-list__items">
        {articles.map((article) => {
          const slug = article.slug || article.name;
          return (
            <li key={slug}>
              <Link
                to={`/article/${slug}`}
                className={
                  slug === activeArticleId
                    ? 'articles-list__link articles-list__link--active'
                    : 'articles-list__link'
                }
              >
                {article.title}
                <span className="articles-list__upvotes">{article.upvotes ?? 0}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ArticlesList;
