# dashboard.py
import streamlit as st
import paho.mqtt.client as mqtt
import json
from datetime import datetime
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from collections import deque
import time
import math

class ScenarioDashboard:
    def __init__(self, scenario, broker_host="localhost", broker_port=1883):
        self.scenario = scenario
        self.max_data_points = 100
        self.data_stores = {}
        self.alerts = deque(maxlen=50)
        
        # Initialize data stores based on scenario
        self.initialize_data_stores()
        
        # Initialize MQTT client
        self.client = mqtt.Client(
            client_id=f"dashboard_{scenario}",
            callback_api_version=mqtt.CallbackAPIVersion.VERSION2
        )
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        
        try:
            self.client.connect(broker_host, broker_port, 60)
            self.client.loop_start()
        except Exception as e:
            st.error(f"Failed to connect to MQTT broker: {e}")

    def initialize_data_stores(self):
        scenario_sensors = {
            "healthcare": ["heart_rate", "blood_pressure", "oxygen_saturation"],
            "autonomous_vehicle": ["lidar", "speed", "obstacle"],
            "defense": ["radar", "infrared", "signal"],
            "home_iot": ["temperature", "humidity", "motion", "power"]
        }
        
        for sensor in scenario_sensors.get(self.scenario, []):
            self.data_stores[sensor] = deque(maxlen=self.max_data_points)

    def on_connect(self, client, userdata, flags, reason_code, properties):
        self.client.subscribe(f"sensor/{self.scenario}/#")
        self.client.subscribe(f"alerts/{self.scenario}/#")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            timestamp = datetime.now()
            
            if "sensor" in msg.topic:
                self.process_sensor_data(msg.topic, payload, timestamp)
            elif "alerts" in msg.topic:
                self.process_alert(payload, timestamp)
        except json.JSONDecodeError:
            st.error(f"Invalid JSON payload: {msg.payload}")

    def process_sensor_data(self, topic, payload, timestamp):
        sensor_type = topic.split('/')[-1]
        if sensor_type in self.data_stores:
            self.data_stores[sensor_type].append({
                'timestamp': timestamp,
                'value': payload['value'],
                'sensor_id': payload['sensor_id']
            })

    def process_alert(self, payload, timestamp):
        self.alerts.appendleft({
            'timestamp': timestamp,
            'message': payload.get('alert', ''),
            'sensor_id': payload.get('sensor_id', ''),
            'value': payload.get('value', None)
        })

    def create_healthcare_dashboard(self):
        fig = make_subplots(rows=3, cols=1, subplot_titles=('Heart Rate', 'Blood Pressure', 'Oxygen Saturation'))
        
        if self.data_stores['heart_rate']:
            df = pd.DataFrame(list(self.data_stores['heart_rate']))
            fig.add_trace(
                go.Scatter(x=df['timestamp'], y=df['value'], name="Heart Rate (BPM)"),
                row=1, col=1
            )
        
        if self.data_stores['blood_pressure']:
            df = pd.DataFrame(list(self.data_stores['blood_pressure']))
            values = pd.json_normalize(df['value'])
            fig.add_trace(
                go.Scatter(x=df['timestamp'], y=values['systolic'], name="Systolic"),
                row=2, col=1
            )
            fig.add_trace(
                go.Scatter(x=df['timestamp'], y=values['diastolic'], name="Diastolic"),
                row=2, col=1
            )
        
        if self.data_stores['oxygen_saturation']:
            df = pd.DataFrame(list(self.data_stores['oxygen_saturation']))
            fig.add_trace(
                go.Scatter(x=df['timestamp'], y=df['value'], name="SpO2 (%)"),
                row=3, col=1
            )
        
        fig.update_layout(height=800, showlegend=True)
        return fig

    def create_autonomous_vehicle_dashboard(self):
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('LIDAR Readings', 'Vehicle Speed', 'Obstacle Detection', 'Obstacle Types')
        )
        
        if self.data_stores['lidar']:
            latest_lidar = list(self.data_stores['lidar'])[-1]['value']
            angles = [float(k) for k in latest_lidar.keys()]
            distances = list(latest_lidar.values())
            fig.add_trace(
                go.Scatterpolar(r=distances, theta=angles, mode='lines+markers'),
                row=1, col=1
            )
        
        if self.data_stores['speed']:
            df = pd.DataFrame(list(self.data_stores['speed']))
            fig.add_trace(
                go.Scatter(x=df['timestamp'], y=df['value'], name="Speed (km/h)"),
                row=1, col=2
            )
        
        if self.data_stores['obstacle']:
            df = pd.DataFrame(list(self.data_stores['obstacle']))
            obstacle_data = pd.json_normalize(df['value'])
            detected = obstacle_data['detected'].astype(int)
            fig.add_trace(
                go.Scatter(x=df['timestamp'], y=detected, mode='markers', name="Obstacles"),
                row=2, col=1
            )
            
            if not obstacle_data.empty and 'type' in obstacle_data.columns:
                obstacle_types = obstacle_data[obstacle_data['detected']]['type'].value_counts()
                fig.add_trace(
                    go.Pie(labels=obstacle_types.index, values=obstacle_types.values),
                    row=2, col=2
                )
        
        fig.update_layout(height=800, showlegend=True)
        return fig

    def create_defense_dashboard(self):
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('Radar Contacts', 'Contact Altitudes', 'Infrared Readings', 'Signal Detection')
        )
        
        if self.data_stores['radar']:
            latest_contacts = list(self.data_stores['radar'])[-1]['value']
            if latest_contacts:
                bearings = [c['bearing'] for c in latest_contacts]
                ranges = [c['range'] for c in latest_contacts]
                fig.add_trace(
                    go.Scatterpolar(r=ranges, theta=bearings, mode='markers'),
                    row=1, col=1
                )
                
                altitudes = [c['altitude'] for c in latest_contacts]
                fig.add_trace(
                    go.Histogram(x=altitudes, nbinsx=20),
                    row=1, col=2
                )
        
        if self.data_stores['infrared']:
            df = pd.DataFrame(list(self.data_stores['infrared']))
            fig.add_trace(
                go.Scatter(x=df['timestamp'], y=df['value'], name="Temperature (°C)"),
                row=2, col=1
            )
        
        if self.data_stores['signal']:
            df = pd.DataFrame(list(self.data_stores['signal']))
            signal_data = pd.json_normalize(df['value'])
            if not signal_data.empty and 'detected' in signal_data.columns:
                detected_signals = signal_data[signal_data['detected']]
                if not detected_signals.empty and 'strength' in detected_signals.columns:
                    fig.add_trace(
                        go.Scatter(
                            x=df['timestamp'][signal_data['detected']],
                            y=detected_signals['strength'],
                            mode='markers',
                            name='Signal Strength (dBm)',
                            marker=dict(
                                color=detected_signals['frequency'],
                                colorscale='Viridis',
                                showscale=True,
                                colorbar=dict(title='Frequency (MHz)')
                            )
                        ),
                        row=2, col=2
                    )
        
        fig.update_layout(height=800, showlegend=True)
        return fig

    def create_home_iot_dashboard(self):
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('Temperature & Humidity', 'Motion Events', 
                          'Power Consumption', 'Daily Power Usage Pattern'),
            specs=[[{"secondary_y": True}, {}],
                  [{}, {"type": "polar"}]]
        )
        
        # Temperature & Humidity Plot
        if self.data_stores['temperature'] and self.data_stores['humidity']:
            temp_df = pd.DataFrame(list(self.data_stores['temperature']))
            humid_df = pd.DataFrame(list(self.data_stores['humidity']))
            
            fig.add_trace(
                go.Scatter(x=temp_df['timestamp'], y=temp_df['value'],
                          name="Temperature (°C)", line=dict(color='red')),
                row=1, col=1, secondary_y=False
            )
            fig.add_trace(
                go.Scatter(x=humid_df['timestamp'], y=humid_df['value'],
                          name="Humidity (%)", line=dict(color='blue')),
                row=1, col=1, secondary_y=True
            )
        
        # Motion Events
        if self.data_stores['motion']:
            motion_df = pd.DataFrame(list(self.data_stores['motion']))
            fig.add_trace(
                go.Scatter(x=motion_df['timestamp'],
                          y=[1 if x else 0 for x in motion_df['value']],
                          mode='markers',
                          name="Motion Events",
                          marker=dict(size=10,
                                    color=['red' if x else 'green' 
                                          for x in motion_df['value']])),
                row=1, col=2
            )
        
        # Power Consumption
        if self.data_stores['power']:
            power_df = pd.DataFrame(list(self.data_stores['power']))
            fig.add_trace(
                go.Scatter(x=power_df['timestamp'], y=power_df['value'],
                          name="Power (W)", fill='tozeroy'),
                row=2, col=1
            )
            
            # Daily Power Usage Pattern (Polar Plot)
            if not power_df.empty:
                hours = power_df['timestamp'].dt.hour
                avg_power_by_hour = power_df.groupby(hours)['value'].mean()
                fig.add_trace(
                    go.Scatterpolar(
                        r=avg_power_by_hour.values,
                        theta=avg_power_by_hour.index * 15,  # Convert to degrees
                        name="Daily Pattern",
                        fill='toself'
                    ),
                    row=2, col=2
                )
        
        fig.update_layout(height=800, showlegend=True)
        return fig

def main():
    st.set_page_config(page_title="Multi-Scenario IoT Dashboard", layout="wide")
    
    # Initialize session state
    if 'current_scenario' not in st.session_state:
        st.session_state.current_scenario = 'healthcare'
    if 'dashboards' not in st.session_state:
        st.session_state.dashboards = {}
    if 'refresh_counter' not in st.session_state:
        st.session_state.refresh_counter = 0
    
    # Sidebar controls
    with st.sidebar:
        st.title("Dashboard Controls")
        
        scenario = st.selectbox(
            "Select Scenario",
            ["healthcare", "autonomous_vehicle", "defense", "home_iot"],
            key="scenario_selector"
        )
        
        if scenario not in st.session_state.dashboards:
            st.session_state.dashboards[scenario] = ScenarioDashboard(scenario)
        
        st.button("Refresh Data", on_click=lambda: st.rerun())
        auto_refresh = st.checkbox("Enable Auto-refresh", value=True)
        refresh_rate = st.slider("Refresh Rate (seconds)", 1, 10, 5)
    
    # Main content
    st.title(f"{scenario.replace('_', ' ').title()} IoT Dashboard")
    
    # Get current dashboard
    dashboard = st.session_state.dashboards[scenario]
    
    # Display scenario-specific dashboard
    if scenario == "healthcare":
        st.plotly_chart(dashboard.create_healthcare_dashboard(), use_container_width=True)
    elif scenario == "autonomous_vehicle":
        st.plotly_chart(dashboard.create_autonomous_vehicle_dashboard(), use_container_width=True)
    elif scenario == "defense":
        st.plotly_chart(dashboard.create_defense_dashboard(), use_container_width=True)
    elif scenario == "home_iot":
        st.plotly_chart(dashboard.create_home_iot_dashboard(), use_container_width=True)
    
    # Display alerts
    st.subheader("Recent Alerts")
    col1, col2 = st.columns([2, 1])
    
    with col1:
        if dashboard.alerts:
            for alert in list(dashboard.alerts)[:5]:
                severity = "🔴" if "critical" in alert['message'].lower() else "🟡"
                st.markdown(
                    f"""
                    <div style='padding: 10px; border-left: 5px solid {"red" if "critical" in alert["message"].lower() else "orange"}; margin-bottom: 10px;'>
                        {severity} <small>{alert['timestamp'].strftime('%H:%M:%S')}</small><br>
                        <strong>{alert['message']}</strong><br>
                        Sensor: {alert['sensor_id']}
                        {f"<br>Value: {alert['value']}" if alert['value'] is not None else ""}
                    </div>
                    """,
                    unsafe_allow_html=True
                )
        else:
            st.info("No alerts received yet")
    
    # Auto-refresh logic
    if auto_refresh:
        time.sleep(refresh_rate)
        st.rerun()

if __name__ == "__main__":
    main()