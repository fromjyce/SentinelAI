from mininet.net import Mininet
from mininet.node import Controller
from mininet.link import TCLink
from mininet.cli import CLI
from mininet.log import setLogLevel

def base_topology():
    """Base topology with 3 nodes: h1, h2, h3"""
    net = Mininet(controller=Controller, link=TCLink)

    # Add controller
    net.addController('c0')

    # Add hosts
    h1 = net.addHost('h1')
    h2 = net.addHost('h2')
    h3 = net.addHost('h3')

    # Add a switch
    s1 = net.addSwitch('s1')

    # Create links
    net.addLink(h1, s1)
    net.addLink(h2, s1)
    net.addLink(h3, s1)

    # Start the network
    net.start()
    print("Base topology is running")

    # Launch CLI
    CLI(net)

    # Stop the network
    net.stop()

if __name__ == '__main__':
    setLogLevel('info')
    base_topology()
