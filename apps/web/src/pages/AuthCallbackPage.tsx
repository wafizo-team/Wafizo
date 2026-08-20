import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { setAccessToken, setRefreshToken } from '@/lib/api/client';

function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      void navigate('/', { replace: true });
    } else {
      void navigate('/login?error=missing_tokens', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Connexion en cours...</p>
    </div>
  );
}

export default AuthCallbackPage;
