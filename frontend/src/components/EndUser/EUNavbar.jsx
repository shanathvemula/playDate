/* eslint-disable no-unused-vars */
import React from "react";
import { Logo } from "./constant/common";
import { COLORS } from "./constant/styles";
import { FaUser } from "react-icons/fa";
import { useStateContext } from "./context/StateContext";

const EUNavbar = () => {
  const { tabs, handlerTabs } = useStateContext();

  return (
    <nav className="flex sticky top-0 z-50  justify-between items-center flex-wrap bg-white shadow-md ">
      <img src={Logo} alt="logo" width={160} />

      <ul className="flex space-x-6">
        <li
          onClick={() => handlerTabs("mybook")}
          className={`hover:text-gray-500 py-3 cursor-pointer ${
            tabs === "mybook" ? `border-b-2  border-[#0F78D8]` : ""
          }`}
        >
          Book
        </li>
        <li
          onClick={() => handlerTabs("myvenue")}
          className={`hover:text-gray-500 py-3 cursor-pointer ${
            tabs === "myvenue" ? `border-b-2 border-[#0F78D8]` : ""
          }`}
        >
          My Venues
        </li>
      </ul>

      <div className="pr-3 flex items-center gap-5">
        <div className="p-1 rounded-full w-[35px] h-[35px] border flex items-center justify-center bg-orange-700">
          <FaUser color="white" />
        </div>
        <button
          className={`bg-[var(--primary)] text-white px-6 py-2 text-sm rounded-full`}
        >
          Login / Signup
        </button>
      </div>
    </nav>
  );
};

export default EUNavbar;
