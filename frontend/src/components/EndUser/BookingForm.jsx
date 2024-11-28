/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routesLink } from "./constant/routes";

function BookingForm() {
  const [duration, setDuration] = useState(0);
  const navigation = useNavigate();

  const incrementDuration = () => setDuration((prev) => prev + 1);
  const decrementDuration = () =>
    setDuration((prev) => (prev > 0 ? prev - 1 : 0));

  const handleSubmit = (event) => {
    event.preventDefault();
    navigation(routesLink.BOOKING_SCREEN);
  };

  return (
    <div className=" bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-lg font-semibold mb-6 text-gray-500 ">
          ₹ 1400.00 per hour
        </h1>

        {/* Sport Field */}
        <div className="mb-4">
          <label
            htmlFor="sport"
            className="block text-sm mb-1 text-gray-500 font-medium"
          >
            Sport
          </label>
          <select
            id="sport"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option className="text-sm" value="" disabled selected>
              Choose Game
            </option>
            <option className="text-sm" value="football">
              Football
            </option>
            <option className="text-sm" value="basketball">
              Basketball
            </option>
            <option className="text-sm" value="cricket">
              Cricket
            </option>
            <option className="text-sm" value="tennis">
              Tennis
            </option>
            <option className="text-sm" value="badminton">
              Badminton
            </option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Game Day Field */}
          <div className="mb-4">
            <label
              htmlFor="game-day"
              className="block text-sm mb-1 text-gray-500 font-medium"
            >
              Day
            </label>
            <input
              type="date"
              id="game-day"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Game Time Field */}
          <div className="mb-4">
            <label
              htmlFor="game-time"
              className="block text-sm mb-1 text-gray-500 font-medium"
            >
              Time
            </label>
            <input
              type="time"
              id="game-time"
              className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* Game Duration Field */}
        <div className="mb-4">
          <label
            htmlFor="game-duration"
            className="block text-sm mb-1 text-gray-500 font-medium"
          >
            Game Duration (hours)
          </label>
          <div className="flex items-center  border px-2 rounded-md border-gray-300">
            <button
              type="button"
              onClick={decrementDuration}
              className="px-2  text-sm bg-gray-50 border hover:bg-gray-300 text-gray-500 focus:outline-none"
            >
              -
            </button>
            <input
              type="text"
              id="game-duration"
              value={duration}
              readOnly
              className="w-full text-sm px-4 py-2 text-center focus:outline-none"
            />
            <button
              type="button"
              onClick={incrementDuration}
              className="px-2  text-sm bg-gray-50 border hover:bg-gray-300 text-gray-500 focus:outline-none"
            >
              +
            </button>
          </div>
        </div>

        {/* Game Court Field */}
        <div className="mb-4">
          <label
            htmlFor="game-court"
            className="block text-sm mb-1 text-gray-500 font-medium"
          >
            Game Court
          </label>
          <select
            id="sport"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option className="text-sm" value="" disabled selected>
              Game court
            </option>
            <option className="text-sm" value="grass-court">
              Grass Court
            </option>
            <option className="text-sm" value="hard-court">
              Hard Court
            </option>
            <option className="text-sm" value="clay-court">
              Clay Court
            </option>
            <option className="text-sm" value="indoor-court">
              Indoor Court
            </option>
            <option className="text-sm" value="outdoor-court">
              Outdoor Court
            </option>
            <option className="text-sm" value="synthetic-court">
              Synthetic Court
            </option>
            <option className="text-sm" value="multi-sport-court">
              Multi-Sport Court
            </option>
          </select>
        </div>

        {/* Buttons */}
        <div className="">
          <button
            type="submit"
            className="w-full text-sm bg-[var(--primary)] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium mr-2"
          >
            Book Now
          </button>
          <button
            type="button"
            onClick={() => alert("Book Now")}
            className="w-full text-sm bg-gray-50 mt-3 border hover:bg-gray-100 text-black px-4 py-2 rounded-md font-medium"
          >
            Co-Play
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
