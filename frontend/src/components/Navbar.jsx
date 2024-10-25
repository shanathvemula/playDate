import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';
import Cookies from "js-cookie";
import classNames from 'classnames'; // Optional: To handle conditional class management

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply the theme to the document's root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Handle logout function
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('refresh');
    window.location.href = '/';
  };

  // Menu items array to reduce repetition
  const menuItems = [
    { label: 'Profile', action: () => {} },
    { label: 'Settings', action: () => {} },
    { label: 'Logout', action: handleLogout },
  ];

  return (
    <nav className="bg-zink-100 dark:bg-gray-900 p-4 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="http://69.197.176.103:8000/media/logo/Logo_without_background.png"
          alt="Playdate Logo"
          className="h-8 w-auto mr-2"
        />
      </div>

      {/* Theme Toggle Button and Profile Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="bg-sky-600 text-white p-2 rounded-full dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center"
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        {/* Profile Section */}
        <div className="relative hidden md:block">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          />
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
              <ul className="py-1 text-gray-700 dark:text-gray-200">
                {menuItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-sky-500 dark:hover:bg-sky-500 cursor-pointer"
                    onClick={item.action}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <button className="block md:hidden text-white" onClick={toggleMobileMenu}>
        <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden">
          <ul className="flex flex-col items-start p-4">
            <li
              className="py-2 px-4 hover:bg-sky-500 dark:hover:bg-sky-500 cursor-pointer flex items-center justify-between w-full"
              onClick={toggleTheme}
            >
              {theme === 'light' ? "Dark Mode" : "Light Mode"}
              <button
                className="ml-2 bg-sky-600 text-white p-1 rounded-full dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center "
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
            </li>
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                className="py-2 px-4 hover:bg-sky-500 dark:hover:bg-sky-500 cursor-pointer w-full"
                onClick={item.action}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
