import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './NavBar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  {
    to: '/articles-list',
    label: 'Articles',
    isActive: ({ pathname }) =>
      pathname === '/articles-list' || pathname.startsWith('/article/'),
  },
  { to: '/write', label: 'Write' },
];

const HIDDEN_PILL = { left: 0, width: 0, opacity: 0 };

const NavBar = () => {
  const location = useLocation();
  const trackRef = useRef(null);
  const linkRefs = useRef({});
  const [activePill, setActivePill] = useState(HIDDEN_PILL);
  const [hoverPill, setHoverPill] = useState(HIDDEN_PILL);

  const measureLink = useCallback((key) => {
    const linkEl = linkRefs.current[key];
    const trackEl = trackRef.current;
    if (!linkEl || !trackEl) return HIDDEN_PILL;

    const trackRect = trackEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();

    return {
      left: linkRect.left - trackRect.left,
      width: linkRect.width,
      opacity: 1,
    };
  }, []);

  const getActiveKey = useCallback(() => {
    const item = NAV_ITEMS.find(({ to, end, isActive }) => {
      if (isActive) return isActive({ pathname: location.pathname });
      if (end) return location.pathname === to;
      return location.pathname === to;
    });
    return item?.to ?? null;
  }, [location.pathname]);

  useLayoutEffect(() => {
    const activeKey = getActiveKey();
    if (activeKey) {
      setActivePill(measureLink(activeKey));
    } else {
      setActivePill(HIDDEN_PILL);
    }
    setHoverPill(HIDDEN_PILL);
  }, [location.pathname, getActiveKey, measureLink]);

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
          <li className="navbar__auth-placeholder" aria-hidden="true">
            <span className="navbar__auth-link navbar__auth-link--disabled">
              Login
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
