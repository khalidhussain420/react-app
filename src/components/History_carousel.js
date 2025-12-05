import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/History_carousel.css";
import bigLeftArrow from '../images/bigLeftArrow.png';
import bigRightArrow from '../images/bigRightArrow.png';
import { fetchUserLibraryBooks } from "../services/AllServices.js";
import { speakText } from './utils/speechUtils.js';

const HistoryCarousel = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [historyBooks, setHistoryBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetchUserLibraryBooks();

        if (response.status === "success") {
          // Filter books that have status "completed" or "restarted"
          const filteredBooks = response.data.filter(book => book.status === "completed" || book.status === "restarted");
          setBooks(response?.data || []); 
          setHistoryBooks(filteredBooks);
        }
      } catch (error) {
        console.error("Error fetching history books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  
 

  const maxIndex = historyBooks.length > 5 ? historyBooks.length - 5 : 0;
  const prevSlide = () => {
    setCurrentIdx((prevIdx) => (prevIdx === 0 ? maxIndex : prevIdx - 1));
  };

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

  return (
    <div className="carousel__wrap">
      <div className="carousel__inner">
        <button className="carousel__btn" onClick={prevSlide} disabled={historyBooks.length <= 5}>
          <div className="carousel__btn--prev">
            <img src={bigLeftArrow} alt="Previous" className="carousel__btn-arrow" />
          </div>
        </button>

        <div className="carousel__container">
          <div className="genre_heading"
          tabIndex={0} 
                    onFocus={() => speakText(`History section. You have ${historyBooks.length} books in history.`)}
          >History Books</div>
          {loading ? (
            <p>Loading...</p>
          ) : historyBooks.length === 0 ? (
            <p>No books found in history.</p>
          ) : (
            <div className="carousel__slide-list" style={{ transform: `translateX(-${currentIdx * (10.3 + 2)}vw)` }}>
              {historyBooks.map((book, index) => (
                <div key={book._id} className="carousel__slide-item" onClick={() => navigate(`/book-info/${book._id}`, { state: { books } })} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") { navigate(`/book-info/${book._id}`, { state: { books } }) }}} onFocus={() => speakText(book.title)}>
                  <img src={book.thumbnail} alt={book.title} />
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="carousel__btn" onClick={nextSlide} disabled={historyBooks.length <= 5}>
          <div className="carousel__btn--next">
            <img src={bigRightArrow} alt="Next" className="carousel__btn-arrow" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HistoryCarousel;