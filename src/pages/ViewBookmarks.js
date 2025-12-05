import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ViewBookmarks.css';
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import ViewBookmarksCarousel from "../components/ViewBookmarksCarousel.js";

const ViewBookmarks = () => {
    const [activeItem, setActiveItem] = useState("bookmarks");
    const [searchQuery, setSearchQuery] = useState(''); 
    const navigate = useNavigate();
    
    const resetSearch = () => {
      setSearchQuery(""); // Reset the search query
    };
  
    const handleActiveItemChange = (item) => {
      setActiveItem(item); // Update active item
      if (item === "dashboard") {
        navigate("/dashboard"); // Navigate to dashboard
      } else if (item === "bookmarks") {
        navigate("/bookmarks"); // Navigate to bookmarks
      } else if (item === "library") {
        navigate("/library"); // Navigate to library
      } else if (item === "settings") {
        navigate("/settings"); // Navigate to settings
      }
      resetSearch(); // Reset search whenever a new section is selected
    };
  
    const getHeaderVisibility = () => {
      if (activeItem === "dashboard" || activeItem === "") {
        return { showSearch: true, showUserProfile: true, showArrows: true, pageName: "Dashboard" };
      } else if (activeItem === "bookmarks") {
        return { showSearch: true, showUserProfile: true, showArrows: true, pageName: "" };
      } else if (activeItem === "library") {
        return { showSearch: false, showUserProfile: true, showArrows: true, pageName: "My Library" };
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
        <div className="viewbookmarks_container">
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
          <div className="view_bookmarks_body">
            <div className="view_bookmarks_container">
                <div className="viewBookmarksCarousel">
                  <ViewBookmarksCarousel />
                </div>
            </div>
          </div>
        </div>
      </main>
    );
  };
export default ViewBookmarks;
