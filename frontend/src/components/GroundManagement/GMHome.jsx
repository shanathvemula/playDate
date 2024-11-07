import React, { useState, useRef } from "react";
import Modal from "react-modal";
import GMNavbar from "./GMNavbar";
import Select from "react-select";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const daysOptions = [
    { value: "Mon", label: "Monday" },
    { value: "Tue", label: "Tuesday" },
    { value: "Wed", label: "Wednesday" },
    { value: "Thu", label: "Thursday" },
    { value: "Fri", label: "Friday" },
    { value: "Sat", label: "Saturday" },
    { value: "Sun", label: "Sunday" },
];

const initialGroundData = [
    {
        name: "Cricket",
        description: "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
        location: "Chennai",
        venue: "YDSC Ground",
        images: [
            { id: 1, url: "https://via.placeholder.com/200x200", title: "Cricket Ground Overview" },
            { id: 2, url: "https://via.placeholder.com/200x200", title: "Pavilion Area" },
        ],
        promotions: [
            { title: "Season End Offer", discount: "18% off", validity: "2024-10-31", image: "https://via.placeholder.com/98x98" },
            { title: "Monsoon Madness", discount: "25% off", validity: "2024-11-15", image: "https://via.placeholder.com/98x98" }
        ],
        maintenanceSchedule: [
            { days: ["Mon", "Thu"], startTime: "10:00", endTime: "11:00" },
            { days: ["Fri", "Sun"], startTime: "08:00", endTime: "09:00" }
        ]
    },
    {
        name: "Football",
        description: "1200ft x 800ft wide football ground suitable for professional games...",
        location: "Mumbai",
        venue: "City Stadium",
        images: [
            { id: 2, url: "https://via.placeholder.com/200x200", title: "Football Ground Overview" },
        ],
        promotions: [
            { title: "Summer Start Offer", discount: "30% off", validity: "2024-06-30", image: "https://via.placeholder.com/98x98" },
            { title: "Winter Warm-Up", discount: "15% off", validity: "2024-01-15", image: "https://via.placeholder.com/98x98" }
        ],
        maintenanceSchedule: [
            { days: ["Mon", "Wed"], startTime: "09:00", endTime: "10:00" },
            { days: ["Thu", "Sat"], startTime: "11:00", endTime: "12:00" }
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
            type="date"
            value={promotionData.validity}
            onChange={handlePromotionChange}
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

const ScheduleModal = ({ isOpen, closeModal, scheduleData, handleScheduleChange, handleSaveSchedule }) => (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="p-4 bg-white rounded-lg shadow-lg w-1/2 mx-auto my-8">
        <h2 className="text-xl font-semibold mb-4">{scheduleData.isEditing ? "Edit Schedule" : "Add Schedule"}</h2>
        <label className="text-gray-600 mb-2">Select Days</label>
        <Select
            isMulti
            options={daysOptions}
            value={daysOptions.filter((day) => scheduleData.days.includes(day.value))}
            onChange={(selectedOptions) => handleScheduleChange({ target: { name: "days", value: selectedOptions.map((option) => option.value) } })}
            placeholder="Select days of the week"
            className="mb-4"
        />
        <label className="text-gray-600 mb-2">Start Time</label>
        <input
            type="time"
            name="startTime"
            value={scheduleData.startTime}
            onChange={handleScheduleChange}
            className="mb-4 p-2 border rounded w-full"
        />
        <label className="text-gray-600 mb-2">End Time</label>
        <input
            type="time"
            name="endTime"
            value={scheduleData.endTime}
            onChange={handleScheduleChange}
            className="mb-4 p-2 border rounded w-full"
        />
        <button onClick={handleSaveSchedule} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md mr-2">
            Save
        </button>
        <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded shadow-md">
            Cancel
        </button>
    </Modal>
);

const ImageModal = ({ isOpen, closeModal, imageData, handleImageChange, handleImageUpload, handleSaveImage }) => (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="p-4 bg-white rounded-lg shadow-lg w-1/2 mx-auto my-8">
        <h2 className="text-xl font-semibold mb-4">{imageData.isEditing ? "Edit Image" : "Upload Image"}</h2>
        <input
            name="title"
            value={imageData.title}
            onChange={handleImageChange}
            placeholder="Image Title"
            className="mb-2 p-2 border rounded w-full"
        />
        <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
        />
        {imageData.url && (
            <img src={imageData.url} alt="Preview" className="w-32 h-32 mb-4" />
        )}
        <button onClick={handleSaveImage} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md mr-2">
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
    const [groundData, setGroundData] = useState(initialGroundData);
    const [promotionData, setPromotionData] = useState({ title: "", discount: "", validity: "", image: "", isEditing: false, editIndex: null });
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduleData, setScheduleData] = useState({ days: [], startTime: "", endTime: "", isEditing: false, editIndex: null });
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageData, setImageData] = useState({ url: "", title: "", isEditing: false, editIndex: null });

    const selectedGround = groundData[selectedIndex];

    const refs = {
        detailsRef: useRef(null),
        promotionsRef: useRef(null),
        imagesRef: useRef(null),
        availabilityRef: useRef(null),
        pricingRef: useRef(null),
        amenitiesRef: useRef(null),
        rulesRef: useRef(null),
    };

    const openModal = (promotion = {}, index = null) => {
        setPromotionData({ ...promotion, image: promotion.image || "", isEditing: !!promotion.title, editIndex: index });
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
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, promotions: updatedPromotions };
        setGroundData(updatedGroundData);
        closeModal();
    };

    const openScheduleModal = (schedule = {}, index = null) => {
        setScheduleData({
            days: schedule.days || [],
            startTime: schedule.startTime || "",
            endTime: schedule.endTime || "",
            isEditing: !!schedule.days,
            editIndex: index,
        });
        setIsScheduleModalOpen(true);
    };

    const closeScheduleModal = () => {
        setIsScheduleModalOpen(false);
        setScheduleData({ days: [], startTime: "", endTime: "", isEditing: false, editIndex: null });
    };

    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setScheduleData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveSchedule = () => {
        const updatedSchedules = [...selectedGround.maintenanceSchedule];
        if (scheduleData.isEditing) {
            updatedSchedules[scheduleData.editIndex] = {
                days: scheduleData.days,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
            };
        } else {
            updatedSchedules.push({
                days: scheduleData.days,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
            });
        }
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, maintenanceSchedule: updatedSchedules };
        setGroundData(updatedGroundData);
        closeScheduleModal();
    };

    const handleDeleteSchedule = (index) => {
        const updatedSchedules = [...selectedGround.maintenanceSchedule];
        updatedSchedules.splice(index, 1);
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, maintenanceSchedule: updatedSchedules };
        setGroundData(updatedGroundData);
    };

    const openImageModal = (image = {}, index = null) => {
        setImageData({ ...image, isEditing: !!image.title, editIndex: index });
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setImageData({ url: "", title: "", isEditing: false, editIndex: null });
    };

    const handleImageChange = (e) => {
        const { name, value } = e.target;
        setImageData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleImageUploadIS = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageData((prev) => ({ ...prev, url: URL.createObjectURL(file) }));
        }
    };
    
    const handleSaveImage = () => {
        const updatedImages = [...selectedGround.images];
        
        // Handle editing vs new upload
        if (imageData.isEditing) {
            updatedImages[imageData.editIndex] = { ...imageData };
        } else {
            updatedImages.push({ id: Date.now(), ...imageData });
        }

        // Update the groundData with new or updated image
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, images: updatedImages };
        setGroundData(updatedGroundData);

        closeImageModal();
    };
    const handleDeleteImage = (index) => {
        const updatedImages = [...selectedGround.images];
        updatedImages.splice(index, 1);

        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, images: updatedImages };
        console.log("updatedGroundData", updatedGroundData)
        setGroundData(updatedGroundData);
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
                                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
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

                    <section ref={refs.imagesRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="px-4 py-2 bg-white rounded-lg flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-base font-semibold text-gray-800">Schedule for Maintenance</h4>
                                <button onClick={() => openScheduleModal()} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md">
                                    Add Schedule
                                </button>
                            </div>
                            
                            <div className="flex flex-row gap-4">
                                {selectedGround.maintenanceSchedule.map((schedule, index) => (
                                    <div key={index} className="relative w-full p-3 bg-yellow-100 rounded-lg border-l-4 border-yellow-600">
                                        <button
                                            onClick={() => openScheduleModal(schedule, index)}
                                            className="absolute top-2 right-8 bg-white p-1 rounded-full shadow hover:bg-gray-200"
                                        >
                                            <FiEdit size={16} className="text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSchedule(index)}
                                            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
                                        >
                                            <MdDelete size={16} className="text-red-600" />
                                        </button>
                                        <span className="text-xs font-semibold text-gray-800">
                                            {schedule.days.map(day => daysOptions.find(option => option.value === day)?.label).join(", ")}
                                        </span>
                                        <p className="text-xs font-normal text-gray-700">
                                            {schedule.startTime} - {schedule.endTime}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section ref={refs.imagesRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="px-4 py-2 bg-white rounded-lg flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-base font-semibold text-gray-800">Images</h4>
                                <button onClick={() => openImageModal()} className="px-4 py-1.5 bg-blue-600 text-white rounded shadow-md">
                                    Upload Image
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {selectedGround.images.map((image, index) => (
                                    <div key={image.id} className="relative w-32 h-32 p-2 bg-gray-100 rounded-lg shadow-md">
                                        <button
                                            onClick={() => openImageModal(image, index)}
                                            className="absolute top-2 right-8 bg-white p-1 rounded-full shadow hover:bg-gray-200"
                                        >
                                            <FiEdit size={16} className="text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteImage(index)}
                                            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
                                        >
                                            <MdDelete size={16} className="text-red-600" />
                                        </button>
                                        <img src={image.url} alt={image.title} className="w-full h-full object-cover rounded" />
                                        <p className="text-xs text-center mt-2 text-gray-800">{image.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

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

            <ScheduleModal
                isOpen={isScheduleModalOpen}
                closeModal={closeScheduleModal}
                scheduleData={scheduleData}
                handleScheduleChange={handleScheduleChange}
                handleSaveSchedule={handleSaveSchedule}
            />

            <ImageModal
                isOpen={isImageModalOpen}
                closeModal={closeImageModal}
                imageData={imageData}
                handleImageChange={handleImageChange}
                handleImageUpload={handleImageUploadIS}
                handleSaveImage={handleSaveImage}
            />
        </div>
    );
};

export default GMHome;
