// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeviceManagement {

    // Structure to store device information
    struct Device {
        string name;
        string identityKey;
        string status;
        string ip;
        uint256 timestamp;
    }

    // Mapping of device identity keys to device information
    mapping(string => Device) public devices;

    // Array of transaction logs
    struct TransactionLog {
        string action;
        string message;
        string oldKey;
        string newKey;
        uint256 timestamp;
    }

    TransactionLog[] public transactionLogs;

    // Event to emit device registration details
    event DeviceRegistered(string deviceName, string identityKey, uint256 timestamp);
    event DeviceRemoved(string deviceName, string identityKey, uint256 timestamp);
    event DeviceReintegrated(string deviceName, string identityKey, uint256 timestamp);

    // Function to register a new device
    function registerDevice(string memory _name, string memory _identityKey, string memory _ip) public {
        require(bytes(devices[_identityKey].name).length == 0, "Device already registered");
        
        devices[_identityKey] = Device({
            name: _name,
            identityKey: _identityKey,
            status: "normal", // Initially, the device status is "normal"
            ip: _ip,
            timestamp: block.timestamp
        });

        // Emit an event for device registration
        emit DeviceRegistered(_name, _identityKey, block.timestamp);
        
        // Log the registration as a transaction
        transactionLogs.push(TransactionLog({
            action: "deviceRegistered",
            message: string(abi.encodePacked(_name, " registered with identity key: ", _identityKey)),
            oldKey: "",
            newKey: _identityKey,
            timestamp: block.timestamp
        }));
    }

    // Function to recover a device by generating a new identity key
    function recoverDevice(string memory _oldKey, string memory _newKey) public {
        Device storage device = devices[_oldKey];
        
        require(bytes(device.name).length != 0, "Device not found");
        
        // Step 1: Remove the old device (node removal transaction)
        // Mark the old device as "removed" and delete it from the devices mapping
        string memory oldDeviceName = device.name;
        string memory oldDeviceIp = device.ip;

        // Log the removal of the device (node removal transaction)
        transactionLogs.push(TransactionLog({
            action: "nodeRemoved",
            message: string(abi.encodePacked(oldDeviceName, " removed from network. Identity Key: ", _oldKey)),
            oldKey: _oldKey,
            newKey: "",
            timestamp: block.timestamp
        }));

        // Remove the old device from the mapping
        delete devices[_oldKey];

        // Step 2: Reintegration (register the device again with a new identity key)
        devices[_newKey] = Device({
            name: oldDeviceName,
            identityKey: _newKey,
            status: "normal", // Status is set to "normal" upon recovery
            ip: oldDeviceIp,
            timestamp: block.timestamp
        });

        // Emit an event for device reintegration
        emit DeviceReintegrated(oldDeviceName, _newKey, block.timestamp);

        // Log the reintegration of the device (node reintegration transaction)
        transactionLogs.push(TransactionLog({
            action: "nodeReintegrated",
            message: string(abi.encodePacked(oldDeviceName, " reintegrated with new identity key: ", _newKey)),
            oldKey: _oldKey,
            newKey: _newKey,
            timestamp: block.timestamp
        }));
    }

    // Function to get the transaction log by index
    function getTransactionLog(uint256 index) public view returns (TransactionLog memory) {
        require(index < transactionLogs.length, "Transaction index out of range");
        return transactionLogs[index];
    }

    // Function to get the total number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactionLogs.length;
    }
}
