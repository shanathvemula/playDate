/* eslint-disable no-unused-vars */
import React from "react";
import EUNavbar from "./EUNavbar";
import SearchBar from "./SearchBar";
import Card from "./Card";
import { BookVenue, GameNear } from "./mock_datas";
import { AiOutlineExport } from "react-icons/ai";

const EUHome = () => (
  <>
    <header className="home-banner bg-cover text-white h-[80vh] min-h-full text-center flex items-center justify-center">
      <SearchBar />
    </header>
    <main className="p-6">
      {/* your book venue */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-md font-bold ">Your booked venue (2) </h2>
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

      {/* game near you  */}
      <section className="mt-14">
        <h2 className="text-md font-bold mb-5 ">Games near you </h2>
        <div className="flex items-center gap-6 overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-primary-bg scrollbar-track-gray-200">
          {GameNear?.map((game) => (
            <Card key={game.id} game={game} />
          ))}
        </div>
      </section>
    </main>
  </>
);

export default EUHome;
