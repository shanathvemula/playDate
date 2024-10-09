// import React from 'react';
// import CarouselComponent from './CarouselComponent'; // Import the CarouselComponent
// import './App.css'; // Create a CSS file for styling

// const App = () => (
//   <div className="app-container">
//     <div className="left-side">
//       <CarouselComponent />
//     </div>
//     <div className="right-side">
//       <h1>Right Side Content</h1>
//       {/* You can add more content or components here */}
//     </div>
//   </div>
// );

// export default App;

// import React from 'react';
// import LoginPage from './LoginPage'; // Import the login page component

// function App() {
//   return (
//     <div>
//       <LoginPage />
//     </div>
//   );
// }

// export default App;

import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthPage from "./components/Auth/AuthPage";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
    // <div>
    //   <AuthPage />
    // </div>
  )
}

export default App;