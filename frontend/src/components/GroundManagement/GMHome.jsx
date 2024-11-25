import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import GMNavbar from "./GMNavbar";
import Select from "react-select";
import { FiEdit } from "react-icons/fi";
import { MdDelete, MdClose } from "react-icons/md";
import { GroundNewGET, GroundNewPOST, GroundNewUpdate, GroundNewDelete } from "../../api/service";
import NewGroundForm from "./NewGroundForm";
import Loader from "../Loader/Loader";


const availabilityOptions = [
    { value: "Available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
    { value: "maintenance", label: "Under Maintenance" },
    { value: "closed", label: "Closed" },
];

const daysOptions = [
    { value: "Mon", label: "Monday" },
    { value: "Tue", label: "Tuesday" },
    { value: "Wed", label: "Wednesday" },
    { value: "Thu", label: "Thursday" },
    { value: "Fri", label: "Friday" },
    { value: "Sat", label: "Saturday" },
    { value: "Sun", label: "Sunday" },
];

// JSON for all available amenities
const allAmenities = [
    "Washroom",
    "Change Room",
    "Resting Space",
    "Parking",
    "First Aid Kit",
    "Drinking Water",
    "Medical Assistance",
    "Seating Area",
];

// const Loader = () => (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 bg-opacity-80 z-50">
//         <div className="flex flex-col items-center">
//             <img
//                 src="http://157.173.195.249:8000/media/logo/Play_primary.svg" // Replace with your loading image path
//                 alt="Loading..."
//                 className="w-16 h-16"
//             />
//             <p className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-300">Loading, please wait...</p>
//         </div>
//     </div>
// );

const PromotionModal = ({ isOpen, closeModal, promotionData, handlePromotionChange, handleImageUpload, handleSavePromotion }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="relative top-20 mx-auto bg-white p-6 rounded-lg shadow-lg max-w-lg z-40 dark: text-gray-600"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30"
    >
        {/* Close X Button */}
        <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
            <MdClose size={24}  />
        </button>

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
            type="number"
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
        <div className="flex justify-end gap-4">
            <button onClick={handleSavePromotion} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md">
                Save
            </button>
            <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded shadow-md">
                Cancel
            </button>
        </div>
    </Modal>
);


const ScheduleModal = ({ isOpen, closeModal, scheduleData, handleScheduleChange, handleSaveSchedule }) => (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="relative top-20 mx-auto bg-white p-6 rounded-lg shadow-lg max-w-lg z-40 dark:text-gray-600"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30">

        {/* Close X Button */}
        <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
            <MdClose size={24}  />
        </button>

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
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="relative top-20 mx-auto bg-white p-6 rounded-lg shadow-lg max-w-lg z-40 dark:text-gray-600"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30">

        {/* Close X Button */}
        <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
            <MdClose size={24}  />
        </button>

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

const PricingModal = ({ isOpen, closeModal, pricingData, handlePricingChange, handleSavePricing }) => (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="relative top-20 mx-auto bg-white p-6 rounded-lg shadow-lg max-w-lg z-40 dark:text-gray-600"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30">

        {/* Close X Button */}
        <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
            <MdClose size={24}  />
        </button>

        <h2 className="text-xl font-semibold mb-4">{pricingData.isEditing ? "Edit Pricing" : "Create Pricing"}</h2>
        <label className="text-gray-600 mb-2">Select Days</label>
        <Select
            isMulti
            options={daysOptions}
            value={daysOptions.filter(day => pricingData.days.includes(day.value))}
            onChange={selectedOptions => handlePricingChange({ target: { name: "days", value: selectedOptions.map(option => option.value) } })}
            placeholder="Select days of the week"
            className="mb-4"
        />
        <div className="mb-4">
            <label className="text-gray-600 mb-2">Start Time</label>
            <input
                type="time"
                name="startTime"
                value={pricingData.startTime}
                onChange={handlePricingChange}
                className="p-2 border rounded w-full"
            />
        </div>
        <div className="mb-4">
            <label className="text-gray-600 mb-2">End Time</label>
            <input
                type="time"
                name="endTime"
                value={pricingData.endTime}
                onChange={handlePricingChange}
                className="p-2 border rounded w-full"
            />
        </div>
        <div className="mb-4">
            <label className="text-gray-600 mb-2">Price per Hour</label>
            <input
                type="number"
                name="price"
                value={pricingData.price}
                onChange={handlePricingChange}
                className="p-2 border rounded w-full"
            />
        </div>
        <button onClick={handleSavePricing} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md mr-2">
            Save
        </button>
        <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded shadow-md">
            Cancel
        </button>
    </Modal>
);

const EditAmenitiesModal = ({ isOpen, closeModal, selectedAmenities, handleAmenityChange, saveAmenities }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="relative top-20 mx-auto bg-white p-6 rounded-lg shadow-lg max-w-lg z-40 dark:text-gray-600"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30"
    >
        {/* Close X Button */}
        <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
            <MdClose size={24}  />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Amenities</h2>
        <div className="flex flex-col gap-2">
            {allAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-gray-600">
                    <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                    />
                    {amenity}
                </label>
            ))}
        </div>
        <div className="flex justify-end gap-4 mt-6">
            <button onClick={saveAmenities} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md">
                Save
            </button>
            <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded shadow-md">
                Cancel
            </button>
        </div>
    </Modal>
);

const GroundRulesModal = ({ isOpen, closeModal, groundRulesData, handleInputChange, handleSave }) => (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="relative top-20 mx-auto bg-white p-6 rounded-lg shadow-lg max-w-lg z-40 dark:text-gray-600"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30">

        {/* Close X Button */}
        <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
            <MdClose size={24}  />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Edit Ground Rules & Info</h2>
        <label className="text-gray-600">Dimensions:</label>
        <textarea
            name="dimensions"
            value={groundRulesData.dimensions}
            onChange={handleInputChange}
            placeholder="Enter dimensions info..."
            className="w-full h-24 p-2 border rounded mb-4"
        />
        <label className="text-gray-600">Goals:</label>
        <textarea
            name="goals"
            value={groundRulesData.goals}
            onChange={handleInputChange}
            placeholder="Enter goals info..."
            className="w-full h-24 p-2 border rounded mb-4"
        />
        <div className="flex justify-end mt-4">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md mr-2">
                Save
            </button>
            <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded shadow-md">
                Cancel
            </button>
        </div>
    </Modal>
);


const GMHome = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groundData, setGroundData] = useState([]);
    const [promotionData, setPromotionData] = useState({ title: "", discount: "", validity: "", image: "", isEditing: false, editIndex: null });
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduleData, setScheduleData] = useState({ days: [], startTime: "", endTime: "", isEditing: false, editIndex: null });
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageData, setImageData] = useState({ url: "", title: "", isEditing: false, editIndex: null });
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [pricingData, setPricingData] = useState({ days: [], startTime: "", endTime: "", price: 0, editIndex: null, timeIndex: null });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState(groundData[selectedIndex]?.amenities || []);
    const [isGroundRulesModalOpen, setIsGroundRulesModalOpen] = useState(false);
    const [groundRulesData, setGroundRulesData] = useState({dimensions: "", goals: ""});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [webSocketLoading, setWebSocketLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editableDetails, setEditableDetails] = useState(() => {
        const initialGround = groundData[selectedIndex] || {}; // Fallback to empty object if no ground is selected
        return {
            name: initialGround.name || "",
            description: initialGround.description || "",
            venue: initialGround.venue || "",
            location: initialGround.location || "",
            type: initialGround.type || "",
            capacity: initialGround.capacity || 0,
            contact_number: initialGround.contact_number || "",
            availability_status: initialGround.availability_status || ""
        };
    });
    
    const [isEditingProfitCenter, setIsEditingProfitCenter] = useState(false);
    const [editableProfitCenter, setEditableProfitCenter] = useState({
        groundName: groundData[selectedIndex]?.ground_name || '',
        location: groundData[selectedIndex]?.location || '',
    });

    useEffect(() => {
        const fetchInitialGroundData = async () => {
            setIsLoading(true);  // Start loading
            try {
                const data = await GroundNewGET();  // API call
                setGroundData(data || []);  // Update state with fetched data or fallback to an empty array
                setSelectedIndex(0);  // Reset the selected index after fetching data
            } catch (err) {
                console.error("Failed to fetch ground data:", err);
                setError("Failed to load ground data. Please try again.");
            } finally {
                setIsLoading(false);  // Stop loading regardless of the result
            }
        };
    
        fetchInitialGroundData();
    }, []);
    

    let ws;

    useEffect(() => {
        setIsLoading(true);
        setWebSocketLoading(true);
    
        ws = new WebSocket('ws://localhost:8000/groundnew'); // 'ws://157.173.195.249:8000/groundnew'
    
        ws.onopen = () => {
          console.log('Connected to WebSocket server');
          setWebSocketLoading(false);
        };
    
        ws.onmessage = (event) => {
            setIsLoading(true);
            try {
                const message = JSON.parse(event.data);
                handleWebSocketAction(message);
            } catch (error) {
                console.error('Error parsing WebSocket data', error);
            } finally {
                setIsLoading(false);  // Hide loader after processing the message
            }
        };
        
    
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWebSocketLoading(false);
        };
    
        return () => {
          ws.close();
        };
    }, []);

    const handleWebSocketAction = (message) => {
        console.log("WebSocket Action:", message.action);
        
        switch (message.action) {
            case "create":
                // Add new ground data to the list
                setGroundData((prevGroundData) => [...prevGroundData, message.data]);
                break;
    
            case "update":
                // Update an existing ground data by matching the id
                setGroundData((prevGroundData) =>
                    prevGroundData.map((ground) =>
                        ground.id === message.data.id ? { ...ground, ...message.data } : ground
                    )
                );
                break;
    
            case "delete":
                // Remove ground data based on the id
                setGroundData((prevGroundData) =>
                    prevGroundData.filter((ground) => ground.id !== message.data.id)
                );
                break;
    
            default:
                console.warn("Unhandled WebSocket action:", message.action);
        }
    };
    

    const selectedGround = groundData[selectedIndex];


    const [isAddingNewGround, setIsAddingNewGround] = useState(false);
    const [newGroundDetails, setNewGroundDetails] = useState({
        ground_name: "",
        name: "",
        description: "",
        location: "",
        venue: "",
        type: "",
        capacity: 0,
        contact_number: "",
        availability_status: "",
        images: [],
        promotions: [],
        maintenanceSchedule: [],
        pricing: [],
        amenities: [],
        groundRulesInfo: {
            dimensions: "",
            goals: "",
        },
    });

    const handleNewGroundInputChange = (e) => {
        const { name, value } = e.target;
        setNewGroundDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveNewGround = async () => {
        try {
            // Send the new ground details to the API
            const response = await GroundNewPOST(newGroundDetails);
    
            // Ensure the response contains data
            if (response?.status === 200 || response?.status === 201) {
                const responseData = response.data; // Access response data properly
                
                // Update the ground data locally only after successful API response
                const updatedGroundData = [...groundData, { ...responseData }];
                setGroundData(updatedGroundData);
    
                // Close the form and reset the fields
                setIsAddingNewGround(false);
                setNewGroundDetails({
                    ground_name: "",
                    name: "",
                    description: "",
                    location: "",
                    venue: "",
                    type: "",
                    capacity: 0,
                    contact_number: "",
                    availability_status: "",
                    images: [],
                    promotions: [],
                    maintenanceSchedule: [],
                    pricing: [],
                    amenities: [],
                    groundRulesInfo: {
                        dimensions: "",
                        goals: "",
                    },
                });
    
                console.log("New ground saved successfully:", responseData);
            } else {
                console.error("Failed to save the new ground:", response);
            }
        } catch (error) {
            console.error("An error occurred while saving the new ground:", error.message || error);
        }
    };
    

    const handleCancelNewGround = () => {
        setIsAddingNewGround(false);
    };


    const refs = {
        detailsRef: useRef(null),
        promotionsRef: useRef(null),
        imagesRef: useRef(null),
        availabilityRef: useRef(null),
        pricingRef: useRef(null),
        amenitiesRef: useRef(null),
        rulesRef: useRef(null),
    };

    // Sync editableDetails when selectedGround changes
    React.useEffect(() => {
        if (selectedGround) {
            setEditableDetails({
                name: selectedGround.name || "",
                description: selectedGround.description || "",
                venue: selectedGround.venue || "",
                location: selectedGround.location || "",
                type: selectedGround.type || "",
                capacity: selectedGround.capacity || 0,
                contact_number: selectedGround.contact_number || "",
                availability_status: selectedGround.availability_status || "",
            });
        } else {
            // Fallback to default values if selectedGround is undefined
            setEditableDetails({
                name: "",
                description: "",
                venue: "",
                location: "",
                type: "",
                capacity: 0,
                contact_number: "",
                availability_status: "",
            });
        }
    }, [selectedGround]);
    

    const handleDetailsEditClick = () => {
        setIsEditing(true);
    };

    const handleDetailsInputChange = (e) => {
        const { name, value } = e.target;
        setEditableDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleDetailsSave = async () => {
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = {
            ...updatedGroundData[selectedIndex],
            ...editableDetails,
        };
        setIsLoading(true);
        const response = await GroundNewUpdate({ 
            id: updatedGroundData[selectedIndex].id, 
            ...editableDetails
        })
        setGroundData(updatedGroundData);
        setIsEditing(false);
    };

    const handleDetailsCancel = () => {
        // Reset editable details to current ground data if cancelled
        setEditableDetails({
            name: selectedGround.name,
            description: selectedGround.description,
            venue: selectedGround.venue,
            location: selectedGround.location,
            type: selectedGround.type,
            capacity: selectedGround.capacity,
            contact_number: selectedGround.contact_number,
            availability_status: selectedGround.availability_status,
        });
        setIsEditing(false);
    };


    React.useEffect(() => {
        setEditableProfitCenter({
            groundName: selectedGround?.ground_name || '',
            location: selectedGround?.location || '',
        });
    }, [selectedGround]);

    const handleProfitCenterEditClick = () => {
        setIsEditingProfitCenter(true);
    };

    const handleProfitCenterInputChange = (e) => {
        const { name, value } = e.target;
        setEditableProfitCenter((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleProfitCenterSave = async () => {
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = {
            ...updatedGroundData[selectedIndex],
            ground_name: editableProfitCenter.groundName,
            location: editableProfitCenter.location,
        };
        setIsLoading(true)
        const response = await GroundNewUpdate({
            id: updatedGroundData[selectedIndex].id, 
            ground_name: editableProfitCenter.groundName,
            location: editableProfitCenter.location,
        })
        setIsLoading(false)
        setGroundData(updatedGroundData);
        setIsEditingProfitCenter(false);
    };

    const handleProfitCenterCancel = () => {
        // Reset editable details to current ground data if canceled
        setEditableProfitCenter({
            groundName: selectedGround.ground_name,
            location: selectedGround.location,
        });
        setIsEditingProfitCenter(false);
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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result;
                handlePromotionChange({
                    target: {
                        name: 'image',
                        value: base64String
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleSavePromotion = async () => {
        const updatedPromotions = [...selectedGround.promotions];
        if (promotionData.isEditing) {
            updatedPromotions[promotionData.editIndex] = { ...promotionData };
        } else {
            updatedPromotions.push({ ...promotionData });
        }
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, promotions: updatedPromotions };
        setIsLoading(true);
        const response = await GroundNewUpdate({ 
            id: updatedGroundData[selectedIndex].id,
            promotions: updatedPromotions 
        });
        setGroundData(updatedGroundData);
        setIsLoading(false);
        closeModal();
    };

    const handleDeletePromotion = async (index) => {
        if (!window.confirm("Are you sure you want to delete this promotion?")) return;
    
        setIsLoading(true);
        const updatedPromotions = selectedGround.promotions.filter((_, idx) => idx !== index);
        const updatedGround = { ...selectedGround, promotions: updatedPromotions };
    
        try {
            await GroundNewUpdate({ 
                id: selectedGround.id,
                promotions: updatedPromotions 
            });
            setGroundData(groundData.map(ground =>
                ground.id === selectedGround.id ? updatedGround : ground
            ));
        } catch (error) {
            console.error('Failed to delete the promotion:', error);
            alert("Could not delete the promotion: " + error.message);
        } finally {
            setIsLoading(false);
        }
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

    const handleSaveSchedule = async () => {
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
        setIsLoading(true);
        const response = await GroundNewUpdate({
            id: updatedGroundData[selectedIndex].id, 
            maintenanceSchedule: updatedSchedules
        })
        setGroundData(updatedGroundData);
        setIsLoading(false);
        closeScheduleModal();
    };

    const handleDeleteSchedule = async (index) => {
        const updatedSchedules = [...selectedGround.maintenanceSchedule];
        updatedSchedules.splice(index, 1);
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, maintenanceSchedule: updatedSchedules };
        setIsLoading(true);
        const response = await GroundNewUpdate({
            id: updatedGroundData[selectedIndex].id,
            maintenanceSchedule: updatedSchedules 
        })
        setGroundData(updatedGroundData);
        setIsLoading(false);
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
            const reader = new FileReader();
            reader.onload = () => {
                setImageData((prev) => ({ ...prev, url: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    
    const handleSaveImage = async () => {
        const updatedImages = [...selectedGround.images];
        if (imageData.isEditing) {
            updatedImages[imageData.editIndex] = { ...imageData };
        } else {
            updatedImages.push({ id: Date.now(), ...imageData });
        }
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, images: updatedImages };
        setIsLoading(true);
        const response = await GroundNewUpdate({
            id: updatedGroundData[selectedIndex].id,
            images: updatedImages
        })
        setGroundData(updatedGroundData);
        setIsLoading(false);
        closeImageModal();
    };
    
    const handleDeleteImage = async (index) => {
        const updatedImages = [...selectedGround.images];
        updatedImages.splice(index, 1);
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = { ...selectedGround, images: updatedImages };
        setIsLoading(true);
        const response = await GroundNewUpdate({
            id: updatedGroundData[selectedIndex].id,
            images: updatedImages
        })
        setGroundData(updatedGroundData);
        setIsLoading(false);
    };
    
    const openPricingModal = (pricingEntry = {}, timeIndex = null, pricingIndex = null) => {
        setPricingData({
            days: pricingEntry.days || [],
            startTime: pricingEntry.times?.[timeIndex]?.startTime || "",
            endTime: pricingEntry.times?.[timeIndex]?.endTime || "",
            price: pricingEntry.times?.[timeIndex]?.price || 0,
            editIndex: pricingIndex,
            timeIndex: timeIndex,
            isEditing: !!pricingEntry.days,
        });
        setIsPricingModalOpen(true);
    };

    const closePricingModal = () => {
        setIsPricingModalOpen(false);
        setPricingData({ days: [], startTime: "", endTime: "", price: 0, editIndex: null, timeIndex: null, isEditing: false });
    };

    const handlePricingChange = (e) => {
        const { name, value } = e.target;
        setPricingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePricing = async () => {
        const updatedGroundData = [...groundData];
        const currentPricing = [...selectedGround.pricing];

        if (pricingData.isEditing) {
            const updatedPricingEntry = { ...currentPricing[pricingData.editIndex] };
            updatedPricingEntry.days = pricingData.days;
            updatedPricingEntry.times[pricingData.timeIndex] = {
                startTime: pricingData.startTime,
                endTime: pricingData.endTime,
                price: parseFloat(pricingData.price),
            };
            currentPricing[pricingData.editIndex] = updatedPricingEntry;
        } else {
            const newPricingEntry = {
                days: pricingData.days,
                times: [{ startTime: pricingData.startTime, endTime: pricingData.endTime, price: parseFloat(pricingData.price) }],
            };
            currentPricing.push(newPricingEntry);
        }

        updatedGroundData[selectedIndex] = {
            ...selectedGround,
            pricing: currentPricing,
        };
        setIsLoading(true);
        const response = await GroundNewUpdate({
            id: updatedGroundData[selectedIndex].id,
            pricing: currentPricing
        })
        setGroundData(updatedGroundData);
        setIsLoading(false);
        closePricingModal();
    };

    const handleDeletePricingEntry = async (pricingIndex) => {
        const updatedGroundData = [...groundData];
        const updatedPricing = selectedGround.pricing.filter((_, index) => index !== pricingIndex);
        updatedGroundData[selectedIndex] = { ...selectedGround, pricing: updatedPricing };
        setIsLoading(true);
        const response = await GroundNewUpdate({
            id: updatedGroundData[selectedIndex].id,
            pricing: updatedPricing
        })
        setGroundData(updatedGroundData);
        setIsLoading(false);
    };

    const handleDeleteTimeSlot = async (pricingIndex, timeIndex) => {
        const updatedGroundData = [...groundData];
        const updatedPricingEntry = { ...selectedGround.pricing[pricingIndex] };
        updatedPricingEntry.times = updatedPricingEntry.times.filter((_, index) => index !== timeIndex);

        // If no time slots left, remove the entire pricing entry
        if (updatedPricingEntry.times.length === 0) {
            handleDeletePricingEntry(pricingIndex);
        } else {
            const updatedPricing = [...selectedGround.pricing];
            updatedPricing[pricingIndex] = updatedPricingEntry;
            updatedGroundData[selectedIndex] = { ...selectedGround, pricing: updatedPricing };
            setIsLoading(true);
            const response = await GroundNewUpdate({
                id: updatedGroundData[selectedIndex].id,
                pricing: updatedPricing
            })
            setGroundData(updatedGroundData);
            setIsLoading(false);
        }
    };
    
    // Amenities
    const openEditModal = () => {
        setSelectedAmenities(selectedGround.amenities);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleAmenityChange = (amenity) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
        );
    };

    const saveAmenities = async () => {
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex] = {
            ...selectedGround,
            amenities: selectedAmenities,
        };
        setIsLoading(true);
        const response = await GroundNewUpdate(updatedGroundData[selectedIndex])
        setGroundData(updatedGroundData);
        setIsLoading(false);
        closeEditModal();
    };

    const openGroundRulesModal = () => {
        setGroundRulesData({
            dimensions: selectedGround.groundRulesInfo.dimensions,
            goals: selectedGround.groundRulesInfo.goals
        });
        setIsGroundRulesModalOpen(true);
    };

    const closeGroundRulesModal = () => {
        setIsGroundRulesModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGroundRulesData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const updatedGroundData = [...groundData];
        updatedGroundData[selectedIndex].groundRulesInfo = { ...groundRulesData };
        setIsLoading(true);
        const response = await GroundNewUpdate(updatedGroundData[selectedIndex])
        setGroundData(updatedGroundData);
        setIsLoading(false);
        closeGroundRulesModal();
    };

    const handleDeleteGround = async (index) => {
        const removedGround = groundData[index]; // Capture the ground being removed
        console.log("Removed Ground Data:", removedGround.id); // Log the removed ground data
        setIsLoading(true)
        const response = await GroundNewDelete(removedGround.id);
        if (response?.status === 200 || response?.status === 204) {
            setIsLoading(false)
            // Update the local ground data only if the API call is successful
            const updatedGroundData = groundData.filter((_, i) => i !== index); // Remove the selected ground
            setGroundData(updatedGroundData); // Update state
            console.log("Updated Ground Data:", updatedGroundData); // Log updated data
        } else {
            console.log("Failed to delete ground from API:", response);
            // window.location.reload()
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-900">
            {/* min-h-screen flex flex-col bg-gray-100 */}
            {isLoading && <Loader />} {/* Conditionally render the Loader */}
            <GMNavbar/>
            <br />
            <br />
            <br />

            <div className="p-4 space-y-4 lg:p-6 ">
                <section className="bg-white dark:bg-gray-700 dark:text-gray-200 shadow-md rounded-lg p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Ground List</h2>
                    <div className="flex space-x-4">
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200" onClick={() => setIsAddingNewGround(true)}>
                            New Ground
                        </button>
                        <button className="px-5 py-2 bg-neutral-500 text-white rounded-lg shadow-md hover:bg-neutral-600 transition-all duration-200">
                            More
                        </button>
                    </div>
                </section>
                
                {/* { groundData.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <h3 className="text-lg font-semibold">No grounds are available.</h3>
                        <p>Add new grounds by clicking the New Ground Button.</p>
                    </div>
                ) : ( */}

                <div className="flex overflow-x-auto space-x-2 pb-2">
                    {groundData.map((ground, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedIndex(index);
                                setIsAddingNewGround(false);
                            }}
                            className={`relative h-[114px] w-[280px] sm:w-[350px] md:w-[409px] p-4 rounded-lg shadow-md flex-shrink-0 cursor-pointer transition-all duration-200 
                                ${selectedIndex === index ? "bg-white border-2 border-blue-600" : "bg-neutral-100 hover:bg-gray-100"}`}
                        >
                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering card click
                                    handleDeleteGround(index);
                                }}
                                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
                            >
                                <MdDelete size={16} className="text-red-600"/>
                            </button>

                            <h3 className="text-xl font-semibold text-gray-800">{ground.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{ground.description}</p>
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <span>{ground.ground_name}</span>
                                <span>{ground.location}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* )} */}
            </div>
            

            {isAddingNewGround ? (
                <NewGroundForm
                    newGroundDetails={newGroundDetails}
                    handleInputChange={handleNewGroundInputChange}
                    handleSaveNewGround={handleSaveNewGround}
                    handleCancel={handleCancelNewGround}
                />
            ) : (
                groundData.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <h3 className="text-lg font-semibold">No grounds are available.</h3>
                        <p>Add new grounds by clicking the button below.</p>
                        <button
                            onClick={() => setIsAddingNewGround(true)}
                            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                        >
                            Add New Ground
                        </button>
                    </div>) : (
            <div className="flex flex-col md:flex-row gap-4 p-2 lg:px-2 h-[calc(100vh-12rem)]">
                <aside className="hidden lg:block w-full md:w-1/4 bg-gray-100 p-4 rounded-lg">
                    <nav>
                        {/* <div
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="p-3 cursor-pointer hover:bg-white"
                        >
                            All Sections
                        </div> */}
                        <div
                            onClick={() => document.getElementById("ground-details").scrollIntoView({ behavior: "smooth" })}
                            className="p-3 cursor-pointer hover:bg-white"
                        >
                            Ground Details
                        </div>
                        <div
                            onClick={() => document.getElementById("promotions").scrollIntoView({ behavior: "smooth" })}
                            className="p-3 cursor-pointer hover:bg-white"
                        >
                            Promotions
                        </div>
                        <div
                            onClick={() => document.getElementById("schedule-maintenance").scrollIntoView({ behavior: "smooth" })}
                            className="p-3 cursor-pointer hover:bg-white"
                        >
                            Schedule for Maintenance
                        </div>
                        <div
                            onClick={() => document.getElementById("ground-images").scrollIntoView({ behavior: "smooth" })}
                            className="p-3 cursor-pointer hover:bg-white"
                        >
                            Ground Images
                        </div>
                        <div
                            onClick={() => document.getElementById("manage-price").scrollIntoView({ behavior: "smooth" })}
                            className="p-3 cursor-pointer hover:bg-white"
                        >
                            Manage Price
                        </div>
                        <div
                            onClick={() => document.getElementById("amenities").scrollIntoView({ behavior: "smooth" })}
                            className="p-3 cursor-pointer hover:bg-white"
                        >
                            Amenities
                        </div>
                        <div
                            onClick={() => document.getElementById("ground-rules").scrollIntoView({ behavior: "smooth" })}
                            className="p-3 cursor-pointer hover:bg-white"
                        >
                            Ground Rules & Info
                        </div>
                    </nav>
                </aside>



                <main className="flex-1 overflow-y-auto p-4 h-full space-y-4">
                    {/* Profit Center */}
                    <section className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-neutral-600 text-base font-semibold leading-loose">Profit Center</h2>
                        {!isEditingProfitCenter ? (
                            <button onClick={handleProfitCenterEditClick} className="flex items-center gap-1 text-gray-500 hover:text-gray-600">
                                <FiEdit className="text-blue-600" /> Edit
                            </button>
                        ) : (
                            <div>
                                <button onClick={handleProfitCenterSave} className="px-4 py-1.5 bg-blue-600 text-white rounded shadow-md mr-2">
                                    Save
                                </button>
                                <button onClick={handleProfitCenterCancel} className="px-4 py-1.5 bg-gray-400 text-white rounded shadow-md">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Ground Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-base font-normal leading-snug">Ground Name</label>
                            {isEditingProfitCenter ? (
                                <input
                                    name="groundName"
                                    value={editableProfitCenter.groundName}
                                    onChange={handleProfitCenterInputChange}
                                    className="w-full px-4 py-3 border rounded-lg mt-1"
                                />
                            ) : (
                                <div className="p-2 bg-gray-50 rounded-md border">
                                    {editableProfitCenter.groundName}
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-base font-normal leading-snug">Location</label>
                            {isEditingProfitCenter ? (
                                <input
                                    name="location"
                                    value={editableProfitCenter.location}
                                    onChange={handleProfitCenterInputChange}
                                    className="w-full px-4 py-3 border rounded-lg mt-1"
                                />
                            ) : (
                                <div className="p-2 bg-gray-50 rounded-md border">
                                    {editableProfitCenter.location}
                                </div>
                            )}
                        </div>
                    </div>
                    </section>
                    
                    {/* Ground Details */}

                    <section id="ground-details" className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Ground Details</h3>
                            {!isEditing ? (
                                <button onClick={handleDetailsEditClick} className="flex items-center gap-1 text-gray-500 hover:text-gray-600">
                                    <FiEdit className="text-blue-600" /> Edit
                                </button>
                            ) : (
                                <div>
                                    <button onClick={handleDetailsSave} className="px-4 py-1.5 bg-blue-600 text-white rounded shadow-md mr-2">Save</button>
                                    <button onClick={handleDetailsCancel} className="px-4 py-1.5 bg-gray-400 text-white rounded shadow-md">Cancel</button>
                                </div>
                            )}
                        </div>

                        {/* Venue Name */}
                        <div className="mb-2">
                            <label className="text-gray-600">Venue Name</label>
                            {isEditing ? (
                                <input
                                    name="name"
                                    value={editableDetails.name}
                                    onChange={handleDetailsInputChange}
                                    className="w-full p-2 border rounded mt-1"
                                />
                            ) : (
                                <div className="p-2 bg-gray-50 rounded-md border">{selectedGround.name}</div>
                            )}
                        </div>

                        {/* Ground Type and Capacity - Side by Side */}
                        <div className="flex gap-4 mb-2">
                            {/* Ground Type */}
                            <div className="flex-1">
                                <label className="text-gray-600">Ground Type</label>
                                {isEditing ? (
                                    <input
                                        name="type"
                                        value={editableDetails.type}
                                        onChange={handleDetailsInputChange}
                                        className="w-full p-2 border rounded mt-1"
                                    />
                                ) : (
                                    <div className="p-2 bg-gray-50 rounded-md border">{selectedGround.type}</div>
                                )}
                            </div>

                            {/* Capacity */}
                            <div className="flex-1">
                                <label className="text-gray-600">Capacity</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={editableDetails.capacity}
                                        onChange={handleDetailsInputChange}
                                        className="w-full p-2 border rounded mt-1"
                                        min={2}
                                    />
                                ) : (
                                    <div className="p-2 bg-gray-50 rounded-md border">{selectedGround.capacity}</div>
                                )}
                            </div>
                        </div>

                        {/* Availability Status */}
                        <div className="mb-2">
                        <label className="text-gray-600">Availability Status</label>
                        {isEditing ? (
                            <select
                                name="availability_status"
                                value={editableDetails.availability_status}
                                onChange={handleDetailsInputChange}
                                className="w-full p-2 border rounded mt-1"
                            >
                                {availabilityOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="p-2 bg-gray-50 rounded-md border">
                                {availabilityOptions.find(option => option.value === editableDetails.availability_status)?.label || "Not specified"}
                            </div>
                        )}
                    </div>


                        {/* Ground Description */}
                        <div className="mb-2">
                            <label className="text-gray-600">Ground Description</label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={editableDetails.description}
                                    onChange={handleDetailsInputChange}
                                    className="w-full p-2 border rounded mt-1"
                                />
                            ) : (
                                <div className="p-2 bg-gray-50 rounded-md border">{selectedGround.description}</div>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div className="mb-2">
                            <label className="text-gray-600">Contact Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={editableDetails.contact_number}
                                    onChange={handleDetailsInputChange}
                                    placeholder="Enter phone number"
                                    className="w-full p-2 border rounded mt-1"
                                />
                            ) : (
                                <div className="p-2 bg-gray-50 rounded-md border">{selectedGround.contact_number}</div>
                            )}
                        </div>
                    </section>

                    
                    {/* Promotions */}
                    <section id="promotions" ref={refs.promotionsRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Promotions</h3>
                            <button onClick={() => openModal({}, null)} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md">
                                Create Promotion
                            </button>
                        </div>
                        {selectedGround.promotions && selectedGround.promotions.length > 0 ? (
                            <div className="flex gap-4 flex-wrap">
                                {selectedGround.promotions.map((promotion, index) => (
                                    <div key={index} className="relative h-28 w-68 p-2 bg-gray-100 rounded shadow-md">
                                        <div className="flex items-start gap-2">
                                            <img className="w-24 h-24 rounded" src={promotion.image} alt={promotion.title} />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevents the modal from opening
                                                        openModal(promotion, index);
                                                    }}
                                                    className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
                                                >
                                                    <FiEdit size={16} className="text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevents the modal from opening
                                                        handleDeletePromotion(index);
                                                    }}
                                                    className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
                                                >
                                                    <MdDelete size={16} className="text-red-600" />
                                                </button>
                                            </div>
                                            <div className="flex flex-col justify-between">
                                                <br/>
                                                <span className="font-medium text-gray-800">{promotion.title}</span>
                                                <span className="text-sm text-gray-600">{`${promotion.discount}% off`}</span>
                                                <span className="text-sm text-gray-500">{promotion.validity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 mt-2">
                                No promotions available. Click 'Create Promotion' to add new ones.
                            </div>
                        )}
                    </section>



                    {/* Schedule for Maintenance */}
                    <section id="schedule-maintenance" className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="px-4 py-2 bg-white rounded-lg flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-base font-semibold text-gray-800">Schedule for Maintenance</h4>
                                <button onClick={() => openScheduleModal()} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md">
                                    Add Schedule
                                </button>
                            </div>
                            
                            {selectedGround.maintenanceSchedule && selectedGround.maintenanceSchedule.length > 0 ? (
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
                                            <p className="text-xs font-normal text-gray-600">
                                                {schedule.startTime} - {schedule.endTime}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 mt-2">
                                    No maintenance schedules available.
                                </div>
                            )}
                        </div>
                    </section>


                    {/* Images Section */}
                    <section id="ground-images" ref={refs.imagesRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="px-4 py-2 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-base font-semibold text-gray-800">Ground Images</h4>
                                <button onClick={() => openImageModal()} className="px-4 py-1.5 bg-blue-600 text-white rounded shadow-md">
                                    Upload Image
                                </button>
                            </div>
                            {selectedGround.images && selectedGround.images.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {selectedGround.images.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="relative w-32 h-40 p-2 bg-gray-100 rounded-lg shadow-md overflow-hidden"
                                        >
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
                                            <img src={image.url} alt={image.title} className="w-full h-28 object-cover rounded" />
                                            <p className="text-xs text-center mt-2 text-gray-800 truncate">{image.title}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 mt-2">
                                    No images available
                                </div>
                            )}
                        </div>
                    </section>


                    {/* Manage Price */}
                    <section id="manage-price" ref={refs.pricingRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between mb-4">
                            <span className="text-base font-semibold">Manage Price</span>
                            <button onClick={() => openPricingModal()} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md">
                                Create Pricing
                            </button>
                        </div>
                        {selectedGround.pricing && selectedGround.pricing.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {selectedGround.pricing.map((pricingEntry, pricingIndex) => (
                                    <div key={pricingIndex} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-800">
                                                {pricingEntry.days.map(day => daysOptions.find(option => option.value === day)?.label).join(", ")}
                                            </span>
                                            <button
                                                onClick={() => handleDeletePricingEntry(pricingIndex)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                        {pricingEntry.times.map((timeEntry, timeIndex) => (
                                            <div key={timeIndex} className="flex justify-between text-sm mt-2">
                                                <span>{`${timeEntry.startTime} - ${timeEntry.endTime}`}</span>
                                                <span>{`INR ${timeEntry.price.toFixed(2)}/hour`}</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openPricingModal(pricingEntry, timeIndex, pricingIndex)}
                                                        className="text-blue-600"
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTimeSlot(pricingIndex, timeIndex)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 mt-2">
                                No pricing details available.
                            </div>
                        )}
                    </section>

                    
                    {/* Amenities */}
                    <section id="amenities" className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-semibold text-gray-800">Amenities</h3>
                            <button onClick={openEditModal} className="flex items-center gap-1 text-gray-500 hover:text-gray-600">
                                <FiEdit className="text-blue-600"/>
                                <span>Edit</span>
                            </button>
                        </div>
                        {selectedGround.amenities && selectedGround.amenities.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedGround.amenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium text-gray-600"
                                    >
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-3 text-gray-500">
                                No amenities available.
                            </div>
                        )}
                    </section>


                    {/* Ground Rules & Info Section */}
                    <section id="ground-rules" ref={refs.rulesRef} className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">About Venue</h3>
                            <button onClick={openGroundRulesModal} className="flex items-center gap-1 text-gray-500 hover:text-gray-600">
                                <FiEdit className="text-blue-600" /> Edit
                            </button>
                        </div>
                        <div className="text-gray-600">
                            <p><strong>Dimensions:</strong><br />{selectedGround.groundRulesInfo.dimensions}</p>
                            <p className="mt-2"><strong>Goals:</strong><br />{selectedGround.groundRulesInfo.goals}</p>
                        </div>
                    </section>
                </main>

            </div>))}

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

            <PricingModal
                isOpen={isPricingModalOpen}
                closeModal={closePricingModal}
                pricingData={pricingData}
                handlePricingChange={handlePricingChange}
                handleSavePricing={handleSavePricing}
            />

            <EditAmenitiesModal
                isOpen={isEditModalOpen}
                closeModal={closeEditModal}
                selectedAmenities={selectedAmenities}
                handleAmenityChange={handleAmenityChange}
                saveAmenities={saveAmenities}
            />

            <GroundRulesModal
                isOpen={isGroundRulesModalOpen}
                closeModal={closeGroundRulesModal}
                groundRulesData={groundRulesData}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
            />
        </div>
    );
};

export default GMHome;
