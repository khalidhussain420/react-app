import React, { useState } from "react";
import "../styles/AudioSettings.css";
import { updatePlaySpeed, updateVoiceSelection } from "../services/AllServices"; // Import your API service functions

const AudioSettings = () => {
  const [playbackSpeed, setPlaybackSpeed] = useState("1.5 x");
  const [voiceSelection, setVoiceSelection] = useState("Indian Male");
  const [sleepTimer, setSleepTimer] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error state
  const [successMessage, setSuccessMessage] = useState(""); // For success message

  // Function to handle playback speed change
  const handlePlaybackSpeedChange = async (e) => {
    const newSpeed = e.target.value;
    setPlaybackSpeed(newSpeed);

    try {
      setIsLoading(true);
      setError(null); // Reset error state on change
      const response = await updatePlaySpeed(newSpeed); // Call the API for play speed update
      if (response && response.status === "success") {
        alert("Playspeed updated!");
        setSuccessMessage("Playback speed updated successfully.");
      }
    } catch (err) {
      setError("Error updating playback speed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle voice selection change
  const handleVoiceSelectionChange = async (e) => {
    const newVoice = e.target.value;
    setVoiceSelection(newVoice);

    try {
      setIsLoading(true);
      setError(null); // Reset error state on change
      const response = await updateVoiceSelection(newVoice); // Call the API for voice selection update
      if (response && response.status === "success") {
        alert("voice selection updated!");
        setSuccessMessage("Voice selection updated successfully.");
      }
    } catch (err) {
      setError("Error updating voice selection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="audio-settings-container">
      {/* Playback Speed */}
      <div className="audio-settings-group">
        <label className="audio-settings-label">Playback Speed</label>
        <div className="audio-dropdown">
          <select
            className="audio-select"
            value={playbackSpeed}
            onChange={handlePlaybackSpeedChange}
            disabled={isLoading} // Disable during loading
          >
            <option value="0.5 x">0.5 x</option>
            <option value="1.0 x">1.0 x</option>
            <option value="1.5 x">1.5 x</option>
            <option value="2.0 x">2.0 x</option>
          </select>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="audio-settings-group">
        <label className="audio-settings-label">Voice Selection</label>
        <div className="audio-dropdown">
          <select
            className="audio-select"
            value={voiceSelection}
            onChange={handleVoiceSelectionChange}
            disabled={isLoading} // Disable during loading
          >
            <option value="Indian Male">Indian Male</option>
            <option value="Indian Female">Indian Female</option>
            <option value="US Male">US Male</option>
            <option value="US Female">US Female</option>
          </select>
        </div>
      </div>

      {/* Sleep Timer */}
      <div className="audio-settings-toggle">
        <label className="audio-settings-label">Sleep Timer</label>
        <div
          className={`audio-toggle ${sleepTimer ? "active" : ""}`}
          onClick={() => setSleepTimer(!sleepTimer)}
        >
          <div className="audio-toggle-knob"></div>
        </div>
      </div>

      {/* Success/Error messages */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AudioSettings;
