import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Dashboard from "./component/Dashboard";
import TripDetailsForm from "./component/trip/TripDetailsForm";
import BudgetEntry from "./component/budget/BudgetEntry";
import ToDoList from "./component/trip/ToDoList";
import ItineraryPage from "./component/trip/ItineraryPage";
import TravelPath from "./component/trip/TravelPath";
import Login from "./component/auth/Login";
import SignUp from "./component/auth/SignUp";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      {isAuthenticated && (
        <Navbar
          toggleSidebar={toggleSidebar}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      <div className="main-container">
        {isAuthenticated && <Sidebar isSidebarOpen={isSidebarOpen} />}
        <div className="content bg-dark">
          <Routes>
            <Route path="/signup" element={<SignUp />} />

            {!isAuthenticated ? (
              <Route
                path="/*"
                element={<Login setIsAuthenticated={setIsAuthenticated} />}
              />
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tripdetails" element={<TripDetailsForm />} />
                <Route path="/budgetentry" element={<BudgetEntry />} />
                <Route path="/todo" element={<ToDoList />} />
                <Route path="/itinerarypage" element={<ItineraryPage />} />
                <Route path="/travelpath" element={<TravelPath />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
