/**
 * Main navigation — NavLink items with sliding frosted-glass active indicator
 * and hover highlight. Shows a Login link when logged out, or the current
 * user + a Log out button when logged in.
 */
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './NavBar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  {
    to: '/articles-list',
    label: 'Articles',
    // Keep "Articles" highlighted when viewing a single article page
    isActive: ({ pathname }) =>
      pathname === '/articles-list' || pathname.startsWith('/article/'),
  },
  { to: '/write', label: 'Write' },
];

/** Hidden pill style — used before measurement or when no link is active */
const HIDDEN_PILL = { left: 0, width: 0, opacity: 0 };

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const trackRef = useRef(null);
  const linkRefs = useRef({});
  const [activePill, setActivePill] = useState(HIDDEN_PILL);
  const [hoverPill, setHoverPill] = useState(HIDDEN_PILL);

  /**
   * Measure a nav link's position relative to the track for pill placement.
   * @param {string} key - NAV_ITEMS `to` path used as ref key
   */
  const measureLink = useCallback((key) => {
    const linkEl = linkRefs.current[key];
    const trackEl = trackRef.current;
    if (!linkEl || !trackEl) return HIDDEN_PILL;

    const trackRect = trackEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();

    return {
      left: linkRect.left - trackRect.left,
      top: linkRect.top - trackRect.top + linkRect.height / 2,
      width: linkRect.width,
      opacity: 1,
    };
  }, []);

  /** Which nav item matches the current URL (for the active sliding pill). */
  const getActiveKey = useCallback(() => {
    const item = NAV_ITEMS.find(({ to, end, isActive }) => {
      if (isActive) return isActive({ pathname: location.pathname });
      if (end) return location.pathname === to;
      return location.pathname === to;
    });
    return item?.to ?? null;
  }, [location.pathname]);

  // Move active pill when route changes (before paint to avoid flicker)
  useLayoutEffect(() => {
    const activeKey = getActiveKey();
    if (activeKey) {
      setActivePill(measureLink(activeKey));
    } else {
      setActivePill(HIDDEN_PILL);
    }
    setHoverPill(HIDDEN_PILL);
  }, [location.pathname, getActiveKey, measureLink]);

  // Re-measure active pill on window resize
  useLayoutEffect(() => {
    const handleResize = () => {
      const activeKey = getActiveKey();
      if (activeKey) {
        setActivePill(measureLink(activeKey));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getActiveKey, measureLink]);

  const handleMouseEnter = (key) => {
    setHoverPill(measureLink(key));
  };

  const handleMouseLeave = () => {
    setHoverPill(HIDDEN_PILL);
  };

  /** Clear the session and return to the homepage. */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" aria-label="Main">
      <div className="navbar__track" ref={trackRef}>
        <span
          className="navbar__pill navbar__pill--active"
          style={activePill}
          aria-hidden="true"
        />
        <span
          className="navbar__pill navbar__pill--hover"
          style={hoverPill}
          aria-hidden="true"
        />
        <ul className="navbar__list">
          {NAV_ITEMS.map(({ to, label, end, isActive }) => (
            <li key={to}>
              <NavLink
                ref={(el) => {
                  linkRefs.current[to] = el;
                }}
                to={to}
                end={end}
                isActive={isActive}
                className={({ isActive: active }) =>
                  active ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
                onMouseEnter={() => handleMouseEnter(to)}
                onMouseLeave={handleMouseLeave}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="navbar__auth">
            {isAuthenticated ? (
              <span className="navbar__auth-group">
                <span className="navbar__auth-user">Hi, {user.username}</span>
                <button
                  type="button"
                  className="navbar__auth-logout"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </span>
            ) : (
              <NavLink to="/login" className="navbar__auth-link">
                Login
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
