import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.100.22:3333';
    window.location.href = `${apiUrl}/auth/google`;
  };

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
        <p className="text-xs text-muted-foreground">
          Vous pourrez déconnecter votre fiche à tout moment depuis les paramètres.
        </p>
      </div>
    </div>
  );
}
