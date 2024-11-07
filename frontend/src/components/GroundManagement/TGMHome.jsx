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

const GMHome = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [groundData, setGroundData] = useState(initialGroundData);
    const [promotionData, setPromotionData] = useState({ title: "", discount: "", validity: "", image: "", isEditing: false, editIndex: null });
    const [scheduleData, setScheduleData] = useState({ days: [], startTime: "", endTime: "", isEditing: false, editIndex: null });
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

    return (
        <div className="h-96 bg-neutral-700">
  <div className="w-96 h-96 left-[100px] top-[100px] absolute bg-Color Neutral-neutral lightest">
    <div className="w-96 h-14 px-6 left-0 top-0 absolute bg-Color Neutral-white justify-between items-center inline-flex">
      <div className="self-stretch px-4 py-6 bg-Color Neutral-white justify-start items-center gap-2 flex">
        <div className="w-8 h-8 relative">
          <div className="w-8 h-8 left-0 top-0 absolute bg-blue-600 rounded-lg shadow" />
        </div>
        <div className="text-sky-600 text-3xl font-semibold font-['Roboto'] leading-10">Playdate</div>
      </div>
      <div className="justify-start items-center gap-20 flex">
        <div className="p-2.5 justify-center items-center gap-1.5 flex">
          <div className="w-6 h-6 bg-zinc-100 rounded-full" />
          <div className="text-Color Neutral-neutral dark text-base font-medium font-['Roboto'] leading-10">Dashboard</div>
        </div>
        <div className="p-2.5 border-b border-black justify-center items-center gap-1.5 flex">
          <div className="w-6 h-6 bg-zinc-100 rounded-full" />
          <div className="text-Color Neutral-neutral dark text-xl font-medium font-['Roboto'] leading-10">Grounds</div>
        </div>
        <div className="p-2.5 justify-center items-center gap-1.5 flex">
          <div className="w-6 h-6 bg-zinc-100 rounded-full" />
          <div className="text-Color Neutral-neutral dark text-xl font-medium font-['Roboto'] leading-10">Bookings</div>
        </div>
        <div className="p-2.5 justify-center items-center gap-1.5 flex">
          <div className="w-6 h-6 bg-zinc-100 rounded-full" />
          <div className="text-Color Neutral-neutral dark text-xl font-medium font-['Roboto'] leading-10">Finance</div>
        </div>
      </div>
      <div className="justify-end items-center gap-8 flex">
        <div className="w-6 h-6 relative">
          <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
        </div>
        <div className="justify-start items-center gap-9 flex">
          <div className="w-8 h-8 bg-red-400 rounded-2xl border border-black justify-center items-center gap-2.5 flex" />
        </div>
      </div>
    </div>
    <div className="h-28 p-2 left-[32px] top-[154px] absolute bg-Color Neutral-white rounded border-b border-black flex-col justify-start items-start gap-1.5 inline-flex">
      <div className="self-stretch justify-between items-start inline-flex">
        <div className="text-black text-base font-medium font-['Roboto'] leading-normal">Cricket</div>
        <div className="w-6 h-6 relative">
          <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
        </div>
      </div>
      <div className="self-stretch text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">1234ft x 672ft wide cricket ground optimal for all your gameplays ...</div>
      <div className="self-stretch justify-between items-start inline-flex">
        <div className="text-Text-primary text-sm font-medium font-['Roboto'] leading-tight">YDSC Ground</div>
        <div className="text-Text-primary text-sm font-medium font-['Roboto'] leading-tight">Chennai</div>
      </div>
    </div>
    <div className="h-28 p-2 left-[465px] top-[154px] absolute bg-zinc-100 rounded flex-col justify-start items-start gap-1.5 inline-flex">
      <div className="self-stretch text-black text-base font-medium font-['Roboto'] leading-normal">Football</div>
      <div className="self-stretch text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">1234ft x 672ft wide cricket ground optimal for all your gameplays ...</div>
      <div className="self-stretch justify-between items-start inline-flex">
        <div className="text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">YDSC Ground</div>
        <div className="text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">Location</div>
      </div>
    </div>
    <div className="h-28 p-2 left-[898px] top-[154px] absolute bg-zinc-100 rounded flex-col justify-start items-start gap-1.5 inline-flex">
      <div className="self-stretch text-black text-base font-medium font-['Roboto'] leading-normal">Badminton </div>
      <div className="self-stretch text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">1234ft x 672ft wide cricket ground optimal for all your gameplays ...</div>
      <div className="self-stretch justify-between items-start inline-flex">
        <div className="text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">YDSC Ground</div>
        <div className="text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">Location</div>
      </div>
    </div>
    <div className="w-96 px-2 left-[24px] top-[84px] absolute bg-Color Neutral-white rounded justify-between items-center inline-flex">
      <div className="text-black text-xl font-medium font-['Roboto'] leading-10">Ground List</div>
      <div className="justify-start items-center gap-2 flex">
        <div className="px-4 py-1.5 bg-blue-600 rounded justify-center items-center gap-2.5 flex">
          <div className="text-center text-white text-sm font-normal font-['Roboto'] leading-snug">New Ground</div>
        </div>
        <div className="px-4 py-1.5 bg-Link-secondary rounded border justify-center items-center gap-2.5 flex">
          <div className="text-center text-white text-sm font-normal font-['Roboto'] leading-snug">More</div>
        </div>
      </div>
    </div>
    <div className="h-96 left-[32px] top-[308px] absolute flex-col justify-center items-start gap-2 inline-flex">
      <div className="self-stretch px-3 py-1 justify-start items-center gap-2.5 inline-flex">
        <div className="text-Color Neutral-neutral dark text-base font-medium font-['Roboto'] leading-10">Ground Details</div>
      </div>
      <div className="self-stretch px-3 py-1 justify-start items-center gap-2.5 inline-flex">
        <div className="text-Color Neutral-neutral dark text-base font-medium font-['Roboto'] leading-10">Promotions</div>
      </div>
      <div className="self-stretch px-3 py-1 justify-start items-center gap-2.5 inline-flex">
        <div className="text-Color Neutral-neutral dark text-base font-medium font-['Roboto'] leading-10">Images</div>
      </div>
      <div className="self-stretch px-3 py-1 bg-white border-r border-black justify-start items-center gap-2.5 inline-flex">
        <div className="text-Color Neutral-neutral dark text-base font-medium font-['Roboto'] leading-10">Slot availablity</div>
      </div>
      <div className="self-stretch px-3 py-1 justify-start items-center gap-2.5 inline-flex">
        <div className="text-Color Neutral-neutral dark text-base font-medium font-['Roboto'] leading-10">Manage Price</div>
      </div>
      <div className="self-stretch px-3 py-1 justify-start items-center gap-2.5 inline-flex">
        <div className="text-Color Neutral-neutral dark text-base font-medium font-['Roboto'] leading-10">Amenities</div>
      </div>
      <div className="self-stretch px-3 py-1 justify-start items-center gap-2.5 inline-flex">
        <div className="text-Color Neutral-neutral dark text-base font-medium font-['Roboto'] leading-10">Ground Rules & Info</div>
      </div>
    </div>
    <div className="w-96 h-96 pb-4 left-[306px] top-[308px] absolute flex-col justify-start items-start gap-2 inline-flex">
      <div className="self-stretch h-96 p-4 bg-white rounded-lg flex-col justify-start items-start gap-4 flex">
        <div className="text-Color Neutral-neutral dark text-base font-semibold font-['Roboto'] leading-loose">Ground Details</div>
        <div className="self-stretch h-16 flex-col justify-start items-start gap-2 flex">
          <div className="self-stretch text-Text-Default-Default text-base font-normal font-['Inter'] leading-snug">Venue Name</div>
          <div className="self-stretch px-4 py-3 bg-Background-Default-Default rounded-lg border border-Border-Default-Default justify-start items-center inline-flex">
            <div className="grow shrink basis-0 text-Text-primary text-base font-normal font-['Inter'] leading-none">Cricket</div>
          </div>
        </div>
        <div className="self-stretch h-28 flex-col justify-start items-start gap-2 flex">
          <div className="self-stretch text-Text-Default-Default text-base font-normal font-['Inter'] leading-snug">Ground Description</div>
          <div className="self-stretch px-4 py-3 bg-Background-Default-Default rounded-lg border border-Border-Default-Default justify-start items-start inline-flex">
            <div className="grow shrink basis-0 text-Text-primary text-base font-normal font-['Inter'] leading-snug">1234ft x 672ft wide cricket ground optimal for all your gameplays ...</div>
          </div>
        </div>
        <div className="self-stretch h-16 flex-col justify-start items-start gap-2 flex">
          <div className="self-stretch text-Text-Default-Default text-base font-normal font-['Inter'] leading-snug">Location</div>
          <div className="self-stretch px-4 py-3 bg-Background-Default-Default rounded-lg border border-Border-Default-Default justify-start items-center inline-flex">
            <div className="grow shrink basis-0 text-Text-primary text-base font-normal font-['Inter'] leading-none">Chennai</div>
          </div>
        </div>
      </div>
      <div className="self-stretch h-48 p-4 bg-white rounded-lg flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch justify-between items-center inline-flex">
          <div className="text-Color Neutral-neutral dark text-base font-semibold font-['Roboto'] leading-loose">Promotions</div>
          <div className="justify-start items-center gap-2 flex">
            <div className="justify-start items-center gap-4 flex">
              <div className="px-3.5 py-1 bg-Color Neutral-white rounded justify-center items-center gap-2.5 flex">
                <div className="w-6 h-6 relative">
                  <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
                </div>
                <div className="text-Border-secondary text-base font-semibold font-['Roboto'] leading-normal">Edit</div>
              </div>
            </div>
            <div className="px-4 py-1.5 bg-Link-secondary rounded border justify-center items-center gap-2.5 flex">
              <div className="text-center text-white text-sm font-normal font-['Roboto'] leading-snug">Create Promotion</div>
            </div>
          </div>
        </div>
        <div className="self-stretch justify-start items-start gap-4 inline-flex">
          <div className="h-28 p-2 bg-Color Neutral-neutral lightest rounded justify-start items-start gap-1.5 flex">
            <img className="w-24 h-24" src="https://via.placeholder.com/98x98" />
            <div className="grow shrink basis-0 self-stretch flex-col justify-between items-start inline-flex">
              <div className="self-stretch text-black text-base font-medium font-['Roboto'] leading-normal">Season End Offer</div>
              <div className="self-stretch text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">1234ft x 672ft wide cricket ground optimal for all your gameplays ...</div>
              <div className="self-stretch justify-between items-start inline-flex">
                <div className="text-Text-primary text-lg font-medium font-['Roboto'] leading-tight">18% off</div>
                <div className="text-Text-primary text-lg font-medium font-['Roboto'] leading-tight">Till 31 OCTOBER</div>
              </div>
            </div>
          </div>
          <div className="h-28 p-2 bg-Color Neutral-neutral lightest rounded justify-start items-start gap-1.5 flex">
            <img className="w-24 h-24" src="https://via.placeholder.com/98x98" />
            <div className="grow shrink basis-0 self-stretch flex-col justify-between items-start inline-flex">
              <div className="self-stretch text-black text-base font-medium font-['Roboto'] leading-normal">Summer Start Offer</div>
              <div className="self-stretch text-Text-secondary text-sm font-medium font-['Roboto'] leading-tight">1234ft x 672ft wide cricket ground optimal for all your gameplays ...</div>
              <div className="self-stretch justify-between items-start inline-flex">
                <div className="text-Text-primary text-lg font-medium font-['Roboto'] leading-tight">30% off</div>
                <div className="text-Text-primary text-lg font-medium font-['Roboto'] leading-tight">Till 31 OCTOBER</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch h-28 px-4 py-2 bg-white rounded-lg flex-col justify-center items-start gap-2 flex">
        <div className="self-stretch py-1 justify-between items-center inline-flex">
          <div className="text-Color Neutral-neutral dark text-base font-semibold font-['Roboto'] leading-loose">Schedule for Maintenance</div>
          <div className="justify-start items-center gap-4 flex">
            <div className="p-1 bg-Color Neutral-white rounded justify-center items-center gap-2.5 flex">
              <div className="w-6 h-6 relative">
                <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
              </div>
            </div>
          </div>
        </div>
        <div className="justify-start items-start gap-2 inline-flex">
          <div className="w-80 px-5 py-2 bg-Color Neutral-neutral lightest rounded-lg border-l-4 border-yellow-600 flex-col justify-center items-start gap-0.5 inline-flex">
            <div className="text-zinc-800 text-xs font-semibold font-['Roboto'] leading-none tracking-wide">Mon - Thu</div>
            <div className="text-zinc-800 text-xs font-normal font-['Roboto'] leading-none tracking-wide">10 AM - 11 AM</div>
          </div>
          <div className="w-80 px-5 py-2 bg-Color Neutral-neutral lightest rounded-lg border-l-4 border-yellow-600 flex-col justify-center items-start gap-0.5 inline-flex">
            <div className="text-zinc-800 text-xs font-semibold font-['Roboto'] leading-none tracking-wide">Fri - Sun</div>
            <div className="text-zinc-800 text-xs font-normal font-['Roboto'] leading-none tracking-wide">08 AM - 09 AM</div>
          </div>
        </div>
      </div>
      <div className="self-stretch h-96 p-4 bg-white rounded-lg flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch justify-between items-center inline-flex">
          <div className="text-Color Neutral-neutral dark text-base font-semibold font-['Roboto'] leading-loose">Images</div>
          <div className="justify-start items-center gap-2 flex">
            <div className="justify-start items-center gap-4 flex">
              <div className="px-3.5 py-1 bg-Color Neutral-white rounded justify-center items-center gap-2.5 flex">
                <div className="w-6 h-6 relative">
                  <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
                </div>
                <div className="text-Border-secondary text-base font-semibold font-['Roboto'] leading-normal">Edit</div>
              </div>
            </div>
            <div className="px-4 py-1.5 bg-Link-secondary rounded border justify-center items-center gap-2.5 flex">
              <div className="text-center text-white text-sm font-normal font-['Roboto'] leading-snug">Upload</div>
            </div>
          </div>
        </div>
        <div className="self-stretch justify-start items-start gap-4 inline-flex">
          <div className="w-96 flex-col justify-start items-start inline-flex">
            <div className="self-stretch h-px origin-top-left rotate-[-34.23deg] border" />
          </div>
          <div className="w-96 flex-col justify-start items-start inline-flex">
            <div className="self-stretch h-96 origin-top-left -rotate-45 justify-start items-start inline-flex">
              <div className="self-stretch origin-top-left rotate-[24.47deg] border" />
            </div>
          </div>
          <div className="w-96 flex-col justify-start items-start inline-flex">
            <div className="self-stretch h-px origin-top-left rotate-[-34.23deg] border" />
          </div>
          <div className="w-96 flex-col justify-start items-start inline-flex">
            <div className="h-px origin-top-left rotate-[-41.81deg]" />
          </div>
          <div className="w-96 flex-col justify-start items-start inline-flex">
            <div className="self-stretch h-px origin-top-left rotate-[-30deg] border" />
          </div>
        </div>
      </div>
      <div className="self-stretch h-80 p-4 bg-white rounded-lg flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch justify-between items-center inline-flex">
          <div className="text-Color Neutral-neutral dark text-base font-semibold font-['Roboto'] leading-loose">Manage Price</div>
          <div className="justify-start items-center gap-4 flex">
            <div className="px-3.5 py-1 bg-Color Neutral-white rounded justify-center items-center gap-2.5 flex">
              <div className="w-6 h-6 relative">
                <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
              </div>
              <div className="text-Border-secondary text-base font-semibold font-['Roboto'] leading-normal">Edit</div>
            </div>
          </div>
        </div>
        <div className="self-stretch p-2 bg-Color Neutral-white rounded-lg border border-Color Neutral-neutral lightest justify-start items-start gap-2 inline-flex">
          <div className="text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">Monday - Thurday</div>
          <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">Select the edit on the right to edit/update the pricing information for this selected venue</div>
        </div>
        <div className="flex-col justify-start items-start gap-2 flex">
          <div className="h-16 p-2 bg-Color Neutral-white rounded-lg border border-Color Neutral-neutral lightest flex-col justify-start items-start gap-2 flex">
            <div className="self-stretch text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">Monday - Thurday</div>
            <div className="self-stretch justify-start items-center gap-12 inline-flex">
              <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">12:00 Am - 12:00 AM</div>
              <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">INR 800.00/hour</div>
            </div>
          </div>
          <div className="h-32 p-2 bg-Color Neutral-white rounded-lg border border-Color Neutral-neutral lightest flex-col justify-start items-start gap-2 flex">
            <div className="self-stretch text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">Friday - Sunday</div>
            <div className="self-stretch justify-start items-center gap-12 inline-flex">
              <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">12:00 Am - 07:00 AM</div>
              <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">INR 1000.00/hour</div>
            </div>
            <div className="self-stretch justify-start items-center gap-12 inline-flex">
              <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">07:00 Am - 05:00 AM</div>
              <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">INR 900.00/hour</div>
            </div>
            <div className="self-stretch justify-start items-center gap-12 inline-flex">
              <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">05:00 Am - 12:00 AM</div>
              <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-snug">INR 1000.00/hour</div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch h-28 p-4 bg-white rounded-lg flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch justify-between items-center inline-flex">
          <div className="text-Color Neutral-neutral dark text-base font-semibold font-['Roboto'] leading-loose">Amenities</div>
          <div className="justify-start items-center gap-4 flex">
            <div className="px-3.5 py-1 bg-Color Neutral-white rounded justify-center items-center gap-2.5 flex">
              <div className="w-6 h-6 relative">
                <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
              </div>
              <div className="text-Border-secondary text-base font-semibold font-['Roboto'] leading-normal">Edit</div>
            </div>
          </div>
        </div>
        <div className="justify-start items-start gap-4 inline-flex">
          <div className="px-3 py-1 bg-Color Neutral-neutral lightest rounded justify-start items-center gap-12 flex">
            <div className="text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">Washroom</div>
          </div>
          <div className="px-3 py-1 bg-Color Neutral-neutral lightest rounded justify-start items-center gap-12 flex">
            <div className="text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">Change Room</div>
          </div>
          <div className="px-3 py-1 bg-Color Neutral-neutral lightest rounded justify-start items-center gap-12 flex">
            <div className="text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">Resting Space</div>
          </div>
          <div className="px-3 py-1 bg-Color Neutral-neutral lightest rounded justify-start items-center gap-12 flex">
            <div className="text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">Parking</div>
          </div>
          <div className="px-3 py-1 bg-Color Neutral-neutral lightest rounded justify-start items-center gap-12 flex">
            <div className="text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">First Aid Kit</div>
          </div>
        </div>
      </div>
      <div className="self-stretch h-48 p-4 bg-white rounded-lg flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch justify-between items-center inline-flex">
          <div className="text-Color Neutral-neutral dark text-base font-semibold font-['Roboto'] leading-loose">About Venue</div>
          <div className="justify-start items-center gap-4 flex">
            <div className="px-3.5 py-1 bg-Color Neutral-white rounded justify-center items-center gap-2.5 flex">
              <div className="w-6 h-6 relative">
                <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
              </div>
              <div className="text-Border-secondary text-base font-semibold font-['Roboto'] leading-normal">Edit</div>
            </div>
          </div>
        </div>
        <div className="self-stretch text-zinc-800 text-sm font-medium font-['Poppins'] leading-snug">Dimensions :<br/>The pitch is typically 100–130 yards long and 50–100 yards wide, but for international matches it's 110–120 yards long and 70–80 yards wide. <br/>Lines. The pitch is divided into two halves by a halfway line, and the center mark is at the midpoint of the halfway line. The pitch also has two goal lines, two touch lines, and corner flags at the corners. <br/>Goals:<br/>There is a goal at the center of each short side of the field, and each goal is 24 feet wide. </div>
      </div>
    </div>
  </div>
</div>
    );
};

export default GMHome;
