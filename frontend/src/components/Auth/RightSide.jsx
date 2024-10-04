// RightSide.js
import React from 'react';
import CarouselComponent from '../CarouselComponent';

const RightSide = () => {

  // List of image sources
  const imageSrcList = [
    'https://via.placeholder.com/1920x1080.png?text=Slide+1',
    'https://via.placeholder.com/1920x1080.png?text=Slide+2',
    'https://via.placeholder.com/1920x1080.png?text=Slide+3',
    'https://via.placeholder.com/1920x1080.png?text=Slide+4',
  ];

  return (
    <div className="hidden md:block w-2/3 bg-gray-100 flex justify-center items-center p-8">
      <CarouselComponent images={imageSrcList} />
      {/* <div className="text-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/ed/Globe.jpg" // Replace with your globe image or animation
          alt="Globe"
          className="w-72 h-72 mx-auto"
        />
        <p className="mt-4 text-gray-600">
          Stay Healthy and find your game partner with Playdate
        </p>
      </div> */}
    </div>
  );
};

export default RightSide;
