import React, { memo } from 'react';
import { FaChartLine, FaUsers, FaCog, FaBars } from 'react-icons/fa';
import { RiMenuFold2Fill, RiMenuFold3Fill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom';
// import { ReactComponent as FootballPitch  } from '../../assets/hugeicons_football-pitch.svg';

const Sidebar = memo(({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleOnClickuser = () => {
        // navigate('/Admin/User')
        window.location.href = '/Admin/User';
    }

    const handleOnClickGrounds = () => {
        // navigate('/Admin/Ground')
        window.location.href = '/Admin/Ground';
    }

  return (
    <div className={`bg-white dark:bg-gray-800 text-black dark:text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-10'} flex-shrink-0`}>
      {/* Toggle Sidebar Button */}
      <div className="flex justify-end px-2 py-4">
        {/* p-2*/}
        <button onClick={toggleSidebar} className="text-black dark:text-white ">
            {isOpen ? <RiMenuFold3Fill size={24} /> : <RiMenuFold2Fill size={24} />}
        </button>
      </div>

      {/* Sidebar List Items */}
      <ul className="flex flex-col">
        <li className="px-2 py-2 hover:bg-sky-500 cursor-pointer flex items-center" onClick={handleOnClickGrounds}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 8.571C2 6.416 2 5.339 2.586 4.669C3.172 3.999 4.114 4 6 4H18C19.886 4 20.828 4 21.414 4.67C22 5.338 22 6.415 22 8.57V15.428C22 17.583 22 18.66 21.414 19.33C20.828 20 19.886 20 18 20H6C4.114 20 3.172 20 2.586 19.33C2 18.662 2 17.585 2 15.43V8.571Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 10V5M12 14V19M22 9H19.5C19.2348 9 18.9804 9.10536 18.7929 9.29289C18.6054 9.48043 18.5 9.73478 18.5 10V14C18.5 14.2652 18.6054 14.5196 18.7929 14.7071C18.9804 14.8946 19.2348 15 19.5 15H22M2 9H4.5C4.76522 9 5.01957 9.10536 5.20711 9.29289C5.39464 9.48043 5.5 9.73478 5.5 10V14C5.5 14.2652 5.39464 14.5196 5.20711 14.7071C5.01957 14.8946 4.76522 15 4.5 15H2" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
          {isOpen && <span className='pl-2'>Grounds</span>}
        </li>
        <li className="px-2 py-2 hover:bg-sky-500 cursor-pointer flex items-center" onClick={handleOnClickuser}>
          <FaUsers size={24}/>
          {isOpen && <span className='pl-2'>Users</span>}
        </li>
        <li className="px-2 py-2 hover:bg-sky-500 cursor-pointer flex items-center">
          <FaCog size={24}/>
          {isOpen && <span className="pl-2">Settings</span>}
        </li>
      </ul>
    </div>
  );
});

export default Sidebar;
