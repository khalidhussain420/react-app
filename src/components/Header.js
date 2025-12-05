import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { fetchProfile, searchBooks, fetchSearchHistory, fetchSearchCount } from "../services/AllServices";
import { getToken } from "../storage/Storage";
import { speakText } from "./utils/speechUtils"; // Import the speech function
import userIcon from "../images/user_icon.png";
import leftArrow from "../images/left_arrow.png";
import rightArrow from "../images/right_arrow.png";
import searchIcon from "../images/search_icon.png";
import historyIcon from "../images/history_icon.png";

const Header = ({ showSearch, showUserProfile, onSearch, searchQuery, showArrows, pageName, onProfileClick, disableSpeech }) => {
  const [profile, setProfile] = useState();
  const [token, setTokenState] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchCounts, setSearchCounts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await getToken();
        setTokenState(storedToken);
        if (storedToken) {
          const response = await fetchProfile();
          setProfile(response?.data || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to load profile.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSearchHistoryData = async () => {
      try {
        const response = await fetchSearchHistory(token);
        if (response?.status === "success") {
          setSearchHistory(response.data.searchedData.reverse());
        }
      } catch (error) {
        console.error("Error fetching search history:", error);
      }
    };

    const fetchSearchCountData = async () => {
      try {
        const response = await fetchSearchCount();
        if (response?.status === "success") {
          setSearchCounts(Object.keys(response.data).reverse());
        }
      } catch (error) {
        console.error("Error fetching search count:", error);
      }
    };

    if (token) {
      fetchSearchHistoryData();
      fetchSearchCountData();
    }
  }, [token]);

  const handleArrowFocus = (direction) => {
    if (!disableSpeech) {
      const directionText = direction === "left" ? "Go back" : "Go forward";
      speakText(directionText);
    }
  };

  const handleSearchFocus = () => {
    if (!disableSpeech) {
      speakText("Search field");
    }
  };

  const handleSearchClick = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await searchBooks(searchQuery);
        if (response) {
          navigate("/searched-results", {
            state: { searchedbooks: response.data, searchedQuery: searchQuery },
          });
        }
      } catch (error) {
        console.error("Error searching books:", error);
        alert("Failed to fetch search results.");
      }
    }
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") handleSearchClick();
  };

  const handleTagClick = async (tag) => {
    try {
      const response = await searchBooks(tag);
      if (response) {
        navigate("/searched-results", {
          state: { searchedbooks: response.data, searchedQuery: tag },
        });
      }
    } catch (error) {
      console.error("Error searching books:", error);
      alert("Failed to fetch search results.");
    }
  };

  const handleHistoryClick = async (query) => {
    try {
      const response = await searchBooks(query);
      if (response) {
        navigate("/searched-results", {
          state: { searchedbooks: response.data, searchedQuery: query },
        });
      }
    } catch (error) {
      console.error("Error searching books:", error);
      alert("Failed to fetch search results.");
    }
  };

  return (
    <header className="header">
      {showArrows && (
        <div className="header-left-section">
          <img
            src={leftArrow}
            alt="Left Arrow"
            className="left-arrow-icon"
            tabIndex={0}
            onClick={() => navigate(-1)}
            onKeyDown={(e) => e.key === "Enter" && navigate(-1)}
            style={{ cursor: "pointer" }}
            onFocus={() => handleArrowFocus("left")}  // Speak when focused
          />
          <img
            src={rightArrow}
            alt="Right Arrow"
            className="right-arrow-icon"
            tabIndex={0}
            onClick={() => navigate(1)}
            onKeyDown={(e) => e.key === "Enter" && navigate(1)}
            style={{ cursor: "pointer" }}
            onFocus={() => handleArrowFocus("right")}  // Speak when focused
          />
        </div>
      )}

      <div className="active_screen_text">
        <span className="page_label">{pageName}</span>
      </div>

      {showSearch && (
        <div className="search-bar-container" ref={searchRef}>
          <div className="search-bar" onClick={() => setShowDropdown(true)}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              tabIndex={0} // Allow focus
              onFocus={handleSearchFocus} // Speak when focused
            />
            <div className="search-icon" onClick={handleSearchClick}>
              <img src={searchIcon} alt="search icon" /> 
            </div>
          </div>

          {showDropdown && (
            <div className="search-dropdown">
              <div className="search-container">
                <div className="searchbyplaceholder">
                  {searchCounts.length === 0 && searchHistory.length === 0
                    ? "Search by book name, author, genre, etc."
                    : "Search by book name, author, genre, etc."}
                </div>

                {searchCounts.length > 0 && (
                  <div className="tags-container">
                    {searchCounts.map((tag, index) => (
                      <span
                        key={index}
                        className="tag"
                        tabIndex={0}
                        onClick={() => handleTagClick(tag)}
                        onKeyDown={(e) => e.key === "Enter" && handleTagClick(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {searchHistory.length > 0 && (
                  <div className="recent-container">
                    <h3 className="recent-heading">Recent</h3>
                    <ul className="recent-list">
                      {searchHistory.map((item, index) => (
                        <li
                          key={index}
                          tabIndex={0}
                          onClick={() => handleHistoryClick(item)}
                          onKeyDown={(e) => e.key === "Enter" && handleHistoryClick(item)}
                        >
                          <img src={historyIcon} className="history-icon" alt="history icon" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="header-user-profile">
        {showUserProfile && (
          <>
            {!token ? (
              <div
                className="header-user-name"
                onClick={() => setShowPopup((prev) => !prev)}
                style={{ cursor: "pointer" }}
                tabIndex={0} // Add focusable for tab
                onFocus={() => !disableSpeech && speakText("Sign In or Create Account")} // Speech when focused
              >
                Sign In / Account
              </div>
            ) : (
              <div
                className="header-user-name"
                style={{ cursor: "default" }}
         
              >
                {profile?.firstname} {profile?.lastName}
              </div>
            )}
            <img
              src={userIcon}
              alt="User Icon"
              className="header-user-icon"
              tabIndex={token ? 0 : -1}
              style={{ cursor: token ? "pointer" : "default" }}
              onClick={token ? onProfileClick : null}
              onFocus={() => !disableSpeech && speakText("My Account")}
              onKeyDown={(e) => token && e.key === "Enter" && onProfileClick()}
            />
          </>
        )}
      </div>

      {showPopup && !token && (
        <div className="popup-container">
          <div className="popup-arrow"></div>
          <div className="popup-content">
            <button
              className="signin-button"
              onClick={() => navigate("/signin")}
              tabIndex={0} // Add focusable for tab
              onFocus={() => !disableSpeech && speakText("Sign In")}
            >
              Sign In
            </button>
            <div className="new-customer">
              New customer?{" "}
              <span
                className="start-here"
                onClick={() => navigate("/signup")}
              >
                Start here
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
