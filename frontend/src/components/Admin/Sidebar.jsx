import React, { memo } from 'react';
import { FaChartLine, FaUsers, FaCog, FaBars } from 'react-icons/fa';

const Sidebar = memo(({ isOpen, toggleSidebar }) => {
  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-10'} flex-shrink-0`}>
      {/* Toggle Sidebar Button */}
      <div className="flex justify-end p-2">
        <button onClick={toggleSidebar} className="text-white">
          <FaBars />
        </button>
      </div>
      
      {/* Sidebar List Items */}
      <ul className="flex flex-col">
        <li className="px-2 py-2 hover:bg-gray-600 cursor-pointer flex items-center">
          <FaChartLine className="mr-2" />
          {isOpen && <span>Dashboard</span>}
        </li>
        <li className="px-2 py-2 hover:bg-gray-600 cursor-pointer flex items-center">
          <FaUsers className="mr-2" />
          {isOpen && <span>Users</span>}
        </li>
        <li className="px-2 py-2 hover:bg-gray-600 cursor-pointer flex items-center">
          <FaCog className="mr-2" />
          {isOpen && <span>Settings</span>}
        </li>
      </ul>
    </div>
  );
});

export default Sidebar;
