import React from 'react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="container mx-auto p-10">
        <div className="flex bg-white rounded-lg shadow-lg">
          {/* Left Section: Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="text-center mb-6">
              <img
                src="logo.png" /* You can replace this with your logo */
                alt="Logo"
                className="mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-700">Playdate</h1>
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
                  placeholder="Enter mail / phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-500 transition duration-300">
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
                  <a href="/login" className="text-blue-500">Sign in</a>
                </p>
              </div>
            </form>
          </div>
          {/* Right Section: Globe or Image */}
          <div className="hidden md:block w-1/2 bg-gray-100 flex justify-center items-center p-8">
            <div className="text-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/ed/Globe.jpg"
                alt="Globe"
                className="w-72 h-72 mx-auto"
              />
              <p className="mt-4 text-gray-600">
                Stay Healthy and find your game partner with Playdate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
