import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import Navbar from '../../Navbar';
import Footer from '../../footer';
import Sidebar from '../Sidebar';
import GroundSidebarForm from './GroundSidebarForm'; // Import GroundSidebarForm
import Skeleton from 'react-loading-skeleton';

const GroundManagement = () => {
  const [grounds, setGrounds] = useState([]);
  const [groundCount, setGroundCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isGroundFormOpen, setIsGroundFormOpen] = useState(false); // State to open/close form
  const [editingGround, setEditingGround] = useState(null); // State for editing ground
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [webSocketLoading, setWebSocketLoading] = useState(true);
  const wsRef = useRef(null); 

  const toggleStatus = useCallback(
    (index) => {
      const updatedGrounds = grounds.map((ground, i) =>
        i === index ? { ...ground, status: !ground.status } : ground
      );
      setGrounds(updatedGrounds);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            action: 'update',
            data: updatedGrounds[index],
          })
        );
      }
    },
    [grounds]
  );

  useEffect(() => {
    setLoading(true);
    setWebSocketLoading(true);

    wsRef.current = new WebSocket('ws://127.0.0.1:8000/grounds');

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket server');
      setWebSocketLoading(false);
    };

    wsRef.current.onmessage = (event) => {
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

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWebSocketLoading(false);
    };

    return () => {
      wsRef.current.close();
    };
  }, []);

  const handleWebSocketAction = useCallback(
    (message) => {
      switch (message.action) {
        case 'initial':
          if (Array.isArray(message.data)) {
            setGrounds(message.data);
            setGroundCount(message.data.length);
          }
          break;
        case 'create':
          setGrounds((prevGrounds) => [message.data, ...prevGrounds]);
          setGroundCount((prevCount) => prevCount + 1);
          break;
        case 'update':
          setGrounds((prevGrounds) =>
            prevGrounds.map((ground) =>
              ground.id === message.data.id ? message.data : ground
            )
          );
          break;
        case 'delete':
          setGrounds((prevGrounds) =>
            prevGrounds.filter((ground) => ground.id !== message.data.id)
          );
          setGroundCount((prevCount) => prevCount - 1);
          break;
        default:
          console.error(`Unknown action: ${message.action}`);
      }
    },
    []
  );

  const handleEdit = (id) => {
    const groundToEdit = grounds.find((ground) => ground.id === id);
    if (groundToEdit) {
      setEditingGround(groundToEdit);
      setIsGroundFormOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: 'delete',
          data: { id },
        })
      );
    }
  };

  const handleFormSubmit = (formData) => {
    setFormLoading(true);
    try {
      if (editingGround) {
        const updatedGround = { ...editingGround, ...formData };
        wsRef.current.send(JSON.stringify({ action: 'update', data: updatedGround }));
      } else {
        const newGround = { ...formData, id: Date.now() };
        wsRef.current.send(JSON.stringify({ action: 'create', data: newGround }));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setFormLoading(false);
      setIsGroundFormOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      <div className="flex flex-grow">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-grow transition-all duration-300`}>
          <Navbar />
          <div className="p-4 md:p-8 flex-grow">
            <div className="bg-white p-4 mb-4 shadow-md rounded-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Ground details ({groundCount})</h2>
                <p className="text-gray-500">Create and manage ground information in Playdate</p>
              </div>
              <button
                className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-500"
                onClick={() => setIsGroundFormOpen(true)}
              >
                + New Ground
              </button>
            </div>

            <div className="bg-white shadow-md rounded-md overflow-x-auto">
              {loading || webSocketLoading ? (
                <div className="p-6">
                  <Skeleton height={40} count={5} />
                </div>
              ) : (
                <table className="table-auto w-full text-left">
                  <thead className="bg-gray-200 text-gray-600">
                    <tr>
                      <th className="p-4">Ground ID</th>
                      <th className="p-4">Ground Name</th>
                      <th className="p-4">Game</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Capacity</th>
                      <th className="p-4">Surface Type</th>
                      <th className="p-4">Availability Status</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grounds.map((ground, index) => (
                      <tr key={ground.id} className="border-b">
                        <td className="p-4">{ground.id}</td>
                        <td className="p-4">{ground.ground_name}</td>
                        <td className="p-4">{ground.game}</td>
                        <td className="p-4">{ground.location}</td>
                        <td className="p-4">{ground.capacity}</td>
                        <td className="p-4">{ground.surface_type}</td>
                        <td className="p-4">Availability Status</td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div
                              onClick={() => toggleStatus(index)}
                              className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in ${
                                ground.status ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in ${
                                  ground.status ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </div>
                            <span className="ml-2">{ground.status ? 'Active' : 'Disabled'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <FaEdit
                              className="text-blue-600 cursor-pointer"
                              onClick={() => handleEdit(ground.id)}
                            />
                            <FaTrashAlt
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleDelete(ground.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Ground Form Sidebar */}
      <GroundSidebarForm
        isOpen={isGroundFormOpen}
        onClose={() => setIsGroundFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingGround={editingGround}
        loading={formLoading}
      />
    </div>
  );
};

export default GroundManagement;
