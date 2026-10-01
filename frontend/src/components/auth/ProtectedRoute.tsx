import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLoadingScreen } from './AuthLoadingScreen';
import { AccessDeniedPage } from '../../pages/AccessDeniedPage';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (currentUser?.role !== 'admin') {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
}
