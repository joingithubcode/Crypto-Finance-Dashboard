import { Bitcoin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
          <Bitcoin className="w-4 h-4 text-indigo-500" />
          <span>CryptoPro Dashboard © {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span>Built with Django + React</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            API Connected
          </span>
        </div>
      </div>
    </footer>
  );
}