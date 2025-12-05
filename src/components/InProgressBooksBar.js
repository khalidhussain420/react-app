import React from 'react';
import '../styles/InProgessBooksBar.css';
import { useNavigate } from "react-router-dom";
import { fetchPageDetails } from "../services/AllServices.js";
import { speakText } from './utils/speechUtils'; // Import the speakText utility

const InProgessBooksBar = ({ inProgressBooks }) => {
  const navigate = useNavigate();

  const handlePlayClick = async (event, bookID, bookName) => {
    event.preventDefault(); // Prevent default link behavior

    if (!bookID) {
      console.log('No bookID provided:', bookID);
      return;
    }

    console.log('Attempting to fetch details for bookID:', bookID);
    try {
      const response = await fetchPageDetails(bookID);
      console.log(response);
      if (response) {
        // Announce that the user is continuing the book
        
        navigate("/audiobook-player", { state: { bookData: response } });
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      console.error("Error in handlePlayClick:", error);
    }
  };

  // Handle focus and keyboard navigation
  const handleFocusOnBook = (bookName, percentage) => {
    speakText(`${bookName}, Progress: ${percentage}%`);
  };

  const handleFocusOnContinueReading = () => {
    speakText("Continue reading books section.");
  };

  return (
    <div className="progressbar_container">
      <h3
        className="progressbook_title"
        onFocus={handleFocusOnContinueReading} // Trigger speech when focusing on the title
        tabIndex={0}
      >
        Continue Reading
      </h3>
      <div className="progessbar-book-list">
        {inProgressBooks.map((book, index) => (
          <a
            href="/audiobook-player"
            key={index}
            className={`progress-container ${book.colorClass}-bg`}
            tabIndex={0} // Allow keyboard focus
            onClick={(e) => handlePlayClick(e, book.id, book.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePlayClick(e, book.id, book.name);
              }
            }}
            onFocus={() => handleFocusOnBook(book.name, book.percentage)} // Trigger speech on focus
          >
            <div
              className={`progress-bar ${book.colorClass}`}
              style={{ width: `${book.percentage}%` }}
            >
              <div className="text-container">
                <span className="percentage-text">{book.percentage}%</span>
                <span className="book-name">{book.name}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default InProgessBooksBar;
