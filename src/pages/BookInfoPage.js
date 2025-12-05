import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import '../styles/BookInfo.css';
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import bigLeftArrow from '../images/bigLeftArrow.png';
import bigRightArrow from '../images/bigRightArrow.png';
import playIcon from '../images/playIcon.png';
import readlaterIcon from '../images/readlater_icon.png';
import tickReadLaterIcon from '../images/tick_readlater.png'; // New tick icon
import loadingSpinner from "../images/loadingSpinner.gif";
import { insertReadLater, deleteReadLater,fetchPageDetails  } from "../services/AllServices.js"; // Import delete API

const BookInfo = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortedBooks, setSortedBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false); // State to track bookmark status
  const { bookId, genre } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchBookData = () => {
      try {
        setLoading(true);
        if (genre && location.state?.genreBooks[genre]) {
          const booksInGenre = location.state.genreBooks[genre];
          setSortedBooks(booksInGenre);
  
          const selectedIndex = booksInGenre.findIndex((book) => book._id === bookId);
          setCurrentIndex(selectedIndex !== -1 ? selectedIndex : 0);
  
          // Check bookmark status from local storage
          const currentBook = booksInGenre[selectedIndex];
          const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
          setIsBookmarked(!!storedBookmarks[currentBook._id]); // Check if the book is bookmarked
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookData();
  }, [genre, bookId, location.state]);

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
  
  const toggleBookmark = async (bookID) => {
    const currentBook = sortedBooks[currentIndex];
  
    // Get existing bookmarks from local storage
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  
    if (isBookmarked) {
      // Remove the bookmark
      await deleteReadLater({ bookID }); 
      delete storedBookmarks[currentBook._id];
      setIsBookmarked(false);
    } else {
      // Add the bookmark
      await insertReadLater({ bookID }); 
      storedBookmarks[currentBook._id] = true;
      setIsBookmarked(true);
    }
  
    // Save updated bookmarks back to local storage
    localStorage.setItem("bookmarks", JSON.stringify(storedBookmarks));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % sortedBooks.length;
      const nextBook = sortedBooks[nextIndex];
      navigate(`/book-info/${genre}/${nextBook._id}`, { state: location.state });
      setIsBookmarked(nextBook?.isBookmarked || false); // Update bookmark status for the new book
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexCalc = (prevIndex - 1 + sortedBooks.length) % sortedBooks.length;
      const prevBook = sortedBooks[prevIndexCalc];
      navigate(`/book-info/${genre}/${prevBook._id}`, { state: location.state });
      setIsBookmarked(prevBook?.isBookmarked || false); // Update bookmark status for the new book
      return prevIndexCalc;
    });
  };  

  const currentBook = sortedBooks[currentIndex] || {};

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
          {loading ? (
            <div className="loading-spinner">
              <img src={loadingSpinner} alt="Loading..." />
            </div>
          ) : (
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
                    <a href="/audiobook-player" className="bookinfo_play" onClick={(e) => handlePlayClick(e, currentBook._id)} >
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
          )}
        </div>
      </div>
    </main>
  );
};

export default BookInfo;
