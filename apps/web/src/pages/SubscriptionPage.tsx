import { useSubscription, useCreateCheckout, useBillingPortal } from '../lib/api/queries';
import { Button } from '../components/ui/button';

export default function SubscriptionPage() {
  const { data: subData, isLoading } = useSubscription();
  const createCheckout = useCreateCheckout();
  const billingPortal = useBillingPortal();

  if (isLoading) {
    return <div className="p-6">Chargement de l'abonnement...</div>;
  }

  const subscription = subData as {
    plan?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  } | null;

  const handleSubscribe = () => {
    createCheckout.mutate('price_123', {
      onSuccess: (res) => {
        if (res?.url) {
          window.location.href = res.url;
        }
      },
    });
  };

  const handleManage = () => {
    billingPortal.mutate(window.location.href, {
      onSuccess: (res) => {
        if (res?.url) {
          window.location.href = res.url;
        }
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion de l'abonnement</h1>
      
      <div className="bg-white p-6 rounded shadow space-y-4">
        <p>
          <strong>Plan actuel :</strong> {subscription?.plan || 'Gratuit'}
        </p>
        {subscription?.currentPeriodEnd && (
          <p>
            <strong>Renouvellement :</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-4">
          <Button onClick={handleSubscribe}>Passer à la formule Pro</Button>
          <Button onClick={handleManage} variant="outline">Gérer la facturation</Button>
        </div>
      </div>
    </div>
  );
}
