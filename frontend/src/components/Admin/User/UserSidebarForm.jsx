import React, { useState, useEffect } from 'react';
import Switch from 'react-switch'; // Import react-switch for the toggle
// import DatePicker from 'react-datepicker'; // Import DatePicker for the DOB field
// import 'react-datepicker/dist/react-datepicker.css'; // Import the styles for the date picker

import { DatePicker } from "antd";


const UserSidebarForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    gender: '',
    age: '',
    phone: '',
    is_active: true,
    profileImage: null, // For file upload
    date_of_birth: new Date(), // Date of Birth field (default to today's date)
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        // username: editingUser.name,
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
        gender: editingUser.gender,
        age: editingUser.age,
        phone: editingUser.phone,
        date_of_birth: editingUser.date_of_birth | '2024-10-11',
        is_active: editingUser.is_active,
      });
    } else {
      setFormData({
        // username: '',
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        age: '',
        phone: '',
        is_active: true,
      });
    }
  }, [editingUser]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleFormSubmit = (e) => {
    console.log("formData", formData)
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end z-50">
      <div
        className={`bg-white w-1/4 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex bg-gray-200 flex justify-between items-center mb-1 p-2">
          <h3 className="text-l font-semibold text-neutral-800">
            {editingUser ? 'Edit User' : 'Create User'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className='p-6'>
          <form onSubmit={handleFormSubmit}>
            {/* First Name */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter First name"
                required
              />
            </div>

            {/* Last Name */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Last name"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter user email"
                required
              />
            </div>

            {/* Gender */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter age"
              />
            </div>

            {/* Phone */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            {/* Date of Birth (Date Picker) */}
            {/* <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Date of Birth
              </label>
              <DatePicker />
            </div> */}

            {/* Profile Image */}
            {/* <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Profile Image
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                />
                {formData.profileImage && (
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.profileImage.name}
                  </span>
                )}
              </div>
              <small className="text-gray-500 block">Max size: 1.5 MB</small>
            </div> */}

            {/* Is Active (Toggle Switch) */}
            {/* <div className="mb-2 flex items-center">
              <label className="text-gray-700 text-sm font-medium mr-2">
                Is Active
              </label>
              <Switch
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: !prev.is_active,
                  }))
                }
                checked={formData.is_active}
                onColor="#4CAF50"
                offColor="#F44336"
                checkedIcon={false}
                uncheckedIcon={false}
              />
            </div> */}

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-200 mr-2"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSidebarForm;
