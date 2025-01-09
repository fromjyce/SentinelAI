"use client";
import { useState } from "react";
import Image from "next/image";
import { Server, CirclePlus } from "lucide-react";

const summaryData = [
  { title: "Total Devices", value: 5, bgColor: "bg-yellow-100" },
  { title: "Active Threats", value: 3, bgColor: "bg-blue-100" },
  { title: "Isolated Devices", value: 2, bgColor: "bg-[#fca5a5]" },
  { title: "System Health", value: "Good", bgColor: "bg-green-100" }
];

const activeNodes = [
  { id: 1, name: "Node 1", operatingTime: "14h", connectionQuality: "Excellent", temperature: "72°F", usageFrequency: "High", connectivityType: "Wi-Fi", priority: "High", location: "Living Room", status: "Healthy", nodeHealth: "Good" },
  { id: 2, name: "Node 2", operatingTime: "10h", connectionQuality: "Good", temperature: "70°F", usageFrequency: "Medium", connectivityType: "Ethernet", priority: "Medium", location: "Bedroom", status: "Stable", nodeHealth: "Good" },
  { id: 3, name: "Node 3", operatingTime: "18h", connectionQuality: "Fair", temperature: "74°F", usageFrequency: "Low", connectivityType: "Wi-Fi", priority: "Low", location: "Kitchen", status: "Stable", nodeHealth: "Fair" }
];

const isolatedNodes = [
  { id: 1, name: "Node 4", operatingTime: "8h", connectionQuality: "Poor", temperature: "68°F", usageFrequency: "Low", connectivityType: "Wi-Fi", priority: "Low", location: "Garage", status: "Isolated", nodeHealth: "Critical", ifpsStorageLink: "https://storage.link/4" },
  { id: 2, name: "Node 5", operatingTime: "5h", connectionQuality: "Fair", temperature: "71°F", usageFrequency: "Medium", connectivityType: "Ethernet", priority: "Medium", location: "Office", status: "Isolated", nodeHealth: "Fair", ifpsStorageLink: "https://storage.link/5" }
];

const imageData = "/images/default_image.png";

export default function HomeIOT() {
  const [activeNodeDetails, setActiveNodeDetails] = useState(null);
  const [isolatedNodeDetails, setIsolatedNodeDetails] = useState(null);

  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevice, setNewDevice] = useState({ deviceId: "", type: "", location: "" });

  const openActiveNodeDetailsModal = (node) => {
    setActiveNodeDetails(node);
  };

  const closeActiveNodeDetailsModal = () => {
    setActiveNodeDetails(null);
  };

  const openIsolatedNodeDetailsModal = (node) => {
    setIsolatedNodeDetails(node);
  };

  const closeIsolatedNodeDetailsModal = () => {
    setIsolatedNodeDetails(null);
  };

  const openAddDeviceModal = () => {
    setShowAddDeviceModal(true);
  };

  const closeAddDeviceModal = () => {
    setShowAddDeviceModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle adding the new device logic (e.g., send it to an API or add it to the state)
    console.log("New Device Added:", newDevice);
    closeAddDeviceModal(); // Close the modal after submission
  };

  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <h1 className="text-5xl font-bold mb-4 mt-2 urbanist text-[#dd0000]">Dashboard</h1>

      {/* Grid Layout for Uniform Width and Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
        {/* Left Half: Summary Section */}
        <div className="w-full h-[400px]">
          <h2 className="text-3xl font-semibold mb-4 play text-[#890408]">Network Summary</h2>

          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col justify-between h-full">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full poppins">
              {summaryData.map((item, index) => (
                <div
                  key={index}
                  className={`${item.bgColor} flex rounded-lg p-4 text-center justify-center items-center shadow-xl`}
                >
                  <div>
                    <p className="text-4xl font-bold mb-2">{item.value}</p>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Half: Image Section */}
        <div className="w-full h-[400px]">
          <h2 className="text-3xl font-semibold mb-4 play text-[#890408]">Simulated Network</h2>

          <div className="bg-white rounded-lg shadow-xl w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={imageData}
                alt="IoT System Overview"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left Side: Active Nodes */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold mb-4 play text-[#2b6cb0]">Active Nodes</h2>
            <div className="flex items-center space-x-2">
              <CirclePlus className="text-blue-500" size={24} onClick={openAddDeviceModal} />
              <span className="text-lg font-medium urbanist">Add a Device</span>
            </div>
          </div>
          <div className="space-y-4">
            {activeNodes.map((node) => (
              <div
                key={node.id}
                className="flex justify-between items-center bg-blue-50 p-4 rounded-lg shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <Server className="text-blue-500" size={24} />
                  <span className="font-medium text-lg urbanist">{node.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 poppins"
                    onClick={() => openActiveNodeDetailsModal(node)}
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-[#FB0000] text-white rounded-lg hover:bg-[#FF4D4D] poppins">
                    Isolate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Isolated Nodes */}
        <div className="p-6">
          <h2 className="text-3xl font-semibold mb-4 play text-[#e53e3e]">Isolated Nodes</h2>
          <div className="space-y-4">
            {isolatedNodes.map((node) => (
              <div
                key={node.id}
                className="flex justify-between items-center bg-red-50 p-4 rounded-lg shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <Server className="text-red-500" size={24} />
                  <span className="font-medium text-lg urbanist">{node.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 poppins"
                    onClick={() => openIsolatedNodeDetailsModal(node)}
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 poppins">
                    Recover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Adding a Device */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4 text-center space_grotesk">Add New Device</h3>
            <form onSubmit={handleSubmit} className="space-y-4 poppins">
              <div className="flex flex-col">
                <label htmlFor="deviceId" className="font-medium">Device ID</label>
                <input
                  type="text"
                  id="deviceId"
                  name="deviceId"
                  value={newDevice.deviceId}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="type" className="font-medium">Device Type</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={newDevice.type}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="location" className="font-medium">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newDevice.location}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={closeAddDeviceModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
