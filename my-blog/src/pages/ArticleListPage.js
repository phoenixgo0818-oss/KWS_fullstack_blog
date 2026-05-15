import { Link } from 'react-router-dom';
import articles from './article-content';

const ArticleListPage = () => {
  return (
    <>
      <h1>Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.name}>
            <Link to={`/article/${article.name}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ArticleListPage;
