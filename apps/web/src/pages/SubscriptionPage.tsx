import { Check } from 'lucide-react';
import { Plan } from '@wafizo/shared';

import { useSubscription, useCreateCheckout, useBillingPortal } from '@/lib/api/queries';

const PRO_PRICE_ID =
  (import.meta.env.VITE_STRIPE_PRICE_ID_PRO as string | undefined) ?? 'price_placeholder_pro';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const proFeatures = [
  'Générations de réponses IA illimitées',
  'Alertes SMS pour les avis urgents',
  'Historique complet des avis',
  'Support prioritaire',
];

function SubscriptionPage() {
  const { data: subscription, isLoading } = useSubscription();
  const checkout = useCreateCheckout();
  const portal = useBillingPortal();

  async function handleUpgrade() {
    const result = await checkout.mutateAsync(PRO_PRICE_ID);
    window.location.href = result.checkoutUrl;
  }

  async function handleManage() {
    const result = await portal.mutateAsync();
    window.location.href = result.portalUrl;
  }

  if (isLoading || !subscription) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  const isPro = subscription.plan === Plan.PRO;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Abonnement</h1>
        <p className="mt-2 text-muted-foreground">Gérez votre plan et votre facturation.</p>
      </div>

      <section className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Plan actuel</p>
            <p className="mt-1 text-2xl font-bold">{isPro ? 'Pro' : 'Gratuit'}</p>
          </div>
          {isPro && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Actif
            </span>
          )}
        </div>

        {isPro && subscription.currentPeriodEnd && (
          <p className="mt-3 text-sm text-muted-foreground">
            {subscription.cancelAtPeriodEnd
              ? `Se termine le ${formatDate(subscription.currentPeriodEnd)}`
              : `Renouvellement le ${formatDate(subscription.currentPeriodEnd)}`}
          </p>
        )}

        {isPro ? (
          <button
            type="button"
            onClick={() => void handleManage()}
            disabled={portal.isPending}
            className="mt-6 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {portal.isPending ? 'Ouverture...' : 'Gérer mon abonnement'}
          </button>
        ) : (
          <>
            <ul className="mt-6 space-y-2">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => void handleUpgrade()}
              disabled={checkout.isPending}
              className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {checkout.isPending ? 'Redirection...' : 'Passer à Pro'}
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default SubscriptionPage;
