/**
 * ErrorMessage — shared alert for API / load failures.
 * Props: message (required), prefix (optional label before the message).
 */
import './ErrorMessage.css';

const ErrorMessage = ({ message, prefix = 'Something went wrong' }) => (
  <div className="error-message" role="alert">
    <p className="error-message__text">
      {prefix}: {message}
    </p>
  </div>
);

export default ErrorMessage;
