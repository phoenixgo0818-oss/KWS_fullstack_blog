/**
 * ProtectedRoute — redirects to /login if no user is logged in.
 * Wrap around routes that require authentication (e.g. /write).
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  // Wait for the token restore check on load, so a logged-in user on a
  // hard refresh doesn't briefly get bounced to /login before it resolves.
  if (!ready) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
