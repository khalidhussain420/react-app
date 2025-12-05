import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import '../styles/BookInfo.css';
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import bigLeftArrow from '../images/bigLeftArrow.png';
import bigRightArrow from '../images/bigRightArrow.png';
import playIcon from '../images/playIcon.png';
import tickReadLaterIcon from '../images/tick_readlater.png';
import readlaterIcon from '../images/readlater_icon.png';
import { insertReadLater, deleteReadLater, fetchPageDetails } from "../services/AllServices.js"; // Import delete API

const SearchedBookInfoPage = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { bookId } = useParams(); // Get bookId from URL
  const [isBookmarked, setIsBookmarked] = useState(false); // State to track bookmark status
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize books to avoid unnecessary re-renders
  const books = useMemo(() => location.state?.books || [], [location.state]);
  const selectedBook = location.state?.selectedBook || books.find(book => book.bookID === bookId);
  
  useEffect(() => {
    if (selectedBook) {
      const selectedIndex = books.findIndex((book) => book.bookID === bookId);
      setCurrentIndex(selectedIndex !== -1 ? selectedIndex : 0);
    }
  }, [bookId, books, selectedBook]);
  
  const currentBook = selectedBook || books[currentIndex] || {};

  const handlePlayClick = async (event, bookID) => {
    event.preventDefault(); // Prevent default link behavior
    
    if (!bookID) {
      console.log('No bookID provided:', bookID);
      return;
    }
  
    console.log('Attempting to fetch details for bookID:', bookID);
    try {
      const response = await fetchPageDetails(bookID);
      if (response) {
        navigate("/audiobook-player", { state: { bookData: response } });
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      console.error("Error in handlePlayClick:", error);
    }
  };
  

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % books.length;
      const nextBook = books[nextIndex];
      navigate(`/searched-books/${nextBook.bookID}`, { state: { books } });
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexCalc = (prevIndex - 1 + books.length) % books.length;
      const prevBook = books[prevIndexCalc];
      navigate(`/searched-books/${prevBook.bookID}`, { state: { books } });
      return prevIndexCalc;
    });
  };

  const handleProfileClick = () => {
    navigate("/settings", { state: { selectedSection: "account" } });
  };

  
  const resetSearch = () => {
    setSearchQuery("");
  };

  const toggleBookmark = async (bookID) => {
    // Get existing bookmarks from local storage
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  
    if (isBookmarked) {
      // Remove the bookmark
      await deleteReadLater({ bookID }); 
      delete storedBookmarks[bookID];
      setIsBookmarked(false);
    } else {
      // Add the bookmark
      await insertReadLater({ bookID }); 
      storedBookmarks[bookID] = true;
      setIsBookmarked(true);
    }
  
    // Save updated bookmarks back to local storage
    localStorage.setItem("bookmarks", JSON.stringify(storedBookmarks));
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

      <div className="bookInfo_container">
         <Header
            showSearch={showSearch}
            showUserProfile={showUserProfile}
            showArrows={showArrows}
            pageName={pageName}
            searchQuery={searchQuery}
            onSearch={(query) => setSearchQuery(query)}
            onProfileClick={handleProfileClick} 
          />

        <div className="bookInfo_body">
          <div className="carousel-container">
            <div className="carousel-arrow" onClick={handlePrev}>
                <div className="left-arrow">
                 <img src={bigLeftArrow} alt="left arrow" />
                </div>
            </div>

            <div className="carousel-content">
              <img className="bookinfo_cover" src={currentBook.thumbnail} alt="Book Cover" />
              <div className="book_info">
                <div className="bookinfo_title_play">
                  <div className="bookinfo_title">{currentBook.title}</div>
                  <a href="/audiobook-player" className="bookinfo_play" onClick={(e) => handlePlayClick(e, currentBook.bookID)}>
                    <img src={playIcon} alt="play icon" />
                  </a>
                </div>
                <div className="bookinfo_author_save">
                  <div className="bookinfo_author">{currentBook.author_list?.join(", ")}</div>
                  <div
                      className="bookinfo_save"
                      onClick={() => toggleBookmark(currentBook._id)}
                    >
                     <img
                        src={isBookmarked ? tickReadLaterIcon : readlaterIcon}
                        alt="bookmark icon"
                      />
                  </div>
                </div>
                <p className="bookinfo_description">{currentBook.description}</p>
              </div>
            </div>

            <div className="carousel-arrow" onClick={handleNext}>
                <div className="right-arrow">
                  <img src={bigRightArrow} alt="right arrow" />
                </div>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchedBookInfoPage;
