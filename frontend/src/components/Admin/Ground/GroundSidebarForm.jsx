import React, { useState, useEffect, useRef } from 'react';
// import { createGround, updateGround } from '../../../api/service';

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
    game: '',
    ground_type: '',
    capacity: '',
    surface_type: '',
    availability_status: 'Available',
    locker_room: 'Available',
    wash_rooms: 'Available',
    lighting_night: 'Available',
    parking_facility: 'Available',
    parking_type: 'Digital', // New parking field
    last_maintenance_date: '',
    next_maintenance_date: '',
    maintenance_team_contact: '',
    maintenance_status: 'Scheduled',
    ground_image: null, // Placeholder for file upload
  });

  const formRef = useRef(null); // Reference to the form container

  useEffect(() => {
    if (editingGround) {
      setFormData({
        ground_name: editingGround.ground_name,
        location: editingGround.location,
        game: editingGround.game,
        ground_type: editingGround.ground_type,
        capacity: editingGround.capacity,
        surface_type: editingGround.surface_type,
        availability_status: editingGround.availability_status,
        locker_room: editingGround.locker_room,
        wash_rooms: editingGround.wash_rooms,
        lighting_night: editingGround.lighting_night,
        parking_facility: editingGround.parking_facility,
        parking_type: editingGround.parking_type,
        last_maintenance_date: editingGround.last_maintenance_date,
        next_maintenance_date: editingGround.next_maintenance_date,
        maintenance_team_contact: editingGround.maintenance_team_contact,
        maintenance_status: editingGround.maintenance_status,
        ground_image: null, // Placeholder for image upload
      });
    } else {
      setFormData({
        ground_name: '',
        location: '',
        game: '',
        ground_type: '',
        capacity: '',
        surface_type: '',
        availability_status: 'Available',
        locker_room: 'Available',
        wash_rooms: 'Available',
        lighting_night: 'Available',
        parking_facility: 'Available',
        parking_type: 'Digital',
        last_maintenance_date: '',
        next_maintenance_date: '',
        maintenance_team_contact: '',
        maintenance_status: 'Scheduled',
        ground_image: null,
      });
    }
  }, [editingGround]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, ground_image: e.target.files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData); // Submit form data

    if (editingGround) {
      const updatedGround = { ...editingGround, ...formData };
      delete updatedGround.ground_image; // Remove file from update if not necessary
    //   await updateGround(updatedGround);
    } else {
      console.log("formData", formData)
      await createGround(formData);
    }

    setFormData({
      ground_name: '',
      location: '',
      game: '',
      ground_type: '',
      capacity: '',
      surface_type: '',
      availability_status: 'Available',
      locker_room: 'Available',
      wash_rooms: 'Available',
      lighting_night: 'Available',
      parking_facility: 'Available',
      parking_type: 'Digital',
      last_maintenance_date: '',
      next_maintenance_date: '',
      maintenance_team_contact: '',
      maintenance_status: 'Scheduled',
      ground_image: null,
    });
  };

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
        ref={formRef} // Attach the ref to the form container
        className={`bg-white w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-1 p-4 bg-gray-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            {editingGround ? 'Edit Ground' : 'Create Ground'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-full">
          <form onSubmit={handleFormSubmit}>
            {/* Ground Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Ground Name
              </label>
              <input
                type="text"
                name="ground_name"
                value={formData.ground_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Ground Name"
                required
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Location"
                required
              />
            </div>

            {/* Game */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Select Game
              </label>
              <select
                name="game"
                value={formData.game}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose Game</option>
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Badminton">Badminton</option>
              </select>
            </div>

            {/* Ground Type */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Ground Type
              </label>
              <select
                name="ground_type"
                value={formData.ground_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Ground Type</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>

            {/* Capacity */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Ground Capacity"
              />
            </div>

            {/* Surface Type */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Surface Type
              </label>
              <select
                name="surface_type"
                value={formData.surface_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Surface Type</option>
                <option value="Grass">Grass</option>
                <option value="Synthetic">Synthetic</option>
              </select>
            </div>

            {/* Availability Status */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Availability Status
              </label>
              <select
                name="availability_status"
                value={formData.availability_status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Ground Image</label>
              <input
                type="file"
                name="ground_image"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            {/* Ground Facilities */}
            <div className="mb-4">
              <h4 className="text-gray-700 text-sm font-medium mb-2">Facilities</h4>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Locker Room</label>
                <select
                  name="locker_room"
                  value={formData.locker_room}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Wash Rooms</label>
                <select
                  name="wash_rooms"
                  value={formData.wash_rooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Lighting for Night Matches</label>
                <select
                  name="lighting_night"
                  value={formData.lighting_night}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Parking Facility</label>
                <select
                  name="parking_facility"
                  value={formData.parking_facility}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Parking Type</label>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, parking_type: 'Digital' })}
                    className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 ${
                      formData.parking_type === 'Digital' ? 'bg-black text-white' : 'bg-white text-gray-400'
                    }`}
                  >
                    Digital
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, parking_type: 'Manual' })}
                    className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 ${
                      formData.parking_type === 'Manual' ? 'bg-black text-white' : 'bg-white text-gray-400'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>
            </div>

            {/* Ground Maintenance Section */}
            <div className="mb-4">
              <h4 className="text-gray-700 text-sm font-medium mb-2">Ground Maintenance</h4>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Last Maintenance Date</label>
                <input
                  type="date"
                  name="last_maintenance_date"
                  value={formData.last_maintenance_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Next Maintenance Date</label>
                <input
                  type="date"
                  name="next_maintenance_date"
                  value={formData.next_maintenance_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Maintenance Team Contact</label>
                <input
                  type="text"
                  name="maintenance_team_contact"
                  value={formData.maintenance_team_contact}
                  onChange={handleInputChange}
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
                    className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 ${
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
                    className={`flex-1 py-1 px-2 text-center transition-colors duration-300 border border-gray-300 ${
                      formData.maintenance_status === 'Pending' ? 'bg-black text-white' : 'bg-white text-gray-400'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading} // Disable button while loading
                className={`${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'
                } text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200 mr-2`}
              >
                {loading ? 'Submitting...' : editingGround ? 'Update Ground' : 'Create Ground'}
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
});

export default GroundSidebarForm;
