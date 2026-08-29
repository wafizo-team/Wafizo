import { Navigate, Outlet } from 'react-router-dom';
import { BusinessConnectionStatus } from '@wafizo/shared';

import { useMe } from '@/lib/api/queries';

function RequireBusinessConnected() {
  const { data } = useMe();

  const isConnected = data?.business?.connectionStatus === BusinessConnectionStatus.CONNECTED;

  if (!isConnected) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export default RequireBusinessConnected;
