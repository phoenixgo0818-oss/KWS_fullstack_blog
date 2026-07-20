/**
 * LoginPage — email/password sign-in form. Route: /login
 * On success, redirects back to the page that required login (or home).
 */
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AuthPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const redirectTo = location.state?.from?.pathname || '/';

  /** Log in via useAuth, then return to wherever the user came from. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setSubmitting(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-page__title">Log in</h1>
      <p className="auth-page__hint">
        New here? <Link to="/register">Create an account</Link>
      </p>

      <form className="auth-page__form" onSubmit={handleSubmit}>
        <label className="auth-page__label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          className="auth-page__input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label className="auth-page__label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className="auth-page__input"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="auth-page__error">{error}</p>}

        <button
          type="submit"
          className="auth-page__submit"
          disabled={submitting || !email.trim() || !password}
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
