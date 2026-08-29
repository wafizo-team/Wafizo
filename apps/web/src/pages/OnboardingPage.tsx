import { useNavigate } from 'react-router-dom';

import { useConnectBusiness } from '@/lib/api/queries';

function OnboardingPage() {
  const connectBusiness = useConnectBusiness();
  const navigate = useNavigate();

  async function handleConnect() {
    await connectBusiness.mutateAsync();
    void navigate('/', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Bienvenue sur Wafizo</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pour commencer à recevoir et répondre à vos avis, connectez votre fiche Google Business
          Profile.
        </p>

        <button
          type="button"
          onClick={() => void handleConnect()}
          disabled={connectBusiness.isPending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {connectBusiness.isPending ? 'Connexion...' : 'Connecter ma fiche Google'}
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          Vous pourrez déconnecter votre fiche à tout moment depuis les paramètres.
        </p>
      </div>
    </div>
  );
}

export default OnboardingPage;
