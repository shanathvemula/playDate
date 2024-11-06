import React, { useState, useRef } from "react";
import Modal from "react-modal";
import GMNavbar from "./GMNavbar";
import { MdOutlineBorderColor } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

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

const PromotionModal = ({ isOpen, closeModal, promotionData, handlePromotionChange, handleImageUpload, handleSavePromotion }) => (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="p-4 bg-white rounded-lg shadow-lg w-1/2 mx-auto my-8">
        <h2 className="text-xl font-semibold mb-4">{promotionData.isEditing ? "Edit Promotion" : "Create Promotion"}</h2>
        <input
            name="title"
            value={promotionData.title}
            onChange={handlePromotionChange}
            placeholder="Promotion Title"
            className="mb-2 p-2 border rounded w-full"
        />
        <input
            name="discount"
            value={promotionData.discount}
            onChange={handlePromotionChange}
            placeholder="Discount"
            className="mb-2 p-2 border rounded w-full"
        />
        <input
            name="validity"
            value={promotionData.validity}
            onChange={handlePromotionChange}
            placeholder="Validity"
            className="mb-2 p-2 border rounded w-full"
        />
        <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
        />
        {promotionData.image && (
            <img src={promotionData.image} alt="Promotion Preview" className="w-24 h-24 mb-4" />
        )}
        <button onClick={handleSavePromotion} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md mr-2">
            Save
        </button>
        <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded shadow-md">
            Cancel
        </button>
    </Modal>
);

const GMHome = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [promotionData, setPromotionData] = useState({
        title: "", discount: "", validity: "", image: "", isEditing: false, editIndex: null
    });

    const refs = {
        detailsRef: useRef(null),
        promotionsRef: useRef(null),
        imagesRef: useRef(null),
        availabilityRef: useRef(null),
        pricingRef: useRef(null),
        amenitiesRef: useRef(null),
        rulesRef: useRef(null),
    };

    const selectedGround = groundData[selectedIndex];

    const openModal = (promotion = {}, index = null) => {
        setPromotionData({
            ...promotion,
            image: promotion.image || "",
            isEditing: !!promotion.title,
            editIndex: index,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPromotionData({ title: "", discount: "", validity: "", image: "", isEditing: false, editIndex: null });
    };

    const handlePromotionChange = (e) => {
        const { name, value } = e.target;
        setPromotionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPromotionData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
        }
    };

    const handleSavePromotion = () => {
        const updatedPromotions = [...selectedGround.promotions];
        if (promotionData.isEditing) {
            updatedPromotions[promotionData.editIndex] = { ...promotionData };
        } else {
            updatedPromotions.push({ ...promotionData });
        }
        selectedGround.promotions = updatedPromotions;
        closeModal();
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <GMNavbar />

            <div className="p-4 space-y-4 lg:p-6">
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

                <div className="flex overflow-x-auto space-x-2">
                    {groundData.map((ground, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedIndex(index)}
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

            <div className="flex flex-col md:flex-row gap-4 p-4 lg:px-6">
                <aside className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg">
                    <nav>
                        {Object.keys(refs).map((key, idx) => (
                            <div key={idx} onClick={() => refs[key].current.scrollIntoView({ behavior: "smooth" })}
                                className="p-3 cursor-pointer hover:bg-white">
                                {key.replace("Ref", "").replace(/([A-Z])/g, " $1")}
                            </div>
                        ))}
                    </nav>
                </aside>

                <div className="flex flex-col w-full md:w-3/4 space-y-4">
                    <section ref={refs.detailsRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Ground Details</h3>
                        <div className="mb-2">
                            <label className="text-gray-600">Game</label>
                            <div className="p-3 bg-gray-50 rounded-md border">{selectedGround.name}</div>
                        </div>
                        <div className="mb-2">
                            <label className="text-gray-600">Ground Description</label>
                            <textarea readOnly className="w-full p-3 bg-gray-50 rounded-md border" value={selectedGround.description} />
                        </div>
                        <div className="mb-2">
                            <label className="text-gray-600">Venue Name</label>
                            <div className="p-3 bg-gray-50 rounded-md border">{selectedGround.venue}</div>
                        </div>
                        <div className="mb-2">
                            <label className="text-gray-600">Location</label>
                            <div className="p-3 bg-gray-50 rounded-md border">{selectedGround.location}</div>
                        </div>
                    </section>

                    <section ref={refs.promotionsRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Promotions</h3>
                            <button onClick={() => openModal()} className="px-4 py-1.5 bg-neutral-500 text-white rounded shadow-md">
                                Create Promotion
                            </button>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            {selectedGround.promotions.map((promotion, index) => (
                                <div key={index} className="relative h-28 w-64 p-2 bg-gray-100 rounded shadow-md">
                                    <button
                                        onClick={() => openModal(promotion, index)}
                                        className="absolute top-2 left-2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
                                    >
                                        <FiEdit size={16} className="text-blue-600" />
                                    </button>
                                    <div className="flex items-start gap-2">
                                        <img className="w-24 h-24 rounded" src={promotion.image} alt={promotion.title} />
                                        <div className="flex flex-col justify-between">
                                            <span className="font-medium text-gray-800">{promotion.title}</span>
                                            <span className="text-sm text-gray-600">{promotion.discount}</span>
                                            <span className="text-sm text-gray-500">{promotion.validity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Placeholder sections for other sidebar links */}
                    <section ref={refs.imagesRef} className="bg-white p-4 rounded-lg shadow-lg">Images Section</section>
                    <section ref={refs.availabilityRef} className="bg-white p-4 rounded-lg shadow-lg">Slot Availability Section</section>
                    <section ref={refs.pricingRef} className="bg-white p-4 rounded-lg shadow-lg">Manage Price Section</section>
                    <section ref={refs.amenitiesRef} className="bg-white p-4 rounded-lg shadow-lg">Amenities Section</section>
                    <section ref={refs.rulesRef} className="bg-white p-4 rounded-lg shadow-lg">Ground Rules & Info Section</section>
                </div>
            </div>

            <PromotionModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                promotionData={promotionData}
                handlePromotionChange={handlePromotionChange}
                handleImageUpload={handleImageUpload}
                handleSavePromotion={handleSavePromotion}
            />
        </div>
    );
};

export default GMHome;
