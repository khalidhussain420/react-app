import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Library.css';
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import ReadlaterCarousel from "../components/Readlater_carousel.js";
import InprogressCarousel from "../components/Inprogress_carousel.js";
import HistoryCarousel from "../components/History_carousel.js";

const Library = () => {
  const [activeItem, setActiveItem] = useState("library");
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();

  const resetSearch = () => {
    setSearchQuery(""); // Reset the search query
  };

  const handleActiveItemChange = (item) => {
    setActiveItem(item); // Update active item
    if (item === "dashboard") {
      navigate("/dashboard"); // Navigate to feedback page
    } else if (item === "bookmarks") {
      navigate("/bookmarks"); // Navigate to home page
    }
    else if (item === "library") {
      navigate("/library"); // Navigate to home page
    }
    else if (item === "settings") {
      navigate("/settings"); // Navigate to home page
    }

    resetSearch(); // Reset search whenever a new section is selected
  };

  const getHeaderVisibility = () => {
    if (activeItem === "dashboard" || activeItem === "") {
      return { showSearch: true, showUserProfile: true, showArrows: false, pageName: "Dashboard" };
    } else if (activeItem === "bookmarks") {
      return { showSearch: true, showUserProfile: true, showArrows: true, pageName: "" };
    } else if (activeItem === "library") {
      return { showSearch: true, showUserProfile: true, showArrows: true, pageName: "My Library" };
    } else if (activeItem === "settings") {
      return { showSearch: false, showUserProfile: true, showArrows: true, pageName: "Account" };
    }
  };

  const { showSearch, showUserProfile, showArrows, pageName } = getHeaderVisibility();

  const handleProfileClick = () => {
    navigate("/settings", { state: { selectedSection: "account" } });
  };

  return (
    <main className="main-content">
      <div className="sidebar_container">
        <Sidebar
          activeItem={activeItem}
          setActiveItem={handleActiveItemChange}
          resetSearch={resetSearch}
        />
      </div>
    
      <div className="library_container">
        <div className="header_container">
          <Header
            showSearch={showSearch}
            showUserProfile={showUserProfile}
            showArrows={showArrows} 
            pageName={pageName} 
            searchQuery={searchQuery}
            onSearch={(query) => setSearchQuery(query)}
            onProfileClick={handleProfileClick} 
          />
        </div>
        <div className="library_body">
          <div className="carousels_container">
              <div className="readlater_carousel">
                <ReadlaterCarousel />
              </div>
              <div className="inprogress_carousel">
                <InprogressCarousel  />
              </div>
              <div className="history_carousel">
                <HistoryCarousel/>
              </div>
          </div>
        </div>
      </div> 
    </main>
  );
};

export default Library;
