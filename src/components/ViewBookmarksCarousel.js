import React, { useEffect, useState } from "react";
import "../styles/ViewBookmarksCarousel.css";
import bigLeftArrow from "../images/bigLeftArrow.png";
import bigRightArrow from "../images/bigRightArrow.png";
import playIcon from "../images/playIcon.png";
import delIcon from "../images/delIcon.png";
import { fetchUserBookmarks, deleteBookMarks } from "../services/AllServices.js";
import { useSearchParams, useNavigate } from "react-router-dom";

const ViewBookmarksCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [markedBooks, setMarkedBooks] = useState([]);
  const [selectedBookIdx, setSelectedBookIdx] = useState(0);
  const [searchParams] = useSearchParams();
  const bookid = searchParams.get("bookid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetchUserBookmarks();
        console.log('dnwdn',response);
        const books = response.data || [];
        setMarkedBooks(books);

        // Find the index of the book with the given bookid
        const bookIndex = books.findIndex((book) => book._id === bookid);
        if (bookIndex !== -1) {
          setCurrentIdx(Math.max(0, bookIndex - 4)); // Set to show the book at the center of the carousel
          setSelectedBookIdx(bookIndex);
        } else {
          setSelectedBookIdx(0); // Reset if bookid is invalid
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBookmarks();
  }, [bookid]); // Add bookid as a dependency to refetch data on bookid change

  const maxIndex = Math.max(0, markedBooks.length - 10);

  const prevSlide = () => {
    setCurrentIdx((prevIdx) => (prevIdx === 0 ? maxIndex : prevIdx - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prevIdx) => (prevIdx === maxIndex ? 0 : prevIdx + 1));
  };

  const handleBookSelect = (index) => {
    const selectedBook = markedBooks[index];
    if (selectedBook) {
      // Redirect to the URL with the new bookid
      navigate(`/view-bookmarks?bookid=${selectedBook._id}`);
    }
  };
  const handleDelete = async (bookmarkId) => {
    console.log(bookmarkId)
    try {
      await deleteBookMarks({ bookmarkId }, () => {
        setMarkedBooks((prevBooks) => prevBooks.filter(book => book._id !== bookmarkId));
        window.location.reload();
      });
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const selectedBook = markedBooks[selectedBookIdx];
  const selectedSections = selectedBook?.sections || [];

  return (
    <div className="viewbookmarks_carousel__wrap">
      <div className="viewbookmarks_carousel__inner">
        <button className="viewbookmarks_carousel__btn" onClick={prevSlide}>
          <div className="viewbookmarks_carousel__btn--prev">
            <img src={bigLeftArrow} alt="Previous" className="viewbookmarks_carousel__btn-arrow" />
          </div>
        </button>

        <div className="viewbookmarks_carousel__container">
          <div className="viewbookmarks_heading">View Bookmarks</div>
          {loading ? (
            <div className="viewbookmarks__skeleton-loader">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="viewbookmarks__skeleton-item"></div>
              ))}
            </div>
          ) : (
            <div
              className="viewbookmarks_carousel__slide-list"
              style={{ transform: `translateX(-${currentIdx * (10.3 + 2)}vw)` }}
            >
              {markedBooks.map((book, index) => (
                <div
                  key={book._id}
                  className={`viewbookmarks_carousel__slide-item ${
                    index === selectedBookIdx ? "active" : ""
                  }`}
                  onClick={() => handleBookSelect(index)}
                >
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="viewbookmarks_carousel__slide-thumbnail"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="viewbookmarks_carousel__btn" onClick={nextSlide}>
          <div className="viewbookmarks_carousel__btn--next">
            <img src={bigRightArrow} alt="Next" className="viewbookmarks_carousel__btn-arrow" />
          </div>
        </button>
      </div>
      {/* Dynamic content based on selected book */}
      {selectedSections.length > 0 ? (
        <div className="bookmarks_section_container">
          
          {selectedSections.map((section, index) => (
            <div key={index} className="section_box" style={{ background: index % 2 === 0 ? "rgba(223, 200, 38, 0.52)" : "rgba(137, 187, 52, 0.52)" }}>
              <div className="play_container">
                <div className="play_img">
                  <img src={playIcon} alt="play icon" />
                </div>
              </div>
              <div className="section_info_container">
                <div className="section_bookname">{selectedBook?.title || "NA"}</div>
                <div className="section_time">7:25 - 7:30</div>
              </div>
              <div className="section_content_container">
                <p className="section_content">{section.text || "No content available"}</p>
                <div className="section_delete" onClick={() => handleDelete(section.bookmarkID)}>
                  <div className="del_img">
                    <img src={delIcon} alt="delete" />
                  </div>
                  <div className="del_text">Delete</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No sections available</p>
      )}

    </div>
  );
};

export default ViewBookmarksCarousel;
