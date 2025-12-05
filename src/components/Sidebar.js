import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import audiobook_logo from "../images/audiobook_logo.png";
import bookmark_icon from "../images/bookmark_icon.png";
import dashboard_icon from "../images/dashboard_icon.png";
import library_icon from "../images/library_icon.png";
import settings_icon from "../images/settings_icon.png";
import help_icon from "../images/help_icon.png";
import logout_icon from "../images/logout_icon.png";
import bookmark_active from "../images/bookmark_active.png";
import dashboard_active from "../images/dashboard_active.png";
import library_active from "../images/library_active.png";
import settings_active from "../images/settings_active.png";
import { getToken, setToken } from "../storage/Storage"; // Import your storage functions
import { speakText } from "./utils/speechUtils"; // Import the speech utility

const Sidebar = ({ activeItem, setActiveItem, resetSearch, disableSpeech }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [token, setTokenState] = useState(null); // State to store the resolved token value
  const navigate = useNavigate();
  const menuItemRefs = useRef([]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await getToken();
        setTokenState(storedToken);
      } catch (error) {
        console.error("Failed to fetch name", error);
      }
    };
    fetchToken();
  }, []);

  const handleLogout = async () => {
    // Clear the token and other user data from localStorage
    try {
      await setToken("");
      console.log("User logged out");

      // Navigate to the landing page after logout
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const menuItems = [
    { icon: dashboard_icon, activeIcon: dashboard_active, label: "Dashboard", key: "dashboard" },
    { icon: bookmark_icon, activeIcon: bookmark_active, label: "Bookmark", key: "bookmarks" },
    { icon: library_icon, activeIcon: library_active, label: "Library", key: "library" },
    { icon: settings_icon, activeIcon: settings_active, label: "Settings", key: "settings" },
  ];

  const bottomMenuItems = [
    { icon: help_icon, label: "Help", key: "help", disabled: true },
    { icon: logout_icon, label: "Logout", key: "logout", disabled: false },
  ];

  const handleItemClick = (item) => {
    if (item.key === "logout") {
      handleLogout();
    } else if (!item.disabled) {
      setActiveItem(item.key);
      if (item.key === "home") {
        resetSearch();
      }
    }
  };

  const handleKeyDown = (event, item) => {
    if (event.key === "Enter") {
      handleItemClick(item);
    }
  };
  const handleImageFocus = (event) => {
    if (!disableSpeech) {
      const altText = event.target.alt; // Get the alt text of the image
      speakText(altText);  // Speak the alt text aloud
    }
  };
  return (
    <div className="sidebar">
      {/* Top section with icons */}
      <div className="sidebar-top">
        <div className="logo-container">
          <a href="/dashboard">
            <img src={audiobook_logo} alt="Welcome to Audio book" className="logo" tabIndex={0}
              onFocus={handleImageFocus} />
          </a>
        </div>
        {menuItems
          .filter((item) => token || item.key === "dashboard") // Show only "Dashboard" if no token
          .map((item, index) => (
            <div
              key={item.key}
              ref={(el) => (menuItemRefs.current[index] = el)}
              tabIndex={0}
              className={`sidebar-icon ${activeItem === item.key ? "active" : ""}`}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              onFocus={() => !disableSpeech && speakText(item.label)} // Trigger speech when focused
              onKeyDown={(e) => handleKeyDown(e, item)}
            >
              <img
                src={
                  activeItem === item.key || hoveredItem === item.key
                    ? item.activeIcon
                    : item.icon
                }
                alt={`${item.label} Icon`}
              />
            </div>
          ))}
      </div>

      {/* Bottom section with icons */}
      {token && ( // Render bottom menu only if token exists
        <div className="sidebar-bottom">
          {bottomMenuItems.map((item, index) => (
            <div
              key={item.key}
              ref={(el) => (menuItemRefs.current[menuItems.length + index] = el)}
              tabIndex={0}
              className={`sidebar-icon ${activeItem === item.key ? "active" : ""}`}
              onClick={() => handleItemClick(item)}
              onFocus={() => !disableSpeech && speakText(item.label)} // Trigger speech when focused
              onKeyDown={(e) => handleKeyDown(e, item)}
            >
              <img src={item.icon} alt={`${item.label} Icon`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
