import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Navbar from '../../Navbar';
import Footer from '../../footer';
import Sidebar from '../Sidebar'; // Import Sidebar component
import UserSidebarForm from './UserSidebarForm';
import Skeleton from 'react-loading-skeleton';
import { getUserId, deleteUser } from '../../../api/service';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For main sidebar
  const [isUserFormOpen, setIsUserFormOpen] = useState(false); // For user form sidebar
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [webSocketLoading, setWebSocketLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  let ws;

  // WebSocket connection setup
  useEffect(() => {
    setLoading(true);
    setWebSocketLoading(true);

    ws = new WebSocket('ws://69.197.176.103:8000/users');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setWebSocketLoading(false);
    };

    ws.onmessage = (event) => {
      setLoading(true);
      try {
        const message = JSON.parse(event.data);
        handleWebSocketAction(message);
      } catch (error) {
        console.error('Error parsing WebSocket data', error);
      } finally {
        setLoading(false);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWebSocketLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleWebSocketAction = (message) => {
    switch (message.action) {
      case 'initial':
        if (Array.isArray(message.data)) {
          const processedUsers = message.data.map(user => ({
            id: user.id,
            name: user.first_name || user.username,
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
        const newUser = {
          id: message.data.id,
          name: message.data.first_name || message.data.username,
          email: message.data.email || 'N/A',
          gender: message.data.gender || 'N/A',
          age: message.data.age || 'N/A',
          phone: message.data.phone || 'N/A',
          is_active: message.data.is_active
        };
        setUsers(prevUsers => [newUser, ...prevUsers]);
        setUserCount(prevCount => prevCount + 1);
        break;
      case 'update':
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
        setUsers(prevUsers => prevUsers.filter(user => user.id !== message.data.id));
        setUserCount(prevCount => prevCount - 1);
        break;
      default:
        console.error('Unknown WebSocket action:', message.action);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsUserFormOpen(true); // Open user form sidebar
  };

  const handleEdit = async (user) => {
    const data = await getUserId(user.id, user.username);
    setEditingUser(data.data);
    setIsUserFormOpen(true); // Open user form sidebar
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setErrorMessage('');

    try {
      if (editingUser) {
        const updatedUser = { ...editingUser, ...formData };
        ws.send(JSON.stringify({ action: 'update', data: updatedUser }));
      } else {
        const newUser = { ...formData, id: Date.now() };
        ws.send(JSON.stringify({ action: 'create', data: newUser }));
      }
    } catch (error) {
      setErrorMessage('Error submitting form, please try again.');
    } finally {
      setFormLoading(false);
      setIsUserFormOpen(false); // Close user form sidebar
    }
  };

  const confirmDelete = (id) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const handleDelete = async () => {
    setFormLoading(true);
    setErrorMessage('');
    
    try {
      await deleteUser(selectedUserId);
      ws.send(JSON.stringify({ action: 'delete', data: { id: selectedUserId } }));
    } catch (error) {
      setErrorMessage('Error deleting user, please try again.');
    } finally {
      setFormLoading(false);
      setIsDeleteModalOpen(false); // Close the delete modal
    }
  };

  // Toggle the sidebar between open and closed
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      {/* Navbar at the top, full-width */}
      {/* <Navbar /> */}

      {/* Sidebar and Content */}
      <div className="flex flex-grow">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Sidebar Component */}
        
        <div className={`flex-grow transition-all duration-300`}>
          <Navbar />
          <div className="p-4 md:p-8 flex-grow">
            <div className="bg-white p-4 mb-4 shadow-lg rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-neutral-800">User Management ({userCount})</h2>
                <p className="text-gray-600">Manage and organize user information efficiently.</p>
              </div>
              <button
                className="mt-4 md:mt-0 bg-sky-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-sky-600 transition"
                onClick={handleCreateUser}
                disabled={formLoading || loading}
              >
                + Add New User
              </button>
            </div>

            <div className="bg-white shadow-md rounded-md overflow-x-auto">
              {loading || webSocketLoading ? (
                <div className="p-6">
                  <Skeleton height={40} count={5} />
                </div>
              ) : (
                <table className="table-auto w-full text-left">
                  <thead className="bg-neutral-300 text-gray-700">
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
                                onClick={() => confirmDelete(user.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="p-4 text-center text-gray-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <UserSidebarForm
              isOpen={isUserFormOpen} // Control for the User form sidebar
              onClose={() => setIsUserFormOpen(false)}
              onSubmit={handleFormSubmit}
              editingUser={editingUser}
              loading={formLoading}
            />
          </div>
        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md shadow hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
