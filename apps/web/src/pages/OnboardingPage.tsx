import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnectBusiness } from '@/lib/api/queries';
import { Button } from '@/components/ui/button';

export function OnboardingPage() {
  const navigate = useNavigate();
  const connectBusiness = useConnectBusiness();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connectBusiness.mutateAsync();
      void navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion.';
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold tracking-tight">Bienvenue sur Wafizo</h1>
        <p className="text-sm text-muted-foreground">
          Connectez votre compte pour commencer à gérer vos avis clients et optimiser votre
          visibilité.
        </p>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          className="w-full"
          disabled={connectBusiness.isPending}
          onClick={() => {
            void handleConnect();
          }}
        >
          {connectBusiness.isPending ? 'Connexion en cours...' : 'Connecter mon établissement'}
        </Button>
      </div>
    </div>
  );
}

export default OnboardingPage;
