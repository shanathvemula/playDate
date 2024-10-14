import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing Edit and Delete icons
import Navbar from '../../Navbar';
import Footer from '../../footer';
import UserSidebarForm from './UserSidebarForm'; // Import the UserSidebarForm component

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // To hold user data for editing

  let ws; // WebSocket reference

  // WebSocket connection setup
  useEffect(() => {
    ws = new WebSocket('ws://127.0.0.1:8000/users');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketAction(message);
      } catch (error) {
        console.error('Error parsing WebSocket data', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
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
  const handleEdit = (user) => {
    setEditingUser(user); // Set the user to be edited
    setIsSidebarOpen(true); // Open sidebar
  };

  // Handle form submission (create or update)
  const handleFormSubmit = (formData) => {
    if (editingUser) {
      // Update existing user
      const updatedUser = { ...editingUser, ...formData };
      ws.send(JSON.stringify({ action: 'update', data: updatedUser }));
    } else {
      // Create new user
      const newUser = { ...formData, id: Date.now() };
      ws.send(JSON.stringify({ action: 'create', data: newUser }));
    }
  };

  const handleDelete = (id) => {
    ws.send(JSON.stringify({ action: 'delete', data: { id } }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="p-8 bg-gray-100 flex-grow">
        {/* Header */}
        <div className="bg-white p-4 mb-4 shadow-md rounded-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              User details ({userCount})
            </h2>
            <p className="text-gray-500">
              Create and manage user information in Playdate
            </p>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleCreateUser}
          >
            + New User
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-md overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="p-4">Id</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Age</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Is Active</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.gender}</td>
                    <td className="p-4">{user.age}</td>
                    <td className="p-4">{user.phone}</td>
                    <td className="p-4">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </td>
                    <td className="p-2">
                      <div className='flex space-x-3'>
                        <FaEdit
                          className="text-blue-600 cursor-pointer"
                          onClick={() => handleEdit(user)}
                        />
                        <FaTrashAlt
                          className="text-red-600 cursor-pointer ml-2"
                          onClick={() => handleDelete(user.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* User Sidebar Form Component */}
        <UserSidebarForm
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSubmit={handleFormSubmit}
          editingUser={editingUser}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserManagement;
