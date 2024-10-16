import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white p-4 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="http://69.197.176.103:8000/media/logo/Logo_without_background.png" // Replace with the actual logo URL
          alt="Playdate Logo"
          className="h-8 w-auto mr-2"
        />
        {/* <span className="text-xl font-semibold text-blue-600">Playdate</span> */}
      </div>

      {/* Profile Section */}
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/150" // Replace with the actual profile picture URL
          alt="Profile"
          className="h-8 w-8 rounded-full"
        />
      </div>
    </nav>
  );
};

export default Navbar;
