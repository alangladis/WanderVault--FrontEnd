import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigation after login
import { encryptData } from "../utils/encrypt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, Typography } from "@mui/material";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/"); // Redirect if already authenticated
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const encryptedData = encryptData({ username, password });

    try {
      const response = await fetch("http://localhost:3031/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedData }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!", { position: "top-right" });
        localStorage.setItem("isAuthenticated", "true"); // Persist login
        setIsAuthenticated(true); // Update state
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setErrorMessage(data.message || "Invalid username or password.");
        toast.error("Login failed! Please check credentials.", {
          position: "top-right",
        });
      }
    } catch (error) {
      setErrorMessage("Error connecting to the server.");
      toast.error("Server error! Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-container d-flex justify-content-center align-items-center bg-dark text-white"
      style={{ minHeight: "100vh", width: "100%" }}
    >
      <div className="container p-4 rounded shadow-lg bg-secondary">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            marginTop: 4,
          }}
        >
          <Typography variant="h6">Don't have an account?</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </Box>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
