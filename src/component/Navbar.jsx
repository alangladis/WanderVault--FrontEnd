import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ThemeToggle from "./utils/ThemeToggle";

const Navbar = ({ toggleSidebar, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-content w-100">
        <h1 className="px-2">Dashboard</h1>
        <div className="navbar-actions d-flex justify-content-end align-items-center">
          <button className="hamburger" onClick={toggleSidebar}>
            ☰
          </button>
          <ThemeToggle />
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} color="error">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
