import React, { useState, useRef } from "react";
import GMNavbar from "./GMNavbar";
import { MdOutlineBorderColor } from "react-icons/md";

const GMHome = () => {
    const groundData = [
        {
            name: "Cricket",
            description: "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            location: "Chennai",
            venue: "YDSC Ground",
            promotions: [
                { title: "Season End Offer", discount: "18% off", validity: "Till 31 October", image: "https://via.placeholder.com/98x98" },
                { title: "Monsoon Madness", discount: "25% off", validity: "Till 15 November", image: "https://via.placeholder.com/98x98" }
            ]
        },
        {
            name: "Football",
            description: "1200ft x 800ft wide football ground suitable for professional games...",
            location: "Mumbai",
            venue: "City Stadium",
            promotions: [
                { title: "Summer Start Offer", discount: "30% off", validity: "Till 30 June", image: "https://via.placeholder.com/98x98" },
                { title: "Winter Warm-Up", discount: "15% off", validity: "Till 15 January", image: "https://via.placeholder.com/98x98" }
            ]
        },
        {
            name: "Badminton",
            description: "Indoor badminton court with standard dimensions and facilities...",
            location: "Delhi",
            venue: "Indoor Arena",
            promotions: [
                { title: "Spring Smash", discount: "20% off", validity: "Till 25 March", image: "https://via.placeholder.com/98x98" }
            ]
        },
        {
            name: "Tennis",
            description: "High-quality tennis court with proper lighting and seating...",
            location: "Bangalore",
            venue: "City Sports Complex",
            promotions: [
                { title: "Grand Slam Special", discount: "35% off", validity: "Till 20 July", image: "https://via.placeholder.com/98x98" }
            ]
        }
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);
    
    // Refs for each section
    const detailsRef = useRef(null);
    const promotionsRef = useRef(null);
    const imagesRef = useRef(null);
    const availabilityRef = useRef(null);
    const pricingRef = useRef(null);
    const amenitiesRef = useRef(null);
    const rulesRef = useRef(null);

    const handleCardClick = (index) => {
        setSelectedIndex(index);
    };

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: "smooth" });
    };

    const selectedGround = groundData[selectedIndex];

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <GMNavbar />

            {/* Main Content */}
            <div className="p-4 space-y-4 lg:p-6">
                {/* Ground List Header */}
                <section className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Ground List</h2>
                    <div className="flex space-x-4">
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200">
                            New Ground
                        </button>
                        <button className="px-5 py-2 bg-neutral-500 text-white rounded-lg shadow-md hover:bg-neutral-600 transition-all duration-200">
                            More
                        </button>
                    </div>
                </section>

                {/* Ground List Cards */}
                <div className="flex overflow-x-auto space-x-2">
                    {groundData.map((ground, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(index)}
                            className={`h-[114px] w-[280px] sm:w-[350px] md:w-[409px] p-4 rounded-lg shadow-md flex-shrink-0 cursor-pointer transition-all duration-200 
                                ${selectedIndex === index ? "bg-white border-2 border-blue-600" : "bg-neutral-100 hover:bg-gray-100"}`}
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{ground.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{ground.description}</p>
                            <div className="flex justify-between text-sm text-gray-700 mt-2">
                                <span>{ground.venue}</span>
                                <span>{ground.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar and Details Layout */}
            <div className="flex flex-col md:flex-row gap-4 p-4 lg:px-6">
                {/* Sidebar */}
                <aside className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg">
                    <nav>
                        <div onClick={() => scrollToSection(detailsRef)} className="p-3 cursor-pointer hover:bg-white">
                            Ground Details
                        </div>
                        <div onClick={() => scrollToSection(promotionsRef)} className="p-3 cursor-pointer hover:bg-white">
                            Promotions
                        </div>
                        <div onClick={() => scrollToSection(imagesRef)} className="p-3 cursor-pointer hover:bg-white">
                            Images
                        </div>
                        <div onClick={() => scrollToSection(availabilityRef)} className="p-3 cursor-pointer hover:bg-white">
                            Slot Availability
                        </div>
                        <div onClick={() => scrollToSection(pricingRef)} className="p-3 cursor-pointer hover:bg-white">
                            Manage Price
                        </div>
                        <div onClick={() => scrollToSection(amenitiesRef)} className="p-3 cursor-pointer hover:bg-white">
                            Amenities
                        </div>
                        <div onClick={() => scrollToSection(rulesRef)} className="p-3 cursor-pointer hover:bg-white">
                            Ground Rules & Info
                        </div>
                    </nav>
                </aside>

                {/* Ground Details and Promotions Section */}
                <div className="flex flex-col w-full md:w-3/4 space-y-4">
                    {/* Ground Details Section */}
                    <section ref={detailsRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Ground Details</h3>
                        <div>
                            <label className="text-gray-600">Game</label>
                            <div className="p-3 bg-gray-50 rounded-md border">{selectedGround.name}</div>
                        </div>
                        <div>
                            <label className="text-gray-600">Ground Description</label>
                            <textarea
                                readOnly
                                className="w-full p-3 bg-gray-50 rounded-md border"
                                value={selectedGround.description}
                            />
                        </div>
                        <div>
                            <label className="text-gray-600">Venue Name</label>
                            <div className="p-3 bg-gray-50 rounded-md border">{selectedGround.venue}</div>
                        </div>
                        <div>
                            <label className="text-gray-600">Location</label>
                            <div className="p-3 bg-gray-50 rounded-md border">{selectedGround.location}</div>
                        </div>
                    </section>

                    {/* Promotions Section */}
                    <section ref={promotionsRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Promotions</h3>
                            <div className="flex gap-2">
                                <button className="px-3.5 py-1 flex items-center gap-2">
                                    <MdOutlineBorderColor size={24}/>
                                    <span className="text-gray-700 font-semibold">Edit</span>
                                </button>
                                <button className="px-4 py-1.5 bg-neutral-500 text-white rounded shadow-md">
                                    Create Promotion
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            {selectedGround.promotions.map((promotion, index) => (
                                <div key={index} className="h-28 w-64 p-2 bg-gray-100 rounded flex items-start gap-2 shadow-md">
                                    <img className="w-24 h-24 rounded" src={promotion.image} alt={promotion.title} />
                                    <div className="flex flex-col justify-between">
                                        <span className="font-medium text-gray-800">{promotion.title}</span>
                                        <span className="text-sm text-gray-600">{promotion.discount}</span>
                                        <span className="text-sm text-gray-500">{promotion.validity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Placeholder sections for other sidebar links */}
                    <section ref={imagesRef} className="bg-white p-4 rounded-lg shadow-lg">Images Section</section>
                    <section ref={availabilityRef} className="bg-white p-4 rounded-lg shadow-lg">Slot Availability Section</section>
                    <section ref={pricingRef} className="bg-white p-4 rounded-lg shadow-lg">Manage Price Section</section>
                    <section ref={amenitiesRef} className="bg-white p-4 rounded-lg shadow-lg">Amenities Section</section>
                    <section ref={rulesRef} className="bg-white p-4 rounded-lg shadow-lg">Ground Rules & Info Section</section>
                </div>
            </div>
        </div>
    );
};

export default GMHome;
