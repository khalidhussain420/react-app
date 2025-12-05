import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  isLightMode: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage, default to light mode
  const [isLightMode, setIsLightMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme !== "dark"; // Default to light if not explicitly set to dark
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);

    // Save to localStorage
    localStorage.setItem("theme", newTheme ? "light" : "dark");

    // Apply theme to body
    document.body.className = newTheme ? "light" : "dark";
  };

  // Apply theme on initial load and when theme changes
  useEffect(() => {
    document.body.className = isLightMode ? "light" : "dark";
  }, [isLightMode]);

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
