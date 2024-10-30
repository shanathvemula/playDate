import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from "./components/Auth/AuthPage";
import GMHome from "./components/GroundManagement/GMHome";
import EUHome from "./components/EndUser/EUHome";
import PasswordReset from "./components/Auth/PasswordReset";
import GroundManagement from "./components/Admin/Ground/GroundManagement";
import UserManagement from "./components/Admin/User/UserManagement";
import Loading from "./components/Loading"; // Import the Loading component
import Form from "./components/Admin/Form/Form";

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

  return (
    <Router>
      <Routes>
        {/* Common routes for all users */}
        <Route path='/' element={<AuthPage />} />
        <Route path='/passwordReset' element={<PasswordReset />} />
        

        {/* Conditionally render Admin routes */}
        {userType === "Admin" && (
          <>
            <Route path="/Admin/Ground" element={<GroundManagement />} />
            <Route path='/Admin/User' element={<UserManagement />} />
            <Route path="/Admin/form" element={<Form />} />
          </>
        )}
        {userType === "Ground Manager" && (
          <>
             <Route path="/home" element={<GMHome />} />
          </>
        )}
        {userType === "End User" && (
          <>
             <Route path="/home" element={<EUHome />} />
          </>
        )}
      </Routes>
    </Router>
  );
}


export default App;
