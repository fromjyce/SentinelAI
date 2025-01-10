'use client';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Server,
  CirclePlus,
  CircleCheckBig,
  Trophy,
  ChartLine,
  Download,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Head from 'next/head';

const UploadDashboard = () => {
  const router = useRouter();
  const [filename, setFilename] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalDevices, setTotalDevices] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);
  const [isolatedDevices, setIsolatedDevices] = useState(0);
  const [systemHealth, setSystemHealth] = useState('Unknown');
  const [activeThreats, setActiveThreats] = useState(0);
  const [activeNodes, setActiveNodes] = useState([]);
  const [isolatedNodes, setIsolatedNodes] = useState([]);
  const [threatAnalysis, setThreatAnalysis] = useState([]);
  const [globalModelStatus, setGlobalModelStatus] = useState(null);
  const [realTimeFeed, setRealTimeFeed] = useState([]);
  const [imagePath, setImagePath] = useState('');
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevice, setNewDevice] = useState({ id: '', name: '', location: '' });
  const [isHighPriority, setIsHighPriority] = useState(false);

  useEffect(() => {
    if (router.query.filename) {
      setFilename(router.query.filename);

      if (router.query.filename === 'test.py') {
        setImagePath('/images/base_case_comp/1.png');
        setIsHighPriority(false);
        simulateTestPyWorkflow();
      } else if (router.query.filename === 'manage.py') {
        setImagePath('/images/home_ping/1.png');
        setIsHighPriority(true);
        simulateManagePyWorkflow();
      }
    }
  }, [router.query.filename]);

  const simulateTestPyWorkflow = () => {
    setTimeout(() => {
      setLoading(false);
      setTotalDevices(3);
      setActiveDevices(3);
      setIsolatedDevices(0);
      setSystemHealth('Good');
      setActiveThreats(0);

      setTimeout(() => {
        setActiveNodes([
          { id: 1, name: 'Node 1', status: 'Healthy' },
          { id: 2, name: 'Node 2', status: 'Healthy' },
          { id: 3, name: 'Node 3', status: 'Healthy' },
        ]);

        setTimeout(() => {
          setImagePath('/images/base_case_comp/2.png');
          setIsolatedNodes([
            { id: 3, name: 'Node 3', status: 'Isolated' },
          ]);
          setActiveNodes((prev) => prev.filter((node) => node.id !== 3));
          setActiveDevices(2);
          setIsolatedDevices(1);
          setSystemHealth('Fair');
          setActiveThreats(1);

          setThreatAnalysis([
            {
              type: 'DDoS Attack',
              affectedNodes: 1,
              riskLevel: 'High',
              mitigation: 'Node Isolation',
              description: 'Node 3 sent an abnormal amount of traffic, so it was isolated.',
            },
          ]);

          setTimeout(() => {
            setGlobalModelStatus({
              accuracy: '92.5%',
              detectionTime: '120 ms',
            });
            setRealTimeFeed((prevFeed) => [
              { text: 'Node 3 isolated due to detected threat.', duration: 'Just now' },
              ...prevFeed,
            ]);

            setTimeout(() => {
              setImagePath('/images/base_case_comp/3.png');
              setActiveNodes((prevNodes) => [
                ...prevNodes,
                { id: 3, name: 'Node 3', status: 'Healthy' },
              ]);
              setIsolatedNodes((prevNodes) => prevNodes.filter((node) => node.id !== 3));
              setActiveDevices((prev) => prev + 1);
              setIsolatedDevices((prev) => prev - 1);
              setSystemHealth('Good');
              setActiveThreats(0);
              setRealTimeFeed((prevFeed) => [
                { text: 'Node 3 recovered and added back to active devices.', duration: 'Just now' },
                ...prevFeed,
              ]);
            }, 4000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const simulateManagePyWorkflow = () => {
    setTimeout(() => {
      setLoading(false);
      setTotalDevices(5);
      setActiveDevices(5);
      setIsolatedDevices(0);
      setSystemHealth('Good');
      setActiveThreats(0);

      setTimeout(() => {
        setActiveNodes([
          { id: 1, name: 'Node 1', status: 'Healthy' },
          { id: 2, name: 'Node 2', status: 'Healthy' },
          { id: 3, name: 'Node 3', status: 'Healthy' },
          { id: 4, name: 'Node 4', status: 'Healthy' },
          { id: 5, name: 'Node 5', status: 'Healthy' },
        ]);

        setTimeout(() => {
          setImagePath('/images/home_ping/2.png');
          setIsolatedNodes([
            { id: 2, name: 'Node 2', status: 'Isolated' },
            { id: 4, name: 'Node 4', status: 'Isolated' },
          ]);
          setActiveNodes((prev) => prev.filter((node) => node.id !== 2 && node.id !== 4));
          setActiveDevices(3);
          setIsolatedDevices(2);

          setTimeout(() => {
            setShowAddDeviceModal(true);
            // Simulate adding a new device
            setTimeout(() => {
              setImagePath('/images/home_ping/3.png');
              handleAddDeviceSimulation({ id: 6, name: 'Node 6', location: 'New Location' });
            }, 2000);

            setTimeout(() => {
              setImagePath('/images/home_ping/4.png');
              setActiveNodes((prevNodes) => [
                ...prevNodes,
                { id: 2, name: 'Node 2', status: 'Healthy' },
                { id: 4, name: 'Node 4', status: 'Healthy' },
              ]);
              setIsolatedNodes([]);
              setActiveDevices(5);
              setIsolatedDevices(0);
              setRealTimeFeed((prevFeed) => [
                { text: 'Node 2 and Node 4 recovered and added back to active devices.', duration: 'Just now' },
                ...prevFeed,
              ]);
            }, 4000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const handleAddDeviceSimulation = (device) => {
    setActiveNodes((prevNodes) => [...prevNodes, { ...device, status: 'Healthy' }]);
    setActiveDevices((prev) => prev + 1);
    setTotalDevices((prev) => prev + 1);
    setRealTimeFeed((prevFeed) => [
      { text: `Device ${device.name} added to the network.`, duration: 'Just now' },
      ...prevFeed,
    ]);
  };

  const openAddDeviceModal = () => setShowAddDeviceModal(true);
  const closeAddDeviceModal = () => setShowAddDeviceModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddDevice = (e) => {
    e.preventDefault();
    const newNode = { id: activeNodes.length + 1, ...newDevice, status: 'Healthy' };
    setActiveNodes((prevNodes) => [...prevNodes, newNode]);
    setActiveDevices((prev) => prev + 1);
    setTotalDevices((prev) => prev + 1);
    setNewDevice({ id: '', name: '', location: '' });
    closeAddDeviceModal();
  };

  return (
    <>
      <Head>
        <title>Your Network&apos;s Dashboard</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f4f4f4] to-[#ffffff] p-6">
        <h1 className="text-4xl font-bold text-center text-[#dd0000] mb-2">Your Network&apos;s Dashboard</h1>
        {isHighPriority ? (
          <p className="text-center text-gray-600 mb-6">High Priority</p>
        ) : (
          totalDevices > 0 && <p className="text-center text-gray-600 mb-6">Low Priority</p>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold text-[#2b6cb0]">Network Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-blue-100">
                      <CardContent className="text-center">
                        <h3 className="text-xl font-semibold">Total Devices</h3>
                        <p className="text-2xl font-bold">{totalDevices}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-100">
                      <CardContent className="text-center">
                        <h3 className="text-xl font-semibold">Active Devices</h3>
                        <p className="text-2xl font-bold">{activeDevices}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-100">
                      <CardContent className="text-center">
                        <h3 className="text-xl font-semibold">Isolated Devices</h3>
                        <p className="text-2xl font-bold">{isolatedDevices}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-100">
                      <CardContent className="text-center">
                        <h3 className="text-xl font-semibold">System Health</h3>
                        <p className="text-2xl font-bold">{systemHealth}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-100">
                      <CardContent className="text-center">
                        <h3 className="text-xl font-semibold">Active Threats</h3>
                        <p className="text-2xl font-bold">{activeThreats}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-3xl font-semibold text-[#dd6b20]">Simulation Graph</CardTitle>
                    {isHighPriority && (
                      <Button className="bg-blue-500 text-white">Trigger Isolation</Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Image
                    src={imagePath}
                    alt="Simulation Graph"
                    width={500}
                    height={300}
                    className="rounded-lg mx-auto"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Active Nodes and Isolated Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-3xl font-semibold text-[#2b6cb0]">Active Nodes</CardTitle>
                    <Button
                      className="bg-blue-500 text-white"
                      onClick={openAddDeviceModal}
                    >
                      + Add Devices
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeNodes.map((node) => (
                    <div key={node.id} className="mb-4 flex justify-between items-center">
                      <div>
                        <Server className="inline-block mr-2 text-blue-500" />
                        <span>{node.name}</span> - <span>{node.status}</span>
                      </div>
                      <div>
                        <Button className="mr-2 bg-green-500 text-white">Details</Button>
                        <Button className="bg-red-500 text-white">Isolate</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold text-[#e53e3e]">Isolated Nodes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isolatedNodes.map((node) => (
                    <div key={node.id} className="mb-4 flex justify-between items-center">
                      <div>
                        <Server className="inline-block mr-2 text-red-500" />
                        <span>{node.name}</span> - <span>{node.status}</span>
                      </div>
                      <div>
                        <Button className="mr-2 bg-blue-500 text-white">Recover</Button>
                        <Button className="bg-yellow-500 text-white">Details</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Threat Analysis and Global Model Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold text-[#e53e3e]">Threat Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {threatAnalysis.map((threat, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold">{threat.type}</h4>
                      <p>Affected Nodes: {threat.affectedNodes}</p>
                      <p>Risk Level: {threat.riskLevel}</p>
                      <p>Mitigation: {threat.mitigation}</p>
                      <p>{threat.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold text-[#dd6b20]">Global Model Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Accuracy: {globalModelStatus?.accuracy || 'Loading...'}</p>
                  <p>Detection Time: {globalModelStatus?.detectionTime || 'Loading...'}</p>
                </CardContent>
              </Card>
            </div>

            {/* Real-Time Feed */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold text-[#FF4D4D]">Real-Time Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  {realTimeFeed.map((feed, index) => (
                    <div key={index} className="mb-4">
                      <p>{feed.text}</p>
                      <span className="text-sm text-gray-500">{feed.duration}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {showAddDeviceModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-2xl font-semibold mb-4">Add New Device</h3>
              <form onSubmit={handleAddDevice}>
                <div className="mb-4">
                  <label htmlFor="id" className="block text-lg font-semibold">
                    Device ID
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={newDevice.id}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-lg font-semibold">
                    Device Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newDevice.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-lg font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newDevice.location}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                    onClick={closeAddDeviceModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Device
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadDashboard;