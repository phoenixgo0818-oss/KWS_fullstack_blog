/**
 * RegisterPage — create-account form. Route: /register
 * On success, redirects back to the page that required login (or home).
 */
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AuthPage.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const redirectTo = location.state?.from?.pathname || '/';
  const canSubmit = username.trim() && email.trim() && password.length >= 6;

  /** Register via useAuth, then return to wherever the user came from. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      await register({ username: username.trim(), email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-page__title">Create an account</h1>
      <p className="auth-page__hint">
        Already have one? <Link to="/login">Log in</Link>
      </p>

      <form className="auth-page__form" onSubmit={handleSubmit}>
        <label className="auth-page__label" htmlFor="register-username">
          Username
        </label>
        <input
          id="register-username"
          type="text"
          className="auth-page__input"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={50}
          autoComplete="username"
          required
        />

        <label className="auth-page__label" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          className="auth-page__input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label className="auth-page__label" htmlFor="register-password">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          className="auth-page__input"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />

        {error && <p className="auth-page__error">{error}</p>}

        <button type="submit" className="auth-page__submit" disabled={submitting || !canSubmit}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
