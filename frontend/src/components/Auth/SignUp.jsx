import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { signup } from '../../api/service';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ setCurrentForm }) => {
  // States to manage password visibility and form inputs
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [first_name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  // States for validation messages
  const [error, setError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const navigateSignIn = () => {
    setCurrentForm('signIn');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error states
    setError('');
    setPasswordMatchError('');

    // Validation rules
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== rePassword) {
      setPasswordMatchError('Passwords do not match.');
      return;
    }

    // Submit form logic
    const data = await signup(username, password, first_name)
    // Further form submission logic (e.g., API calls) goes here
  };

  return (
    <div>
      <div className="text-center mb-6">
        <img
          src="api/media/logo/Logo_without_background.png" // Add your logo here
          alt="Logo"
          className="mx-auto mb-4"
        />
        <h2 className="text-xl font-light text-gray-500">Create Account</h2>
        <p className="text-gray-400">Enter details to create your account</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Your name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={first_name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">E-mail or phone number</label>
          <input
            type="text"
            placeholder="Enter your email or phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            {/* Password Error */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {/* Confirm Password Error */}
            {passwordMatchError && (
              <p className="text-red-500 text-sm mt-1">{passwordMatchError}</p>
            )}
          </div>
          {/* Confirm Password Field */}
          <div className="w-1/2 relative">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
            {/* Eye Icon */}
            <span
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-3 right-3 cursor-pointer flex items-center h-full"
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="text-gray-500 text-lg"
              />
            </span>
            {/* Confirm Password Error */}
            {passwordMatchError && (
              <p className="text-red-500 text-sm mt-1">{passwordMatchError}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
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
            <a href="#" onClick={navigateSignIn} className="text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
