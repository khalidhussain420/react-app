import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import Carousel from "../components/Carousel.js";
import GenreCarousel from "../components/Genre_carousel.js";
import InProgessBooksBar from "../components/InProgressBooksBar.js";
import { fetchAllGenreBooks, fetchUserLibraryBooks } from "../services/AllServices.js";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [genreBooks, setGenreBooks] = useState({});
  const [inProgressBooks, setInProgressBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetchUserLibraryBooks();
        console.log(response);
        if (response.status === "success") {
          const colorClasses = ["green", "yellow", "orange"];
          const lastThreeBooks = response.data.slice(-3).map((book, index) => ({
            id: book._id,
            name: book.title,
            percentage: Math.round(((book.index - 1) / book.page_count) * 100),
            colorClass: colorClasses[index % colorClasses.length],
          }));
          setInProgressBooks(lastThreeBooks);
        }
      } catch (error) {
        console.error("Error fetching in-progress books:", error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchGenreBooks = async () => {
      try {
        const response = await fetchAllGenreBooks();
        setGenreBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch genre books:", error);
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
          <div
            className="carousels_container"
            style={{ width: inProgressBooks.length === 0 ? "100%" : "72%" }}
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
          {inProgressBooks.length > 0 && (
            <div className="inprogress_booksbar">
              <InProgessBooksBar inProgressBooks={inProgressBooks} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
