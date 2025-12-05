import React, { useState, useEffect } from "react";
import "../styles/SignIn.css";
import { Eye, EyeOff } from "lucide-react";

import book_logo from "../images/vector_booklogo.svg";
import message_logo from "../images/message_logo.svg";
// import password_eye from "../images/password_eye.svg";
import leftArrow from "../images/left_arrow.png";
import rightArrow from "../images/right_arrow.png";
import lock_logo from "../images/lock_logo.svg";
import { loginUser } from "../services/AllServices";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const goBack = () => {
    if (canGoBack) {
      window.history.back();
    }
  };

  const goForward = () => {
    window.history.forward();
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await loginUser(loginData, (data) => {
        console.log("Callback Data:", data);
      });
      if (response && response.status === "success") {
        console.log("User Data:", response.data);
        localStorage.setItem("access_token", response.data.access_token);
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while logging in. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="signin-page">
      <header className="header">
        <div className="header-left-section">
          <img src={book_logo} alt="book logo" className="book-logo-icon" />

          {/* Left Arrow (Back) */}
          <img
            src={leftArrow}
            alt="Left Arrow"
            className={`left-arrow-icon ${!canGoBack ? "disabled" : ""}`}
            onClick={goBack}
            style={{
              cursor: canGoBack ? "pointer" : "not-allowed",
              opacity: canGoBack ? 1 : 0.5,
            }}
          />

          {/* Right Arrow (Forward) */}
          <img
            src={rightArrow}
            alt="Right Arrow"
            className="right-arrow-icon"
            onClick={goForward}
            style={{ cursor: "pointer" }}
          />
        </div>
      </header>

      <div className="signin-container">
        <div className="signin-form">
          <div className="booklogo-heading">
            <img
              className="booklogo-img"
              alt="site logo of book"
              src={book_logo}
            />
            <div className="booklogo-heading-text">
              <div className="heading-text-wrapper">Login</div>
            </div>
          </div>

          <form className="signin-form" onSubmit={handleNext}>
            <div className="signin-form-group">
              <div className="signin-input-fields">
                <div className="inputfield-wrapper">
                  <div className="inputfield-container">
                    <div className="inputfield-content">
                      <img
                        loading="lazy"
                        src={message_logo}
                        alt=""
                        className="inputfield-icon"
                      />
                      <input
                        type="email"
                        id="email"
                        placeholder="Your Email Address"
                        className="inputfield-inside"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-label="Your Email Address"
                      />
                    </div>
                  </div>
                </div>

                <div className="passwordInputWrapper">
                  <div className="passwordInputContainer">
                    <div className="passwordInputContent">
                      <img
                        loading="lazy"
                        src={lock_logo}
                        alt=""
                        className="passwordIcon"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Password"
                        className="passwordField"
                        aria-label="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      {/* <img
                        loading="lazy"
                        src={password_eye}
                        alt={showPassword ? "Hide password" : "Show password"}
                        className="visibilityIcon"
                        onClick={togglePasswordVisibility}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            togglePasswordVisibility();
                          }
                        }}
                        tabIndex="0"
                        role="button"
                        aria-pressed={showPassword}
                      /> */}
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="visibilityIcon"
                        aria-pressed={showPassword}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={20} className="icon" />
                        ) : (
                          <Eye size={20} className="icon" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="signin-error-message">{errorMessage}</div>
            )}
            <div className="signin-loginLink">
              <p>
                Don't have an Account?{" "}
                <a href="/signup" style={{ color: "#a63e71" }}>
                  Sign Up
                </a>
              </p>
            </div>

            <div className="forgot-password-div">
              <p>
                <a href="/forgot-password" style={{ color: "#a63e71" }} onClick>
                  Forgot Password
                </a>
              </p>
            </div>

            <button
              type="submit"
              className="signin-signinButton"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
