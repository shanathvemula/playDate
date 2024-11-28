/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { IoShareSocial } from "react-icons/io5";
import { games } from "../../constant/common";
import { FaCircleCheck } from "react-icons/fa6";
import Footer from "../../components/Footer";
import BookingForm from "./BookingForm";
import Modal from "./Modal";
import { useStateContext } from "./context/StateContext";

const Booking = () => {
  const navigation = useNavigate();
  const { selectGroud } = useStateContext();
  const [showModal, setShowModal] = useState(false);

  console.log("Modal", selectGroud);

  return (
    <>
      <div className="p-5 bg-gray-100 grid grid-cols-12 gap-3">
        <div
          className={
            showModal
              ? "col-span-12"
              : "col-span-12 lg:col-span-8 xl:col-span-9 "
          }
        >
          <div
            className={`${
              showModal ? "sticky top-12 py-2 bg-gray-100" : ""
            } flex items-center justify-between flex-wrap `}
          >
            <div className=" flex items-center gap-3  m-2 md:gap-14 ">
              <span
                onClick={() => {
                  showModal ? setShowModal(false) : navigation("/");
                }}
              >
                <IoIosArrowBack
                  fontSize={30}
                  className="border rounded-full p-[6px] cursor-pointer bg-white hover:bg-gray-100 active:bg-white"
                />
                <span className="text-sm">Back</span>
              </span>

              <div className="">
                <h3 className="text-lg font-bold">
                  {selectGroud?.gameName} - {selectGroud?.academy}
                </h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 ">
                    {selectGroud?.location?.area}
                  </span>
                  <span className="text-xs text-gray-500 ">
                    • {selectGroud?.rating} Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 m-2 ">
              <span className="p-1 cursor-pointer hover:bg-gray-50 active:bg-white px-2 text-md border-2 bg-white rounded-lg ">
                Rate this venue
              </span>

              <IoShareSocial
                size={33}
                className="p-2 cursor-pointer hover:bg-gray-50 active:bg-white border-2 bg-white rounded-lg "
              />
            </div>
          </div>

          {!showModal ? (
            <div>
              {/* images collection with venues */}
              <div className="border rounded-md bg-white mt-4">
                <div className="grid grid-cols-12 gap-2 relative">
                  <div className="col-span-12 sm:col-span-8">
                    <img
                      src={selectGroud?.images[0]}
                      alt={selectGroud?.gameName}
                      className=""
                    />
                  </div>

                  <div className="col-span-4 hidden sm:block ">
                    <img
                      src={selectGroud?.images[1]}
                      alt={selectGroud?.gameName}
                      className=""
                    />
                    <img
                      src={selectGroud?.images[2]}
                      alt={selectGroud?.gameName}
                      className=" mt-[6px]"
                    />
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    className="text-xs hover:bg-gray-200 active:bg-white bg-white text-gray-800 w-[100px] p-1 rounded absolute bottom-3 right-3"
                  >
                    View all photos
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-bold">
                    Venue{" "}
                    <span className="text-gray-400 font-normal text-xs">
                      ( Select your game)
                    </span>
                  </h3>

                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2 mt-3">
                    {selectGroud?.venues?.map((item, idx) => (
                      <img
                        key={idx}
                        src={games?.[item?.toLowerCase()]}
                        alt=""
                        width={100}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className=" mt-3 rounded-md border bg-white p-3">
                <h3 className="text-sm font-bold mb-2">Amenities</h3>
                <div className="flex items-center flex-wrap gap-3 mt-3">
                  {selectGroud?.venues?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 box-content rounded-md px-3 py-2 min-w-fit flex items-center gap-2"
                    >
                      <FaCircleCheck style={{ fontSize: 16, marginLeft: 2 }} />
                      <span className="text-sm ">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* active time */}
              <div className=" mt-3 rounded-md border bg-white p-3">
                <h3 className="text-sm font-bold mb-2">Ground Active Time</h3>
                <div className=" mt-3">
                  <span className="text-lg font-medium">
                    {selectGroud?.groundActiveTime}
                  </span>
                </div>
              </div>

              {/* Venue/Ground Details */}
              <div className=" mt-3 rounded-md border bg-white p-3 max-h-[400px] ">
                <h3 className="text-sm font-bold mb-2">Venue/Ground Details</h3>
                <div className=" mt-3">
                  <span className="text-sm ">{selectGroud?.venueDetails}</span>
                </div>
              </div>

              {/* Venue/Ground Details */}
              <div className=" mt-3 rounded-md border bg-white p-3">
                <h3 className="text-sm font-bold mb-2">
                  Where you&apos;ll be playing
                </h3>
                <h3 className="text-lg font-bold mb-2">
                  Gate 3,{selectGroud?.academy}, {selectGroud?.location.area}
                </h3>
                <div className=" mt-3">
                  <img src={games?.Rectangle} alt="" width={"100%"} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              {selectGroud?.images?.map((item, idx) => (
                <div key={idx}>
                  <img
                    src={item}
                    alt={selectGroud?.gameName}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* right side */}
        {!showModal && (
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 ">
            <div className="sticky top-14 right-2">
              <BookingForm />
            </div>
          </div>
        )}
      </div>
      {/* footer */}
      {!showModal && <Footer />}
    </>
  );
};

export default Booking;
