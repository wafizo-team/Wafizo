import { useState } from 'react';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../lib/api/queries';

interface NotificationPreferences {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  [key: string]: unknown;
}

export function SettingsPage() {
  const { data: preferences } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();
  const prefsData = (preferences as NotificationPreferences) || {};
  const [formState, setFormState] = useState<NotificationPreferences>(prefsData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePreferences.mutateAsync(formState);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Paramètres de notification */}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
