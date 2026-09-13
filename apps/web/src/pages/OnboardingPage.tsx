import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnectBusiness } from '../lib/api/queries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const connectBusiness = useConnectBusiness();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleConnect() {
    try {
      setIsLoading(true);
      await connectBusiness.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      void navigate('/', { replace: true });
    } catch (error) {
      console.error('Failed to connect business:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold">Bienvenue sur Wafizo</h1>
        <p className="text-muted-foreground">
          Pour commencer à recevoir et répondre à vos avis, connectez votre fiche Google Business Profile.
        </p>
        <Button onClick={handleConnect} disabled={isLoading} className="w-full">
          {isLoading ? 'Connexion en cours...' : 'Connecter ma fiche Google'}
        </Button>
      </div>
    </div>
  );
}
