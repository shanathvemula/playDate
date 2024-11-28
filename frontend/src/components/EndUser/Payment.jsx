/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { routesLink } from "./constant/routes";
import { useStateContext } from "./context/StateContext";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
} from "react-icons/fa";
import Modal from "./Modal";
import AuthPage from "../Auth/AuthPage";
// import Login from "../../components/Login";

const Payment = () => {
  const navigation = useNavigate();
  const { selectGroud } = useStateContext();
  const [open, setOpen] = useState(false);

  return (
    <div className=" px-10 ">
      <div className=" flex items-center gap-3 py-5 m-2 md:gap-14 ">
        <span
          onClick={() => {
            navigation(routesLink.BOOK_SCREEN);
          }}
        >
          <IoIosArrowBack
            fontSize={30}
            className="border rounded-full p-[6px] cursor-pointer bg-white hover:bg-gray-100 active:bg-white"
          />
          <span className="text-sm">Back</span>
        </span>

        <div className="">
          <h3 className="text-xl font-bold">Confirm and pay</h3>
        </div>
      </div>

      <div className="p-5 bg-white rounded-md">
        <div className="space-y-3 text-gray-700">
          {/* Location */}
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <span className="font-medium text-sm">
              {selectGroud?.gameName} {selectGroud && " - "}{" "}
              {selectGroud?.academy || "Game Studio"}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" />
            <span className="font-medium text-sm">
              {selectGroud?.date || "19 December 2024"}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <FaClock className="text-gray-500" />
            <span className="font-medium text-sm">
              {selectGroud?.groundActiveTime || "10:00 AM to 11:00 AM"}
            </span>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-gray-500" />
            <span className="font-medium text-sm">
              {" "}
              {selectGroud?.amount || " ₹ 1400.00"}
            </span>
          </div>

          <button
            onClick={() => setOpen(true)}
            type="submit"
            className=" text-sm bg-[var(--primary)] hover:bg-blue-600 active:bg-[var(--primary)] text-white px-4 py-2 rounded-md font-medium mr-2"
          >
            Proceed to Pay ₹ 1400
          </button>
        </div>
      </div>

      
        {/* <Login open={open} setOpen={setOpen} /> */}
        {/* <AuthPage open={open} setOpen={setOpen} /> */}
    
    </div>
  );
};

export default Payment;
