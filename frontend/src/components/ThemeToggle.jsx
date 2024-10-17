import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="p-4">
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
};

export default ThemeToggle;
