/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";
import { routesLink } from "./constant/routes";
import { useStateContext } from "./context/StateContext";

const Card = ({ game }) => {
  const navigate = useNavigate();
  const { handlerSelectedGround } = useStateContext();
  const imageUrls = game?.images?.map((image) => image?.url).filter(Boolean) || [];
  console.log("handlerSelectedGround", game.priceRange)

  return (
    <div
      className="card-box bg-white cursor-pointer rounded-lg p-2 shadow-md w-60 relative"
    // Navigate to the booking page on card click
    >
      <Carousel 
      // images={game?.images}
      images={imageUrls}

     
      />
      {/* <Carousel images={imageUrls.length > 0 ? imageUrls : ["placeholder-image-url"]} /> */}

      <div className="absolute top-3 flex w-full items-center justify-between ">
        <p className="text-xs bg-white px-2 rounded py-1 ml-1">
          ⭐ {game?.rating}
        </p>
        <p className="text-xs bg-white px-2 rounded py-1 mr-5">
          {game?.address}
        </p>
      </div>

      <div
        onClick={() => {
          handlerSelectedGround(game);
          navigate(routesLink.BOOK_SCREEN);
        }}
      >
        <h3 className="text-sm font-bold card-title mt-3">{game?.ground_name}</h3>
        <p className="text-xs my-2">{game?.type}</p>
        <div className="block md:flex items-center justify-between">
          {/* Field Type with Tooltip */}
          <p
            className="text-xs my-2 truncate"
            title={game?.description}
          >
            {game?.description
              ? game.description.length > 20
                ? `${game.description.slice(0, 20)}...`
                : game.location.fieldType
              : "Field type not specified"}
          </p>

          {/* Capacity */}
          <p className="text-xs my-2">
            {game?.capacity ? `${game.capacity} people` : "Capacity not available"}
          </p>
        </div>


        <div className="block md:flex items-center justify-between">
          <p className="text-xs my-2 text-gray-500 mt-2">
              Price: {game.priceRange?.length === 2 ? `${game.priceRange[0]} - ${game.priceRange[1]}` : "N/A"}
          </p>

          <p
            className={`text-xs p-1 px-2 rounded ${game?.availability_status?.toLowerCase() === "today" ||
              game?.availability_status?.toLowerCase() === "available"
              ? "bg-green-300 text-green-700"
              : "bg-red-300 text-red-700"
              } my-2`}
          >
            {game?.availability_status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
