import { useEffect } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const DeviceAnalytics = () => {
  // Data for the devices
  const devices = ['Smart Camera', 'Smart Thermostat', 'Smart Lock'];
  const operating_time = [14, 72, 68];  // in hours
  const connection_quality = [95, 80, 70];  // in percentage
  const usage_frequency = [12, 8, 5];  // times per day

  useEffect(() => {
    const ctx = document.getElementById("deviceAnalyticsChart").getContext("2d");

    new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: devices,
        datasets: [
          {
            label: "Operating Time (hours)",
            data: operating_time,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Connection Quality (%)",
            data: connection_quality,
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
          {
            label: "Usage Frequency (times/day)",
            data: usage_frequency,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          }
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 justify-center items-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Device-Wide Analytics</h2>
      <div className="aspect-w-16 aspect-h-9">
        <canvas id="deviceAnalyticsChart" width="500" height="300"></canvas>
      </div>
    </div>
  );
};

export default DeviceAnalytics;
