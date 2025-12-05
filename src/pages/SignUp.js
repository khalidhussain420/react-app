import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/SignUp.css";
import leftArrow from "../images/left_arrow.png";
import rightArrow from "../images/right_arrow.png";
import book_logo from "../images/vector_booklogo.svg";
import fullname_logo from "../images/fullname_logo.svg";
import message_logo from "../images/message_logo.svg";
import lock_logo from "../images/lock_logo.svg";
import { sendOTP, validateOTP } from "../services/AllServices";
import upload_icon from "../images/upload_icon.svg";

const InputField = ({ icon, placeholder, type, id, value, onChange }) => (
  <div className="inputfield-wrapper">
    <div className="inputfield-container">
      <div className="inputfield-content">
        <img loading="lazy" src={icon} alt="" className="inputfield-icon" />
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className="inputfield-inside"
          value={value}
          onChange={onChange}
          required
          aria-label={placeholder}
        />
      </div>
    </div>
  </div>
);

const SignUp = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    genre: [],
    profile_picutre: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [enteredOTP, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResendOTP, setLoadingResendOTP] = useState(false);
  const [loadingVerifyOTP, setLoadingVerifyOTP] = useState(false);
  // const [filePreview, setFilePreview] = useState(null);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, udidFile: file });

      // Create a preview URL for the image
      // const previewUrl = URL.createObjectURL(file);
      // setFilePreview(previewUrl);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!isChecked) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setLoadingResendOTP(true);
    setEmailError("");
    try {
      const response = await sendOTP(formData);
      if (
        response.detail ===
        "Email already registered. Please use a different email address."
      ) {
        setEmailError(response.detail);
      } else if (response.status === "success") {
        setIsPopupOpen(true);
        setErrorMessage("");
      } else {
        setErrorMessage(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      if (
        error.response?.data?.detail ===
        "Email already registered. Please use a different email address."
      ) {
        setEmailError(
          "Email already registered. Please use a different email address or log in."
        );
      } else {
        setErrorMessage("An error occurred while sending the OTP.");
      }
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingResendOTP(false);
    }
  };
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1); // Check if there is a previous page
  }, []);

  const goBack = () => {
    if (canGoBack) window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  const handleOtpSubmit = async () => {
    setLoadingVerifyOTP(true);
    try {
      const response = await validateOTP({
        email: formData.email,
        enteredOTP,
      });
      if (response.status === "success") {
        navigate("/genre", { state: { formData } });
      } else {
        setErrorMessage(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during OTP validation.");
      console.error(error);
    } finally {
      setLoadingVerifyOTP(false);
    }
  };

  return (
    <div className="signup-page">
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
      <div className="signup-container">
        <div className="signup-form">
          <div className="booklogo-heading">
            <img
              className="booklogo-img"
              alt="site logo of book"
              src={book_logo}
            />
            <div className="booklogo-heading-text">
              <div className="heading-text-wrapper">Sign up</div>
            </div>
          </div>

          <form className="signup-form" onSubmit={handleSignUpClick}>
            <div className="signup-form-group">
              <div className="signup-input-fields">
                <InputField
                  icon={fullname_logo}
                  placeholder="Your Full Name"
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />

                <div className="inputfield-wrapper">
                  <div className="inputfield-container">
                    <div className="inputfield-content">
                      <img
                        loading="lazy"
                        src={upload_icon}
                        alt=""
                        className="inputfield-icon"
                      />
                      <label
                        htmlFor="udidUpload"
                        className="custom-file-label"
                        aria-label="Profile Image Upload"
                      >
                        {formData.udidFile
                          ? formData.udidFile.name
                          : "Upload UDID"}
                      </label>
                      <input
                        type="file"
                        id="udidUpload"
                        className="hidden-file-input"
                        onChange={handleFileChange}
                        accept="image/*"
                        // Remove aria-hidden attribute
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="inputfield-wrapper">
                  <div className="inputfield-container">
                    <div className="inputfield-content">
                      <img
                        loading="lazy"
                        src={upload_icon}
                        alt=""
                        className="inputfield-icon"
                      />
                      <label
                        htmlFor="udidUpload"
                        className="custom-file-label"
                        aria-label="Profile Image Upload"
                      >
                        {formData.udidFile
                          ? formData.udidFile.name
                          : "Upload Profile Image"}
                      </label>
                      <input
                        type="file"
                        id="udidUpload"
                        className="hidden-file-input"
                        onChange={handleFileChange}
                        accept="image/*"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div> */}

                {/* {filePreview && (
                  <div className="file-preview">
                    <img
                      src={filePreview}
                      alt="Profile preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )} */}

                <InputField
                  icon={message_logo}
                  placeholder="Your Email Address"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
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
                        placeholder="Create a Strong Password"
                        className="passwordField"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
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

            {emailError && (
              <p className="signup-error-email" style={{ color: "red" }}>
                {emailError}
              </p>
            )}
            <div className="Agree_tc">
              <input
                type="checkbox"
                id="agree_tc"
                style={{
                  marginTop: "0vw",
                  cursor: "pointer",
                }}
                checked={isChecked}
                onChange={handleCheckboxChange}
                required
              />
              <label className="terms-condition-label" htmlFor="agree_tc">
                I agree to the terms and conditions
              </label>
            </div>
            <div className="signup-loginLink">
              <p>
                Already have an account?{" "}
                <a href="/signin" style={{ color: "#a63e71" }}>
                  Login
                </a>
              </p>
            </div>

            <button type="submit" className="signUpButton" disabled={loading}>
              {loading ? "Sending..." : "Sign up"}
            </button>
          </form>
        </div>
      </div>

      {isPopupOpen && (
        <>
          <div className="popup-overlay"></div>
          <div className="otp-popup">
            <div className="otp-popup-content">
              <button
                className="close-popup-button"
                onClick={() => setIsPopupOpen(false)}
                aria-label="Close Popup"
              >
                &times;
              </button>
              <h2>Email Verification</h2>
              <p>
                An email has been sent to <strong>{formData.email}</strong>.
                Please enter the OTP below to verify your account.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                className="otp-input"
                value={enteredOTP}
                onChange={handleOtpChange}
                required
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="otp-buttons">
                <button
                  onClick={handleSignUpClick}
                  className="otp-submit-button"
                  disabled={loadingResendOTP}
                >
                  {loadingResendOTP ? "Resending..." : "Resend OTP"}
                </button>
                <button
                  onClick={handleOtpSubmit}
                  className="otp-submit-button"
                  disabled={loadingVerifyOTP}
                >
                  {loadingVerifyOTP ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignUp;
