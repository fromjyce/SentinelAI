"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Server, CirclePlus, CircleCheckBig, UserCog, Trophy, ChartLine, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UpdateFooter from "@/components/UpdateFooter";
import Navbar from "@/components/Navbar";
import Head from "next/head";

const summaryData = [
  { title: "Total Sensors", value: 6, bgColor: "bg-yellow-100" },
  { title: "Active Threats", value: 0, bgColor: "bg-blue-100" },
  { title: "Compromised Sensors", value: 1, bgColor: "bg-[#fca5a5]" },
  { title: "System Health", value: "Good", bgColor: "bg-green-100" }
];

const activeNodes = [
  {
    id: 1,
    name: "Node 1",
    vehicleId: "VID1234",
    sensorType: "Radar",
    sensorStatus: "Normal",
    speed: "80 km/h",
    location: "(25.34567, 44.6789)",
    batteryLevel: "90%",
    connectionType: "Wi-Fi",
    eventLogs: "12",
    usage: "Daily",
    attackType: "None",
    protocolLabel: "Normal"
  },
  {
    id: 2,
    name: "Node 2",
    vehicleId: "VID5678",
    sensorType: "LIDAR",
    sensorStatus: "Faulty",
    speed: "60 km/h",
    location: "(12.12345, 56.2345)",
    batteryLevel: "85%",
    connectionType: "Cellular",
    eventLogs: "75",
    usage: "Weekly",
    attackType: "MITM",
    protocolLabel: "Compromised"
  },
  {
    id: 3,
    name: "Node 3",
    vehicleId: "VID9101",
    sensorType: "Camera",
    sensorStatus: "Disabled",
    speed: "50 km/h",
    location: "(20.34567, 44.1234)",
    batteryLevel: "50%",
    connectionType: "Bluetooth",
    eventLogs: "30",
    usage: "Occasionally",
    attackType: "DDoS",
    protocolLabel: "Compromised"
  },
  {
    id: 4,
    name: "Node 4",
    vehicleId: "VID3344",
    sensorType: "ECU",
    sensorStatus: "Faulty",
    speed: "70 km/h",
    location: "(22.23456, 55.6789)",
    batteryLevel: "80%",
    connectionType: "Cellular",
    eventLogs: "90",
    usage: "Weekly",
    attackType: "Jamming",
    protocolLabel: "Compromised"
  },
  {
    id: 5,
    name: "Node 5",
    vehicleId: "VID5566",
    sensorType: "Radar",
    sensorStatus: "Normal",
    speed: "90 km/h",
    location: "(18.12345, 47.5678)",
    batteryLevel: "70%",
    connectionType: "Bluetooth",
    eventLogs: "20",
    usage: "Occasionally",
    attackType: "None",
    protocolLabel: "Normal"
  }
];

const compromisedNodes = [
  {
    id: 6,
    name: "Node 6",
    vehicleId: "VID9101",
    sensorType: "Camera",
    sensorStatus: "Disabled",
    speed: "50 km/h",
    location: "(20.34567, 44.1234)",
    batteryLevel: "50%",
    connectionType: "Bluetooth",
    eventLogs: "30",
    usage: "Occasionally",
    attackType: "DDoS",
    protocolLabel: "Compromised"
  }
];

const imageData = "/images/av_iot/1.png";

export default function AutoVehIOT() {
  const [threats, setThreats] = useState([
    { type: 'Sensor Spoofing', affectedNodes: 2, riskLevel: 'High', mitigation: 'Sensor Calibration & Isolation' },
    { type: 'GPS Jamming', affectedNodes: 1, riskLevel: 'Medium', mitigation: 'Backup Navigation & Signal Blocking' },
    { type: 'CAN Bus Attack', affectedNodes: 1, riskLevel: 'High', mitigation: 'Network Segmentation & Intrusion Detection' },
    { type: 'Over-the-Air Update Exploit', affectedNodes: 1, riskLevel: 'Low', mitigation: 'Firmware Validation & Secure Updates' },
  ]);
  
  const [insights, setInsights] = useState([
    { title: 'Vehicle-to-Vehicle Insight', description: 'Advanced data sharing has enhanced response time to GPS jamming incidents by 25%.' },
    { title: 'Autonomous Model Efficiency', description: 'Improved algorithms have increased detection accuracy for CAN Bus attacks from 80% to 95%.' },
    { title: 'Shared Traffic Patterns', description: 'Collaborative analysis of traffic data has reduced false positives in radar anomaly detection by 15%.' },
  ]);
  
  const realTimeFeed = [
    { text: "Sensor spoofing detected in Vehicle VID1234", duration: "5 minutes ago" },
    { text: "GPS jamming mitigated in Vehicle VID5678", duration: "10 minutes ago" },
    { text: "CAN Bus anomaly detected in Vehicle VID9101", duration: "15 minutes ago" },
    { text: "Firmware update secured for Vehicle VID3344", duration: "20 minutes ago" },
    { text: "Global navigation system update deployed", duration: "30 minutes ago" },
  ];

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
  const [modelPerformance, setModelPerformance] = useState(null); // For detection accuracy
  const [latency, setLatency] = useState(null); // For detection time
  const [recoveryTime, setRecoveryTime] = useState(null); // For recovery time
  useEffect(() => {
    setGlobalModelStatus("Up to Date");
    setLearningProgress(`${(Math.random() * 100).toFixed(2)}%`);
    setNodeContributions(3);
    setModelPerformance(`${(Math.random() * (100 - 80) + 80).toFixed(2)}%`); // 80-100%
    setLatency(`${(Math.random() * (300 - 50) + 50).toFixed(2)} ms`); // 50-300ms
    setRecoveryTime(`${(Math.random() * (10 - 1) + 1).toFixed(2)} s`); // 1-10s
    const interval = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : prev)); // Increment step until all cards are shown
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const CardWidget = ({ icon, title, value, className = '' }) => {
    return (
      <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold urbanist">{title}</CardTitle>
          {icon && <div className="p-2 bg-gray-100 rounded-full">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold poppins">{value}</div>
        </CardContent>
      </Card>
    );
  };

  const downloadReport = () => {
    console.log("Downloading detailed report...");
  };

  return (
    <>
    <Head><title>SentinelAI | AV Dashboard</title></Head>
    <Navbar/>
    <div className="min-h-screen p-6 mt-20">
      <h1 className="text-5xl font-bold mb-4 mt-2 urbanist text-[#dd0000]">Autonomous Vehicles - Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full h-[500px]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-3xl font-semibold play text-[#890408]">
                  Network Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)]">
                <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full poppins">
                  {summaryData.map((item, index) => (
                    <Card
                      key={index}
                      className={`${item.bgColor} transition-all duration-300 hover:shadow-lg flex items-center justify-center ${index < 3 ? 'col-span-1' : index === 3 ? 'col-span-2' : 'col-span-1'}`}
                    >
                      <CardContent className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold">{item.value}</div>
                          <div className="text-xl font-semibold mt-2">{item.title}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full h-[500px]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-3xl font-semibold play text-[#890408]">
                  Simulated Network
                </CardTitle>
              </CardHeader>
              <CardContent className="relative h-[calc(100%-5rem)]">
                <Image
                  src={imageData}
                  alt="Autonomous Vehicle System Overview"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </CardContent>
            </Card>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-semibold play text-[#2b6cb0]">
                Active Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex justify-between items-center bg-blue-50 p-4 rounded-lg"
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
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-semibold play text-[#e53e3e]">
                Compromised Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {compromisedNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex justify-between items-center bg-red-50 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Server className="text-red-500" size={24} />
                    <span className="font-medium text-lg urbanist">{node.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 poppins"
                      onClick={() => openCompromisedNodeDetailsModal(node)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
      </div>

      {/* Global Model Status */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="md:col-span-2">
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-semibold play text-[#e53e3e]">
          Threat Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          {threats.map((threat, index) => (
            <Card key={index} className="bg-[#f4f4f4]">
              <CardContent className="pt-6">
                <h4 className="text-xl font-semibold mb-2 urbanist">{threat.type}</h4>
                <p className="poppins"><strong>Affected Nodes:</strong> {threat.affectedNodes}</p>
                <p className="poppins"><strong>Risk Level:</strong> {threat.riskLevel}</p>
                <p className="poppins"><strong>Mitigation:</strong> {threat.mitigation}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-4 poppins text-[#890408]">
          Collaborative Threat Insights
        </h3>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Card key={index} className="bg-blue-50">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-2 poppins">{insight.title}</h4>
                <p className="urbanist">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>

  <div>
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-semibold play text-[#dd6b20]">
          Global Model Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step >= 1 && (
          <CardWidget
            icon={<CircleCheckBig className="text-green-500" />}
            title="Global Model Status"
            value={globalModelStatus || "Loading..."}
          />
        )}
        {step >= 2 && (
          <CardWidget
            icon={<ChartLine className="text-blue-500" />}
            title="Learning Progress"
            value={learningProgress || "Loading..."}
          />
        )}
        {step >= 3 && (
          <CardWidget
            icon={<UserCog className="text-purple-500" />}
            title="Node Contributions"
            value={nodeContributions ? `${nodeContributions} nodes` : "Loading..."}
          />
        )}
        {step >= 4 && (
          <Card className="bg-yellow-50">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Trophy className="text-yellow-500" size={24} />
                <CardTitle className="text-xl font-semibold urbanist">
                  Model Performance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-lg poppins">
              <p><strong>Detection Accuracy:</strong> {modelPerformance || "Data not available"}</p>
              <p><strong>Average Latency:</strong> {latency || "Data not available"}</p>
              <p><strong>Average Recovery Time:</strong> {recoveryTime || "Data not available"}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  </div>
</div>
<div className="mt-6">
  <Card>
    <CardHeader>
      <CardTitle className="text-3xl font-semibold text-[#FF4D4D] play">
        Real-Time Feed
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {realTimeFeed.map((feed, index) => (
          <div key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow">
            <span className="text-gray-700 poppins">{feed.text}</span>
            <span className="text-sm text-gray-500 poppins">{feed.duration}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>

<div className="mt-8">
      <Button
        onClick={downloadReport}
        className="w-full flex items-center justify-center space-x-2 bg-[#318CE7] hover:bg-[#6CB4EE] poppins text-base"
      >
        <Download className="h-5 w-5" />
        <span>Download Detailed Report</span>
      </Button>
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
    <UpdateFooter/>
    </>
  );
}

