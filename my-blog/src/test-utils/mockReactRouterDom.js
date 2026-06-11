import React from 'react';

export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const Routes = ({ children }) => <div>{children}</div>;
export const Route = () => null;
export const Link = ({ children, to }) => <a href={to}>{children}</a>;
export const NavLink = React.forwardRef(({ children, to, className }, ref) => (
  <a ref={ref} href={to} className={typeof className === 'function' ? className({ isActive: false }) : className}>
    {children}
  </a>
));
export const useParams = () => ({});
export const useLocation = () => ({ pathname: '/', state: null });
export const useNavigate = () => () => {};
