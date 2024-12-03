/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Custom Arrow Components
const CustomLeftArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-10 shadow-md hover:bg-[rgba(0,0,0,0.2)]"
  >
    <IoIosArrowBack size={20} />
  </button>
);

const CustomRightArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-10 shadow-md hover:bg-[rgba(0,0,0,0.2)]"
  >
    <IoIosArrowForward size={20} />
  </button>
);

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle previous slide
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Handle next slide
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full h-36 overflow-hidden">
      <CustomLeftArrow onClick={handlePrev} />
      <CustomRightArrow onClick={handleNext} />

      <div className="relative h-full flex items-center justify-center">
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={images[currentIndex] || "https://via.placeholder.com/300"}
            alt={`Slide ${currentIndex + 1}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full object-cover rounded-md"
          />
        </AnimatePresence>
      </div>

      {/* Dots for navigation */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index
                ? "bg-gray-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
