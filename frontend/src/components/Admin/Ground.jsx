import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing Edit and Delete icons
import Navbar from '../Navbar';
import Footer from '../footer';

const GroundManagement = () => {
  const [grounds, setGrounds] = useState([
    {
      name: 'YRTDS Sports Arena',
      id: 'PD00025487',
      location: 'Valasaravakkam',
      type: 'Synthetic',
      capacity: '10+',
      surface: 'Surface Type',
      status: true,
    },
    {
      name: 'RUDS Badminton Club',
      id: 'PD00025488',
      location: 'Anna Nagar',
      type: 'Synthetic',
      capacity: '4+',
      surface: 'Surface Type',
      status: true,
    },
    {
      name: 'OTPR Cricket Academy',
      id: 'PD00025489',
      location: 'Koyambedu',
      type: 'Mud, Synthetic',
      capacity: '10+',
      surface: 'Surface Type',
      status: true,
    },
    {
      name: 'Sample Ground',
      id: 'PD00025490',
      location: 'Location',
      type: 'Ground Type',
      capacity: 'Capacity',
      surface: 'Surface Type',
      status: false,
    },
  ]);

  const toggleStatus = (index) => {
    setGrounds((prevGrounds) =>
      prevGrounds.map((ground, i) =>
        i === index ? { ...ground, status: !ground.status } : ground
      )
    );
  };

  const handleEdit = (id) => {
    // Handle Edit logic here
    alert(`Edit ground with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Handle Delete logic here
    alert(`Delete ground with ID: ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="p-8 bg-gray-100 flex-grow">
        {/* Header */}
        <div className="bg-white p-4 mb-4 shadow-md rounded-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Ground details (434)</h2>
            <p className="text-gray-500">Create and manage ground information in Playdate</p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            + New Ground
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-md overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="p-4">Ground Name</th>
                <th className="p-4">Ground ID</th>
                <th className="p-4">Location</th>
                <th className="p-4">Ground Type</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Surface Type</th>
                <th className="p-4">Availability Status</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th> {/* New Actions Column */}
              </tr>
            </thead>
            <tbody>
              {grounds.map((ground, index) => (
                <tr key={ground.id} className="border-b">
                  <td className="p-4">{ground.name}</td>
                  <td className="p-4">{ground.id}</td>
                  <td className="p-4">{ground.location}</td>
                  <td className="p-4">{ground.type}</td>
                  <td className="p-4">{ground.capacity}</td>
                  <td className="p-4">{ground.surface}</td>
                  <td className="p-4">Availability Status</td>
                  <td className="p-4">
                    {/* Custom Toggle Switch */}
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
                    {/* Edit and Delete Icons */}
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GroundManagement;
