from mininet.net import Mininet
from mininet.node import Controller
from mininet.link import TCLink
from mininet.cli import CLI
from mininet.log import setLogLevel

def healthcare_topology():
    """Topology for Healthcare IoT devices"""
    net = Mininet(controller=Controller, link=TCLink)

    # Add controller
    net.addController('c0')

    # Add hosts representing IoT devices
    h1 = net.addHost('h1', ip='10.0.0.1', mac='00:00:00:00:01:01')  # Heart Rate Monitor
    h2 = net.addHost('h2', ip='10.0.0.2', mac='00:00:00:00:01:02')  # Infusion Pump
    h3 = net.addHost('h3', ip='10.0.0.3', mac='00:00:00:00:01:03')  # Patient Monitor
    h4 = net.addHost('h4', ip='10.0.0.4', mac='00:00:00:00:01:04')  # Ventilator
    h5 = net.addHost('h5', ip='10.0.0.5', mac='00:00:00:00:01:05')  # Glucose Monitor

    # Add a switch
    s1 = net.addSwitch('s1')

    # Create links
    net.addLink(h1, s1)
    net.addLink(h2, s1)
    net.addLink(h3, s1)
    net.addLink(h4, s1)
    net.addLink(h5, s1)

    # Start the network
    net.start()
    print("Healthcare topology is running")

    # Launch CLI
    CLI(net)

    # Stop the network
    net.stop()

if __name__ == '__main__':
    setLogLevel('info')
    healthcare_topology()
