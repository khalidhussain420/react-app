// src/pages/Settings.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Settings.css";
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import AccountSection from "../components/AccountSection.js";
import SettingsSection from "../components/SettingsSection.js";
import SettingsNavbar from "../components/SettingsNavbar.js";

const Settings = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("settings");
  const [selectedSection, setSelectedSection] = useState(
    location.state?.selectedSection || "settings"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const resetSearch = () => {
    setSearchQuery(""); // Reset the search query
  };

  const handleActiveItemChange = (item) => {
    setActiveItem(item); // Update active item
    if (item === "dashboard") {
      navigate("/dashboard"); // Navigate to feedback page
    } else if (item === "bookmarks") {
      navigate("/bookmarks"); // Navigate to bookmarks page
    } else if (item === "library") {
      navigate("/library"); // Navigate to library page
    } else if (item === "settings") {
      setSelectedSection("settings"); // Reset to settings section
      navigate("/settings"); // Navigate to settings page
    }

    resetSearch(); // Reset search whenever a new section is selected
  };

  const getHeaderVisibility = () => {
    if (activeItem === "dashboard" || activeItem === "") {
      return { showSearch: true, showUserProfile: true, showArrows: true, pageName: "Dashboard" };
    } else if (activeItem === "bookmarks") {
      return {
        showSearch: true,
        showUserProfile: true,
        showArrows: true,
        pageName: "",
      };
    } else if (activeItem === "library") {
      return {
        showSearch: false,
        showUserProfile: true,
        showArrows: true,
        pageName: "My Library",
      };
    } else if (activeItem === "settings") {
      return {
        showSearch: false,
        showUserProfile: true,
        showArrows: true,
        pageName: "",
      };
    }
  };

  const { showSearch, showUserProfile, showArrows, pageName } =
    getHeaderVisibility();

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };
  const handleProfileClick = () => {
    setSelectedSection("account");
    navigate("/settings", { state: { selectedSection: "account" } });
  };

  return (
    <main className="main-content">
      <div className="sidebar_container">
        <Sidebar
          activeItem={activeItem}
          setActiveItem={handleActiveItemChange}
          resetSearch={resetSearch}
        />
      </div>

      <div className="settings_container">
        <div className="header_container">
          <Header
            showSearch={showSearch}
            showUserProfile={showUserProfile}
            showArrows={showArrows}
            pageName={pageName}
            searchQuery={searchQuery}
            onSearch={(query) => setSearchQuery(query)}
            onProfileClick={handleProfileClick} // Pass the function here
          />
        </div>
        <div className="settings_body_wrapper">
          <div className="settings_body">
            <div className="settings-nav-bar">
              <SettingsNavbar
                selectedSection={selectedSection}
                onSelectSection={handleSectionClick}
              />
            </div>
            {selectedSection === "account" && <AccountSection />}
            {selectedSection === "settings" && <SettingsSection />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
