import { useEffect, useState } from 'react';
import type { NotificationPreferences } from '@wafizo/shared';

import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/lib/api/queries';
import { ApiRequestError } from '@/lib/api/client';

function SettingsPage() {
  const { data, isLoading } = useNotificationPreferences();
  const updatePrefs = useUpdateNotificationPreferences();

  const [form, setForm] = useState<NotificationPreferences | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setError(null);
    setSaved(false);

    try {
      await updatePrefs.mutateAsync(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.body.details?.[0]?.message ?? err.body.message);
      } else {
        setError('Une erreur est survenue.');
      }
    }
  }

  if (isLoading || !form) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="mt-2 text-muted-foreground">Configurez vos préférences de notification.</p>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-6 rounded-xl border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notifications par email</p>
            <p className="text-xs text-muted-foreground">Recevez un email à chaque nouvel avis.</p>
          </div>
          <input
            type="checkbox"
            checked={form.emailEnabled}
            onChange={(e) => setForm({ ...form, emailEnabled: e.target.checked })}
            className="h-5 w-5 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notifications par SMS</p>
            <p className="text-xs text-muted-foreground">Recevez un SMS pour les avis urgents.</p>
          </div>
          <input
            type="checkbox"
            checked={form.smsEnabled}
            onChange={(e) => setForm({ ...form, smsEnabled: e.target.checked })}
            className="h-5 w-5 rounded"
          />
        </div>

        {form.smsEnabled && (
          <div>
            <label className="text-sm font-medium">Numéro de téléphone</label>
            <input
              type="tel"
              placeholder="+33612345678"
              value={form.phoneNumber ?? ''}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Format international, ex: +33612345678
            </p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Alerte à partir de</label>
          <select
            value={form.minRatingAlert}
            onChange={(e) => setForm({ ...form, minRatingAlert: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={1}>1 étoile et moins</option>
            <option value={2}>2 étoiles et moins</option>
            <option value={3}>3 étoiles et moins</option>
            <option value={4}>4 étoiles et moins</option>
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Soyez alerté pour les avis à cette note ou en dessous.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-green-600">Préférences enregistrées.</p>}

        <button
          type="submit"
          disabled={updatePrefs.isPending}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {updatePrefs.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}

export default SettingsPage;
