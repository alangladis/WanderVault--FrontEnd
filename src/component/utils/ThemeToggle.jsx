import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import ThemeButton from "./ThemeButton";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const getColorPreference = () => {
    const storedPreference = localStorage.getItem("theme-preference");
    if (storedPreference) return storedPreference;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [themeNew, setTheme] = useState(getColorPreference);

  const setPreference = (value) => {
    localStorage.setItem("theme-preference", value);
    reflectPreference(value);
  };

  const reflectPreference = (value) => {
    document.documentElement.setAttribute("data-theme", value);
  };

  const handleToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setPreference(newTheme);
    toggleTheme();
  };

  useEffect(() => {
    reflectPreference(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e) => {
      const isDark = e.matches;
      const newTheme = isDark ? "dark" : "light";
      setTheme(newTheme);
      setPreference(newTheme);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [theme]);

  return <ThemeButton toggleMenu={handleToggle} theme={theme} />;
};

export default ThemeToggle;
