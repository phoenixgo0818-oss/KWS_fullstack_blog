/**
 * EmptyArticlesMessage — shown when the article list is empty.
 * Links to /write so the user can create the first post.
 */
import { Link } from 'react-router-dom';
import './EmptyArticlesMessage.css';

const EmptyArticlesMessage = () => (
  <div className="empty-articles">
    <p className="empty-articles__text">No articles yet.</p>
    <p className="empty-articles__hint">Be the first to share something.</p>
    <Link to="/write" className="empty-articles__cta">
      Write the first article
    </Link>
  </div>
);

export default EmptyArticlesMessage;
