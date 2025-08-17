import React, { useEffect, useState } from 'react';

const ThemeSwitcher: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Update document class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save theme preference
    localStorage.setItem('theme', newTheme);
  };

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
          🌙
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Dark</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={toggleTheme}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          theme === 'light'
            ? 'bg-neon text-slate-900 shadow-neon'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </div>
  );
};

export default ThemeSwitcher;
