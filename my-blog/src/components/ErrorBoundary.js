/**
 * ErrorBoundary — catches render errors in child components.
 * Must be a class component (React has no hook equivalent yet).
 * Wrap <Routes> in App.js so one broken page does not crash the whole app.
 */
import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /** React calls this when a child throws during render. */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__text">
            This page crashed unexpectedly. Try refreshing the browser.
          </p>
          <button
            type="button"
            className="error-boundary__btn"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
