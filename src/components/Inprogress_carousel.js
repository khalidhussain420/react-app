import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Inprogress_carousel.css";
import bigLeftArrow from '../images/bigLeftArrow.png';
import bigRightArrow from '../images/bigRightArrow.png';
import emptyStateIcon from "../images/emptyStateIcon.png"; // Add an appropriate empty state image/illustration
import { fetchUserLibraryBooks, fetchPageDetails } from "../services/AllServices.js";
import { speakText } from './utils/speechUtils.js';

const InProgressCarousel = () => {
  const [inProgressBooks, setInProgressBooks] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetchUserLibraryBooks();
        if (response.status === "success") {
          // Filter books that have status "inprogress"
          const filteredBooks = response.data.filter(book => book.status === "inprogress" || book.status === "restarted");
          setInProgressBooks(filteredBooks);
        }
      } catch (error) {
        console.error("Error fetching in-progress books:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, []);
  
  
  const maxIndex = inProgressBooks.length - 5;

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIdx((prevIdx) => (prevIdx === 0 ? maxIndex : prevIdx - 1));
  };

  // Handle next slide
  const nextSlide = () => {
    setCurrentIdx((prevIdx) => (prevIdx === maxIndex ? 0 : prevIdx + 1));
  };

  if (loading) {
    return (
      <div className="carousel__wrap">
        <div className="carousel__skeleton-loader-lib">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="carousel__skeleton-item"></div>
          ))}
        </div>
      </div>
    );
  }

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

  return (
    <div className="carousel__wrap">
      {inProgressBooks.length === 0 ? (
        <div className="empty-state-container">
          <div className="genre_heading" 
          tabIndex={0} 
          onFocus={() => speakText(`In Progress section. You have ${inProgressBooks.length} books in progress.`)}>In Progress</div>
          <div className="empty-state">
           <div className="emptyStateIconAndHeading">
            <div className="emptyStateIcon" ><img src={emptyStateIcon} alt="No books" /></div>
            <div className="empty-state__heading">No Books in Progress</div>
           </div>

          <p className="empty-state__text">
            Start listening to your favorite books to see them here.
          </p>
          <a href="/" className="empty-state__cta">
            Browse Books
          </a>
          </div>
        </div>
      ) : (
        <div className="carousel__inner">
          <button className="carousel__btn" onClick={prevSlide}>
            <div className="carousel__btn--prev">
              <img src={bigLeftArrow} alt="Previous" className="carousel__btn-arrow" />
            </div>
          </button>

          <div className="carousel__container">
            <div className="genre_heading">In Progress</div>
            <div
              className="carousel__slide-list"
              style={{ transform: `translateX(-${currentIdx * (10.3 + 2)}vw)` }}
            >
              {inProgressBooks.map((book, index) => (
                <div
                  key={index}
                  className="carousel__slide-item"
                  tabIndex={0} // Make the item focusable
                  onClick={(e) => handlePlayClick(e, book._id)} // Handle click
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePlayClick(e, book._id); // Handle "Enter" key
                    }
                  }}
                  onFocus={() => speakText(book.title)}
                  role="button" // Indicate that the div is interactive
                  aria-label={`Play ${book.title}`} // Accessibility description
                >
                  <img src={book.thumbnail} alt={`carousel-item-${index}`} />
                </div>
              ))}
            </div>
          </div>

          <button className="carousel__btn" onClick={nextSlide}>
            <div className="carousel__btn--next">
              <img src={bigRightArrow} alt="Next" className="carousel__btn-arrow" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default InProgressCarousel;