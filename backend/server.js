const express = require('express');
const app = express();
const port = 3000;
const crypto = require('crypto');

app.use(express.json());

// Improved data structures
let devices = new Map(); // Store device details with identity keys as keys
let blockchain = []; // Store blockchain transactions
let lastBlockHash = ''; // Track last block hash for chain integrity

// Genesis block creation
function createGenesisBlock() {
    const block = {
        index: 0,
        timestamp: new Date().toISOString(),
        transactions: [],
        previousHash: "0",
        hash: crypto.createHash('sha256').update("genesis").digest('hex')
    };
    lastBlockHash = block.hash;
    blockchain.push(block);
}

// Create new block with transactions
function createNewBlock(transactions) {
    const block = {
        index: blockchain.length,
        timestamp: new Date().toISOString(),
        transactions: transactions,
        previousHash: lastBlockHash,
        hash: crypto.createHash('sha256').update(lastBlockHash + JSON.stringify(transactions)).digest('hex')
    };
    lastBlockHash = block.hash;
    blockchain.push(block);
    return block;
}

// Generate unique identity key for devices
function generateIdentityKey(device) {
    const data = `${device.name}-${device.ip}-${Date.now()}-${Math.random()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Calculate gas fee based on operation complexity
function calculateGasFee(operation) {
    const baseFees = {
        'register': { base: 10, variance: 5 },
        'remove': { base: 15, variance: 8 },
        'recover': { base: 25, variance: 12 }
    };
    
    const fee = baseFees[operation] || { base: 5, variance: 2 };
    return fee.base + Math.floor(Math.random() * fee.variance);
}

// Create transaction and add to new block
function createTransaction(type, device, gasFee) {
    return {
        type,
        deviceName: device.name,
        deviceIP: device.ip,
        identityKey: device.identityKey,
        timestamp: new Date().toISOString(),
        gasFee,
        status: device.status
    };
}

// Initialize blockchain
createGenesisBlock();

// Register device endpoint
app.post('/register-device', (req, res) => {
    const { name, ip } = req.body;
    const identityKey = generateIdentityKey({ name, ip });
    const device = { name, ip, identityKey, status: 'active' };
    
    devices.set(identityKey, device);
    const gasFee = calculateGasFee('register');
    const transaction = createTransaction('register', device, gasFee);
    const block = createNewBlock([transaction]);

    res.json({
        success: true,
        device,
        transaction,
        block
    });
});

// Remove device endpoint
app.post('/remove-device', (req, res) => {
    const { identityKey } = req.body;
    const device = devices.get(identityKey);
    
    if (!device || device.status !== 'active') {
        return res.status(404).json({ success: false, message: 'Device not found or already removed' });
    }

    device.status = 'removed';
    devices.set(identityKey, device);
    const gasFee = calculateGasFee('remove');
    const transaction = createTransaction('remove', device, gasFee);
    const block = createNewBlock([transaction]);

    res.json({
        success: true,
        device,
        transaction,
        block
    });
});

// Recover device endpoint
app.post('/recover-device', (req, res) => {
    const { identityKey } = req.body;
    const device = devices.get(identityKey);
    
    if (!device || device.status !== 'removed') {
        return res.status(404).json({ success: false, message: 'Device not found or not in removed state' });
    }

    const newIdentityKey = generateIdentityKey(device);
    const updatedDevice = { ...device, identityKey: newIdentityKey, status: 'active' };
    
    devices.delete(identityKey);
    devices.set(newIdentityKey, updatedDevice);
    
    const gasFee = calculateGasFee('recover');
    const transaction = createTransaction('recover', updatedDevice, gasFee);
    const block = createNewBlock([transaction]);

    res.json({
        success: true,
        device: updatedDevice,
        transaction,
        block
    });
});

// Get blockchain data endpoint
app.get('/blockchain', (req, res) => {
    res.json({
        blockchain,
        devices: Array.from(devices.values())
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});