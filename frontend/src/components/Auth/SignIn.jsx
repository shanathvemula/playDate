import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { login, getUserId } from '../../api/service';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import GoogleLoginButton from './GoogleLoginButton';


const SignIn = ({setCurrentForm}) => {
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the state
  };

  const navigateForgetPassword = () => {
    setCurrentForm('forgetPassword')
  };

  const navigateSignUp = () =>{
    setCurrentForm('signUp')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(username, password);
    const user = await getUserId('', username);
    // console.log("User", user.data.user_type)
    localStorage.setItem("user", JSON.stringify(user));
    // console.log("kk", JSON.parse(localStorage.getItem("user")).data.id)
    if (user.data.user_type==='Admin'){
      navigate('/Admin/User')
      // window.location.href = '/Admin/User';
    } else if (user.data.user_type==='Ground Manager') {
      navigate('/home')
      // window.location.href = '/home';
    } else {
      console.log('End User')
    } 
  }

  return (
    <div>
      <div className="text-center mb-6 " >
        <img
          src="http://69.197.176.103:8000/media/logo/Logo_without_background.png" // Add your logo here
          alt="Logo"
          className="mx-auto mb-4"
        />
        <h2 className="text-lg font-light text-gray-500">Login to Play</h2>
        <p className="text-gray-400">Let's Play our hearts fill</p>
      </div>
      <form onSubmit={handleSubmit}>
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
        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle input type based on state
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Eye icon to toggle password visibility */}
            <span
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye} // Change icon based on state
                className="text-gray-500 text-lg"
              />
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <a onClick={navigateForgetPassword} className="text-blue-500 text-sm">Forgot Password?</a>
        </div>
        <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-500 transition duration-300">
          Login
        </button>
        <div className="mt-4">
          {/* <GoogleButton onClick={login} label=" " style={{ width: '50px', height: '50px' }} /> */}
          {/* <button className="w-full bg-white border border-gray-300 py-2 rounded-lg flex items-center justify-center">
            <img src="google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button> */}
        </div>
      </form>
      <div className="text-center mt-4">
        <p className="text-gray-500">
          Don’t have an account?{' '}
          <a onClick={navigateSignUp} className="text-blue-500">Create New Account</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
