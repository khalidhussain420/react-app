import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/BookGrids.css";
import { speakText } from './utils/speechUtils.js';

const BookGrids = ({ markedBooks, loading }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (markedBooks.length > 0) {
        speakText(`You have ${markedBooks.length} bookmarkes.`);
      } else {
        speakText("You haven't bookmarked any books yet.");
      }
    }
  }, [markedBooks, loading]);

  const handleBookClick = (bookid) => {
    navigate(`/view-bookmarks?bookid=${bookid}`);
  };

  return (
    <div className="bookGrid__wrap">
      <div className="bookGrid__heading">Showing Bookmarks</div>
      <div className="bookGrid__grid">
        {loading ? (
          <div className="carousel__skeleton-loader">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="carousel__skeleton-item"></div>
            ))}
          </div>
        ) : markedBooks.length === 0 ? (
          <div className="no-books-message">You haven't bookmarked any books yet.</div>
        ) : (
          markedBooks.map((book, index) => (
            <div className="bookGrid__grid-item" key={book._id || index}>
              <div 
                className="bookGrid-img"
                tabIndex={0}
                onClick={() => handleBookClick(book._id)}  
                onFocus={() => speakText(book.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    speakText(`You have ${book.bookMarkCount} bookmarks in this book.`);
                    handleBookClick(book._id);
                  }
                }}>
                <img src={book.thumbnail} alt={`${book.title} Thumbnail`} />
              </div>
              <div className="bookGrid__details">
                <div className="bookGrid__name">{book.title}</div>
                <div className="bookGrid__bookmarks">Bookmarks - {book.bookMarkCount}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookGrids;
