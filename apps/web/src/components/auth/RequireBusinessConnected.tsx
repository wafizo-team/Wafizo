import { Navigate, Outlet } from 'react-router-dom';

import { useMe } from '@/lib/api/queries';

function RequireBusinessConnected() {
  const { data, isLoading } = useMe();

  // Pendant le chargement, on n'affiche rien plutôt que de rediriger à tort
  if (isLoading) {
    return null;
  }

  // TODO(dette-technique): réactiver le check sources.some(s => s.type === 'GOOGLE')
  // quand plusieurs types de sources (Google, Facebook, etc.) seront supportés,
  // ET que POST /business/connect créera aussi la Source Google associée.
  const isConnected = (data?.businesses?.length ?? 0) > 0;

  if (!isConnected) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export default RequireBusinessConnected;
