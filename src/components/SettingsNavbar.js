// src/components/SettingsNavbar.js
import React from "react";
import '../styles/SettingsNavbar.css';

const SettingsNavbar = ({ selectedSection, onSelectSection }) => {
  return (
    <div className="settings_nav_bar">
      <div
        className={`settings_nav_link ${selectedSection === "account" ? "active" : ""}`}
        onClick={() => onSelectSection("account")}
      >
        Account
      </div>
      <div
        className={`settings_nav_link ${selectedSection === "settings" ? "active" : ""}`}
        onClick={() => onSelectSection("settings")}
        style={{ marginLeft: "4.1vw" }}
      >
        Settings
      </div>
    </div>
  );
};

export default SettingsNavbar;
