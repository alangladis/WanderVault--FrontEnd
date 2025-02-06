import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { encryptData } from "../utils/encrypt";

const SignUp = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { username: "", email: "", password: "" };

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const encryptedData = encryptData({ formData });

        const response = await fetch("http://localhost:3031/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encryptedData }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        console.log("User registered successfully:", data);
        alert("Sign up successful");
      } catch (error) {
        console.error("Error during signup:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div
      className={` d-flex justify-content-center align-items-center ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      style={{ minHeight: "100vh", width: "100%", backgroundColor: "gray" }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          maxWidth: 400,
          margin: "auto",
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5">Sign Up</Typography>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
      </Box>
    </div>
  );
};

export default SignUp;
