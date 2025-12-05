
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SearchedBooksPage.css";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";

const SearchedBooksPage = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const books = location.state?.searchedbooks || [];
  const searchedQuery =location.state?.searchedQuery ||[];

  const handleBookClick = (bookId) => {
    const selectedBook = books.find(book => book.bookID === bookId);
    navigate(`/searched-books/${bookId}`, { state: { selectedBook, books } });
  };
  

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
      return { showSearch: true, showUserProfile: true, showArrows: true, pageName: "" };
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
        <div className="bookmarks_body">
          <div className="bookGrids_container">
            <div className="bookGrids">
              <div className="bookGrid__wrap">
                <div className="bookGrid__heading">Showing results for books "{searchedQuery}"</div>
                <div className="bookGrid__grid">
                  {books.length === 0 ? (
                    <div className="no-books-message">No books found.</div>
                  ) : (
                    books.map((book, index) => (
                      <div className="bookGrid__grid-item" key={index}>
                        <div onClick={() => handleBookClick(book.bookID)}>
                          <img
                            src={book.thumbnail}
                            alt={`${book.title} Thumbnail`}
                            className="bookGrid__thumbnail"
                          />
                        </div>
                        <div className="bookGrid__details">
                          <div className="bookGrid__name">{book.title}</div>
                          <div className="bookGrid__author">
                            {book.author_list.join(", ")}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchedBooksPage;