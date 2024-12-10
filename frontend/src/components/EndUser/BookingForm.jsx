import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroundPriceCal, Orders, UpdateTrans } from "../../api/service";
import { notification } from "antd";
import { useRazorpay } from "react-razorpay";

function BookingForm({ groundInfo }) {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [totalPrice, setTotalPrice] = useState(0);
  const [gameDay, setGameDay] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showEmailPopup, setShowEmailPopup] = useState(false); // For email input popup
  const navigate = useNavigate();

  const getTodayDate = () => {
    const now = new Date();
    const indiaOffset = 5.5 * 60 * 60 * 1000;
    const indiaTime = new Date(now.getTime() + indiaOffset - now.getTimezoneOffset() * 60 * 1000);
    return indiaTime.toISOString().split("T")[0];
  };

  const resetFormData = () => {
    setTotalPrice(0);
    setGameDay("");
    setSlots([]);
    setSelectedSlots([]);
    setOrderId("");
    setShowPopup(false);
    setUserEmail("");
  };

  const fetchSlots = async (date) => {
    try {
      const response = await GroundPriceCal(`?date=${date}&id=${groundInfo.id}`);
      setSlots(response?.data?.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    }
  };

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

  const updateTransactionStatus = async (paymentId, status, message, order_id, signature) => {
    try {
      await UpdateTrans({
        order_id,
        payment_id: paymentId,
        status,
        message,
        signature
      });
      console.log(`Transaction updated: Order ID: ${orderId}, Status: ${status}`);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const closePopup = () => setShowPopup(false);

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
        user: user,
      });
      setOrderId(response.data.order_id);
      initiatePayment(response.data.order_id, totalPrice, user);
    } catch (error) {
      console.error("Error creating order:", error);
      notification.error({ message: "Order Failed", description: "Unable to create order. Please try again later." });
    }
  };

  const initiatePayment = async (orderId, price, user) => {
    const options = {
      key: "rzp_test_JvXFkNCRf4a6j0",
      name: "Test Company",
      description: "Test Transaction",
      order_id: orderId,
      amount: price * 100,
      currency: "INR",
      handler: async (response) => {
        resetFormData();
        console.log("success response", response)
        notification.success({ message: "Payment Successful", description: "Your booking is confirmed!" });
        await updateTransactionStatus(response.razorpay_payment_id, "SUCCESS", "Payment successful", orderId, response.razorpay_signature);
      },
      prefill: {
        name: user?.name || "Guest User",
        email: user?.email || userEmail || "guest@example.com",
        contact: user?.contact || "0000000000",
      },
      theme: { color: "#F37254" },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
    razorpay.on("payment.failed", (response) => {
      console.error("Payment Failed:", response.error);
      notification.error({ message: "Payment Failed", description: "Unable to process payment. Please try again." });
      updateTransactionStatus(response.error.metadata.payment_id, "Falied", response.error.reason, orderId);
    });
  };

  const handleEmailSubmit = () => {
    if (!userEmail) {
      notification.error({ message: "Invalid Email", description: "Please enter a valid email." });
      return;
    }
    setShowEmailPopup(false);
    handleBookNow();
  };

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
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            min={getTodayDate()}
            required
          />
        </div>

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
                <button
                  onClick={handleEmailSubmit}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

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
