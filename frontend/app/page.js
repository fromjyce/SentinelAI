'use client'
import Image from 'next/image'
import { ArrowUpRight, Shield, Thermometer, Lock, Camera, Activity, AlertTriangle, CheckCircle, X, Tv, Lightbulb } from 'lucide-react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const initialDeviceTypes = [
  { name: 'Smart Camera', icon: Camera },
  { name: 'Smart Thermostat', icon: Thermometer },
  { name: 'Smart Lock', icon: Lock },
  { name: 'Smart TV', icon: Tv},
  { name: 'Smart Bulb', icon: Lightbulb },
]

const initialDeviceMetrics = {
  'Smart Camera': { operatingTime: '14h', connectionQuality: 'Excellent', temperature: '72°F', usageFrequency: 'High', connectivityType: 'Wi-Fi', priority: 'High' },
  'Smart Thermostat': { operatingTime: '72h', connectionQuality: 'Good', temperature: '68°F', usageFrequency: 'Medium', connectivityType: 'Z-Wave', priority: 'Medium' },
  'Smart Lock': { operatingTime: '68h', connectionQuality: 'Fair', temperature: '70°F', usageFrequency: 'Low', connectivityType: 'Bluetooth', priority: 'High' },
}

const isolatedDevices = [
  { name: 'Smart TV', reason: 'Unauthorized Access', time: '2h ago', status: 'Under Review' },
  { name: 'Smart Bulb', reason: 'Firmware Outdated', time: '4d ago', status: 'Resolved' },
]

const feedItems = [
  { icon: Shield, color: 'text-green-600', bg: 'bg-green-100', message: 'System-wide security scan completed. No threats detected.', time: '30 minutes ago' },
  { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100', message: 'Unusual activity detected on Smart Camera. Monitoring closely.', time: '10 minutes ago' },
  { icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100', message: 'Smart Thermostat firmware updated successfully.', time: '1 hour ago' },
  { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', message: 'Smart Lock access granted to authorized user.', time: '2 hours ago' },
]

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  const [deviceTypes, setDeviceTypes] = useState(initialDeviceTypes);
  const [deviceMetrics, setDeviceMetrics] = useState(initialDeviceMetrics);
  const [newDevice, setNewDevice] = useState({
    name: '',
    location: '',
    connectivityType: '',
    priorityLevel: '',
    firmwareVersion: '',
    securityStatus: '',
    initialOperatingStatus: '',
  });

  const handleDeviceSelect = (value) => {
    setSelectedDeviceType(value);
    setShowPopup(true);
  };

  const handleInputChange = (e) => {
    setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDeviceTypes = [...deviceTypes, { name: newDevice.name, icon: deviceTypes.find(d => d.name === selectedDeviceType)?.icon || Camera }];
    const updatedDeviceMetrics = {
      ...deviceMetrics,
      [newDevice.name]: {
        operatingTime: '0h',
        connectionQuality: 'New',
        temperature: 'N/A',
        usageFrequency: 'New',
        connectivityType: newDevice.connectivityType,
        priority: newDevice.priorityLevel,
      }
    };
    setDeviceTypes(updatedDeviceTypes);
    setDeviceMetrics(updatedDeviceMetrics);
    setShowPopup(false);
    alert(`New device "${newDevice.name}" has been added successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 poppins">
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Hero and Image Section */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Home IoT Threat Detection</h1>
              <p className="text-gray-600 mb-4">Your smart home is secure. No active threats detected.</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">98%</p>
                  <p className="text-sm text-blue-800">System Health</p>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-sm text-green-800">Devices Online</p>
                </div>
                <div className="bg-yellow-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">0</p>
                  <p className="text-sm text-yellow-800">Active Threats</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Select onValueChange={handleDeviceSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add a New Node" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((device) => (
                      <SelectItem key={device.name} value={device.name}>
                        <div className="flex items-center">
                          <device.icon className="mr-2 h-4 w-4" />
                          {device.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                View Detailed Report
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center">
            <Image src="/placeholder.svg?height=300&width=400" width={400} height={300} alt="IoT Devices Visualization" className="rounded-lg" />
          </div>
        </section>

        {/* Device-Specific Panels */}
        <section className="space-y-6">
          {Object.entries(deviceMetrics).map(([deviceName, metrics], index) => {
            const deviceType = deviceTypes.find(d => d.name === deviceName) || deviceTypes[0];
            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <deviceType.icon className="h-8 w-8 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">{deviceName}</h2>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Online</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(metrics).map(([key, value], idx) => (
                    <div key={idx} className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-lg font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Device-Wide Analytics and Isolated Devices */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Device-Wide Analytics</h2>
            <div className="aspect-w-16 aspect-h-9">
              <Image src="/placeholder.svg?height=300&width=500" width={500} height={300} alt="Analytics Chart" className="rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Isolated Devices</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Device Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Reason</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Time</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isolatedDevices.map((device, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-800">{device.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{device.reason}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{device.time}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          device.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Real-Time Feed */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Real-Time Feed</h2>
            <div className="flex space-x-2">
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">All Devices</button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">Threats Only</button>
            </div>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {feedItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`${item.bg} rounded-full p-2`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-gray-800">{item.message}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Pop-up for adding new device */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add New Device</h2>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Device Name</label>
                <Input type="text" id="name" name="name" required onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <Input type="text" id="location" name="location" required onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="connectivityType" className="block text-sm font-medium text-gray-700">Connectivity Type</label>
                <select id="connectivityType" name="connectivityType" required onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="">Select...</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Bluetooth">Bluetooth</option>
                  <option value="Z-Wave">Z-Wave</option>
                  <option value="Ethernet">Ethernet</option>
                </select>
              </div>
              <div>
                <label htmlFor="priorityLevel" className="block text-sm font-medium text-gray-700">Priority Level</label>
                <select id="priorityLevel" name="priorityLevel" required onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="">Select...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="firmwareVersion" className="block text-sm font-medium text-gray-700">Firmware Version (Optional)</label>
                <Input type="text" id="firmwareVersion" name="firmwareVersion" onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="securityStatus" className="block text-sm font-medium text-gray-700">Security Status</label>
                <select id="securityStatus" name="securityStatus" required onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="">Select...</option>
                  <option value="Secure">Secure</option>
                  <option value="Unsecure">Unsecure</option>
                </select>
              </div>
              <div>
                <label htmlFor="initialOperatingStatus" className="block text-sm font-medium text-gray-700">Initial Operating Status</label>
                <select id="initialOperatingStatus" name="initialOperatingStatus" required onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="">Select...</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Add Device</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}