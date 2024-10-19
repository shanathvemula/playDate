import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from "./components/Auth/AuthPage";
import Home from "./components/Home";
import PasswordReset from "./components/Auth/PasswordReset";
import GroundManagement from "./components/Admin/Ground/GroundManagement";
import UserManagement from "./components/Admin/User/UserManagement";
import Loading from "./components/Loading"; // Import the Loading component

function App() {
  const [loading, setLoading] = useState(true); // Initialize loading state

  // Simulate data loading or initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  if (loading) {
    return <Loading />; // Show loading component while loading
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path='/passwordReset' element={<PasswordReset />} />
        <Route path="/Admin/Ground" element={<GroundManagement />} />
        <Route path='/Admin/User' element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
