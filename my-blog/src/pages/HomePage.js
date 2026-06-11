/**
 * HomePage — landing intro. Route: /
 * Static content with link to the article list.
 */
import { Link } from 'react-router-dom';
import './StaticPage.css';

const HomePage = () => {
  return (
    <div className="static-page">
      <p className="static-page__lead">
        KWS Phoenix Blog is a space for learning and documenting full-stack web
        development with the MERN stack—MongoDB, Express, React, and Node. Here
        you will find practical notes on frontends, APIs, databases, and putting
        the pieces together into apps you can actually ship, not just tutorials
        tied to a single course project.
      </p>
      <Link to="/articles-list" className="static-page__cta">
        Browse articles
      </Link>
    </div>
  );
};

export default HomePage;
