import React, { useState, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { fetchAllBooks } from '../services/AllServices';
import { getToken } from '../storage/Storage'; 
import '../styles/Carousel.css';

import leftArrow from '../images/new_release_carousel_leftarrow.png'; 
import rightArrow from '../images/new_release_carousel_rightarrow.png'; 
import { speakText } from './utils/speechUtils'; // Import the speakText utility

const Carousel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
    };
    fetchToken();

    const getBooks = async () => {
      try {
        const response = await fetchAllBooks();
        const sortedBooks = response.data
          .sort((a, b) => new Date(b.created) - new Date(a.created))
          .slice(0, 6);
        setBooks(sortedBooks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };
    getBooks();
  }, []);

  useEffect(() => {
    const updateNavigationArrows = () => {
      if (swiperRef.current) {
        const swiper = swiperRef.current.swiper;
        const prevButton = document.querySelector('.swiper-button-prev');
        const nextButton = document.querySelector('.swiper-button-next');
  
        if (swiper.isBeginning) {
          prevButton.classList.add('disabled');
        } else {
          prevButton.classList.remove('disabled');
        }
  
        if (swiper.isEnd) {
          nextButton.classList.add('disabled');
        } else {
          nextButton.classList.remove('disabled');
        }
      }
    };
  
    if (swiperRef.current) {
      swiperRef.current.swiper.on('slideChange', updateNavigationArrows);
      updateNavigationArrows();
    }
  }, [swiperRef]);

  const handleSlideClick = (bookId) => {
    if (!token) {
      navigate('/signin');
    } else {
      navigate(`/book-info/${bookId}`, { state: { books } });
    }
  };

  // Handle focus events for speaking text
  const handleFocusOnSlide = (bookTitle) => {
    speakText(`${bookTitle}`);
  };

  const handleFocusOnArrow = (direction) => {
    speakText(`Move ${direction} through the carousel`);
  };

  return (
    <div className="new-rleases-carousel-container">
      <Swiper
        ref={swiperRef}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={false}
        slidesPerView={2}
        spaceBetween={-20}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper-container"
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 200,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 120,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: -65,
          },
        }}
      >
        {loading ? (
          [...Array(6)].map((_, index) => (
            <SwiperSlide key={index} className="swiper-slide carousel-skeleton-item">
              <div className="carousel-skeleton-image"></div>
            </SwiperSlide>
          ))
        ) : (
          books.map((book) => (
            <SwiperSlide
              key={book._id}
              className="swiper-slide"
              tabIndex={swiperRef.current?.swiper.activeIndex === books.indexOf(book) ? "0" : "-1"}
              onClick={() => handleSlideClick(book._id)}
              onKeyDown={(e) => e.key === "Enter" && handleSlideClick(book._id)}
              onFocus={() => handleFocusOnSlide(book.title)} // Trigger speech on focus
            >
              <img src={book.thumbnail} alt={book.title} />
            </SwiperSlide>
          ))
        )}
        <div className="swiper-pagination"></div>
      </Swiper>

      <button
        className="swiper-button-prev"
        tabIndex="0"
        onClick={() => swiperRef.current?.swiper.slidePrev()}
        onKeyDown={(e) => e.key === "Enter" && swiperRef.current?.swiper.slidePrev()}
        onFocus={() => handleFocusOnArrow("backward")} // Speech on focus
      >
        <img src={leftArrow} alt="Left Arrow" />
      </button>

      <button
        className="swiper-button-next"
        tabIndex="0"
        onClick={() => swiperRef.current?.swiper.slideNext()}
        onKeyDown={(e) => e.key === "Enter" && swiperRef.current?.swiper.slideNext()}
        onFocus={() => handleFocusOnArrow("forward")} // Speech on focus
      >
        <img src={rightArrow} alt="Right Arrow" />
      </button>
    </div>
  );
};

export default Carousel;
