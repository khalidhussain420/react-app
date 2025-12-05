import React, { useState } from "react";
import "../styles/SettingsSection.css";
import ToggleTheme from "./ToggleTheme";
import AudioSettings from "./AudioSettings";
import "../styles/AudioSettings.css";
import font_size_small from "../images/font_size_small.svg";
import font_size_big from "../images/font_size_big.svg";

const VolumeSlider = ({ value, onChange }) => {
  return (
    <div className="settings-slider-container">
      {/* Volume decrease icon */}
      <img
        src={font_size_small}
        alt="Volume decrease"
        className="settings-volume-icon"
      />

      {/* Slider input */}
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          className="slider"
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>

      {/* Volume increase icon */}
      <img
        src={font_size_big}
        alt="Volume increase"
        className="settings-volume-icon"
      />
    </div>
  );
};

const SettingsSection = () => {
  const [volume, setVolume] = useState(50); // Initial volume state
  // const [isActive, setIsActive] = useState(false); //notifs

  // Toggle handler
  const handleNotifToggle = (id) => {
    setNotificationSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id
          ? { ...setting, isActive: !setting.isActive }
          : setting
      )
    );
  };

  const [notificationSettings, setNotificationSettings] = useState([
    {
      id: "newsUpdates",
      label: "News and Updates",
      ariaLabel: "Toggle news and updates notifications",
      isActive: false, // Initial state
    },
    {
      id: "newBooks",
      label: "New Book Release",
      ariaLabel: "Toggle new book release notifications",
      isActive: true, // Initial state
    },
  ]);

  return (
    <div className="settings-section">
      <section className="settings-content">
        <h1 className="settings-heading">Display Settings</h1>

        <form className="settings-form">
          <div className="settings-form-group">
            <label htmlFor="themeSelect">Select Theme</label>

            <ToggleTheme />
          </div>

          <div className="settings-form-group">
            <label htmlFor="textSize">Text Size</label>
            {/* VolumeSlider component */}
            <VolumeSlider value={volume} onChange={setVolume} />
          </div>
        </form>
        <h2 className="settings-audio-settings">Audio Settings</h2>

        <AudioSettings />
      </section>

      <section className="notif-container">
        <h1 className="notif-heading">Notification Settings</h1>

        <div className="notif-settingsGroup">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="notif-settingItem">
              <label className="notif-settingLabel" htmlFor={setting.id}>
                {setting.label}
              </label>

              <div className="audio-settings-toggle">
                <div
                  className={`audio-toggle ${setting.isActive ? "active" : ""}`}
                  onClick={() => handleNotifToggle(setting.id)}
                  role="switch"
                  aria-checked={setting.isActive}
                  aria-label={setting.ariaLabel}
                  id={setting.id}
                >
                  <div className="audio-toggle-knob"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SettingsSection;
