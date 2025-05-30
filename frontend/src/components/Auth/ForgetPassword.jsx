import React, { useState } from 'react';
import { forgetPassword } from '../../api/service';

const ForgetPassword = ({setCurrentForm}) => {
    const [username, setUsername] = useState('')

    const navigateSignIn = () => {
        setCurrentForm('signIn')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await forgetPassword(username);
        navigateSignIn()
    }

    return (
    <div>
        <div className="text-center mb-6 ">
        <img
            src="http://157.173.195.249:8000/media/logo/Logo_without_background.png" // Add your logo here
            alt="Logo"
            className="mx-auto mb-4"
        />
        <h2 className="text-xl font-light text-gray-500">Forget Password</h2>
        <p className="text-gray-400">Enter your email or mobile number and we will send a reset link</p>
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
        <button className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-500 transition duration-300">
            Send me the link
        </button>
        </form>
        <div className="text-center mt-4">
        <p className="text-gray-500">
            Back to {' '}
            <a onClick={navigateSignIn} className="text-blue-500">Sign In</a>
        </p>
        </div>
    </div>
    );
};

export default ForgetPassword;
