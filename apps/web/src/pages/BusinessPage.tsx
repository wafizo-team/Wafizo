import { useState } from 'react';
import { Copy, Check, QrCode } from 'lucide-react';
import { BusinessConnectionStatus } from '@wafizo/shared';

import { useMe, useCollectLink } from '@/lib/api/queries';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function BusinessPage() {
  const { data: me, isLoading } = useMe();
  const collectLink = useCollectLink();
  const [copied, setCopied] = useState(false);

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  const business = me?.business;
  const isConnected = business?.connectionStatus === BusinessConnectionStatus.CONNECTED;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Établissement</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez les informations et la connexion de votre établissement.
        </p>
      </div>

      {!business || !isConnected ? (
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Aucune fiche Google connectée pour le moment.
          </p>
        </div>
      ) : (
        <>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Votre fiche Google</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Nom</dt>
                <dd className="font-medium">{business.name}</dd>
              </div>
              {business.address && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Adresse</dt>
                  <dd className="font-medium">{business.address}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Statut</dt>
                <dd className="font-medium text-green-600">Connectée</dd>
              </div>
              {business.lastSyncAt && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dernière synchronisation</dt>
                  <dd className="font-medium">{formatDate(business.lastSyncAt)}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="mt-6 rounded-xl border bg-card p-6">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              <h2 className="font-semibold">Lien de collecte d'avis</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Partagez ce lien ou ce QR code à vos clients pour qu'ils laissent facilement
              un avis Google sur votre fiche.
            </p>

            {!collectLink.data ? (
              <button
                type="button"
                onClick={() => collectLink.mutate()}
                disabled={collectLink.isPending}
                className="mt-4 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {collectLink.isPending ? 'Génération...' : 'Générer mon lien de collecte'}
              </button>
            ) : (
              <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row">
                <div
                  className="h-32 w-32 shrink-0 overflow-hidden rounded-lg border bg-white p-2"
                  // Le SVG vient de notre propre API (mock ou back), pas d'une saisie utilisateur.
                  dangerouslySetInnerHTML={{ __html: collectLink.data.qrCodeSvg }}
                />
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Lien public
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={collectLink.data.publicUrl}
                      className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(collectLink.data!.publicUrl)}
                      className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copier
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default BusinessPage;
