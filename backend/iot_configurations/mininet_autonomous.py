from mininet.net import Mininet
from mininet.node import Controller
from mininet.link import TCLink
from mininet.cli import CLI
from mininet.log import setLogLevel

def autonomous_vehicle_topology():
    """Topology for Autonomous Vehicle IoT devices"""
    net = Mininet(controller=Controller, link=TCLink)

    # Add controller
    net.addController('c0')

    # Add hosts representing IoT devices
    h1 = net.addHost('h1', ip='10.0.0.1', mac='00:00:00:00:03:01')  # Radar
    h2 = net.addHost('h2', ip='10.0.0.2', mac='00:00:00:00:03:02')  # LIDAR
    h3 = net.addHost('h3', ip='10.0.0.3', mac='00:00:00:00:03:03')  # Camera
    h4 = net.addHost('h4', ip='10.0.0.4', mac='00:00:00:00:03:04')  # GPS
    h5 = net.addHost('h5', ip='10.0.0.5', mac='00:00:00:00:03:05')  # ECU

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
    print("Autonomous Vehicle topology is running")

    # Launch CLI
    CLI(net)

    # Stop the network
    net.stop()

if __name__ == '__main__':
    setLogLevel('info')
    autonomous_vehicle_topology()
