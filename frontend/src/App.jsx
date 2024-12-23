import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./components/Auth/AuthPage";
import GMHome from "./components/GroundManagement/GMHome.jsx";
import EUHome from "./components/EndUser/EUHome";
import Booking from "./components/EndUser/Booking.jsx";
import Payment from "./components/EndUser/Payment.jsx";
import EUHomeNew from "./components/EndUser/EUHomeNew.jsx";
import PasswordReset from "./components/Auth/PasswordReset";
import GroundManagement from "./components/Admin/Ground/GroundManagement";
import UserManagement from "./components/Admin/User/UserManagement";
import Loading from "./components/Loading"; // Import the Loading component
import Form from "./components/Admin/Form/Form";
import { StateProvider } from "./components/EndUser/context/StateContext.jsx";
import BookingGM from "./components/GroundManagement/BookingGM .jsx";

function App() {
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [userType, setUserType] = useState(null); // State for user type

  // Simulate data loading or initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds

      // Retrieve user type from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserType(userData.user_type); // Set user type in state
      }
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  if (loading) {
    return <Loading />; // Show loading component while loading
  }

  console.log("userType", userType);


  return (
    <StateProvider>
      <Router>
        <Routes>
          {/* Common routes for all users */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/passwordReset" element={<PasswordReset />} />
          <Route path="/" element={<EUHome />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/proceed" element={<Payment />} />
          

          {/* Conditionally render Admin routes */}
          {/* {userType === null && (
            <>
            <Route path="/" element={<EUHome />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/proceed" element={<Payment />} />
            </>
            
            
          )} */}
          {userType === "Admin" && (
            <>
              <Route path="/Admin/Ground" element={<GroundManagement />} />
              <Route path="/Admin/User" element={<UserManagement />} />
              <Route path="/Admin/form" element={<Form />} />
            </>
          )}
          {userType === "Ground Manager" && (
            <>
              <Route path="/home" element={<GMHome />} />
              <Route path="/bookingGM" element={<BookingGM />} />
            </>
          )}
          {userType === "End User" && (
            <>
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking/proceed" element={<Payment />} />
              {/* <Route path="/home" element={<EUHomeNew />} /> */}
            </>
          )}
        </Routes>
      </Router>
    </StateProvider>
  );
}

export default App;
