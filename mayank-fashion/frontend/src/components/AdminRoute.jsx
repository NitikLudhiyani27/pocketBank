import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="container-x py-20 text-center">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
