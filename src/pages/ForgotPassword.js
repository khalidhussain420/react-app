import React, { useState } from "react";
import "../styles/SignIn.css";
import book_logo from "../images/vector_booklogo.svg";
// import fullname_logo from "../images/fullname_logo.svg";
import password_eye from "../images/password_eye.svg";
import lock_logo from "../images/lock_logo.svg";
import { loginUser } from "../services/AllServices";
import leftArrow from "../images/left_arrow.png";
import rightArrow from "../images/right_arrow.png";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  // const handleNext = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setErrorMessage("");

  //   const loginData = {
  //     email: formData.email,
  //     password: formData.password,
  //   };

  //   try {
  //     const response = await loginUser(loginData, (data) => {
  //       console.log("Callback Data:", data);
  //     });
  //     if (response && response.status === "success") {
  //       console.log("User Data:", response.data);
  //       localStorage.setItem("access_token", response.data.access_token);
  //       window.location.href = "/dashboard";
  //     } else {
  //       setErrorMessage(response.message || "Login failed. Please try again.");
  //     }
  //   } catch (error) {
  //     setErrorMessage(
  //       "An error occurred while logging in. Please try again later."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const resetData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await loginUser(resetData, (data) => {
        console.log("Callback Data:", data);
      });

      if (response && response.status === "success") {
        alert(
          "Password reset successfully. Please log in with your new password."
        );
        window.location.href = "/signin"; // Redirect to Sign In page
      } else {
        setErrorMessage(
          response.message || "Password reset failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while resetting the password. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <header className="header">
        <div className="header-left-section">
          <img src={book_logo} alt="book logo" className="book-logo-icon" />
          <img src={leftArrow} alt="Left Arrow" className="left-arrow-icon" />
          <img
            src={rightArrow}
            alt="Right Arrow"
            className="right-arrow-icon"
          />
        </div>
      </header>
      <div className="signup-container">
        <div className="signup-form">
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

          <form className="signup-form" onSubmit={handleNext}>
            <div className="signup-form-group">
              <div className="signup-input-fields">
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
                        placeholder="Enter new password"
                        className="passwordField"
                        aria-label="Enter new password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
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
                        placeholder="Confirm password"
                        className="passwordField"
                        aria-label="Confirm password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <img
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
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="signin-error-message">{errorMessage}</div>
            )}

            <button
              type="submit"
              className="signin-signUpButton"
              disabled={isLoading}
              style={{ marginTop: "2.5vw" }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
