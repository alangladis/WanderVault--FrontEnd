import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/todo">To-Do</Link>
        </li>
        <li>
          <Link to="/budgetentry">Add Budget</Link>
        </li>
        <li>
          <Link to="/tripdetails">Add Trip</Link>
        </li>{" "}
        <li>
          <Link to="/itinerarypage">Itinerary Page</Link>
        </li>{" "}
        <li>
          <Link to="/travelpath">Travel Path</Link>
        </li>
      </ul>
    </aside>
  );;
};

export default Sidebar;
