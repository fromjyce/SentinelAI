import matplotlib.pyplot as plt
import numpy as np

# Data for the devices (for example, smart camera metrics over a period of time)
devices = ['Smart Camera', 'Smart Thermostat', 'Smart Lock']
operating_time = [14, 72, 68]  # in hours
connection_quality = [95, 80, 70]  # in percentage
usage_frequency = [12, 8, 5]  # times per day


# Create a figure and axis
fig, ax = plt.subplots(figsize=(10, 6))

# Plotting multiple metrics on a bar chart
bar_width = 0.25
index = np.arange(len(devices))

# Creating bars for each metric
bar1 = ax.bar(index - bar_width, operating_time, bar_width, label='Operating Time (hrs)', color='b')
bar2 = ax.bar(index, connection_quality, bar_width, label='Connection Quality (%)', color='g')
bar3 = ax.bar(index + bar_width, usage_frequency, bar_width, label='Usage Frequency (times/day)', color='r')

# Adding labels and title
ax.set_xlabel('Devices')
ax.set_ylabel('Characteristics')
ax.set_xticks(index)
ax.set_xticklabels(devices)
ax.legend()

# Adding value labels on top of bars
def add_labels(bars):
    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2, yval + 0.5, round(yval, 2), ha='center', va='bottom')

add_labels(bar1)
add_labels(bar2)
add_labels(bar3)

# Display the plot
plt.tight_layout()
plt.show()
