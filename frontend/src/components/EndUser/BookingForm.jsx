import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroundPriceCal, Orders, UpdateTrans } from "../../api/service";
import { notification } from "antd";
import axios from "axios";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

function BookingForm({ groundInfo }) {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [totalPrice, setTotalPrice] = useState(0);
  const [gameDay, setGameDay] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const user = localStorage.getItem('user');

  const resetFormData = () => {
    setTotalPrice(0);
    setGameDay("");
    setSlots([]);
    setSelectedSlots([]);
    setOrderId("");
    setShowPopup(false);
  };

  // Fetch slots for the selected date
  const fetchSlots = async (date) => {
    try {
      const response = await GroundPriceCal(`?date=${date}&id=${groundInfo.id}`);
      setSlots(response?.data?.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    }
  };

  // Handle date change and fetch slots
  const handleDateChange = async (event) => {
    const selectedDate = event.target.value;
    setGameDay(selectedDate);

    if (new Date(selectedDate) >= new Date(getTodayDate())) {
      await fetchSlots(selectedDate);
      setShowPopup(true);
    } else {
      notification.error({ message: "Invalid Date", description: "Please select a future or current date." });
    }
  };

  // Toggle slot selection and update total price
  const toggleSlotSelection = (slot) => {
    if (!slot.Availability) return;

    setSelectedSlots((prev) => {
      const isSelected = prev.some((s) => s.id === slot.id);

      if (isSelected) {
        setTotalPrice((prevPrice) => prevPrice - (slot.price || 0));
        return prev.filter((s) => s.id !== slot.id);
      }

      setTotalPrice((prevPrice) => prevPrice + (slot.price || 0));
      return [...prev, slot];
    });
  };

  const updateTransactionStatus = async (paymentId, status, message, order_id) => {
    try {
      await UpdateTrans({
        order_id,
        paymentId,
        status,
        message,
      });
      console.log(`Transaction updated: Order ID: ${orderId}, Status: ${status}`);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };
  

  // Close the popup
  const closePopup = () => setShowPopup(false);

  // Book Now handler
  const handleBookNow = async () => {
    if (selectedSlots.length === 0) {
      notification.error({ message: "No Slots Selected", description: "Please select at least one slot." });
      return;
    }

    try {
      console.log("amount", totalPrice)
      const response = await Orders({
        selectedSlots,
        groundId: groundInfo.id,
        amount: totalPrice,
        currency: "INR",
      });
      console.log("Order Response:", response.data.order_id);
      // Initiate Razorpay payment
      setOrderId(response.data.order_id);
      initiatePayment(response.data.order_id, totalPrice);
    } catch (error) {
      console.error("Error creating order:", error);
      notification.error({ message: "Order Failed", description: "Unable to create order. Please try again later." });
    }
  };

  // Initiate Razorpay Payment
  const initiatePayment = async(orderId, price) => {
    const options = {
      key: "rzp_test_JvXFkNCRf4a6j0", // Razorpay test key
      name: "Test Company",
      description: "Test Transaction",
      order_id: orderId,
      amount: price * 100, // Amount in paise
      currency: "INR",
      handler: async (response) => {
        console.log("Payment Success:", response);
        resetFormData();
        notification.success({ message: "Payment Successful", description: "Your booking is confirmed!" });
        await updateTransactionStatus(response.razorpay_payment_id, "SUCCESS", "Payment successful", orderId);
        // navigate(routesLink.BOOKING_SCREEN);
      },
      prefill: {
        name: user?.name || "Guest User",
        email: user?.email || "guest@example.com",
        contact: user?.contact || "0000000000",
      },
      theme: { color: "#F37254" },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
    razorpay.on("payment.failed", (response) => {
      console.error("Payment Failed:", response.error);
      notification.error({ message: "Payment Failed", description: "Unable to process payment. Please try again." });
    });
    razorpay.on("payment.success", async (response) => {
      console.log("Payment Successful:", response);
      notification.success({ message: "Payment Successful", description: "Your booking is confirmed!" });
      await updateTransactionStatus(response.error.metadata.payment_id, "FAILED", response.error.reason, orderId);
      // navigate(routesLink.BOOKING_SCREEN);
    });
  };

  // Render slot cards
  const renderSlots = () =>
    slots.map((slot) => (
      <div
        key={slot.id}
        className={`flex flex-col items-center px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
          slot.Availability
            ? selectedSlots.some((s) => s.id === slot.id)
              ? "bg-blue-600 text-white"
              : "bg-green-500 text-white"
            : "bg-red-500 text-white cursor-not-allowed"
        }`}
        onClick={() => toggleSlotSelection(slot)}
      >
        <span>{`${slot.startTime} - ${slot.endTime}`}</span>
        <span className="text-xs font-light mt-1">₹{slot.price || 0}</span>
      </div>
    ));

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-lg font-semibold mb-6 text-gray-500">₹ {totalPrice.toFixed(2)} total</h1>
        <h6 className="text-sm mb-2 text-gray-400">Price calculated based on selected slots.</h6>

        {/* Game Info */}
        <div className="mb-4">
          <label htmlFor="sport" className="block text-sm mb-1 text-gray-500 font-medium">
            Game
          </label>
          <input
            type="text"
            id="sport"
            value={groundInfo?.name || "N/A"}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
          />
        </div>

        {/* Game Day */}
        <div className="mb-4">
          <label htmlFor="game-day" className="block text-sm mb-1 text-gray-500 font-medium">
            Day
          </label>
          <input
            type="date"
            id="game-day"
            value={gameDay}
            onChange={handleDateChange}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            min={getTodayDate()}
            required
          />
        </div>

        {/* Selected Slots */}
        {selectedSlots.length > 0 && (
          <div className="mb-4">
            <label htmlFor="selected-slots" className="block text-sm mb-1 text-gray-500 font-medium">
              Selected Slots
            </label>
            <div className="bg-gray-100 p-2 rounded-md border border-gray-300">
              {selectedSlots.map((slot) => (
                <span
                  key={slot.id}
                  className="inline-block px-2 py-1 text-sm bg-blue-600 text-white rounded-md mr-2 mb-1"
                >
                  {`${slot.startTime} - ${slot.endTime} (₹${slot.price || 0})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Slot Selection Popup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
              <button onClick={closePopup} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                ✕
              </button>
              <h2 className="text-lg font-semibold text-gray-800">Select Slots</h2>
              <div className="mt-6 grid grid-cols-4 gap-4">{renderSlots()}</div>
              <div className="mt-6 flex justify-end">
                <button onClick={closePopup} className="px-6 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div>
          <button
            type="button"
            className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
