import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Importing icons for light and dark modes

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply the theme to the document's root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <nav className="bg-zink-100 dark:bg-gray-900 p-4 flex justify-between items-center">
      {/* <nav className="bg-white dark:bg-gray-900 p-4 flex justify-between items-center shadow-md"> */}
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="http://69.197.176.103:8000/media/logo/Logo_without_background.png" // Replace with the actual logo URL
          alt="Playdate Logo"
          className="h-8 w-auto mr-2"
        />
      </div>

      {/* Theme Toggle Button */}
      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="bg-sky-600 text-white p-2 rounded-full mr-4 dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center"
        >
          {theme === 'light' ? (
            <FaMoon />
          ) : (
            <FaSun />
          )}
        </button>

        {/* Profile Section */}
        <div className="relative">
          <img
            src="https://via.placeholder.com/150" // Replace with the actual profile picture URL
            alt="Profile"
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={toggleDropdown} // Toggle the dropdown on click
          />

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
              <ul className="py-1 text-gray-700 dark:text-gray-200">
                <li className="px-4 py-2 -gray-100 dark:hover:bg-sky-500 cursor-pointer">Profile</li>
                <li className="px-4 py-2 hover:bg-sky-500 dark:hover:bg-sky-500 cursor-pointer flex" onClick={toggleTheme}>{ theme === 'light' ? "Dark Mode" : "Light Mode" }
                  <button
                    onClick={toggleTheme}
                    className="bg-sky-600 text-white p-1 rounded-full mr-4 dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center"
                  >
                    {theme === 'light' ? (
                      <FaMoon />
                    ) : (
                      <FaSun />
                    )}
                  </button>
                </li>
                <li className="px-4 py-2 hover:bg-sky-500 dark:hover:bg-sky-500 cursor-pointer">Settings</li>
                <li className="px-4 py-2 hover:bg-sky-500 dark:hover:bg-sky-500 cursor-pointer">Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
