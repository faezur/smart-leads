import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Spinner from '../ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'sales')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, token } = useAuthStore();
  const storedToken = token || localStorage.getItem('token');

  if (isLoading) return <Spinner />;

  if (!isAuthenticated || !storedToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
