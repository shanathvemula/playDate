import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const NewGroundForm = ({
    newGroundDetails,
    handleInputChange,
    handleSaveNewGround,
    handleCancel,
}) => {
    const [position, setPosition] = useState([12.9716, 77.5946]); // Default to Bangalore, India
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLoadingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const { latitude, longitude } = location.coords;
                    setPosition([latitude, longitude]);
                    fetchAddress(latitude, longitude);
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.error("Error fetching location:", error.message);
                    setIsLoadingLocation(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            const address = data.display_name || "Unknown Location";
            handleInputChange({
                target: { name: "address", value: address },
            });
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                fetchAddress(lat, lng);
            },
        });

        useEffect(() => {
            map.setView(position, map.getZoom());
        }, [position, map]);

        return (
            <Marker
                position={position}
                icon={L.icon({
                    iconUrl:
                        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                })}
            />
        );
    };

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
                <div className="flex gap-2">
                    <input
                        name="address"
                        value={newGroundDetails.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="button"
                        onClick={fetchCurrentLocation}
                        disabled={isLoadingLocation}
                        className={`px-4 py-2 ${
                            isLoadingLocation ? "bg-gray-400" : "bg-blue-600"
                        } text-white rounded shadow-md`}
                    >
                        {isLoadingLocation ? "Loading..." : "Use Current Location"}
                    </button>
                </div>
                <div className="w-full h-64 border rounded">
                    <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker />
                    </MapContainer>
                </div>
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
                />
                <br />
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
                {/* <input
                    name="location"
                    value={newGroundDetails.location}
                    onChange={handleInputChange}
                    placeholder="Location (e.g., City, State)"
                    className="w-full p-2 border rounded"
                /> */}
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
