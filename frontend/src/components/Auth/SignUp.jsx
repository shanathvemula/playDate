import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUp = ({setCurrentForm}) => {
  // States to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const navigateSignIn = () => {
    setCurrentForm('signIn')
  }

  return (
    <div className="w-full md:w-1/3 p-8 rounded-lg">
      <div className="text-center mb-6 ">
        <img
          src="logo.png" // Add your logo here
          alt="Logo"
          className="mx-auto mb-4"
        />
        <h2 className="text-xl font-light text-gray-500">Create Account</h2>
        <p className="text-gray-400">Enter details to create your account</p>
      </div>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Your name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">E-mail or phone numbers</label>
          <input
            type="email"
            placeholder="Enter your email or phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4 flex space-x-4">
          {/* Password Field */}
          <div className="w-1/2 relative">
            <label className="block text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            {/* Eye Icon */}
            <span
              onClick={togglePasswordVisibility}
              className="absolute inset-y-3 right-3 cursor-pointer flex items-center h-full"
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="text-gray-500 text-lg"
              />
            </span>
          </div>
          {/* Confirm Password Field */}
          <div className="w-1/2 relative">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            {/* Eye Icon */}
            <span
              onClick={toggleConfirmPasswordVisibility}
              // className="absolute inset-y-0 right-0 flex items-center cursor-pointer"
              className="absolute inset-y-3 right-3 cursor-pointer flex items-center h-full"
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="text-gray-500 text-lg"
              />
            </span>
          </div>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Sign up
        </button>
        <div className="mt-4">
          <button className="w-full bg-white border border-gray-300 py-2 rounded-lg flex items-center justify-center">
            <img src="google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-500">
            Already have an account?{' '}
            <a href="#" onClick={navigateSignIn} className="text-blue-500">Sign in</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
