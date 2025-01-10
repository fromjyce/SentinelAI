# simulation_controller.py
import threading
import time
from sensor import (HealthcareSensor, AutonomousVehicleSensor, 
                    DefenseSensor, HomeIoTSensor)

class SimulationController:
    def __init__(self):
        self.scenarios = {
            "healthcare": {
                "sensors": [
                    HealthcareSensor("heart_rate", "hr_001", "healthcare"),
                    HealthcareSensor("blood_pressure", "bp_001", "healthcare"),
                    HealthcareSensor("oxygen_saturation", "ox_001", "healthcare")
                ]
            },
            "autonomous_vehicle": {
                "sensors": [
                    AutonomousVehicleSensor("lidar", "lid_001", "autonomous_vehicle"),
                    AutonomousVehicleSensor("speed", "spd_001", "autonomous_vehicle"),
                    AutonomousVehicleSensor("obstacle", "obs_001", "autonomous_vehicle")
                ]
            },
            "defense": {
                "sensors": [
                    DefenseSensor("radar", "rad_001", "defense"),
                    DefenseSensor("infrared", "ir_001", "defense"),
                    DefenseSensor("signal", "sig_001", "defense")
                ]
            },
            "home_iot": {
                "sensors": [
                    HomeIoTSensor("temperature", "temp_001", "home_iot"),
                    HomeIoTSensor("humidity", "hum_001", "home_iot"),
                    HomeIoTSensor("motion", "mot_001", "home_iot"),
                    HomeIoTSensor("power", "pwr_001", "home_iot")
                ]
            }
        }

    def start_scenario(self, scenario):
        if scenario in self.scenarios:
            for sensor in self.scenarios[scenario]["sensors"]:
                sensor.start()

    def stop_scenario(self, scenario):
        if scenario in self.scenarios:
            for sensor in self.scenarios[scenario]["sensors"]:
                sensor.stop()

    def start_all(self):
        for scenario in self.scenarios:
            self.start_scenario(scenario)

    def stop_all(self):
        for scenario in self.scenarios:
            self.stop_scenario(scenario)

if __name__ == "__main__":
    controller = SimulationController()
    try:
        controller.start_all()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down simulation...")
        controller.stop_all()