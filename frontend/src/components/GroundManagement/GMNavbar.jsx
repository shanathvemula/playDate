import React, { useState, useEffect } from "react";
import { FaBars, FaBell } from "react-icons/fa";

const GMNavbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    // Toggle theme and persist in localStorage
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    // Initialize theme on component mount
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const menuItems = ["Dashboard", "Grounds", "Bookings", "Finance"];

    return (
        <nav className="HeaderNav fixed w-full h-16 px-4 lg:px-8 bg-white dark:bg-gray-800 flex justify-between items-center shadow-md z-50">
            {/* Logo Section */}
            <div className="flex items-center">
                <img
                    src="http://157.173.195.249:8000/media/logo/Logo_without_background.png"
                    alt="Playdate Logo"
                    className="h-8 w-auto mr-2"
                />
            </div>

            {/* Mobile Menu Icon */}
            <button
                className="md:hidden cursor-pointer"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
            >
                <FaBars className="text-2xl text-gray-600 dark:text-gray-300" />
            </button>

            {/* Navigation Menu */}
            <div
                className={`NavMenu ${isMobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-8 absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white dark:bg-gray-800 md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none transition-all duration-200`}
            >
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 p-3 cursor-pointer transition-colors duration-200 ${
                            item === "Grounds" ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
                        } hover:text-blue-500 hover:border-b-2 hover:border-blue-500`}
                    >
                        <div className="hidden md:flex w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center"></div>
                        <span className="text-base md:text-lg font-medium font-['Roboto']">{item}</span>
                    </div>
                ))}
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <div className="relative cursor-pointer">
                    <FaBell className="text-gray-600 dark:text-gray-300 text-xl hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
                </div>

                {/* Profile Icon */}
                <div className="w-8 h-8 md:w-9 lg:w-10 bg-red-400 dark:bg-red-600 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105">
                    <span className="text-white font-semibold">U</span>
                </div>

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="w-8 h-8 md:w-9 lg:w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? "🌞" : "🌙"}
                </button>
            </div>
        </nav>
    );
};

export default GMNavbar;
