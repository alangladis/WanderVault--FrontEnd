import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:3031/api"; // Adjust this based on your backend

const ItineraryPage = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newActivity, setNewActivity] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

  // 📌 Fetch all trips from MongoDB
  useEffect(() => {
    axios
      .get("http://localhost:3031/api/getTrips")
      .then((response) => setTrips(response.data))
      .catch((error) => console.error("Error fetching trips:", error));
  }, []);

  // 📌 Select a trip & fetch its itinerary
  const selectTrip = (trip) => {
    setSelectedTrip(trip);
    setItinerary(trip.days || []);
    setShowModal(true);
    // Generate available dates based on trip's startDate and endDate
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const dates = [];
    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }
    setAvailableDates(dates); // Store the available dates
  };

  // 📌 Add a new day to the selected trip (Backend API Call)
  const addDay = async () => {
    if (!selectedTrip || !selectedDate) return;

    try {
      const newDayNumber = itinerary.length + 1;
      const response = await axios.post(`${API_URL}/${selectedTrip._id}/days`, {
        dayNumber: newDayNumber,
        date: selectedDate, // Use the selected date
      });

      setItinerary(response.data.trip.days); // Update itinerary state
      setSelectedDate(""); // Reset date input
    } catch (error) {
      console.error(
        "Error adding day:",
        error.response?.data?.error || error.message
      );
    }
  };

  // 📌 Add an activity to a selected day (Backend API Call)
  const addActivity = async () => {
    if (selectedTrip && selectedDay !== null && newTime && newActivity) {
      try {
        const response = await axios.post(
          `${API_URL}/${selectedTrip._id}/days/${selectedDay + 1}/itinerary`,
          {
            time: newTime,
            activity: newActivity,
            location: "Unknown", // Modify if needed
            notes: "",
          }
        );

        setItinerary(response.data.trip.days); // Update state with new itinerary
        setNewActivity("");
        setNewTime("");
        setSelectedDay(null);
      } catch (error) {
        console.error("Error adding activity:", error);
      }
    }
  };

  return (
    <div className="row d-grid justify-content-justify p-4 bg-white rounded-5 h-100">
      <div className="container p-4 mt-4">
        <h5 className="mb-4 text-center">Trip Planner</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Trip Name</th>
              <th>Destination</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, index) => (
              <tr key={trip._id}>
                <td>{index + 1}</td>
                <td>{trip.name}</td>
                <td>{trip.destination}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => selectTrip(trip)}
                  >
                    View Itinerary
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && selectedTrip && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedTrip.name} - Itinerary
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <button className="btn btn-primary mb-3" onClick={addDay}>
                    + Add Day
                  </button>

                  {/* Date selection */}
                  <div className="mb-3">
                    <label>Select Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={availableDates[0]?.toISOString().split("T")[0]}
                      max={
                        availableDates[availableDates.length - 1]
                          ?.toISOString()
                          .split("T")[0]
                      }
                    />
                  </div>

                  {itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Day {day.dayNumber}</h5>
                        <ul className="list-group">
                          {day.itinerary.map((activity, activityIndex) => (
                            <li key={activityIndex} className="list-group-item">
                              <strong>{activity.time}</strong> -{" "}
                              {activity.activity}
                            </li>
                          ))}
                        </ul>
                        <button
                          className="btn btn-success mt-2"
                          onClick={() => setSelectedDay(dayIndex)}
                        >
                          + Add Activity
                        </button>
                      </div>
                    </div>
                  ))}

                  {selectedDay !== null && (
                    <div className="mt-3">
                      <label>Time:</label>
                      <input
                        type="time"
                        className="form-control"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                      />
                      <label className="mt-2">Activity:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                      />
                      <button
                        className="btn btn-primary mt-2"
                        onClick={addActivity}
                      >
                        Add Activity
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryPage;
