import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

const GMNavbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const menuItems = ["Dashboard", "Grounds", "Bookings", "Finance"];

    return (
        <nav className="HeaderNav fixed w-full h-16 px-4 lg:px-8 bg-white flex justify-between items-center shadow-md z-50">
            {/* Logo Section */}
            <div className="Logo flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 md:w-10 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                </div>
                <div className="text-sky-600 text-xl md:text-2xl font-bold font-['Roboto']">Playdate</div>
            </div>

            {/* Mobile Menu Icon */}
            <button
                className="md:hidden cursor-pointer"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
            >
                <FaBars className="text-2xl text-gray-600" />
            </button>

            {/* Navigation Menu */}
            <div
                className={`NavMenu ${isMobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-8 absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none transition-all duration-200`}
            >
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 p-3 cursor-pointer transition-colors duration-200 ${
                            item === "Grounds" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                        } hover:text-blue-500 hover:border-b-2 hover:border-blue-500`}
                    >
                        <div className="hidden md:flex w-6 h-6 bg-gray-200 rounded-full items-center justify-center"></div>
                        <span className="text-base md:text-lg font-medium font-['Roboto']">{item}</span>
                    </div>
                ))}
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-4">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-300 rounded-full relative cursor-pointer hover:bg-gray-400 transition-colors duration-200">
                    <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span> {/* Notification dot */}
                </div>
                <div className="w-8 h-8 md:w-9 lg:w-10 bg-red-400 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105">
                    <span className="text-white font-semibold">U</span>
                </div>
            </div>
        </nav>
    );
};

export default GMNavbar;
