/**
 * AboutPage — project description. Route: /about
 */
import { Link } from 'react-router-dom';
import './StaticPage.css';

const AboutPage = () => {
  return (
    <div className="static-page">
      <p className="static-page__lead">
        This site is built as a growing MERN learning journal: a React frontend
        with routing today, and room to add a real Express API and MongoDB
        backend as the stack matures. The goal is honest, beginner-friendly
        guidance on full-stack habits—small projects, clear architecture, and
        steady progress across the whole stack, not only the topics covered in
        the articles published so far.
      </p>
      <Link to="/articles-list" className="static-page__cta">
        View articles
      </Link>
    </div>
  );
};

export default AboutPage;
