import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router for navigation
import { resetPassword } from '../../api/service';

function PasswordReset() {
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Optional: If you want to navigate after reset

  useEffect(() => {
    // Retrieve the token from URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get('token');
    setToken(tokenParam);
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!token) {
      console.log('Token is missing');
      return;
    }

    if (newPassword !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    try {
      // Add your API call logic for password reset here
      const response = await resetPassword(token, newPassword, confirmPassword); // Replace with actual API function
      console.log('Password reset successfully', response);
      
      if (response.status===200){
        // Optionally, navigate the user after a successful reset
        // navigate('/');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error resetting password:', error.data.response);
      // Handle error (e.g., show error message to the user).
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <img
            src="http://69.197.176.103:8000/media/logo/Logo_without_background.png"
            alt="Logo"
            className="mx-auto mb-4"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Reset your password</h2>
        <p className="text-gray-600 text-center mb-6">
          Almost done. Enter your new password and you're good to go.
        </p>
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="new-password">
              New password
            </label>
            <input
              type="password"
              id="new-password"
              className="w-full mt-2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <div className="flex mt-2 space-x-4 text-sm text-gray-500">
              <ul className="space-y-1 flex-1">
                <li>&bull; Lowercase characters.</li>
                <li>&bull; Numbers.</li>
              </ul>
              <ul className="space-y-1 flex-1">
                <li>&bull; Uppercase characters.</li>
                <li>&bull; 14 characters minimum.</li>
              </ul>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700" htmlFor="confirm-password">
              Confirm new password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full mt-2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-3 rounded hover:bg-sky-500 transition-colors"
          >
            Reset password
          </button>
          {/* <div className="text-center my-4 text-gray-500">or</div>
          <div className="text-center">
            <a
              href="#"
              className="text-blue-500 hover:underline"
            >
              Log in with SSO
            </a>
          </div> */}
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
