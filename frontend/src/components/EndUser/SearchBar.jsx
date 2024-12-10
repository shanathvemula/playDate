/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const SearchBar = () => {
  const [fields, setFields] = useState({
    gameName: "",
    location: "",
    date: "",
    players: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields({ ...fields, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-4xl mx-auto ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("submiting", fields);
        }}
        className=" grid grid-cols-12 "
      >
        <div className=" col-span-12 sm:col-span-6 md:col-span-3 border p-2 rounded-lg  my-3 sm: sm:m-2 md:ml-0 md:mr-3 ">
          <h2 className="text-sm text-gray-800 text-left mb-1">Game</h2>
          <input
            value={fields?.gameName}
            name="gameName"
            onChange={handleChange}
            className=" p-2 rounded-md w-full text-black"
            type="text"
            placeholder="Game"
          />
        </div>
        <div className=" col-span-12 sm:col-span-6 md:col-span-3 border p-2 rounded-lg my-3 sm: sm:m-2  md:mr-3 ">
          <h2 className="text-sm text-gray-800 text-left mb-1">Location</h2>
          <input
            value={fields?.location}
            name="location"
            onChange={handleChange}
            className=" p-2 rounded-md  w-full text-black"
            type="text"
            placeholder="choose any Location"
          />
        </div>

        <div className=" col-span-12 sm:col-span-6 md:col-span-3 border p-2 rounded-lg my-3 sm: sm:m-2  md:mr-3 ">
          <h2 className="text-sm text-gray-800 text-left mb-1">Date</h2>
          <input
            value={fields?.date}
            name="date"
            onChange={handleChange}
            className=" p-2 rounded-md  w-full text-black"
            type="date"
            placeholder="add date"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-3 border p-2 rounded-lg my-3 sm: sm:m-2   md:mr-0 md:ml-3 ">
          <h2 className="text-sm text-gray-800 text-left mb-1">Players</h2>
          <input
            value={fields?.players}
            name="players"
            onChange={handleChange}
            className=" p-2 rounded-md  w-full text-black"
            type="number"
            min={0}
          />
        </div>

        <button
          type="submit"
          className="primary-bg col-span-12 px-6 py-2 w-full rounded-md text-white font-semibold 
             transition-all duration-200 ease-in-out 
             hover:bg-blue-700  
             bg-blue-800"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
