/**
 * Shared authentication state — React Context + hook.
 * Restores the logged-in user from a stored JWT on load; exposes register/login/logout.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

/**
 * Decode a JWT payload without verifying the signature — display only.
 * The server re-verifies the signature on every protected request; this just
 * lets the UI show "logged in as X" after a page refresh.
 * @returns {{ userId: string, username: string, exp: number } | null}
 */
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null; // expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Provider: restores the logged-in user from localStorage on mount,
 * and exposes register/login/logout. Wrap in App.js inside the Router.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = api.getToken();
    const decoded = token ? decodeToken(token) : null;

    if (decoded) {
      setUser({ id: decoded.userId, username: decoded.username });
    } else if (token) {
      api.clearToken(); // stale or expired token — drop it
    }
    setReady(true);
  }, []);

  /**
   * Register a new account, store the JWT, and set the logged-in user.
   * @returns {Promise<{ id, username, email }>}
   */
  const register = useCallback(async ({ username, email, password }) => {
    const data = await api.register({ username, email, password });
    api.setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  /**
   * Log in with existing credentials, store the JWT, and set the logged-in user.
   * @returns {Promise<{ id, username, email }>}
   */
  const login = useCallback(async ({ email, password }) => {
    const data = await api.login({ email, password });
    api.setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  /** Clear the stored JWT and logged-in user. */
  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    ready,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Access the shared auth state and helpers.
 * Must be used inside <AuthProvider>.
 * @returns {{ user, isAuthenticated, ready, register, login, logout }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
