#!/usr/bin/env python

from mininet.net import Mininet
from mininet.node import Controller, RemoteController, OVSController
from mininet.node import CPULimitedHost, Host, Node
from mininet.node import OVSKernelSwitch, UserSwitch
from mininet.node import IVSSwitch
from mininet.cli import CLI
from mininet.log import setLogLevel, info
from mininet.link import TCLink, Intf
from subprocess import call

def myNetwork():

    net = Mininet( topo=None,
                   build=False,
                   ipBase='10.0.0.0/8')

    info( '*** Adding controller\n' )
    c0=net.addController(name='c0',
                      controller=Controller,
                      protocol='tcp',
                      port=6633)

    info( '*** Add switches\n')
    s1 = net.addSwitch('s1', cls=OVSKernelSwitch)

    info( '*** Add hosts\n')
    sensor1 = net.addHost('sensor1', cls=Host, ip='10.0.0.2', defaultRoute=None)
    sensor2 = net.addHost('sensor2', cls=Host, ip='10.0.0.3', defaultRoute=None)
    sensor3 = net.addHost('sensor3', cls=Host, ip='10.0.0.4', defaultRoute=None)
    server = net.addHost('server', cls=Host, ip='10.0.0.1', defaultRoute=None)
    actuators = net.addHost('actuators', cls=Host, ip='10.0.0.5', defaultRoute=None)

    info( '*** Add links\n')
    net.addLink(s1, server)
    net.addLink(s1, actuators)
    net.addLink(s1, sensor2)
    net.addLink(s1, sensor3)
    net.addLink(s1, sensor1)

    info( '*** Starting network\n')
    net.build()
    info( '*** Starting controllers\n')
    for controller in net.controllers:
        controller.start()

    info( '*** Starting switches\n')
    net.get('s1').start([c0])

    info( '*** Post configure switches and hosts\n')

    CLI(net)