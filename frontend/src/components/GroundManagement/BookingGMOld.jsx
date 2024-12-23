import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const generateCalendarDates = () => Array.from({ length: 30 }, (_, i) => i + 1);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const bookingsData = [
    { 
      id: "TNS0000005",
      selectedSlots: [
        {
          id: 13,
          date: "2024-12-11T00:00:00",
          price: 1000,
          endTime: "13:00",
          startTime: "12:00",
          Availability: true,
        },
        {
          id: 14,
          date: "2024-12-11T00:00:00",
          price: 1000,
          endTime: "14:00",
          startTime: "13:00",
          Availability: true,
        },
        {
          id: 15,
          date: "2024-12-11T00:00:00",
          price: 1000,
          endTime: "15:00",
          startTime: "14:00",
          Availability: true,
        },
        {
          id: 16,
          date: "2024-12-11T00:00:00",
          price: 1000,
          endTime: "16:00",
          startTime: "15:00",
          Availability: true,
        },
      ],
    },
    {
      id: "TNS0000006",
      selectedSlots: [
        {
          id: 21,
          date: "2024-12-11T00:00:00",
          price: 1000,
          endTime: "21:00",
          startTime: "20:00",
          Availability: true,
        },
      ],
    },
  ];

  const changeMonth = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + offset);
    setSelectedDate(newDate);
  };

  const changeDate = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const calculatePosition = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const calculateHeight = (start, end) => {
    const startPosition = calculatePosition(start);
    const endPosition = calculatePosition(end);
    return endPosition - startPosition;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-6">
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg mb-6 font-semibold hover:from-blue-600 hover:to-blue-700 transition">
          Book Ground
        </button>
        <div className="mb-6">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={() => changeMonth(-1)}
              >
                &lt;
              </button>
              <select
                className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                value={selectedDate.getMonth()}
                onChange={(e) =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      parseInt(e.target.value),
                      selectedDate.getDate()
                    )
                  )
                }
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                value={selectedDate.getFullYear()}
                onChange={(e) =>
                  setSelectedDate(
                    new Date(
                      parseInt(e.target.value),
                      selectedDate.getMonth(),
                      selectedDate.getDate()
                    )
                  )
                }
              >
                {Array.from({ length: 10 }, (_, i) => selectedDate.getFullYear() - 5 + i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={() => changeMonth(1)}
              >
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-sm">
              {daysOfWeek.map((day) => (
                <div key={day} className="font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              {generateCalendarDates().map((date) => (
                <div
                  key={date}
                  className={`py-2 rounded-lg cursor-pointer hover:bg-blue-100 transition ${
                    date === selectedDate.getDate() ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() =>
                    setSelectedDate(
                      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date)
                    )
                  }
                >
                  {date}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-4">
          <h2 className="font-bold text-lg mb-3">Upcoming Maintenance</h2>
          <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
            <p className="font-medium">Tue 04 Nov</p>
            <p className="text-gray-600">10 AM - 11 AM</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={goToToday}
            >
              Today
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => changeDate(-1)}
            >
              &lt;
            </button>
            <p className="font-semibold text-lg text-gray-700">{selectedDate.toDateString()}</p>
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => changeDate(1)}
            >
              &gt;
            </button>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Day
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
              Week
            </button>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <div className="grid grid-rows-24 gap-y-1 border-t border-gray-200 text-sm">
            {[...Array(24)].map((_, hour) => (
              <div
                key={hour}
                className="h-8 flex items-center justify-start pl-2 border-b border-gray-200 text-gray-500"
              >
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            {bookingsData.flatMap((booking) => booking.selectedSlots).map((slot, index) => {
              const top = calculatePosition(slot.startTime) * (32 / 60); // Convert minutes to pixels
              const height = calculateHeight(slot.startTime, slot.endTime) * (32 / 60);

              return (
                <div
                  key={index}
                  className={`absolute left-2 right-2 bg-green-100 rounded-md shadow-md p-2`}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <p className="text-sm font-semibold text-gray-700">
                    {slot.startTime} - {slot.endTime}: Available
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
