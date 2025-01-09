"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Server, CirclePlus, CircleCheckBig, UserCog, Trophy, ChartLine } from "lucide-react";

const summaryData = [
  { title: "Total Devices", value: 5, bgColor: "bg-yellow-100" },
  { title: "Active Threats", value: 3, bgColor: "bg-blue-100" },
  { title: "Isolated Devices", value: 2, bgColor: "bg-[#fca5a5]" },
  { title: "System Health", value: "Good", bgColor: "bg-green-100" }
];

const activeNodes = [
  { 
    id: 1, 
    name: "Node 1", 
    operatingTime: "14h", 
    connectionQuality: "Excellent", 
    temperature: "72°F", 
    usageFrequency: "High", 
    connectivityType: "Wi-Fi", 
    priority: "High", 
    location: "Living Room", 
    status: "Healthy", 
    nodeHealth: "Good" 
  },
  { 
    id: 2, 
    name: "Node 2", 
    operatingTime: "10h", 
    connectionQuality: "Good", 
    temperature: "70°F", 
    usageFrequency: "Medium", 
    connectivityType: "Ethernet", 
    priority: "Medium", 
    location: "Bedroom", 
    status: "Stable", 
    nodeHealth: "Good" 
  },
  { 
    id: 3, 
    name: "Node 3", 
    operatingTime: "18h", 
    connectionQuality: "Fair", 
    temperature: "74°F", 
    usageFrequency: "Low", 
    connectivityType: "Wi-Fi", 
    priority: "Low", 
    location: "Kitchen", 
    status: "Stable", 
    nodeHealth: "Fair" 
  }
];

const isolatedNodes = [
  { 
    id: 1, 
    name: "Node 4", 
    operatingTime: "8h", 
    connectionQuality: "Poor", 
    temperature: "68°F", 
    usageFrequency: "Low", 
    connectivityType: "Wi-Fi", 
    priority: "Low", 
    location: "Garage", 
    status: "Isolated", 
    nodeHealth: "Critical",
    ifpsStorageLink: "https://storage.link/4"
  },
  { 
    id: 2, 
    name: "Node 5", 
    operatingTime: "5h", 
    connectionQuality: "Fair", 
    temperature: "71°F", 
    usageFrequency: "Medium", 
    connectivityType: "Ethernet", 
    priority: "Medium", 
    location: "Office", 
    status: "Isolated", 
    nodeHealth: "Fair",
    ifpsStorageLink: "https://storage.link/5"
  }
];

const imageData = "/images/default_image.png";

export default function HomeIOT() {
  const [threats, setThreats] = useState([
  { type: 'DDoS Attack', affectedNodes: 2, riskLevel: 'High', mitigation: 'Node Isolation' },
  { type: 'Phishing Attack', affectedNodes: 1, riskLevel: 'Medium', mitigation: 'User Education & Block' },
  { type: 'Malware Infection', affectedNodes: 1, riskLevel: 'High', mitigation: 'Antivirus Scan & Patch' },
  { type: 'Brute Force Attempt', affectedNodes: 1, riskLevel: 'Low', mitigation: 'Password Strengthening' },
]);

const [insights, setInsights] = useState([
  { title: 'Global Insight', description: 'Recent federated learning has helped detect a new type of malware with a 20% higher accuracy.' },
  { title: 'Model Efficiency', description: 'Collaborative insights have improved the model’s prediction accuracy from 85% to 92% in identifying DDoS attacks.' },
  { title: 'Shared Knowledge', description: 'A shared node identified multiple brute-force attempts, leading to faster global model updates.' },
]);

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
    console.log("New Device Added:", newDevice);
    closeAddDeviceModal(); // Close the modal after submission
  };
  const [step, setStep] = useState(0); // Initialize step state


  const [globalModelStatus, setGlobalModelStatus] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [nodeContributions, setNodeContributions] = useState(null);
  const [modelPerformance, setModelPerformance] = useState(null);
  

  // Simulate fetching fake data
  useEffect(() => {
    const fetchData = () => {
      setGlobalModelStatus("Up to Date");
      setLearningProgress(`${(Math.random() * 100).toFixed(2)}%`);
      setNodeContributions(Math.floor(Math.random() * 100 + 1)); // Random 1-100 nodes
      setModelPerformance({
        accuracy: `${(Math.random() * (100 - 80) + 80).toFixed(2)}%`, // 80-100%
        detectionRate: `${(Math.random() * (100 - 70) + 70).toFixed(2)}%`, // 70-100%
        improvement: `${(Math.random() * (20 - 5) + 5).toFixed(2)}%`, // 5-20%
      });
    };

    fetchData();

    // Refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <h1 className="text-5xl font-bold mb-4 mt-2 urbanist text-[#dd0000]">Home - Dashboard</h1>

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
                    <h3 className="text-xl font-semibold">{item.title}</h3>
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
            <h2 className="text-3xl font-semibold mb-1 play text-[#2b6cb0]">Active Nodes</h2>
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

      {activeNodeDetails && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4 text-center space_grotesk">{activeNodeDetails.name} Details</h3>
            <div className="space-y-2 poppins">
              <p><strong>Operating Time:</strong> {activeNodeDetails.operatingTime}</p>
              <p><strong>Connection Quality:</strong> {activeNodeDetails.connectionQuality}</p>
              <p><strong>Temperature:</strong> {activeNodeDetails.temperature}</p>
              <p><strong>Usage Frequency:</strong> {activeNodeDetails.usageFrequency}</p>
              <p><strong>Connectivity Type:</strong> {activeNodeDetails.connectivityType}</p>
              <p><strong>Priority:</strong> {activeNodeDetails.priority}</p>
              <p><strong>Location:</strong> {activeNodeDetails.location}</p>
              <p><strong>Status:</strong> {activeNodeDetails.status}</p>
              <p><strong>Node Health:</strong> {activeNodeDetails.nodeHealth}</p>
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 poppins"
                onClick={closeActiveNodeDetailsModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{isolatedNodeDetails && (
  <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
      <h3 className="text-2xl font-semibold mb-4 text-center space_grotesk">{isolatedNodeDetails.name} Details</h3>
      <div className="space-y-2 poppins">
        <p><strong>Operating Time:</strong> {isolatedNodeDetails.operatingTime}</p>
        <p><strong>Connection Quality:</strong> {isolatedNodeDetails.connectionQuality}</p>
        <p><strong>Temperature:</strong> {isolatedNodeDetails.temperature}</p>
        <p><strong>Usage Frequency:</strong> {isolatedNodeDetails.usageFrequency}</p>
        <p><strong>Connectivity Type:</strong> {isolatedNodeDetails.connectivityType}</p>
        <p><strong>Priority:</strong> {isolatedNodeDetails.priority}</p>
        <p><strong>Location:</strong> {isolatedNodeDetails.location}</p>
        <p><strong>Status:</strong> {isolatedNodeDetails.status}</p>
        <p><strong>Node Health:</strong> {isolatedNodeDetails.nodeHealth}</p>
        <p><strong>IFPS Storage Link:</strong> <a href={isolatedNodeDetails.ifpsStorageLink} className="text-blue-500" target="_blank" rel="noopener noreferrer">{isolatedNodeDetails.ifpsStorageLink}</a></p>
      </div>
      <div className="mt-4 text-right">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 poppins"
          onClick={closeIsolatedNodeDetailsModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 p-6">
      <h2 className="text-3xl font-semibold mb-4 play text-[#e53e3e]">Threat Analysis</h2>
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {threats.map((threat, index) => (
            <div key={index} className="bg-[#f4f4f4] p-4 rounded-lg shadow-lg poppins">
              <h4 className="text-lg font-semibold mb-2">{threat.type}</h4>
              <p><strong>Affected Nodes:</strong> {threat.affectedNodes}</p>
              <p><strong>Risk Level:</strong> {threat.riskLevel}</p>
              <p><strong>Mitigation:</strong> {threat.mitigation}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        {/* Add a graph visualization here */}
        <div className="h-32 bg-gray-300">[Graph Placeholder]</div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 poppins text-[#890408]">Collaborative Threat Insights</h3>
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold mb-2 poppins">{insight.title}</h4>
              <p className="urbanist">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="col-span-1 p-6">
      <h2 className="text-3xl font-semibold mb-4 play text-[#dd6b20]">Global Model Status</h2>
      <div className="grid grid-cols-1 gap-6 p-6">
        {step >= 1 && (
          <CardWidget
            icon={<CircleCheckBig className="text-green-500 text-3xl" />}
            title="Global Model Status"
            value={globalModelStatus || "Loading..."}
          />
        )}
        {step >= 2 && (
          <CardWidget
            icon={<ChartLine className="text-blue-500 text-3xl" />}
            title="Learning Progress"
            value={learningProgress || "Loading..."}
          />
        )}
        {step >= 3 && (
          <CardWidget
            icon={<UserCog className="text-purple-500 text-3xl" />}
            title="Node Contributions"
            value={nodeContributions !== null ? `${nodeContributions} nodes` : "Loading..."}
          />
        )}
        {step >= 4 && (
          <CardWidget
            icon={<Trophy className="text-yellow-500 text-3xl" />}
            title="Model Performance"
            value={
              modelPerformance
                ? `Accuracy: ${modelPerformance.accuracy}, Detection: ${modelPerformance.detectionRate}, Improvement: ${modelPerformance.improvement}`
                : "Loading..."
            }
          />
        )}
      </div>
    </div>
      </div>
      {showAddDeviceModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl urbanist">
            <h3 className="text-2xl font-semibold mb-4 text-center space_grotesk">Add New Device</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="deviceId" className="block text-lg font-semibold">
                  Device ID:
                </label>
                <input
                  type="text"
                  id="deviceId"
                  name="deviceId"
                  value={newDevice.deviceId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-lg font-semibold">
                  Device Type:
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={newDevice.type}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-lg font-semibold">
                  Location:
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newDevice.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg poppins"
                  onClick={closeAddDeviceModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 poppins"
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

function CardWidget({ icon, title, value }) {
  return (
    <div className="rounded-lg shadow-md bg-white p-4 flex items-center">
      <div className="flex items-center gap-4">
        {icon}
        <div className="text-left">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
      {/* Value */}
      <div className="ml-auto text-xl font-bold text-gray-800">{value}</div>
    </div>
  );
}