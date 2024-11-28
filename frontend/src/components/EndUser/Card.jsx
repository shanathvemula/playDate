/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";
import { routesLink } from "./constant/routes";
import { useStateContext } from "./context/StateContext";

const Card = ({ game }) => {
  const navigate = useNavigate();
  const { handlerSelectedGround } = useStateContext();

  return (
    <div
      className="card-box bg-white cursor-pointer rounded-lg p-2 shadow-md w-60 relative"
      // Navigate to the booking page on card click
    >
      <Carousel images={game?.images} />

      <div className="absolute top-3 flex w-full items-center justify-between ">
        <p className="text-xs bg-white px-2 rounded py-1 ml-1">
          ⭐ {game?.rating}
        </p>
        <p className="text-xs bg-white px-2 rounded py-1 mr-5">
          {game?.location.area}
        </p>
      </div>

      <div
        onClick={() => {
          handlerSelectedGround(game);
          navigate(routesLink.BOOK_SCREEN);
        }}
      >
        <h3 className="text-sm font-bold card-title mt-3">{game?.gameName}</h3>
        <p className="text-xs my-2">{game?.academy}</p>
        <div className="block md:flex items-center justify-between">
          <p className="text-xs my-2">{game?.location.fieldType}</p>
          <p className="text-xs my-2">{game?.numberOfPlayers} people</p>
        </div>
        <div className="block md:flex items-center justify-between">
          <p className="text-xs my-2 text-gray-500 mt-2">{game?.specialNote}</p>
          <p
            className={`text-xs p-1 px-2 rounded ${
              game?.schedule?.toLowerCase() === "today" ||
              game?.schedule?.toLowerCase() === "available"
                ? "bg-green-300 text-green-700"
                : "bg-red-300 text-red-700"
            } my-2`}
          >
            {game?.schedule}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
