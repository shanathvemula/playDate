import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GetBookings } from "../../api/service";
import Loader from "../Loader/Loader";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingsData, setBookingsData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webSocketLoading, setWebSocketLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user once
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await GetBookings();
        setBookingsData(response.data);
      } catch (err) {
        setError("Failed to fetch bookings data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // WebSocket Connection
  const initializeWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8000/transactions');
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
        setIsLoading(false);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWebSocketLoading(false);
    };

    return ws;
  }, []);

  // Handle WebSocket actions
  const handleWebSocketAction = useCallback((message) => {
    if (!user) return;

    switch (message.action) {
      case "update":
        // Handle update action
        break;
      case "create":
        if (message.data.groundId.CreatedBy === user.id) {
          setBookingsData((prevBookings) => [...prevBookings, message.data]);
        }
        break;
      default:
        break;
    }
  }, [user]);

  useEffect(() => {
    const ws = initializeWebSocket();
    return () => {
      ws.close();
    };
  }, [initializeWebSocket]);

  // Memoized events to avoid unnecessary re-renders
  const calendarEvents = React.useMemo(() => 
    bookingsData.flatMap(({ groundId, selectedSlots }) => 
      selectedSlots.map(({ id, date, startTime, endTime, Availability, price }) => ({
        id: `${id}`,
        title: `${groundId.ground_name} - ${Availability ? "Available" : "Maintenance"}`,
        start: `${date.split("T")[0]}T${startTime}:00`,
        end: `${date.split("T")[0]}T${endTime}:00`,
        backgroundColor: Availability ? "#4caf50" : "#ffa500",
        borderColor: Availability ? "#4caf50" : "#ff8c00",
        extendedProps: { date, startTime, endTime, Availability, price, groundName: groundId.ground_name },
      }))
    ), [bookingsData]);

  const handleEventClick = ({ event }) => {
    setSelectedSlot(event.extendedProps);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {isLoading && <Loader />}
      <aside className="w-1/4 bg-white shadow-lg p-6">
        <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-3 rounded-lg mb-6 font-semibold hover:from-blue-500 hover:to-blue-700 transition">
          Book Ground
        </button>
        <h2 className="font-bold text-lg mb-4 text-center">Select a Date</h2>
        <Calendar onChange={setSelectedDate} value={selectedDate} className="mb-6" />
        <div className="bg-gray-100 rounded-lg shadow-md p-4">
          <h2 className="font-bold text-lg mb-3">Selected Date</h2>
          <p className="text-gray-700">{selectedDate.toDateString()}</p>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Booking Schedule</h1>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              events={calendarEvents}
              dateClick={({ dateStr }) => setSelectedDate(new Date(dateStr))}
              eventClick={handleEventClick}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialDate={selectedDate.toISOString().split("T")[0]}
              selectable
              editable={false}
              height="80vh"
            />
          </div>
        )}
      </main>

      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-4/5 md:w-1/3 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Slot Information</h2>
            <div className="mb-4">
              <p className="flex items-center mb-2">
                <span className="font-semibold">Ground Name:</span>
                <span className="ml-2">{selectedSlot.groundName}</span>
              </p>
              <p className="flex items-center mb-2">
                <span className="font-semibold">Date:</span>
                <span className="ml-2">{new Date(selectedSlot.date).toDateString()}</span>
              </p>
              <p className="flex items-center mb-2">
                <span className="font-semibold">Slot Timing:</span>
                <span className="ml-2">
                  {new Date(`1970-01-01T${selectedSlot.startTime}:00Z`).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })} - 
                  {new Date(`1970-01-01T${selectedSlot.endTime}:00Z`).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </p>
              <p className="flex items-center mb-2">
                <span className="font-semibold">Price:</span>
                <span className="ml-2">₹{selectedSlot.price}</span>
              </p>
              <div className="flex items-center mb-2">
                <span className="font-semibold">Availability:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded ${
                    selectedSlot.Availability ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {selectedSlot.Availability ? "Available" : "Maintenance"}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
