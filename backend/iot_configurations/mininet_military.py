from mininet.net import Mininet
from mininet.node import Controller
from mininet.link import TCLink
from mininet.cli import CLI
from mininet.log import setLogLevel

def military_topology():
    """Topology for Military/Defense IoT devices"""
    net = Mininet(controller=Controller, link=TCLink)

    # Add controller
    net.addController('c0')

    # Add hosts representing IoT devices
    h1 = net.addHost('h1', ip='10.0.0.1', mac='00:00:00:00:02:01')  # Drone
    h2 = net.addHost('h2', ip='10.0.0.2', mac='00:00:00:00:02:02')  # Radar System
    h3 = net.addHost('h3', ip='10.0.0.3', mac='00:00:00:00:02:03')  # Body Armor Sensor
    h4 = net.addHost('h4', ip='10.0.0.4', mac='00:00:00:00:02:04')  # Communication Equipment
    h5 = net.addHost('h5', ip='10.0.0.5', mac='00:00:00:00:02:05')  # Surveillance Camera

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
    print("Military/Defense topology is running")

    # Launch CLI
    CLI(net)

    # Stop the network
    net.stop()

if __name__ == '__main__':
    setLogLevel('info')
    military_topology()
