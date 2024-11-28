/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import clsx from "clsx"; // For dynamic className management

const Modal = ({
    className,
  isOpen,
  onClose,
  title,
  children,
  size = "md", // Control modal size
  overlayColor = "bg-gray-800", // Dynamic overlay color
  overlayOpacity = "bg-opacity-50", // Dynamic overlay opacity
  animate = true, // Toggle animation
}) => {
  if (!isOpen) return null;

  // Modal size mapping
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "w-full h-full",
  };

  return (
    <div
      className={clsx("fixed inset-0 z-50 flex items-center justify-center")}
    >
      {/* Overlay */}
      <div
        className={clsx(
          "absolute inset-0",
          overlayColor,
          overlayOpacity,
          animate && "transition-opacity duration-300"
        )}
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={clsx(
          "bg-white shadow-lg rounded-lg z-10 m-5",
          sizeClasses[size],
          size !== "full" ? "w-full" : "",
          animate && "transform transition-transform duration-300 scale-100",
          className
        )}
      >
        {/* Header */}
       {onClose && <div className="flex justify-between items-center border-b px-4 py-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            ✕
          </button>
        </div>}

        {/* Body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
