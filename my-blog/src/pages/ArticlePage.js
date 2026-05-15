import { Link, useParams } from 'react-router-dom';
import articles from './article-content';

const ArticlePage = () => {
  const { articleId } = useParams();
  const article = articles.find((a) => a.name === articleId);

  if (!article) {
    return <h1>Article not found</h1>;
  }

  const otherArticles = articles.filter((a) => a.name !== articleId);

  return (
    <>
      <h1>{article.title}</h1>
      {article.content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      <h3>Other articles:</h3>
      <ul>
        {otherArticles.map((a) => (
          <li key={a.name}>
            <Link to={`/article/${a.name}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ArticlePage;
