import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ForgetPassword = ({setCurrentForm}) => {

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
        <h2 className="text-xl font-light text-gray-500">Forget Password</h2>
        <p className="text-gray-400">Enter your email or mobile number and we will send a reset link</p>
        </div>
        <form>
        <div className="mb-4">
            <label className="block text-gray-700">E-mail or phone number</label>
            <input
            type="text"
            placeholder="Enter your E-mail or phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Send me the link
        </button>
        </form>
        <div className="text-center mt-4">
        <p className="text-gray-500">
            Back to {' '}
            <a href="#" onClick={navigateSignIn} className="text-blue-500">Sign In</a>
        </p>
        </div>
    </div>
    );
};

export default ForgetPassword;