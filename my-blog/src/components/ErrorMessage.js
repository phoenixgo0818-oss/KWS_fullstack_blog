import './ErrorMessage.css';

const ErrorMessage = ({ message, prefix = 'Something went wrong' }) => (
  <div className="error-message" role="alert">
    <p className="error-message__text">
      {prefix}: {message}
    </p>
  </div>
);

export default ErrorMessage;
