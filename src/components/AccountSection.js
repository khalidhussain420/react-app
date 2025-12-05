import React, { useState, useEffect } from "react";
import "../styles/AccountSection.css";
import {
  InputField,
  PhoneInput,
  CityField,
  SelectField,
} from "./AccountComponents.js";
import account_pfp from "../images/account_pfp.png";
import {
  fetchProfile,
  getCountries,
  getStates,
  updateProfile,
  // getCountryCodes,
} from "../services/AllServices";
import fullname_logo from "../images/fullname_logo.svg";
import message_logo from "../images/message_logo.svg";
import down_arrow_settings from "../images/down_arrow_settings.svg";
import location_logo from "../images/location_logo.svg";

const AccountSection = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    city: "",
    country: "",
    state: "",
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  // Fetch profile details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProfile();
        const {
          firstname,
          lastName,
          email,
          mobileNumber,
          address,
          city,
          country,
          state,
        } = response.data;

        const profileData = {
          firstname,
          lastName,
          email,
          mobileNumber,
          address,
          city,
          country,
          state,
        };

        setProfile(profileData);
        setOriginalProfile(profileData);

        // Fetch countries
        const countriesResponse = await getCountries();
        setCountries(countriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (profile.country) {
      const fetchStates = async () => {
        try {
          const statesResponse = await getStates(profile.country);
          setStates(statesResponse.data);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchStates();
    }
  }, [profile.country]);

  // const handleInputChange = (field, value) => {
  //   setProfile((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));

  //   // Check if the value is different from the original
  //   setIsModified(
  //     JSON.stringify(originalProfile[field]) !== JSON.stringify(value)
  //   );
  // };
  const handleInputChange = (field, value) => {
    console.log("Field:", field, "Value:", value); // Debugging
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    setIsModified(
      JSON.stringify(originalProfile[field]) !== JSON.stringify(value)
    );
  };

  const handleUpdateClick = async () => {
    try {
      // Prepare the updated profile object
      const updatedProfile = {
        firstname: profile.firstname,
        lastName: profile.lastName,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        state: profile.state,
      };

      // Call the updateProfile API
      const response = await updateProfile(updatedProfile);
      console.log("Profile updated successfully:", response);

      // Update the original profile to match the current profile
      setOriginalProfile({ ...profile });

      // Reset modification state
      setIsModified(false);

      // Provide user feedback
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleResetClick = () => {
    // Revert to the original profile
    setProfile(originalProfile);
    setIsModified(false);
  };

  return (
    <div className="settings-accountSection">
      <div className="settings-formSection">
        <form className="settings-inputFields">
          <InputField
            label="First Name"
            icon={fullname_logo}
            value={profile.firstname}
            editable={true}
            placeholder="Update First Name"
            onChange={(e) => handleInputChange("firstname", e.target.value)}
          />
          <InputField
            label="Last Name"
            icon={fullname_logo}
            value={profile.lastName}
            editable={true}
            placeholder="Update Last Name"
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <InputField
            label="Email"
            icon={message_logo}
            value={profile.email}
            editable={true}
            placeholder="Update Email"
            onChange={(e) => handleInputChange("email", e.target.value)}
            type="email"
          />
          {/* <PhoneInput
            value={profile.mobileNumber}
            editable={true}
            placeholder="Update Phone Number"
            onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
            // fetchCountryFlags={getCountryCodes}
            onCountryChange={(country) =>
              handleInputChange("country", country.name)
            }
          /> */}
          {/* <PhoneInput
            value={profile.mobileNumber}
            editable={true}
            placeholder="Update Phone Number"
            onChange={(e) => handleInputChange("mobileNumber", e.target.value)} // Pass only the value
          /> */}

          <PhoneInput
            value={profile.mobileNumber}
            editable={true}
            placeholder="Update Phone Number"
            onChange={(newValue) => handleInputChange("mobileNumber", newValue)}
            onCountryCodeChange={(newCode) =>
              console.log("Selected country code:", newCode)
            }
          />

          <InputField
            label="Address"
            icon={location_logo}
            value={profile.address}
            editable={true}
            placeholder="Update Address"
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          <CityField
            label="City"
            value={profile.city}
            editable={true}
            placeholder="Update City"
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
          <section className="settings-city-selectorContainer">
            <SelectField
              label="Country"
              value={profile.country}
              editable={true}
              placeholder="Update Country"
              iconSrc={down_arrow_settings}
              options={countries}
              onChange={(selectedCountry) => {
                handleInputChange("country", selectedCountry);
                handleInputChange("state", ""); // Reset state when country changes
              }}
            />
            <SelectField
              label="State"
              value={profile.state}
              placeholder="Update State"
              editable={true}
              options={states}
              iconSrc={down_arrow_settings}
              onChange={(selectedState) =>
                handleInputChange("state", selectedState)
              }
            />
          </section>
          <div className="settings-button-group">
            <button
              type="button"
              className="settings-update-button"
              onClick={handleUpdateClick}
              disabled={!isModified}
            >
              Update
            </button>

            {isModified && (
              <button
                type="button"
                className="settings-update-button"
                onClick={handleResetClick}
              >
                Discard
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="settings-imageSection">
        <img src={account_pfp} alt="Profile" />
      </div>
    </div>
  );
};

export default AccountSection;
