const fs = require('fs');

function extractMininetLayout(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    const controllerRegex = /net\.addController\(.+?name='(\w+)',/g;
    const controllers = [...content.matchAll(controllerRegex)].map(match => match[1]);

    const switchRegex = /net\.addSwitch\('(\w+)'/g;
    const switches = [...content.matchAll(switchRegex)].map(match => match[1]);

    const hostRegex = /net\.addHost\('(\w+)',.+?ip='([\d\.]+)'/g;
    const hosts = [...content.matchAll(hostRegex)].map(match => ({ name: match[1], ip: match[2] }));

    const linkRegex = /net\.addLink\((\w+), (\w+)\)/g;
    const links = [...content.matchAll(linkRegex)].map(match => ({ from: match[1], to: match[2] }));

    return {
        controllers,
        switches,
        hosts,
        links,
    };
}

function classifyNetwork(mininetLayout, inputAnswers) {
    let riskScore = 0;
    const reasons = [];

    // 1. Controllers (Single vs. Multiple Controllers)
    if (mininetLayout.controllers.length === 1) {
        riskScore += 2;
        reasons.push("Single controller increases risk (single point of failure).");
    } else if (mininetLayout.controllers.length > 1) {
        riskScore -= 1;
        reasons.push("Multiple controllers reduce risk (distributed control).");
    }

    // 2. Switches (Number of switches & VLAN usage)
    if (mininetLayout.switches.length > 10) {
        riskScore += 3;
        reasons.push("High number of switches increases complexity and attack surface.");
    } else if (mininetLayout.switches.length <= 3) {
        riskScore -= 1;
        reasons.push("Low number of switches suggests a simpler network with reduced complexity.");
    }

    // Check if VLANs are used (indicates segmentation)
    if (mininetLayout.switches.some(switchId => switchId.includes('vlan'))) {
        riskScore -= 2;
        reasons.push("VLAN segmentation reduces the risk of lateral movement.");
    }

    // 3. Hosts (IoT devices criticality, internet exposure)
    const numHosts = mininetLayout.hosts.length;
    if (numHosts > 20) {
        riskScore += 4;
        reasons.push("High number of hosts (IoT devices) increases risk.");
    }

    // Check if IoT devices are exposed to the internet (increases attack surface)
    mininetLayout.hosts.forEach(host => {
        if (host.ip.startsWith("192.") || host.ip.startsWith("10.") || host.ip.startsWith("172.")) {
            // Internal network IP, more secure
            riskScore -= 1;
            reasons.push(`Host ${host.name} is using internal IP (reduced risk).`);
        } else {
            riskScore += 3;
            reasons.push(`Host ${host.name} is exposed to the internet (increases risk).`);
        }
    });

    // 4. Links (Encryption & Security)
    mininetLayout.links.forEach(link => {
        // Check if link is encrypted
        if (link.from.includes('secure') && link.to.includes('secure')) {
            riskScore -= 1;
            reasons.push("Encrypted link reduces risk.");
        } else {
            riskScore += 2;
            reasons.push("Unencrypted link increases risk.");
        }
    });

    // 5. Traffic Patterns (High traffic without IDS)
    if (inputAnswers.trafficLoad === 'high' && inputAnswers.intrusionDetection === 'no') {
        riskScore += 4;
        reasons.push("High traffic without IDS increases risk of undetected attacks.");
    } else if (inputAnswers.trafficLoad === 'low' && inputAnswers.intrusionDetection === 'yes') {
        riskScore -= 2;
        reasons.push("Low traffic with IDS decreases the likelihood of undetected attacks.");
    }

    // 6. Security Protocols (TLS/HTTPS usage)
    if (inputAnswers.useTLS === 'no') {
        riskScore += 3;
        reasons.push("Lack of TLS increases the risk of interception and data leakage.");
    }

    // 7. Network Segmentation (Critical systems isolated)
    if (inputAnswers.networkSegmentation === 'no') {
        riskScore += 4;
        reasons.push("Lack of network segmentation increases lateral movement risk.");
    }

    // 8. Known Vulnerabilities (Open ports, outdated software)
    if (inputAnswers.openPorts > 5) {
        riskScore += 3;
        reasons.push("Multiple open ports increase the attack surface.");
    }
    if (inputAnswers.outdatedSoftware === 'yes') {
        riskScore += 3;
        reasons.push("Outdated software increases vulnerability to known exploits.");
    }

    // Final classification based on risk score
    let riskLevel = 'Low Risk';
    if (riskScore >= 15) {
        riskLevel = 'High Risk';
    } else if (riskScore >= 8) {
        riskLevel = 'Medium Risk';
    }

    return { riskLevel, reasons };
}

// // Example usage
// const mininetLayout = extractMininetLayout("path_to_mininet_file.py");
// const inputAnswers = {
//     trafficLoad: 'high',        // 'high', 'low'
//     intrusionDetection: 'no',   // 'yes', 'no'
//     useTLS: 'no',               // 'yes', 'no'
//     networkSegmentation: 'no',  // 'yes', 'no'
//     openPorts: 6,               // Number of open ports
//     outdatedSoftware: 'yes'     // 'yes', 'no'
// };

const classification = classifyNetwork(mininetLayout, inputAnswers);

console.log("Risk Level:", classification.riskLevel);
console.log("Reasons:", classification.reasons);
