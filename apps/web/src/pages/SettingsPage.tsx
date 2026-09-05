import { useState } from 'react';

export function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [minRatingAlert, setMinRatingAlert] = useState('3');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Notifications</h2>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="emailAlerts"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="emailAlerts" className="text-sm font-medium text-gray-700">
              Enable Email Notifications
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="smsAlerts"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="smsAlerts" className="text-sm font-medium text-gray-700">
              Enable SMS Notifications
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+33 6 00 00 00 00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="minRatingAlert" className="block text-sm font-medium text-gray-700">
            Minimum Rating Alert (Stars)
          </label>
          <select
            id="minRatingAlert"
            value={minRatingAlert}
            onChange={(e) => setMinRatingAlert(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
export default SettingsPage;
