import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo and Developed By Section */}
      <div className="flex items-center">
        {/* <img
          src="http://157.173.195.249:8000/media/logo/Logo_without_background.png" // Replace with the actual logo URL
          alt="Playdate Logo"
          className="h-8 w-auto mr-2"
        /> */}
        <span className="text-sm text-gray-500">
          © 2024 Playdate. All Rights Reserved. | Developed by <strong>Sahasra</strong>
        </span>
      </div>

      {/* Social Media or Links Section */}
      <div className="flex items-center space-x-4">
        <a href="#facebook" aria-label="Facebook">
          <img
            src="https://via.placeholder.com/24" // Replace with actual icon URLs
            alt="Facebook"
            className="h-6 w-6"
          />
        </a>
        <a href="#twitter" aria-label="Twitter">
          <img
            src="https://via.placeholder.com/24" // Replace with actual icon URLs
            alt="Twitter"
            className="h-6 w-6"
          />
        </a>
        <a href="#instagram" aria-label="Instagram">
          <img
            src="https://via.placeholder.com/24" // Replace with actual icon URLs
            alt="Instagram"
            className="h-6 w-6"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
