import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const TravelStats = ({ totalTrips, distanceTraveled, budgetBreakdown }) => {
  // Bar Chart Data (Total Trips & Distance)
  const tripsData = {
    labels: ["Total Trips", "Distance Traveled (km)"],
    datasets: [
      {
        label: "Travel Stats",
        data: [totalTrips, distanceTraveled],
        backgroundColor: ["#4caf50", "#2196f3"],
      },
    ],
  };

  // Line Chart Data (Travel Trend Over Time)
  const travelTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        // label: "Trips Per Month",
        data: [2, 3, 5, 7, 6, 8, 10, 12, 9],
        borderColor: "#ff5733",
        backgroundColor: "rgba(255, 87, 51, 0.5)",
        fill: true,
      },
    ],
  };

  // Donut Chart Data (Budget Breakdown)
  const doughnutOptions = {
    plugins: {
      legend: {
        position: "left", // Moves labels to the left side
        labels: {
          boxWidth: 7, // Reduces legend box size
          padding: 5, // Adds spacing
        },
      },
    },
    maintainAspectRatio: false, // Allows better resizing
    responsive: true,
  };

  const budgetData1 = {
    labels: ["Flights", "Hotels", "Food", "Activities"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#ff9800", "#e91e63", "#3f51b5", "#009688"],
      },
    ],
  };

  const budgetData2 = {
    labels: ["Flights", "Hotels", "Food", "Activities"],
    datasets: [
      {
        data: [50, 20, 15, 15],
        backgroundColor: ["#ff9800", "#e91e63", "#3f51b5", "#009688"],
      },
    ],
  };

  const budgetData3 = {
    labels: ["Flights", "Hotels", "Food", "Activities"],
    datasets: [
      {
        data: [25, 25, 25, 25],
        backgroundColor: ["#ff9800", "#e91e63", "#3f51b5", "#009688"],
      },
    ],
  };

  return (
    <div
      className="container p-3 rounded"
      style={{ minHeight: "80hv", maxHeight: "80vh", overflowY: "auto" }}
    >
      <h3 className="text-center mb-3"> Travel Stats & Insights</h3>

      <div className="row">
        {/* Row 1: Two Charts Side by Side */}
        <div className="col-md-6 mb-3" style={{ maxHeight: "20vh" }}>
          <h5> Total Trips & Distance</h5>
          <Bar data={tripsData} />
        </div>
        <div className="col-md-6 mb-3" style={{ maxHeight: "20vh" }}>
          <h5> Travel Trend Over Time</h5>
          <Line data={travelTrendData} />
        </div>

        {/* Row 2: 3 Donut Charts for Budget Breakdown */}
        <div
          className="col-12 mb-3 d-flex justify-content-around"
          style={{ maxHeight: "20vh" }}
        >
          <div style={{ width: "200px", height: "200px" }}>
            <Doughnut data={budgetData1} options={doughnutOptions} />
          </div>
          <div style={{ width: "200px", height: "200px" }}>
            <Doughnut data={budgetData2} options={doughnutOptions} />
          </div>
          <div style={{ width: "200px", height: "200px" }}>
            <Doughnut data={budgetData3} options={doughnutOptions} />
          </div>
        </div>

        {/* Row 3: Travel Highlights List */}
        <div className="col-12" style={{ maxHeight: "20vh" }}>
          <h5> Travel Highlights</h5>
          <ul className="list-group">
            <li className="list-group-item">Most Frequent Destination: Bali</li>
            <li className="list-group-item">Longest Trip: 15 days in Europe</li>
            <li className="list-group-item">
              Most Expensive Trip: Japan ($3000)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TravelStats;
