import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/GenreSelect.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { registerUser } from "../services/AllServices";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import logo1 from "../images/genre_logo1.png";
import logo2 from "../images/genre_logo2.png";
import logo3 from "../images/genre_logo3.png";
import logo4 from "../images/genre_logo4.png";
import logo5 from "../images/genre_logo5.png";
import checkboxEmpty from "../images/checkbox_empty.svg";
import checkboxFilled from "../images/checkbox_fill.svg";

const options = [
  { id: 1, label: "BTech", color: "#E29336", icon: logo1 },
  { id: 2, label: "MTech", color: "#DFC826", icon: logo2 },
  { id: 3, label: "BDes", color: "#89BB34", icon: logo3 },
  { id: 4, label: "MDes", color: "#E2736F", icon: logo4 },
  { id: 5, label: "MSc", color: "#DFC826", icon: logo5 },
];

const GenreSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!formData) {
      console.warn("Access denied. No form data provided.");
      navigate("/signup");
    }
  }, [formData, navigate]);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelect = (id) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((optionId) => optionId !== id)
        : [...prevSelected, id]
    );
  };

  const handleNext = async () => {
    if (!formData?.email || !formData?.password || !formData?.firstName) {
      console.warn("Required form data is missing or incomplete.");
      alert("Required form data is missing or incomplete.");
      navigate("/signup");
      return;
    }

    if (selectedOptions.length === 0) {
      setError("Please select at least one genre");
      return;
    }

    setIsLoading(true);
    setError("");

    // Get the labels of selected options
    const selectedGenres = selectedOptions
      .map((id) => {
        const option = options.find((opt) => opt.id === id);
        return option ? option.label : null;
      })
      .filter((label) => label !== null);

    try {
      const formDataToSend = {
        // Use firstname instead of firstName to match the registerUser function
        firstname: formData.firstName,
        email: formData.email,
        password: formData.password,
        genre: JSON.stringify(selectedGenres), // Stringify here to match what's expected
      };

      // Append file only if it exists
      if (formData.udidFile) {
        formDataToSend.file = formData.udidFile;
      }

      console.log("formdata", formDataToSend);
      const result = await registerUser(formDataToSend);

      if (result?.status === "success") {
        console.log("Registration successful:", result.message);

        // Save user data
        localStorage.setItem("access_token", result.data.access_token);
        localStorage.setItem("user_email", result.data.email);
        localStorage.setItem("username", result.data.username);
        if (result.data.profile_picture_url) {
          localStorage.setItem(
            "profile_picture",
            result.data.profile_picture_url
          );
        }

        navigate("/dashboard");
      } else {
        setError(result?.message || "Error during registration");
        console.error("Registration failed:", result?.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError(
        error.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="genre-select-wrapper">
      <div className="main-content">
        <div className="sidebar_container">
          <Sidebar />
        </div>
        <div className="genre-selection-container">
          <div className="header_container">
            <Header
              showSearch={false}
              showUserProfile={false}
              showArrows={true}
            />
          </div>
          <div className="genre-content">
            <h1>What would you like to read?</h1>
            <p>Choose your favourites</p>
            {error && (
              <p className="error-message" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <div className="genre-card-container">
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`genre-card ${
                    selectedOptions.includes(option.id) ? "genre-selected" : ""
                  }`}
                  style={{ backgroundColor: option.color }}
                  onClick={() => handleSelect(option.id)}
                >
                  <div className="genre-checkbox">
                    <img
                      src={
                        selectedOptions.includes(option.id)
                          ? checkboxFilled
                          : checkboxEmpty
                      }
                      alt="checkbox"
                    />
                  </div>
                  <div className="genre-icon">
                    <img src={option.icon} alt={option.label} />
                  </div>
                  <p>{option.label}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="genre-signUpButton"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreSelection;
