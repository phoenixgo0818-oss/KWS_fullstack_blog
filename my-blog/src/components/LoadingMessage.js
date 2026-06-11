import './LoadingMessage.css';

const LoadingMessage = ({ message = 'Loading…' }) => (
  <div className="loading-message" role="status" aria-live="polite">
    <span className="loading-message__spinner" aria-hidden="true" />
    <p className="loading-message__text">{message}</p>
  </div>
);

export default LoadingMessage;
