import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserSidebarCreate, updateUser } from '../../../api/service';

const UserSidebarForm = React.memo(({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  loading
}) => {
  const initialFormData = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    phone: '',
    is_active: true,
    user_type: 'Select User Type',
    password: '', // Password will be generated but not shown in the form
  };

  const [formData, setFormData] = useState(initialFormData);

  const formRef = useRef(null); // Reference to the form container

  // Password generator function
  const generatePassword = useCallback(() => {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    const allChars = lowerChars + upperChars + numbers + specialChars;
    let password = [lowerChars, upperChars, numbers, specialChars]
      .map((chars) => chars[Math.floor(Math.random() * chars.length)])
      .join('') + Array.from({ length: 6 }, () =>
        allChars[Math.floor(Math.random() * allChars.length)]
      ).join('');

    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }, []);

  useEffect(() => {
    if (editingUser) {
      setFormData({ ...editingUser, password: '' });
    } else {
      setFormData({ ...initialFormData, password: generatePassword() });
    }
  }, [editingUser, generatePassword]);

  const handleInputChange = useCallback((e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      onSubmit(formData);

      if (editingUser) {
        await updateUser({ ...formData, password: undefined });
      } else {
        await UserSidebarCreate(formData);
      }

      setFormData({ ...initialFormData, password: generatePassword() });
    },
    [formData, editingUser, generatePassword, initialFormData, onSubmit]
  );

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose(); // Close the sidebar if clicked outside
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup event listener
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end z-50">
      <div
        ref={formRef}
        className={`bg-white w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-1 p-4 bg-gray-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            {editingUser ? 'Edit User' : 'Create User'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="flex-grow overflow-y-auto p-4">
          <form onSubmit={handleFormSubmit}>
            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
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

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
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

            {/* User Type */}
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-medium mb-2'>
                User Type
              </label>
              <select 
                name="user_type"
                value={formData.user_type} 
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value="">Select User Type</option>
                  <option value="Admin">Admin</option>
                  <option value="Ground Manager">Ground Manager</option>
                  <option value="End User">End User</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-200 flex-shrink-0 flex justify-end space-x-2">
          <button
            type="submit"
            disabled={loading}
            onClick={handleFormSubmit}
            className={`${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'
            } text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200 mr-2`}
          >
            {loading ? 'Submitting...' : editingUser ? 'Update User' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

export default UserSidebarForm;
