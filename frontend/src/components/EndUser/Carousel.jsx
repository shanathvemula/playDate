/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Custom Left Arrow
const CustomLeftArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-1 top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full z-10 shadow-md hover:bg-[rgba(0,0,0,0.2)]"
    >
      <IoIosArrowBack size={20} />
    </button>
  );
};

// Custom Right Arrow
const CustomRightArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-1 top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full z-10 shadow-md hover:bg-[rgba(0,0,0,0.2)]"
    >
      <IoIosArrowForward size={20} />
    </button>
  );
};

const Carousel = ({ images }) => {
  const settings = {
    dots: true, // Enables indicators
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomRightArrow />, // Use custom right arrow
    prevArrow: <CustomLeftArrow />, // Use custom left arrow
    appendDots: (dots) => (
      <div style={{ bottom: "-15px" }} className="custom-dots">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={`w-3 h-2 -my-4 bg-[#a6a6a6a5] rounded-full hover:bg-gray-600 transition-all`}
      ></div>
    ),
  };

  return (
    <Slider {...settings} className="relative w-full h-36 overflow-hidden ">
      {images?.map((image, index) => (
        <div key={index} className="h-36 ">
          <img
            src={image === "empty" ? "https://via.placeholder.com/300" : image}
            alt="Game"
            className="w-full h-full  object-cover"
          />
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
