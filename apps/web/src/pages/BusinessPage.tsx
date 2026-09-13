import { useMe, useCollectLink } from '@/lib/api/queries';

export function BusinessPage() {
  const { data: me, isLoading } = useMe();
  const collectLink = useCollectLink();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  const business = me?.businesses?.find((b) => b.sources.some((s) => s.type === 'GOOGLE'));

  if (!business) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Établissement</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez les informations et la connexion de votre établissement.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Connectez votre établissement</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Liez votre compte Google Business Profile pour synchroniser vos avis et gérer vos réponses.
          </p>
          <button
            onClick={() => {
              collectLink.mutate(undefined, {
                onSuccess: (res: unknown) => {
                  const data = (res as Record<string, unknown>) || {};
                  const url = (data.url as string) || '';
                  if (url) {
                    window.location.href = url;
                  }
                },
              });
            }}
            disabled={collectLink.isPending}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {collectLink.isPending ? 'Chargement...' : 'Connecter avec Google'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez les informations et la connexion de votre établissement.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Statut de la connexion</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Google Business Profile</span>
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            Connecté
          </span>
        </div>
      </div>
    </div>
  );
}

export default BusinessPage;
