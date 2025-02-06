import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import ToDoList from "./ToDoList";
import TravelStats from "./TravelStats";
import BudgetTracker from "./budget/BudgetTracker";
import Calendar from "react-calendar/dist/cjs/Calendar.js";
import CursorFollower from "./CursorFollower";

const Dashboard = () => {
  const budgetUsed = 70; // Example: 70% budget used
  const payments = ["Hotel - $100", "Flight - $250", "Food - $50"];
  const totalTrips = 12;
  const distanceTraveled = 25000; // in km
  const budgetBreakdown = {
    Flights: 40,
    Hotels: 30,
    Food: 20,
    Activities: 10,
  };

  // State to store trips, loading state, and date
  const [date, setDate] = useState(new Date());
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false); // Define loading state

  // Tile disabled and content for displaying destination name
  const tileDisabled = ({ date }) => {
    // Check if the date is within any trip's date range
    for (let trip of trips) {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);

      if (date >= startDate && date <= endDate) {
        return true; // Disable the date if it's within the trip range
      }
    }
    return false;
  };

  const tileContent = ({ date }) => {
    // Display the destination name on disabled dates
    for (let trip of trips) {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);

      if (date >= startDate && date <= endDate) {
        return <span className="destination-name">{trip.destination}</span>; // Add destination name on disabled dates
      }
    }
    return null;
  };

  // Fetch trips from API
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3031/api/getTrips"); // Adjust to your API endpoint
      setTrips(response.data); // Set trips data from API
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(); // Fetch trips when the component mounts
  }, []);

  return (
    <div className="d-flex w-100 p-4 justify-content-center align-items-center h-100 rounded-5 ">
      <div
        className="col-md-6 bg-light me-2 rounded-5"
        style={{ minHeight: "80vh" }}
      >
        <TravelStats
          totalTrips={totalTrips}
          distanceTraveled={distanceTraveled}
          budgetBreakdown={budgetBreakdown}
        />
        <CursorFollower/>
      </div>
      <div className="col-md-6 rounded-5" style={{ minHeight: "80vh" }}>
        <div className="row d-flex justify-content-center">
          <div className="col-md-11 bg-light rounded-5 m-2 p-3">
            <Calendar
              onChange={setDate}
              value={date}
              tileDisabled={tileDisabled}
              tileContent={tileContent} // Add tileContent to show destination name
            />
          </div>
        </div>
        <div className="row justify-content-center align-items-center d-flex">
          <div
            className="col-md-5 bg-light rounded-5 m-2"
            style={{ minHeight: "42vh" }}
          >
            <BudgetTracker budgetUsed={budgetUsed} payments={payments} />
          </div>
          <div
            className="col-md-5 bg-light rounded-5 m-2"
            style={{ minHeight: "42vh" }}
          >
            <ToDoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
