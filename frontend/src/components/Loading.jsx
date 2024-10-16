// src/components/Loading.js
import React from "react";
import './Loading.css'; // Optional: Add custom styles for loading spinner

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
