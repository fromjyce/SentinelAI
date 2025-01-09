# dashboard.py
import streamlit as st
import paho.mqtt.client as mqtt
import json
from datetime import datetime
import pandas as pd
import time
from collections import deque
import plotly.graph_objects as go
from plotly.subplots import make_subplots

class IoTDashboard:
    def __init__(self, broker_host="localhost", broker_port=1883):
        # Initialize data storage
        self.max_data_points = 100
        self.temperature_data = deque(maxlen=self.max_data_points)
        self.humidity_data = deque(maxlen=self.max_data_points)
        self.motion_events = deque(maxlen=self.max_data_points)
        self.alerts = deque(maxlen=50)
        
        # Initialize MQTT client with VERSION2 callback API
        self.client = mqtt.Client(
            client_id="streamlit_dashboard",
            callback_api_version=mqtt.CallbackAPIVersion.VERSION2
        )
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        
        # Connect to broker
        try:
            self.client.connect(broker_host, broker_port, 60)
            self.client.loop_start()
        except Exception as e:
            st.error(f"Failed to connect to MQTT broker: {e}")
            
    def on_connect(self, client, userdata, flags, reason_code, properties):
        # Subscribe to all sensor and alert topics
        self.client.subscribe("sensor/#")
        self.client.subscribe("alerts/#")
        
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
        if "temperature" in topic:
            self.temperature_data.append({
                'timestamp': timestamp,
                'value': payload['value'],
                'sensor_id': payload['sensor_id']
            })
        elif "humidity" in topic:
            self.humidity_data.append({
                'timestamp': timestamp,
                'value': payload['value'],
                'sensor_id': payload['sensor_id']
            })
        elif "motion" in topic:
            self.motion_events.append({
                'timestamp': timestamp,
                'detected': payload.get('motion_detected', False),
                'sensor_id': payload['sensor_id']
            })
            
    def process_alert(self, payload, timestamp):
        self.alerts.appendleft({
            'timestamp': timestamp,
            'message': payload.get('alert', ''),
            'sensor_id': payload.get('sensor_id', ''),
            'value': payload.get('value', None)
        })
        
    def create_sensor_plots(self):
        # Create figure with secondary y-axis
        fig = make_subplots(specs=[[{"secondary_y": True}]])
        
        # Add temperature data
        if self.temperature_data:
            temp_df = pd.DataFrame(list(self.temperature_data))
            fig.add_trace(
                go.Scatter(x=temp_df['timestamp'], y=temp_df['value'],
                          name="Temperature (°C)", line=dict(color='red')),
                secondary_y=False
            )
            
        # Add humidity data
        if self.humidity_data:
            humid_df = pd.DataFrame(list(self.humidity_data))
            fig.add_trace(
                go.Scatter(x=humid_df['timestamp'], y=humid_df['value'],
                          name="Humidity (%)", line=dict(color='blue')),
                secondary_y=True
            )
            
        # Update layout
        fig.update_layout(
            title="Sensor Readings Over Time",
            xaxis_title="Time",
            height=400
        )
        
        # Update y-axes labels
        fig.update_yaxes(title_text="Temperature (°C)", secondary_y=False)
        fig.update_yaxes(title_text="Humidity (%)", secondary_y=True)
        
        return fig
        
    def create_motion_plot(self):
        if not self.motion_events:
            return None
            
        motion_df = pd.DataFrame(list(self.motion_events))
        
        fig = go.Figure()
        fig.add_trace(
            go.Scatter(x=motion_df['timestamp'], 
                      y=[1 if x else 0 for x in motion_df['detected']],
                      mode='markers',
                      name="Motion Events",
                      marker=dict(size=10,
                                color=['red' if x else 'green' for x in motion_df['detected']]))
        )
        
        fig.update_layout(
            title="Motion Detection Events",
            xaxis_title="Time",
            yaxis_title="Motion Detected",
            height=200,
            yaxis=dict(tickmode='array',
                      ticktext=['No Motion', 'Motion Detected'],
                      tickvals=[0, 1])
        )
        
        return fig

def main():
    st.set_page_config(page_title="IoT Sensor Dashboard", layout="wide")
    
    # Initialize session state for refresh
    if 'refresh_counter' not in st.session_state:
        st.session_state.refresh_counter = 0
    
    st.title("IoT Sensor Network Dashboard")
    
    # Initialize dashboard
    if 'dashboard' not in st.session_state:
        st.session_state.dashboard = IoTDashboard()
    
    # Create columns for layout
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # Display sensor plots
        st.plotly_chart(st.session_state.dashboard.create_sensor_plots(), use_container_width=True)
        
        # Display motion events
        motion_plot = st.session_state.dashboard.create_motion_plot()
        if motion_plot:
            st.plotly_chart(motion_plot, use_container_width=True)
    
    with col2:
        # Display alerts
        st.subheader("Recent Alerts")
        if st.session_state.dashboard.alerts:
            for alert in list(st.session_state.dashboard.alerts)[:10]:
                alert_color = "red" if "High" in alert['message'] else "orange"
                st.markdown(
                    f"""
                    <div style='padding: 10px; border-left: 5px solid {alert_color}; margin-bottom: 10px;'>
                        <small>{alert['timestamp'].strftime('%H:%M:%S')}</small><br>
                        <strong>{alert['message']}</strong><br>
                        Sensor: {alert['sensor_id']}
                        {f"<br>Value: {alert['value']}" if alert['value'] is not None else ""}
                    </div>
                    """,
                    unsafe_allow_html=True
                )
        else:
            st.info("No alerts received yet")
    
    # Add refresh button and auto-refresh
    with st.sidebar:
        st.button("Refresh Data", on_click=lambda: st.rerun())
        auto_refresh = st.checkbox("Enable Auto-refresh", value=True)
    
    # Auto-refresh using empty element
    if auto_refresh:
        refresh_placeholder = st.empty()
        time.sleep(1)  # Wait for 1 second
        st.session_state.refresh_counter += 1
        refresh_placeholder.write(f"Last updated: {datetime.now().strftime('%H:%M:%S')}")
        st.rerun()

if __name__ == "__main__":
    main()