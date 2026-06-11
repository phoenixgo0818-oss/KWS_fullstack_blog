/**
 * NotFoundPage — 404 UI. Route: * (catch-all) and reused when article slug missing.
 */
import { Link } from 'react-router-dom';
import './StaticPage.css';

const NotFoundPage = () => (
  <div className="static-page">
    <h1 className="static-page__title">404</h1>
    <p className="static-page__lead">Page not found.</p>
    <Link to="/" className="static-page__cta">
      Back to home
    </Link>
  </div>
);

export default NotFoundPage;
