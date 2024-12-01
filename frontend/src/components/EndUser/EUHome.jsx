/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import EUNavbar from "./EUNavbar";
import SearchBar from "./SearchBar";
import Card from "./Card";
import { BookVenue } from "./mock_datas";
import { AiOutlineExport } from "react-icons/ai";
import { notification } from "antd";
import Loader from "../Loader/Loader";
import { GroundNewGET } from "../../api/service"; // Import the GroundNewGET API function

const EUHome = () => {
  const [gameNear, setGameNear] = useState([]); // State for games near you
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchGameNear = async (latitude, longitude, radius) => {
      try {
        setLoading(true);
        // Fetch games near the current location
        const response = await GroundNewGET(`?lat=${latitude}&lon=${longitude}&radius=${radius}`);
        setGameNear(response); // Update state with fetched data
      } catch (err) {
        setError(err.message);
        notification.error({
          message: "Error",
          description: "Failed to fetch games near your location.",
        });
      } finally {
        setLoading(false);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const radius = 10;
            fetchGameNear(latitude, longitude, radius); // Pass location to API
          },
          (error) => {
            setError("Unable to fetch location");
            setLoading(false);
            notification.error({
              message: "Location Error",
              description: "Please allow location access to fetch games near you.",
            });
          }
        );
      } else {
        setError("Geolocation is not supported by this browser");
        setLoading(false);
        notification.error({
          message: "Browser Error",
          description: "Geolocation is not supported by your browser.",
        });
      }
    };

    getUserLocation();
  }, []);

  return (
    <>
      <header className="home-banner bg-cover text-white h-[80vh] min-h-full text-center flex items-center justify-center">
        <SearchBar />
      </header>
      <main className="p-6">
        {/* Your book venue */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-md font-bold ">
              Your booked venue ({BookVenue?.length || 0})
            </h2>
            <span className="cursor-pointer">
              <AiOutlineExport />
            </span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-primary-bg scrollbar-track-gray-200">
            {BookVenue?.map((game) => (
              <Card key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Game near you */}
        <section className="mt-14">
          <h2 className="text-md font-bold mb-5">Games near you</h2>
          {loading ? (
            <Loader />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : gameNear?.length > 0 ? (
            <div className="flex items-center gap-6 overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-primary-bg scrollbar-track-gray-200">
              {gameNear.map((game) => (
                <Card key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <p>No games available near you.</p>
          )}
        </section>
      </main>
    </>
  );
};

export default EUHome;
