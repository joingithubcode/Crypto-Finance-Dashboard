import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Bell, Shield, Database, Globe, Palette } from 'lucide-react';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();

  const settingSections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Dark Mode',
          description: 'View the Dashboard in Dark Theme',
          control: (
            <button onClick={toggleTheme} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Price Alerts', description: 'Receive Watchlist Price Alerts', control: <Toggle defaultOn /> },
        { label: 'Portfolio Updates', description: 'Daily portfolio summary', control: <Toggle /> },
        { label: 'Market News', description: 'Get the Latest Crypto Market News', control: <Toggle defaultOn /> },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Two-Factor Auth', description: 'Add an Extra Layer of Security', control: <Toggle /> },
        { label: 'Session Timeout', description: 'Auto logout inactive session', control: <Toggle defaultOn /> },
      ],
    },
    {
      title: 'Data & API',
      icon: Database,
      items: [
        { label: 'Auto Refresh', description: 'Data auto-refresh every 5 mins', control: <Toggle defaultOn /> },
        { label: 'Data Export', description: 'Download Portfolio Data as CSV', control: <button className="btn-secondary text-sm py-1.5">Export CSV</button> },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dashboard preferences aur configuration</p>
      </div>

      {settingSections.map(({ title, icon: Icon, items }) => (
        <div key={title} className="card p-6">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <div className="space-y-4">
            {items.map(({ label, description, control }) => (
              <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
                {control}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* About */}
      <div className="card p-6 text-center">
        <p className="text-sm text-gray-400">CryptoPro Dashboard v1.0.0</p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Built with Django REST Framework + React + Tailwind CSS</p>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

import { useState } from 'react';