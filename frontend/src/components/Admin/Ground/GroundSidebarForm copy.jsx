import React, { useState, useEffect, useRef } from 'react';
import { MdFileUpload, MdOutlineClose } from "react-icons/md";
import { GroundSidebarCreate } from '../../../api/service';

const GroundSidebarForm = React.memo(({
  isOpen,
  onClose,
  onSubmit,
  editingGround,
  loading
}) => {
  const [formData, setFormData] = useState({
    ground_name: '',
    location: '',
    arenas: [{
      game: '',
      ground_type: '',
      capacity: '',
      surface_type: '',
      availability_status: 'Available',
      ground_images: [],
    }],
    locker_rooms: 'Available',
    washrooms: 'Available',
    lighting: 'Available',
    parking: 'Available',
    scoreboard_type: 'Digital',
    last_maintenance_date: '',
    next_maintenance_date: '',
    maintenance_team_contact: '',
    maintenance_status: 'Scheduled',
    created_by:JSON.parse(localStorage.getItem("user")).data.id
  });

  const [arenaVisibility, setArenaVisibility] = useState([true]);

  const formRef = useRef(null);

  useEffect(() => {
    if (editingGround) {
      setFormData({
        ground_name: editingGround.ground_name,
        location: editingGround.location,
        arenas: editingGround.arenas || [{
          game: '',
          ground_type: '',
          capacity: '',
          surface_type: '',
          availability_status: 'Available',
          ground_images: [],
        }],
        locker_rooms: editingGround.locker_rooms,
        washrooms: editingGround.washrooms,
        lighting: editingGround.lighting,
        parking: editingGround.parking,
        scoreboard_type: editingGround.scoreboard_type || 'Digital',
        last_maintenance_date: editingGround.last_maintenance_date,
        next_maintenance_date: editingGround.next_maintenance_date,
        maintenance_team_contact: editingGround.maintenance_team_contact,
        maintenance_status: editingGround.maintenance_status,
        created_by:JSON.parse(localStorage.getItem("user")).data.id
      });
      setArenaVisibility(editingGround.arenas ? editingGround.arenas.map(() => false) : [true]);
    } else {
      setFormData({
        ground_name: '',
        location: '',
        arenas: [{
          game: '',
          ground_type: '',
          capacity: '',
          surface_type: '',
          availability_status: 'Available',
          ground_images: [],
        }],
        locker_rooms: 'Available',
        washrooms: 'Available',
        lighting: 'Available',
        parking: 'Available',
        scoreboard_type: 'Digital',
        last_maintenance_date: '',
        next_maintenance_date: '',
        maintenance_team_contact: '',
        maintenance_status: 'Scheduled',
        created_by:JSON.parse(localStorage.getItem("user")).data.id
      });
      setArenaVisibility([true]);
    }
  }, [editingGround]);

  const handleInputChange = (index, e) => {
    const newArenas = [...formData.arenas];
    newArenas[index][e.target.name] = e.target.value;
    setFormData({ ...formData, arenas: newArenas });
  };

  const handleGeneralInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Updated handleFileChange to append new images instead of replacing existing ones
  const handleFileChange = (index, e) => {
    const newArenas = [...formData.arenas];
    newArenas[index].ground_images = [
      ...newArenas[index].ground_images, 
      ...Array.from(e.target.files)
    ];
    setFormData({ ...formData, arenas: newArenas });
  };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     // Create a new arenas array with additional data for each arena
//     const updatedArenas = formData.arenas.map((arena) => ({
//         ...arena,
//         locker_rooms: formData.locker_rooms,
//         washrooms: formData.washrooms,
//         lighting: formData.lighting,
//         parking: formData.parking,
//         scoreboard_type: formData.scoreboard_type,
//         last_maintenance_date: formData.last_maintenance_date,
//         next_maintenance_date: formData.next_maintenance_date,
//         maintenance_team_contact: formData.maintenance_team_contact,
//         maintenance_status: formData.maintenance_status,
//     }));

//     // Update the formData with the new arenas array
//     const finalFormData = {
//         updatedArenas,
//     };

//     // Pass the finalFormData to the API
//     console.log("finalFormData", finalFormData); // To check the final data structure
//     await GroundSidebarCreate(finalFormData);

//     onSubmit(finalFormData);
// };

  // Helper function to convert image file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Convert all images to Base64 before submission
    const updatedArenas = await Promise.all(
      formData.arenas.map(async (arena) => {
        const base64Images = await Promise.all(
          arena.ground_images.map(async (file) => {
            const base64 = await fileToBase64(file); // Convert each file to Base64
            return {
              name: file.name, // Add image name
              base64: base64  // Add Base64 string
            };
          })
        );
  
        return {
          ...arena,
          ground_images: base64Images  // Replace file objects with objects containing name and Base64
        };
      })
    );
  
    // Prepare the final form data with Base64-encoded images and image names
    const finalFormData = { ...formData, arenas: updatedArenas };
  
    onSubmit(finalFormData);
    console.log("finalFormData", finalFormData); // To check the final data structure
    // Uncomment the next line to actually send the data via API
    // await GroundSidebarCreate(finalFormData);
  };
  

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   onSubmit(formData);
  //   console.log("formData", formData);
  //   // await GroundSidebarCreate(formData);
  // };


  const handleRemoveImage = (arenaIndex, imageIndex) => {
    const newArenas = [...formData.arenas];
    newArenas[arenaIndex].ground_images.splice(imageIndex, 1); // Remove the image at the specified index
    setFormData({ ...formData, arenas: newArenas }); // Update the form data
  };

  const addArenaForm = () => {
    setFormData({
      ...formData,
      arenas: [...formData.arenas, {
        game: '',
        ground_type: '',
        capacity: '',
        surface_type: '',
        availability_status: 'Available',
        ground_images: [],
      }],
    });
    setArenaVisibility([...arenaVisibility.map(() => false), true]);
  };

  const toggleArenaVisibility = (index) => {
    const newVisibility = [...arenaVisibility];
    newVisibility[index] = !newVisibility[index];
    setArenaVisibility(newVisibility);
  };

  const removeArenaForm = (index) => {
    const newArenas = [...formData.arenas];
    newArenas.splice(index, 1);
    const newVisibility = [...arenaVisibility];
    newVisibility.splice(index, 1);
    setFormData({ ...formData, arenas: newArenas });
    setArenaVisibility(newVisibility);
  };

  const toggleFacility = (facility) => {
    setFormData({
      ...formData,
      [facility]: formData[facility] === 'Available' ? 'Not Available' : 'Available',
    });
  };

  const toggleScoreboardType = () => {
    setFormData({
      ...formData,
      scoreboard_type: formData.scoreboard_type === 'Digital' ? 'Manual' : 'Digital',
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
            {editingGround ? 'Edit Ground' : 'Create Ground'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <MdOutlineClose size={24}/>
          </button>
        </div>

        {/* Scrollable form section */}
        <div className="p-6 overflow-y-auto max-h-full">
          <form onSubmit={handleFormSubmit}>
            {/* Ground name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Ground Name</label>
              <input
                type="text"
                name="ground_name"
                value={formData.ground_name}
                onChange={handleGeneralInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm"
                placeholder="Enter Ground Name"
                required
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleGeneralInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm"
                placeholder="Enter Location"
                required
              />
            </div>

            {/* Arena Information */}
            {formData.arenas.map((arena, index) => (
              <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50 shadow-sm">
                <h4
                  className="font-semibold text-gray-600 mb-2 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleArenaVisibility(index)}
                >
                  <span>Arena Information {index + 1}</span>
                  <span>{arenaVisibility[index] ? '▲' : '▼'}</span>
                </h4>
                {arenaVisibility[index] && (
                  <>
                    {/* Game */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Game</label>
                      <input
                        name="game"
                        value={arena.game || formData.game}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder='Enter Game Ex. cricket, Football'
                      />
                    </div>

                    {/* Ground Type */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Ground Type</label>
                      <select
                        name="ground_type"
                        value={arena.ground_type}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Ground Type</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                      </select>
                    </div>

                    {/* Capacity */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        value={arena.capacity}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm"
                        placeholder="Enter Ground Capacity"
                        min={2}
                      />
                    </div>

                    {/* Surface Type */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Surface Type</label>
                      <input
                        name="surface_type"
                        value={arena.surface_type}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder='Enter Surface Type'
                      />
                    </div>

                    {/* Ground Images */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Ground Images</label>
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        name="ground_images"
                        multiple
                        onChange={(e) => handleFileChange(index, e)}
                        className="hidden"
                        id={`ground-images-upload-${index}`}  // Unique ID for each arena
                      />

                      {/* File Upload Button */}
                      <button
                        type="button"
                        onClick={() => document.getElementById(`ground-images-upload-${index}`).click()}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
                      >
                        <div className='flex items-center space-x-2'><MdFileUpload /> <p className='text-white'>Upload Images</p></div>
                      </button>
                      <ul className="mt-2 space-y-1">
                        {arena.ground_images.map((image, imageIndex) => (
                          <li key={imageIndex} className="flex items-center justify-between object-cover border-2 border-gray-300 rounded-md px-4 py">
                            <span>{image.name}</span>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 text-sm"
                              onClick={() => handleRemoveImage(index, imageIndex)}
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Remove Arena Button */}
                    {formData.arenas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArenaForm(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
                      >
                        Remove Arena
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addArenaForm}
              className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-500 mb-4 transition-all"
            >
              + Add More Arena
            </button>

            {/* Ground Facilities */}
            <h4 className="font-semibold text-gray-600 mb-2">Ground Facilities</h4>

            {/* Locker Room */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="block text-gray-700 text-sm font-medium mb-2 rounded">Locker Room(s)</h4>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => toggleFacility('locker_rooms')}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-l-lg ${
                    formData.locker_rooms === 'Available' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => toggleFacility('locker_rooms')}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-r-lg ${
                    formData.locker_rooms === 'Not Available' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Not Available
                </button>
              </div>
            </div>

            {/* Wash Rooms */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="block text-gray-700 text-sm font-medium mb-2">Wash Room(s)</h4>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => toggleFacility('washrooms')}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-l-lg ${
                    formData.washrooms === 'Available' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => toggleFacility('washrooms')}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-r-lg ${
                    formData.washrooms === 'Not Available' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Not Available
                </button>
              </div>
            </div>

            {/* Lighting for Night Matches */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="block text-gray-700 text-sm font-medium mb-2">Lighting for Night Matches</h4>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => toggleFacility('lighting')}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-l-lg ${
                    formData.lighting === 'Available' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => toggleFacility('lighting')}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-r-lg ${
                    formData.lighting === 'Not Available' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Not Available
                </button>
              </div>
            </div>

            {/* Parking Facility */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="block text-gray-700 text-sm font-medium mb-2">Parking Facility</h4>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => toggleFacility('parking')}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-l-lg ${
                    formData.parking === 'Available' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => toggleFacility('parking')}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-r-lg ${
                    formData.parking === 'Not Available' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Not Available
                </button>
              </div>
            </div>

            {/* Scoreboard Type */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="block text-gray-700 text-sm font-medium mb-2">Scoreboard Type</h4>
              <div className="flex">
                <button
                  type="button"
                  onClick={toggleScoreboardType} // Toggle function for scoreboard type
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-l-lg ${
                    formData.scoreboard_type === 'Digital' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Digital
                </button>
                <button
                  type="button"
                  onClick={toggleScoreboardType} // Toggle function for scoreboard type
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-r-lg ${
                    formData.scoreboard_type === 'Manual' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Ground Maintenance */}
            <h4 className="font-semibold text-gray-600 mb-2">Ground Maintenance</h4>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium">Last Maintenance Date</label>
              <input
                type="date"
                name="last_maintenance_date"
                value={formData.last_maintenance_date}
                onChange={handleGeneralInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 transition-shadow shadow-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium">Next Maintenance Date</label>
              <input
                type="date"
                name="next_maintenance_date"
                value={formData.next_maintenance_date}
                onChange={handleGeneralInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 transition-shadow shadow-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium">Maintenance Team Contact</label>
              <input
                type="text"
                name="maintenance_team_contact"
                value={formData.maintenance_team_contact}
                onChange={handleGeneralInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter Maintenance Team Contact"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium">Maintenance Status</label>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, maintenance_status: 'Scheduled' })}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-l-lg ${
                    formData.maintenance_status === 'Scheduled' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Scheduled
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, maintenance_status: 'Completed' })}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 ${
                    formData.maintenance_status === 'Completed' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Completed
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, maintenance_status: 'Pending' })}
                  className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 rounded-r-lg ${
                    formData.maintenance_status === 'Pending' ? 'bg-black text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-200 flex-shrink-0 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'
              } text-white px-4 py-2 rounded-md mr-2`}
              onClick={handleFormSubmit}
            >
              {loading ? 'Submitting...' : editingGround ? 'Update Ground' : 'Create Ground'}
            </button>
        </div>
      </div>
    </div>
  );
});

export default GroundSidebarForm;
