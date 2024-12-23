import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroundPriceCal, Orders, UpdateTrans } from "../../api/service";
import { notification } from "antd";
import { useRazorpay } from "react-razorpay";
import Loader from "../Loader/Loader";

function BookingForm({ groundInfo }) {
  const { Razorpay } = useRazorpay();
  const [totalPrice, setTotalPrice] = useState(0);
  const [gameDay, setGameDay] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const resetFormData = () => {
    setTotalPrice(0);
    setGameDay("");
    setSlots([]);
    setSelectedSlots([]);
    setOrderId("");
    setUserEmail("");
  };

  const fetchSlots = async (date) => {
    setLoading(true);
    try {
      const response = await GroundPriceCal(`?date=${date}&id=${groundInfo.id}`);
      setSlots(response?.data?.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
      notification.error({ message: "Error", description: "Failed to fetch slots." });
    }
    setLoading(false);
  };

  const handleDateChange = async (event) => {
    const selectedDate = event.target.value;
    setGameDay(selectedDate);

    if (new Date(selectedDate) >= new Date(getTodayDate())) {
      await fetchSlots(selectedDate);
    } else {
      notification.error({
        message: "Invalid Date",
        description: "Please select a future or current date.",
      });
    }
  };

  const toggleSlotSelection = (slot) => {
    if (!slot.Availability || isSlotPast(slot)) return;

    setSelectedSlots((prev) => {
      const isSelected = prev.some((s) => s.id === slot.id);
      setTotalPrice((prevPrice) =>
        isSelected ? prevPrice - slot.price : prevPrice + slot.price
      );
      return isSelected
        ? prev.filter((s) => s.id !== slot.id)
        : [...prev, slot];
    });
  };

  const isSlotPast = (slot) => {
    const currentDateTime = new Date();
    const slotDateTime = new Date(`${gameDay} ${slot.endTime}`);
    return slotDateTime <= currentDateTime;
  };

  const updateTransactionStatus = async (paymentId, status, message, orderId, signature) => {
    try {
      await UpdateTrans({ order_id: orderId, payment_id: paymentId, status, message, signature });
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleBookNow = async () => {
    const user = localStorage.getItem("user") || userEmail;

    if (!user) {
      setShowEmailPopup(true);
      return;
    }

    if (selectedSlots.length === 0) {
      notification.error({ message: "No Slots Selected", description: "Please select at least one slot." });
      return;
    }

    try {
      const response = await Orders({
        selectedSlots,
        groundId: groundInfo.id,
        amount: totalPrice,
        currency: "INR",
        user,
      });
      setOrderId(response.data.order_id);
      initiatePayment(response.data.order_id, totalPrice, user);
    } catch (error) {
      console.error("Error creating order:", error);
      notification.error({ message: "Order Failed", description: "Unable to create order." });
    }
  };

  const initiatePayment = (orderId, price, user) => {
    const options = {
      key: "rzp_test_JvXFkNCRf4a6j0",
      name: "Test Company",
      description: "Test Transaction",
      order_id: orderId,
      amount: price * 100,
      currency: "INR",
      handler: async (response) => {
        resetFormData();
        notification.success({
          message: "Payment Successful",
          description: "Your booking is confirmed!",
        });
        await updateTransactionStatus(
          response.razorpay_payment_id,
          "SUCCESS",
          "Payment successful",
          orderId,
          response.razorpay_signature
        );
      },
      prefill: { email: userEmail || "guest@example.com" },
      theme: { color: "#F37254" },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
    razorpay.on("payment.failed", (response) => {
      notification.error({
        message: "Payment Failed",
        description: "Unable to process payment.",
      });
    });
  };

  const handleEmailSubmit = () => {
    if (!userEmail.trim()) {
      notification.error({ message: "Invalid Email", description: "Please enter a valid email." });
      return;
    }
    setShowEmailPopup(false);
    handleBookNow();
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      {loading ? (
        <Loader />
      ) : (
        <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-lg font-semibold mb-6 text-gray-500">₹ {totalPrice.toFixed(2)} total</h1>
          <h6 className="text-sm mb-2 text-gray-400">Price calculated based on selected slots.</h6>

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

          <div className="mb-4">
            <label htmlFor="game-day" className="block text-sm mb-1 text-gray-500 font-medium">
              Day
            </label>
            <input
              type="date"
              id="game-day"
              value={gameDay}
              onChange={handleDateChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
              min={getTodayDate()}
              required
            />
          </div>

          {slots.length > 0 && (
            <div className="mb-4">
              <label htmlFor="slots" className="block text-sm mb-1 text-gray-500 font-medium">
                Available Slots
              </label>
              <div className="grid grid-cols-5 gap-2">
                {slots.map((slot) => {
                  const isPast = isSlotPast(slot);
                  return (
                    <div
                      key={slot.id}
                      className={`flex flex-col items-center px-2 py-1 border rounded-md text-xs font-medium ${
                        isPast || !slot.Availability
                          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                          : selectedSlots.some((s) => s.id === slot.id)
                          ? "bg-blue-500 text-white border-blue-700"
                          : "bg-white text-black border-gray-300 cursor-pointer"
                      }`}
                      onClick={() => !isPast && slot.Availability && toggleSlotSelection(slot)}
                    >
                      <span>{slot.startTime}</span>
                      <span>{slot.endTime}</span>
                      <span>₹{slot.price || 0}</span>
                      {/* {isPast && <span className="text-red-500 text-xs">Unavailable</span>} */}
                      {/* {!slot.Availability && <span className="text-red-500 text-xs">Booked</span>} */}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showEmailPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Email</h2>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md mb-4"
                  placeholder="Enter your email"
                />
                <div className="flex justify-end">
                  <button onClick={handleEmailSubmit} className="px-6 py-2 bg-blue-500 text-white rounded-md">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </form>
      )}
    </div>
  );
}

export default BookingForm;
