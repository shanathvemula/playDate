/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoShareSocial } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
// import Footer from "../../components/Footer";
import BookingForm from "./BookingForm";
import { useStateContext } from "./context/StateContext";
import { useNavigate } from "react-router-dom";


const Booking = () => {
  const navigate = useNavigate();
  const { selectGroud } = useStateContext();
  const [showModal, setShowModal] = useState(false);

  // Utility function for safe image handling
  const getImageSrc = (image) => image?.url || "https://via.placeholder.com/300";

  return (
    <>
      <div className="p-5 bg-gray-100 grid grid-cols-12 gap-3">
        {/* Left Section */}
        <div
          className={
            showModal
              ? "col-span-12"
              : "col-span-12 lg:col-span-8 xl:col-span-9"
          }
        >
          {/* Header */}
          <div
            className={`${
              showModal ? "sticky top-12 py-2 bg-gray-100" : ""
            } flex items-center justify-between flex-wrap`}
          >
            <div className="flex items-center gap-3 m-2 md:gap-14">
              <span
                onClick={() => (showModal ? setShowModal(false) : navigate("/"))}
                className="flex items-center cursor-pointer"
              >
                <IoIosArrowBack
                  fontSize={30}
                  className="border rounded-full p-[6px] bg-white hover:bg-gray-100 active:bg-white"
                />
                <span className="text-sm ml-2">Back</span>
              </span>
              <div>
                <h3 className="text-lg font-bold">
                  {selectGroud?.name} - {selectGroud?.ground_name}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{selectGroud?.address}</span>
                  <span> • {selectGroud?.rating} Rating</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 m-2">
              <button className="p-1 px-2 text-md border-2 bg-white rounded-lg hover:bg-gray-50 active:bg-white">
                Rate this venue
              </button>
              <IoShareSocial
                size={33}
                className="p-2 cursor-pointer hover:bg-gray-50 active:bg-white border-2 bg-white rounded-lg"
              />
            </div>
          </div>

          {/* Main Content */}
          {!showModal ? (
            <div>
              {/* Image Gallery */}
              <div className="border rounded-md bg-white mt-4">
                <div className="grid grid-cols-12 gap-2 relative">
                  {/* Render the main image */}
                  <div className="col-span-12 sm:col-span-8">
                    {selectGroud?.images?.slice(0, 1).map((image) => (
                      <img
                        key={image.id}
                        src={getImageSrc(image)}
                        alt={image.id}
                        className="rounded"
                      />
                    ))}
                  </div>

                  {/* Render side images */}
                  <div className="col-span-4 hidden sm:block">
                    {selectGroud?.images?.slice(1, 3).map((image) => (
                      <img
                        key={image.id}
                        src={getImageSrc(image)}
                        alt={image.id}
                        className="rounded mt-2:first-of-type:mt-0"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    className="text-xs hover:bg-gray-200 active:bg-white bg-white text-gray-800 w-[100px] p-1 rounded absolute bottom-3 right-3"
                  >
                    View all photos
                  </button>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-3 rounded-md border bg-white p-3">
                <h3 className="text-sm font-bold mb-2">Amenities</h3>
                <div className="flex items-center flex-wrap gap-3 mt-3">
                  {selectGroud?.amenities?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-md px-3 py-2 flex items-center gap-2"
                    >
                      <FaCircleCheck style={{ fontSize: 16 }} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Time */}
              <div className="mt-3 rounded-md border bg-white p-3">
                <h3 className="text-sm font-bold mb-2">Ground Active Time</h3>
                <span className="text-lg font-medium">
                  {selectGroud?.groundActiveTime}
                </span>
              </div>

              {/* Venue Details */}
              <div className="mt-3 rounded-md border bg-white p-3">
                <h3 className="text-sm font-bold mb-2">Venue/Ground Details</h3>
                <span className="text-sm">{selectGroud?.description}</span>
              </div>
            </div>
          ) : (
            // Modal View for All Photos
            <div>
              {selectGroud?.images?.map((image, idx) => (
                <div key={idx}>
                  <img
                    src={getImageSrc(image)}
                    alt={image.id}
                    className="w-full rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {!showModal && (
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="sticky top-14 right-2">
              <BookingForm />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* {!showModal && <Footer />} */}
    </>
  );
};

export default Booking;
