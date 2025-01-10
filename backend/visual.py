import streamlit as st
import requests
import pandas as pd
import altair as alt
from datetime import datetime
import time
import random

# Configure API URL
api_url = "http://192.168.56.1:3000"

# Initialize persistent session states
if 'domains' not in st.session_state:
    st.session_state.domains = {
        'healthcare': {
            'name': 'Healthcare Blockchain',
            'devices': [],
            'gas_fees': [],
            'device_prefix': 'med-device-'
        },
        'autonomous': {
            'name': 'Autonomous Vehicle Network',
            'devices': [],
            'gas_fees': [],
            'device_prefix': 'vehicle-'
        },
        'defense': {
            'name': 'Defense Network',
            'devices': [],
            'gas_fees': [],
            'device_prefix': 'secure-node-'
        },
        'home_iot': {
            'name': 'Home IoT Network',
            'devices': [],
            'gas_fees': [],
            'device_prefix': 'home-device-'
        }
    }

if 'current_domain' not in st.session_state:
    st.session_state.current_domain = 'healthcare'

# Main title and domain selector
st.title("Multi-Domain Blockchain Simulator")
selected_domain = st.selectbox(
    "Select Domain",
    options=list(st.session_state.domains.keys()),
    format_func=lambda x: st.session_state.domains[x]['name'],
    key='domain_selector'
)

# Update current domain if changed
if selected_domain != st.session_state.current_domain:
    st.session_state.current_domain = selected_domain

# Get current domain data
current_domain = st.session_state.domains[selected_domain]

# Function to plot gas fees with domain context
def plot_gas_fees(gas_fees_data, domain_name):
    if not gas_fees_data:
        return
    
    df = pd.DataFrame(gas_fees_data, columns=['Timestamp', 'Operation', 'Gas Fee'])
    
    chart = alt.Chart(df).mark_line(point=True).encode(
        x=alt.X('Timestamp:T', title='Time'),
        y=alt.Y('Gas Fee:Q', title=f'Gas Fee (Gwei) - {domain_name}'),
        color=alt.Color('Operation:N', title='Operation Type'),
        tooltip=['Timestamp:T', 'Operation:N', 'Gas Fee:Q']
    ).properties(
        width=700,
        height=400,
        title=f'Gas Fees Over Time - {domain_name}'
    )
    
    st.altair_chart(chart, use_container_width=True)

# Function to display blockchain data with domain context
def display_blockchain_data(blockchain_data, domain_name, device_prefix):
    st.subheader(f"{domain_name} Blockchain Transactions")
    
    transactions = []
    for block in blockchain_data['blockchain']:
        for tx in block['transactions']:
            if tx['deviceName'].startswith(device_prefix):
                tx['blockIndex'] = block['index']
                tx['blockHash'] = block['hash']
                transactions.append(tx)
    
    if transactions:
        df = pd.DataFrame(transactions)
        st.dataframe(df)
    else:
        st.info(f"No transactions found for {domain_name}")

# Device Registration Section
st.header(f"Register New {current_domain['name']} Device")
col1, col2 = st.columns(2)
with col1:
    device_name = st.text_input(
        "Device Name",
        f"{current_domain['device_prefix']}{len(current_domain['devices']) + 1}",
        key=f"device_name_{selected_domain}"
    )
with col2:
    device_ip = st.text_input(
        "Device IP", 
        f"192.168.1.{len(current_domain['devices']) + 1}",
        key=f"device_ip_{selected_domain}"
    )

if st.button("Register Device", key=f"register_{selected_domain}"):
    try:
        response = requests.post(
            f"{api_url}/register-device", 
            json={"name": device_name, "ip": device_ip}
        )
        if response.status_code == 200:
            data = response.json()
            st.success(f"Device {device_name} registered successfully!")
            
            # Update domain-specific gas fees data
            st.session_state.domains[selected_domain]['gas_fees'].append([
                datetime.now(),
                'register',
                data['transaction']['gasFee']
            ])
            
            # Update domain-specific devices list
            st.session_state.domains[selected_domain]['devices'].append(data['device'])
        else:
            st.error("Failed to register device")
    except Exception as e:
        st.error(f"Error: {str(e)}")

# Device Management Section
st.header(f"Manage {current_domain['name']} Devices")
if current_domain['devices']:
    selected_device = st.selectbox(
        "Select Device",
        options=current_domain['devices'],
        format_func=lambda x: f"{x['name']} ({x['status']})",
        key=f"device_select_{selected_domain}"
    )
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("Remove Device", key=f"remove_{selected_domain}") and selected_device['status'] == 'active':
            try:
                response = requests.post(
                    f"{api_url}/remove-device",
                    json={"identityKey": selected_device['identityKey']}
                )
                if response.status_code == 200:
                    data = response.json()
                    st.success(f"Device {selected_device['name']} removed successfully!")
                    
                    st.session_state.domains[selected_domain]['gas_fees'].append([
                        datetime.now(),
                        'remove',
                        data['transaction']['gasFee']
                    ])
                    
                    for device in st.session_state.domains[selected_domain]['devices']:
                        if device['identityKey'] == selected_device['identityKey']:
                            device['status'] = 'removed'
                            
            except Exception as e:
                st.error(f"Error: {str(e)}")
    
    with col2:
        if st.button("Recover Device", key=f"recover_{selected_domain}") and selected_device['status'] == 'removed':
            try:
                response = requests.post(
                    f"{api_url}/recover-device",
                    json={"identityKey": selected_device['identityKey']}
                )
                if response.status_code == 200:
                    data = response.json()
                    st.success(f"Device {selected_device['name']} recovered successfully!")
                    
                    st.session_state.domains[selected_domain]['gas_fees'].append([
                        datetime.now(),
                        'recover',
                        data['transaction']['gasFee']
                    ])
                    
                    for i, device in enumerate(st.session_state.domains[selected_domain]['devices']):
                        if device['identityKey'] == selected_device['identityKey']:
                            st.session_state.domains[selected_domain]['devices'][i] = data['device']
                            
            except Exception as e:
                st.error(f"Error: {str(e)}")
else:
    st.info(f"No devices registered yet in {current_domain['name']}")

# Display Domain-Specific Gas Fees Chart
st.header(f"{current_domain['name']} Gas Fees Analysis")
plot_gas_fees(current_domain['gas_fees'], current_domain['name'])

# Domain-Specific Blockchain Data Display
st.header(f"{current_domain['name']} Blockchain Explorer")
if st.button("Refresh Blockchain Data", key=f"refresh_{selected_domain}"):
    try:
        response = requests.get(f"{api_url}/blockchain")
        if response.status_code == 200:
            blockchain_data = response.json()
            display_blockchain_data(blockchain_data, current_domain['name'], current_domain['device_prefix'])
        else:
            st.error("Failed to fetch blockchain data")
    except Exception as e:
        st.error(f"Error: {str(e)}")