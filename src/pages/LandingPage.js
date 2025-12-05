import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import Carousel from "../components/Carousel.js";
import GenreCarousel from "../components/Genre_carousel.js";
import { fetchAllGenreBooks } from "../services/AllServices.js";
import loadingSpinner from "../images/loadingSpinner.gif"

const LandingPage = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [genreBooks, setGenreBooks] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenreBooks = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetchAllGenreBooks();
        setGenreBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch genre books:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchGenreBooks();
  }, []);

  const handleProfileClick = () => {
    navigate("/settings", { state: { selectedSection: "account" } });
  };

  const resetSearch = () => {
    setSearchQuery("");
  };

  const handleActiveItemChange = (item) => {
    setActiveItem(item);
    if (item === "dashboard") {
      navigate("/dashboard");
    } else if (item === "bookmarks") {
      navigate("/bookmarks");
    } else if (item === "library") {
      navigate("/library");
    } else if (item === "settings") {
      navigate("/settings");
    }
    resetSearch();
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

  return (
    <main className="main-content">
      <div className="sidebar_container">
        <Sidebar
          activeItem={activeItem}
          setActiveItem={handleActiveItemChange}
          resetSearch={resetSearch}
        />
      </div>

      <div className="dashboard_container">
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
        <div className="dashboard_body">
          {loading ? ( // Render loading spinner while loading
             <div className="loading-spinner">
                <img src={loadingSpinner} alt="Loading..." />
              </div>
          ) : (
            <div
              className="carousels_container"
              style={{ width: "100%"}}
            >
              <div className="new_releases_carousel">
                <Carousel />
              </div>
              {genreBooks && Object.keys(genreBooks).map((genre, index) => (
                <div className="genre_carousel" key={index}>
                  <GenreCarousel
                    heading={genre}
                    genre_carousel_images={genreBooks[genre]?.map((book) => ({
                      image: book.thumbnail,
                      id: book._id,
                      title:book.title,
                      author_list:book.author_list
                    }))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
