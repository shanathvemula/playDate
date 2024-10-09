import React, { useState } from 'react';

function PasswordReset() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    // Add logic for password reset here
    if (newPassword === confirmPassword) {
      console.log('Password reset successfully');
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-3">
            <span className="text-blue-500 text-2xl font-bold">R</span>
          </div>
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
              {/* <ul className="space-y-1 flex-1">
                <li>&bull; Uppercase characters.</li>
                <li>&bull; 14 characters minimum.</li>
              </ul> */}
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
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors"
          >
            Reset password
          </button>
          <div className="text-center my-4 text-gray-500">or</div>
          <div className="text-center">
            <a
              href="#"
              className="text-blue-500 hover:underline"
            >
              Log in with SSO
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
