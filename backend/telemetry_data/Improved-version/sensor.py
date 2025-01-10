# sensors.py
import random
from datetime import datetime
import json
import time
import threading
import paho.mqtt.client as mqtt
import math

class BaseSensor:
    def __init__(self, sensor_type, sensor_id, scenario, broker_host="localhost", broker_port=1883):
        self.sensor_type = sensor_type
        self.sensor_id = sensor_id
        self.scenario = scenario
        self.client = mqtt.Client(
            client_id=f"{scenario}_{sensor_type}_{sensor_id}",
            callback_api_version=mqtt.CallbackAPIVersion.VERSION2
        )
        self.client.connect(broker_host, broker_port, 60)
        self.running = False
        self.isolated = False

    def generate_reading(self):
        raise NotImplementedError

    def publish_data(self):
        while self.running and not self.isolated:
            reading = self.generate_reading()
            payload = {
                "sensor_id": self.sensor_id,
                "type": self.sensor_type,
                "scenario": self.scenario,
                "value": reading,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            self.client.publish(f"sensor/{self.scenario}/{self.sensor_type}", json.dumps(payload))
            time.sleep(random.uniform(0.5, 2))

    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self.publish_data)
        self.thread.start()

    def stop(self):
        self.running = False
        if hasattr(self, 'thread'):
            self.thread.join()

class HealthcareSensor(BaseSensor):
    def generate_reading(self):
        if self.sensor_type == "heart_rate":
            # Normal heart rate with occasional anomalies
            base_rate = 75
            variation = random.gauss(0, 5)
            if random.random() < 0.05:  # 5% chance of anomaly
                variation += random.choice([-20, 20])
            return max(40, min(120, base_rate + variation))
            
        elif self.sensor_type == "blood_pressure":
            # Generate systolic/diastolic
            sys_base = 120
            dia_base = 80
            variation = random.gauss(0, 5)
            return {
                "systolic": max(90, min(160, sys_base + variation)),
                "diastolic": max(60, min(100, dia_base + variation))
            }
            
        elif self.sensor_type == "oxygen_saturation":
            # Normal SpO2 with occasional dips
            base_spo2 = 98
            variation = random.gauss(0, 1)
            if random.random() < 0.03:  # 3% chance of low oxygen
                variation -= random.uniform(5, 10)
            return max(85, min(100, base_spo2 + variation))

class AutonomousVehicleSensor(BaseSensor):
    def generate_reading(self):
        if self.sensor_type == "lidar":
            # Simulate distance readings from multiple angles
            angles = list(range(0, 360, 45))
            return {
                str(angle): round(random.uniform(0.5, 50.0), 2)
                for angle in angles
            }
            
        elif self.sensor_type == "speed":
            # Speed in km/h with realistic variations
            base_speed = 60
            variation = random.gauss(0, 5)
            return max(0, min(120, base_speed + variation))
            
        elif self.sensor_type == "obstacle":
            # Detect obstacles with distance and type
            if random.random() < 0.2:  # 20% chance of obstacle
                return {
                    "detected": True,
                    "distance": round(random.uniform(5, 30), 1),
                    "type": random.choice(["vehicle", "pedestrian", "static"])
                }
            return {"detected": False}

class DefenseSensor(BaseSensor):
    def generate_reading(self):
        if self.sensor_type == "radar":
            # Simulate radar contacts
            contacts = []
            if random.random() < 0.3:  # 30% chance of contact
                num_contacts = random.randint(1, 3)
                for _ in range(num_contacts):
                    contacts.append({
                        "range": round(random.uniform(1000, 50000), 0),
                        "bearing": round(random.uniform(0, 359), 1),
                        "altitude": round(random.uniform(0, 30000), 0),
                        "speed": round(random.uniform(100, 1000), 0)
                    })
            return contacts
            
        elif self.sensor_type == "infrared":
            # Thermal signature detection
            base_temp = 25
            variation = random.gauss(0, 2)
            if random.random() < 0.1:  # 10% chance of hot spot
                variation += random.uniform(10, 30)
            return round(base_temp + variation, 1)
            
        elif self.sensor_type == "signal":
            # RF signal detection
            if random.random() < 0.15:  # 15% chance of signal
                return {
                    "detected": True,
                    "frequency": round(random.uniform(30, 300), 1),
                    "strength": round(random.uniform(-90, -30), 1),
                    "type": random.choice(["communication", "radar", "unknown"])
                }
            return {"detected": False}

class HomeIoTSensor(BaseSensor):
    def generate_reading(self):
        if self.sensor_type == "temperature":
            # Indoor temperature with daily patterns
            hour = datetime.now().hour
            base_temp = 22 + math.sin(hour * math.pi / 12)  # Daily cycle
            variation = random.gauss(0, 0.5)
            return round(base_temp + variation, 1)
            
        elif self.sensor_type == "humidity":
            # Indoor humidity
            base_humidity = 45
            variation = random.gauss(0, 3)
            return max(30, min(70, base_humidity + variation))
            
        elif self.sensor_type == "motion":
            # Motion detection with time-based probability
            hour = datetime.now().hour
            # Higher probability during day hours
            probability = 0.3 if 8 <= hour <= 22 else 0.05
            return random.random() < probability
            
        elif self.sensor_type == "power":
            # Power consumption in watts
            base_load = 1000
            hour = datetime.now().hour
            # Higher consumption during peak hours
            if 17 <= hour <= 21:  # Evening peak
                base_load *= 2
            variation = random.gauss(0, 100)
            return max(100, base_load + variation)