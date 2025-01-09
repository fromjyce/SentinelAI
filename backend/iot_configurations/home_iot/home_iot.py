from mininet.net import Mininet
from mininet.node import Controller, RemoteController
from mininet.topo import Topo
from mininet.log import setLogLevel
from mininet.cli import CLI

class IoTTopology(Topo):
    def build(self):
        # Add switch
        switch = self.addSwitch('s1')

        # Add IoT device nodes
        temp_sensor = self.addHost('h1', ip='10.0.0.1')
        humidity_sensor = self.addHost('h2', ip='10.0.0.2')
        motion_sensor = self.addHost('h3', ip='10.0.0.3')

        # Connect hosts to the switch
        self.addLink(temp_sensor, switch)
        self.addLink(humidity_sensor, switch)
        self.addLink(motion_sensor, switch)

def run():
    setLogLevel('info')

    # Create and start Mininet network
    net = Mininet(topo=IoTTopology(), controller=Controller)
    net.start()

    print("Starting IoT Network...")
    print("Temperature Sensor: 10.0.0.1")
    print("Humidity Sensor: 10.0.0.2")
    print("Motion Sensor: 10.0.0.3")

    # Drop into the Mininet CLI
    CLI(net)

    # Stop the network after exiting CLI
    net.stop()

if __name__ == '__main__':
    run()
