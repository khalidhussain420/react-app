import React, { useState, useEffect } from "react";
// import flag_icon from "../images/flag_icon.png";
import { getCountryCodes } from "../services/AllServices";

import down_arrow_settings from "../images/down_arrow_settings.svg";
// import { selectClasses } from "@mui/material";
export const InputField = ({
  label,
  icon,
  value,
  editable,
  onChange,
  type = "text",
  placeholder, // Added placeholder prop
}) => (
  <div className="settings-inputWrapper">
    <label className="settings-label">{label}</label>
    <div className="settings-inputContent">
      <div className="settings-inputInner">
        <img src={icon} alt="" className="settings-icon" />
        <input
          type={type}
          value={value}
          className="settings-inputText"
          aria-label={label}
          disabled={!editable}
          onChange={onChange}
          placeholder={placeholder} // Applied placeholder
        />
      </div>
    </div>
  </div>
);

export const CityField = ({
  label,
  value,
  editable,
  onChange,
  type = "text",
  placeholder, // Added placeholder prop
}) => (
  <div className="settings-inputWrapper">
    <label className="settings-label">{label}</label>
    <div className="settings-inputContent">
      <div className="settings-inputInner">
        {/* <img src={icon} alt="" className="settings-icon" /> */}
        <input
          type={type}
          value={value}
          className="settings-inputText"
          aria-label={label}
          disabled={!editable}
          onChange={onChange}
          placeholder={placeholder} // Applied placeholder
        />
      </div>
    </div>
  </div>
);

export const SelectField = ({
  label,
  value,
  iconSrc,
  options,
  onChange,
  editable,
  placeholder,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsDropdownVisible(false);
  };

  return (
    <div className="settings-city-selectWrapper">
      <div className="settings-city-selectInner">
        <label className="settings-city-selectLabel">{label}</label>
        <div
          className="settings-city-selectField"
          onClick={() => editable && setIsDropdownVisible(!isDropdownVisible)}
        >
          <div className="settings-city-selectContent">
            <div
              className="settings-city-selectValue"
              style={{
                color: value ? "#000" : "#757575",
                opacity: value ? 1 : 2,
              }}
            >
              {value || placeholder}
            </div>
            <img src={iconSrc} alt="" className="settings-city-selectIcon" />
          </div>
        </div>
        {isDropdownVisible && (
          <div className="settings-city-dropdown">
            {options.map((option, index) => (
              <div
                key={index}
                className="settings-city-dropdownOption"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// export const PhoneInput = ({
//   value,
//   editable,
//   onChange,
//   placeholder,

//   onCountryCodeChange,
// }) => {
//   const [countryCodes, setCountryCodes] = useState([]);
//   const [selectedCountryCode, setSelectedCountryCode] = useState("+91"); // Default country code
//   const [showDropdown, setShowDropdown] = useState(false);

//   useEffect(() => {
//     const loadCountryCodes = async () => {
//       try {
//         const response = await getCountryCodes();
//         if (response) {
//           setCountryCodes(response);
//         }
//       } catch (error) {
//         console.error("Error fetching country codes:", error);
//       }
//     };

//     loadCountryCodes();
//   }, []);

//   const handleCountryCodeChange = (code) => {
//     setSelectedCountryCode(code);
//     if (onCountryCodeChange) {
//       onCountryCodeChange(code);
//     }
//     setShowDropdown(false);
//   };

//   return (
//     <div className="settings-inputWrapper">
//       <label className="settings-label">Phone Number</label>
//       <div className="settings-phoneWrapper">
//         <div
//           className="settings-phone-selectField"
//           onClick={() => setShowDropdown(!showDropdown)}
//         >
//           <div className="settings-city-selectContent">
//             {/* <span>{selectedCountryCode}</span> */}
//             <div
//               className="settings-city-selectValue"
//               style={{
//                 color: (value = "#000"),
//                 opacity: (value = 2),
//               }}
//             >
//               {selectedCountryCode}
//             </div>
//             <img
//               src={down_arrow_settings}
//               alt=""
//               className="settings-city-selectIcon"
//             />
//           </div>
//         </div>
//         {editable && showDropdown && (
//           <div className="settings-phone-dropdown">
//             {countryCodes.map((code, index) => (
//               <div
//                 key={index}
//                 className="settings-phone-dropdownOption"
//                 onClick={() => handleCountryCodeChange(code)}
//               >
//                 <span>{code}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="settings-phoneInput">
//           <input
//             type="tel"
//             value={value}
//             className="settings-inputText"
//             aria-label="Phone number"
//             disabled={!editable}
//             onChange={onChange}
//             placeholder={placeholder}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

export const PhoneInput = ({
  value,
  editable,
  onChange,
  placeholder,
  onCountryCodeChange,
}) => {
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91"); // Default country code
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch country codes on mount
  useEffect(() => {
    const loadCountryCodes = async () => {
      try {
        const response = await getCountryCodes();
        if (response) {
          setCountryCodes(response);
        }
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    loadCountryCodes();
  }, []);

  // Handle country code selection
  const handleCountryCodeChange = (code) => {
    setSelectedCountryCode(code);
    if (onCountryCodeChange) {
      onCountryCodeChange(code);
    }
    setShowDropdown(false);
  };

  return (
    <div className="settings-inputWrapper">
      <label className="settings-label">Phone Number</label>
      <div className="settings-phoneWrapper">
        {/* Country Code Dropdown */}
        <div
          className="settings-phone-selectField"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <div className="settings-city-selectContent">
            <span className="settings-city-selectValue">
              {selectedCountryCode}
            </span>
            <img
              src={down_arrow_settings}
              alt="Dropdown arrow"
              className="settings-city-selectIcon"
            />
          </div>
        </div>
        {editable && showDropdown && (
          <div className="settings-phone-dropdown">
            {countryCodes.map((code, index) => (
              <div
                key={index}
                className="settings-phone-dropdownOption"
                onClick={() => handleCountryCodeChange(code)}
              >
                <span>{code}</span>
              </div>
            ))}
          </div>
        )}

        {/* Phone Number Input */}
        <div className="settings-phoneInput">
          <input
            type="tel"
            value={value}
            className="settings-inputText"
            aria-label="Phone number"
            disabled={!editable}
            onChange={(e) => onChange(e.target.value)} // Pass only the value
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};
