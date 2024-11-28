import React from "react";
import { GroundNewPOST } from "../../api/service";

const NewGroundForm = ({ newGroundDetails, handleInputChange, handleSaveNewGround, handleCancel }) => {


    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Add New Ground</h2>
            <div className="space-y-4">
                <input
                    name="ground_name"
                    value={newGroundDetails.ground_name}
                    onChange={handleInputChange}
                    placeholder="Ground Name"
                    className="w-full p-2 border rounded"
                />
                <input
                    name="name"
                    value={newGroundDetails.name}
                    onChange={handleInputChange}
                    placeholder="Venue Name"
                    className="w-full p-2 border rounded"
                />
                <textarea
                    name="description"
                    value={newGroundDetails.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                />
                <input
                    name="address"
                    value={newGroundDetails.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full p-2 border rounded"
                />
                <input
                    name="venue"
                    value={newGroundDetails.venue}
                    onChange={handleInputChange}
                    placeholder="Venue"
                    className="w-full p-2 border rounded"
                />
                <input
                    name="type"
                    value={newGroundDetails.type}
                    onChange={handleInputChange}
                    placeholder="Ground Type (e.g., Grass)"
                    className="w-full p-2 border rounded"
                /><br />
                <label>Capacity</label>
                <input
                    type="number"
                    name="capacity"
                    value={newGroundDetails.capacity}
                    onChange={handleInputChange}
                    placeholder="Capacity"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="tel"
                    name="contact_number"
                    value={newGroundDetails.contact_number}
                    onChange={handleInputChange}
                    placeholder="Contact Number"
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="flex justify-end gap-4 mt-4">
                <button onClick={handleSaveNewGround} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md">
                    Save
                </button>
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-400 text-white rounded shadow-md">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NewGroundForm;
