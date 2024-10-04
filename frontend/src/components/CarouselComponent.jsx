import React from 'react';
import { Carousel } from 'antd';

const contentStyle = {
  // height: '100vh', // Full height of the viewport
//   color: '#fff',
  lineHeight: '50vh',
  textAlign: 'center',
  // background: '#d1e0f7',
};


const CarouselComponent = ({images}) => (
  <Carousel autoplay>
    {images.map((src, index) => (
      <div key={index}>
        <img style={contentStyle} src={src} alt={`Slide ${index + 1}`} />
      </div>
    ))}
  </Carousel>
);

export default CarouselComponent;
