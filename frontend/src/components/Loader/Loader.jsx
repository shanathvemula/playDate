import React from "react";
import "./Loader.css"; // Import CSS for spinning animation

const Loader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
            <img
                src="http://157.173.195.249:8000/media/logo/Play_primary.svg"
                alt="Loading..."
                className="loader-image w-10 h-10"
            />
            <p className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-300">Loading, please wait...</p>
        </div>
    </div>
);

export default Loader;
