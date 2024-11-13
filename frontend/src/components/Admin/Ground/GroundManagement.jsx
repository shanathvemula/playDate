import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import Navbar from '../Navbar';
import Footer from '../../footer';
import Sidebar from '../Sidebar';
import GroundSidebarForm from './GroundSidebarForm'; 
import Skeleton from 'react-loading-skeleton';
import { GroundDelete } from '../../../api/service';

const GroundManagement = () => {
  const [grounds, setGrounds] = useState([]);
  const [groundCount, setGroundCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isGroundFormOpen, setIsGroundFormOpen] = useState(false); 
  const [editingGround, setEditingGround] = useState(null);
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

    const ws = new WebSocket('ws://157.173.195.249:8000/grounds'); 

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

  const handleDelete = async (id) => {
    await GroundDelete(id);
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

  const openCreateGroundForm = () => {
    setEditingGround(null); 
    setIsGroundFormOpen(true); 
  };

  const getCombinedGames = (arena) => {
    return arena.map(a => a.game).join(', '); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      {/* Main content area */}
      <div className="flex flex-grow">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-grow transition-all duration-300 flex flex-col">
          <Navbar  className='mt-auto'/>
          <div className="p-4 md:p-8 flex-grow">
            <div className="bg-white p-4 mb-4 shadow-md rounded-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Ground details ({groundCount})</h2>
                <p className="text-gray-500">Create and manage ground information in Playdate</p>
              </div>
              <button
                className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-500"
                onClick={openCreateGroundForm}
              >
                + Add New Ground
              </button>
            </div>

            {/* Table for larger screens with horizontal scroll */}
            <div className="bg-white shadow-md rounded-md overflow-x-auto hidden sm:block">
              {loading || webSocketLoading ? (
                <div className="p-6">
                  <Skeleton height={40} count={5} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left min-w-full">
                    <thead className="bg-gray-200 text-gray-600">
                      <tr>
                        <th className="p-4">Ground ID</th>
                        <th className="p-4">Ground Name</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Games</th> 
                        <th className="p-4">Maintenance Status</th>
                        <th className="p-4">Maintenance Contact</th>
                        <th className="p-4">Parking Facility</th>
                        <th className="p-4">Wash Rooms</th>
                        <th className="p-4">Locker Room</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grounds.map((ground, index) => (
                        <tr key={ground.id} className="border-b">
                          <td className="p-4">{ground.id}</td>
                          <td className="p-4">{ground.ground_name}</td>
                          <td className="p-4">{ground.location}</td>
                          <td className="p-4">{getCombinedGames(ground.Arena)}</td>
                          <td className="p-4">{ground.maintenance_status}</td>
                          <td className="p-4">{ground.maintenance_team_contact}</td>
                          <td className="p-4">{ground.parking_facility ? "Available" : "Not Available" }</td>                     
                          <td className="p-4">{ground.wash_rooms ? "Available" : "Not Available"}</td>
                          <td className="p-4">{ground.locker_room ? "Available" : "Not Available"}</td>
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
                </div>
              )}
            </div>

            {/* Cards for small screens */}
            <div className="block sm:hidden">
              {loading || webSocketLoading ? (
                <div className="p-6">
                  <Skeleton height={40} count={5} />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {grounds.length > 0 ? (
                    grounds.map(ground => (
                      <div key={ground.id} className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition">
                        <h3 className="text-lg font-semibold text-neutral-800">{ground.id}</h3>
                        <p className="text-gray-600">Ground Name: {ground.ground_name}</p>
                        <p className="text-gray-600">Location: {ground.location}</p>
                        <p className="text-gray-600">Games: {getCombinedGames(ground.Arena)}</p>
                        <p className="text-gray-600">Maintenance Status: {ground.maintenance_status}</p>
                        <p className="text-gray-600">Maintenance Contact: {ground.maintenance_team_contact}</p>
                        <p className="text-gray-600">Parking Facility: {ground.parking_facility ? "Available" : "Not Available"}</p>
                        <p className="text-gray-600">Wash Rooms: {ground.wash_rooms ? "Available" : "Not Available"}</p>
                        <p className="text-gray-600">Locker Room: {ground.locker_room ? "Available" : "Not Available"}</p>
                        <div className="flex justify-end items-center mt-4">
                          <div className="flex space-x-4">
                            <FaEdit
                              className="text-blue-600 cursor-pointer hover:text-sky-600"
                              onClick={() => handleEdit(ground.id)}
                            />
                            <FaTrashAlt
                              className="text-red-600 cursor-pointer hover:text-red-700"
                              onClick={() => handleDelete(ground.id)}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No grounds found.</p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>

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
