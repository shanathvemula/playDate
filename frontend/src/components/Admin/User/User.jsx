import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing Edit and Delete icons
import Navbar from '../../Navbar';
import Footer from '../../footer';
import UserSidebarForm from './UserSidebarForm'; // Import the UserSidebarForm component
import Skeleton from 'react-loading-skeleton'; // Optional loading skeleton package
import { getUserId, deleteUser } from '../../../api/service';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // To hold user data for editing
  const [loading, setLoading] = useState(true); // Loading state for WebSocket connection
  const [formLoading, setFormLoading] = useState(false); // Loading state for form submission
  const [errorMessage, setErrorMessage] = useState(''); // Error state for showing messages
  const [webSocketLoading, setWebSocketLoading] = useState(true); // Loading state for WebSocket

  let ws; // WebSocket reference

  // WebSocket connection setup
  useEffect(() => {
    setLoading(true); // Start loading when the component mounts
    setWebSocketLoading(true); // Start loading for WebSocket

    ws = new WebSocket('ws://127.0.0.1:8000/users');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setWebSocketLoading(false); // Stop loading once connected
    };

    ws.onmessage = (event) => {
      setLoading(true); // Start loading while processing the message
      try {
        const message = JSON.parse(event.data);
        handleWebSocketAction(message);
      } catch (error) {
        console.error('Error parsing WebSocket data', error);
      } finally {
        setLoading(false); // Stop loading once the message is processed
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWebSocketLoading(false); // Stop WebSocket loading when error occurs
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleWebSocketAction = (message) => {
    switch (message.action) {
      case 'initial':
        // Initial data load
        if (Array.isArray(message.data)) {
          const processedUsers = message.data.map(user => ({
            id: user.id,
            name: user.first_name || user.username, // Use first name or username
            email: user.email || 'N/A',
            gender: user.gender || 'N/A',
            age: user.age || 'N/A',
            phone: user.phone || 'N/A',
            is_active: user.is_active
          }));
          setUsers(processedUsers);
          setUserCount(processedUsers.length);
        }
        break;
      case 'create':
        // Create new user
        const newUser = {
          id: message.data.id,
          name: message.data.first_name || message.data.username,
          email: message.data.email || 'N/A',
          gender: message.data.gender || 'N/A',
          age: message.data.age || 'N/A',
          phone: message.data.phone || 'N/A',
          is_active: message.data.is_active
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        setUserCount(prevCount => prevCount + 1);
        break;
      case 'update':
        // Update existing user
        setUsers(prevUsers => prevUsers.map(user =>
          user.id === message.data.id
            ? {
                ...user,
                name: message.data.first_name || message.data.username,
                email: message.data.email || 'N/A',
                gender: message.data.gender || 'N/A',
                age: message.data.age || 'N/A',
                phone: message.data.phone || 'N/A',
                is_active: message.data.is_active
              }
            : user
        ));
        break;
      case 'delete':
        // Delete user
        setUsers(prevUsers => prevUsers.filter(user => user.id !== message.data.id));
        setUserCount(prevCount => prevCount - 1);
        break;
      default:
        console.error('Unknown WebSocket action:', message.action);
    }
  };

  // Open sidebar for user creation
  const handleCreateUser = () => {
    setEditingUser(null); // No user being edited
    setIsSidebarOpen(true); // Open sidebar
  };

  // Open sidebar for user editing
  const handleEdit = async (user) => {
    const data = await getUserId(user.id, user.username)
    setEditingUser(data.data); // Set the user to be edited
    setIsSidebarOpen(true); // Open sidebar
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    setFormLoading(true); // Start loading during form submission
    setErrorMessage(''); // Reset error message

    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = { ...editingUser, ...formData };
        ws.send(JSON.stringify({ action: 'update', data: updatedUser }));
      } else {
        // Create new user
        const newUser = { ...formData, id: Date.now() };
        ws.send(JSON.stringify({ action: 'create', data: newUser }));
      }
    } catch (error) {
      setErrorMessage('Error submitting form, please try again.');
    } finally {
      setFormLoading(false); // Stop loading after form submission
      setIsSidebarOpen(false); // Close the sidebar form
    }
  };

  const handleDelete = async (id) => {
    setFormLoading(true); // Start loading during delete
    setErrorMessage(''); // Reset error message

    try {
      const data = await deleteUser(id)
      ws.send(JSON.stringify({ action: 'delete', data: { id } }));
    } catch (error) {
      setErrorMessage('Error deleting user, please try again.');
    } finally {
      setFormLoading(false); // Stop loading after delete
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      {/* Navbar */}
      <Navbar />

      <div className="p-4 md:p-8 flex-grow">
        {/* Header */}
        <div className="bg-white p-6 mb-6 shadow-lg rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-sky-600">
              User Management ({userCount})
            </h2>
            <p className="text-gray-600">
              Manage and organize user information efficiently.
            </p>
          </div>
          <button
            className="mt-4 md:mt-0 bg-sky-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-sky-600 transition"
            onClick={handleCreateUser}
            disabled={formLoading || loading} // Disable button while loading
          >
            + Add New User
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-md overflow-x-auto">
          {loading || webSocketLoading ? (
            <div className="p-6">
              <Skeleton height={40} count={5} /> {/* Show skeleton loader */}
            </div>
          ) : (
            <>
              {/* {errorMessage && (
                <div className="text-red-500 text-center mb-4">{errorMessage}</div>
              )} */}
              <table className="table-auto w-full text-left">
                <thead className="bg-stone-300 text-gray-700">
                  <tr>
                    <th className="p-3 font-medium">ID</th>
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Gender</th>
                    <th className="p-3 font-medium">Age</th>
                    <th className="p-3 font-medium">Phone</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="p-3">{user.id}</td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.gender}</td>
                        <td className="p-3">{user.age}</td>
                        <td className="p-3">{user.phone}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-md text-sm ${user.is_active ? 'bg-sky-600 text-white' : 'bg-red-100 text-red-700'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className='flex space-x-4 justify-end'>
                            <FaEdit
                              className="text-blue-600 cursor-pointer hover:text-sky-600"
                              onClick={() => handleEdit(user)}
                            />
                            <FaTrashAlt
                              className="text-red-600 cursor-pointer hover:text-red-700"
                              onClick={() => handleDelete(user.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* User Sidebar Form Component */}
        <UserSidebarForm
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSubmit={handleFormSubmit}
          editingUser={editingUser}
          loading={formLoading} // Pass loading state to the form
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserManagement;
