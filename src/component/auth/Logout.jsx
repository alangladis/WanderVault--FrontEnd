import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    // Remove the authentication flag from localStorage
    localStorage.removeItem("isAuthenticated");

    // Redirect to login page after logout
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;
