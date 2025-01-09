# mqtt_broker.py
import paho.mqtt.client as mqtt
from datetime import datetime
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IoTBroker:
    def __init__(self, host="localhost", port=1883):
        # Specify callback API version explicitly
        self.client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.host = host
        self.port = port
        
    def on_connect(self, client, userdata, flags, reason_code, properties):
        logger.info(f"Connected with result code {reason_code}")
        # Subscribe to all sensor topics
        self.client.subscribe("sensor/#")
        
    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            logger.info(f"[{timestamp}] {msg.topic}: {payload}")
            
            # Process messages and implement broker logic here
            if msg.topic == "sensor/motion":
                if payload.get("motion_detected", False):
                    self.handle_motion_event(payload)
            elif "temperature" in msg.topic or "humidity" in msg.topic:
                self.check_threshold_violation(msg.topic, payload)
                
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON payload: {msg.payload}")
            
    def handle_motion_event(self, payload):
        if payload.get("motion_detected"):
            # Publish an alert message
            alert_msg = {
                "sensor_id": payload.get("sensor_id"),
                "alert": "Motion detected",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            self.client.publish("alerts/motion", json.dumps(alert_msg))
            
    def check_threshold_violation(self, topic, payload):
        # Define thresholds
        TEMP_THRESHOLD = 30  # °C
        HUMIDITY_THRESHOLD = 80  # %
        
        if "temperature" in topic and payload.get("value", 0) > TEMP_THRESHOLD:
            self.publish_threshold_alert("temperature", payload)
        elif "humidity" in topic and payload.get("value", 0) > HUMIDITY_THRESHOLD:
            self.publish_threshold_alert("humidity", payload)
            
    def publish_threshold_alert(self, sensor_type, payload):
        alert_msg = {
            "sensor_id": payload.get("sensor_id"),
            "alert": f"High {sensor_type} detected",
            "value": payload.get("value"),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.client.publish(f"alerts/{sensor_type}", json.dumps(alert_msg))
        
    def start(self):
        try:
            self.client.connect(self.host, self.port, 60)
            self.client.loop_forever()
        except Exception as e:
            logger.error(f"Failed to start broker: {e}")
            raise

class SensorSimulator:
    def __init__(self, sensor_type, sensor_id, broker_host="localhost", broker_port=1883):
        self.sensor_type = sensor_type
        self.sensor_id = sensor_id
        # Specify callback API version explicitly
        self.client = mqtt.Client(client_id=f"{sensor_type}_{sensor_id}", 
                                callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
        self.client.connect(broker_host, broker_port, 60)
        self.running = False
        self.isolated = False
        
    def generate_reading(self):
        if self.sensor_type == "temperature":
            return round(random.uniform(20, 35), 1)  # °C
        elif self.sensor_type == "humidity":
            return round(random.uniform(30, 90), 1)  # %
        elif self.sensor_type == "motion":
            return random.random() < 0.3  # 30% chance of motion detection
            
    def publish_data(self):
        while self.running and not self.isolated:
            reading = self.generate_reading()
            payload = {
                "sensor_id": self.sensor_id,
                "type": self.sensor_type,
                "value": reading,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            if self.sensor_type == "motion":
                payload["motion_detected"] = reading
                
            self.client.publish(f"sensor/{self.sensor_type}", json.dumps(payload))
            time.sleep(random.uniform(1, 3))  # Random delay between readings
            
    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self.publish_data)
        self.thread.start()
        
    def stop(self):
        self.running = False
        if hasattr(self, 'thread'):
            self.thread.join()
            
    def isolate(self):
        self.isolated = True
        
    def recover(self):
        self.isolated = False

# Example usage
if __name__ == "__main__":
    import random
    import time
    import threading
    
    # Start broker
    broker = IoTBroker()
    broker_thread = threading.Thread(target=broker.start)
    broker_thread.start()
    
    # Start sensors
    sensors = [
        SensorSimulator("temperature", "temp_001"),
        SensorSimulator("humidity", "hum_001"),
        SensorSimulator("motion", "mot_001")
    ]
    
    try:
        for sensor in sensors:
            sensor.start()
        
        # Keep main thread running
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("Shutting down...")
        for sensor in sensors:
            sensor.stop()
        # Note: You'll need to force quit as broker.loop_forever() runs continuously