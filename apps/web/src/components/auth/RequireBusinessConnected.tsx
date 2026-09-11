import { Navigate, Outlet } from 'react-router-dom';

import { useMe } from '@/lib/api/queries';

function RequireBusinessConnected() {
  const { data, isLoading } = useMe();

  // Pendant le chargement, on n'affiche rien plutôt que de rediriger à tort
  if (isLoading) {
    return null;
  }

  // Un business est "connecté" si l'user a au moins un business avec une source GOOGLE
  const isConnected = data?.businesses?.some((b) => b.sources.some((s) => s.type === 'GOOGLE'));

  if (!isConnected) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export default RequireBusinessConnected;
