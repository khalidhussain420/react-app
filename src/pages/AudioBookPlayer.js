import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactSlider from "react-slider";
import "../styles/AudioBookPlayer.css";
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import { insertBookmark, fetchNextPageDetails } from "../services/AllServices.js";
import { speakText } from "../components/utils/speechUtils.js";

// import arrowBack from "../images/arrow_back.png";
// import arrowNext from "../images/arrow_next.png";
import fastForward from "../images/fast_forward.png";
import fastBackward from "../images/fast_backward.png";
import downArrow from "../images/down_arrow.png";
import skipForward from "../images/skip_forward.png";
import skipBackward from "../images/skip_backward.png";
import playIcon from "../images/playIcon.png";
import pauseIcon from "../images/pauseIcon.png";
import saveIcon from "../images/saveIcon.png";
import zoomIn from "../images/zoom_in.png";
import zoomOut from "../images/zoom_out.png";
import fullScreen from "../images/fullScreen.png";
import exitFullScreen from "../images/exit_fullscreen.png";
import brightnessImg from "../images/brightness.png";

const AudioBookPlayer = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef(null);
  const textContainerRef = useRef(null);
  const activeTextRef = useRef(null);

  const [bookData, setBookData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null); 
  const highlightedItemRef = useRef(null);
  
  // Helper function to conditionally speak text only when audio is paused
  const conditionalSpeakText = useCallback((text) => {
    if (!isPlaying) {
      speakText(text);
    }
  }, [isPlaying]);

  // Initialize book data and start playing
  useEffect(() => {
    if (location.state?.bookData) {
      setBookData(location.state.bookData);
      setCurrentSectionIndex(0);
      setTimeout(() => {
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.play().catch((error) => console.warn("Playback failed:", error));
        }
      }, 2000); // 2-second delay before playing
    }

    // Stop other page audio/speech when navigating to this page
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    };
  }, [location.state]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Handle text scrolling and highlighting
  useEffect(() => {
    if (textContainerRef.current) {
      const currentElement = textContainerRef.current.querySelector('.highlighted');
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSectionIndex]);

  // Section end handler
  const handleSectionEnd = async () => {
    if (currentSectionIndex < (bookData?.sections?.length || 0) - 1) {
      // If there are more sections in the current page, move to the next section
      setCurrentSectionIndex((prev) => prev + 1);
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play(), 100); // Ensure next audio plays
    } else {
      // If this is the last section of the current page
      if (bookData.index < bookData.total_pages) {
        // If there are more pages, fetch the next page
        const newBookData = await fetchNextPageDetails(bookData.bookID, bookData.index, "next");
        if (newBookData) {
          setBookData(newBookData.data);
          setCurrentSectionIndex(0); // Start from the first section of the new page
          setIsPlaying(true);
          setTimeout(() => audioRef.current?.play(), 100); // Ensure next audio plays
        } else {
          // If there's no next page, stop playing
          setIsPlaying(false);
          conditionalSpeakText("End of book reached");
        }
      } else {
        // If this is the last section of the last page, set progress to 100%
        setIsPlaying(false);
        console.log("Reached the end of the book.");
        conditionalSpeakText("You have reached the end of the book");
        // Force progress to 100%
        setBookData((prevData) => ({
          ...prevData,
          index: bookData.total_pages, // Ensure index is set to the last page
        }));
      }
    }
  };

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        // Only speak when transitioning to paused state
        setTimeout(() => {
          speakText("Audio paused");
        }, 100);
      } else {
        audioRef.current.play().catch((error) => {
          console.warn("Playback failed:", error);
          setIsPlaying(false);
          speakText("Playback failed");
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const calculatePageProgress = () => {
    if (bookData) {
      // If it's the last page and all sections are completed, return 100%
      if (bookData.index === bookData.total_pages && currentSectionIndex === bookData.sections.length - 1) {
        return 100;
      }
      // Otherwise, calculate progress based on the current page index
      return ((bookData.index - 1) / bookData.total_pages) * 100;
    }
    return 0;
  };

  const handleSkipSectionForward = useCallback(() => {
    if (currentSectionIndex < bookData?.sections?.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      if (!isPlaying) {
        conditionalSpeakText("Moved to next section");
      } else {
        setIsPlaying(true);
        setTimeout(() => audioRef.current?.play(), 100);
      }
    } else {
      conditionalSpeakText("This is the last section of the page");
    }
  }, [currentSectionIndex, bookData, isPlaying, conditionalSpeakText]);
  
  const handleSkipSectionBackward = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      if (!isPlaying) {
        conditionalSpeakText("Moved to previous section");
      } else {
        setIsPlaying(true);
        setTimeout(() => audioRef.current?.play(), 100);
      }
    } else {
      conditionalSpeakText("This is the first section of the page");
    }
  }, [currentSectionIndex, isPlaying, conditionalSpeakText]);

  const handleSkipPageForward = useCallback(async () => {
    if (bookData.index < bookData.total_pages) {
      // Fetch the next page if available
      const newBookData = await fetchNextPageDetails(bookData.bookID, bookData.index, "next");
      if (newBookData) {
        setBookData(newBookData.data);
        setCurrentSectionIndex(0); // Start from the first section of the new page
        if (!isPlaying) {
          conditionalSpeakText(`Moved to page ${newBookData.data.index}`);
        } else {
          setIsPlaying(true);
          setTimeout(() => audioRef.current?.play(), 100); // Ensure next audio plays
        }
      }
    } else {
      // If this is the last page, stop playing or handle end of book
      setIsPlaying(false);
      conditionalSpeakText("This is the last page of the book");
      console.log("Reached the end of the book.");
    }
  }, [bookData, isPlaying, conditionalSpeakText]);

  const handleSkipPageBackward = useCallback(async () => {
    if (!bookData || !bookData.bookID) {
      console.error("bookData is undefined or missing bookID");
      return;
    }
    
    if (bookData.index > 1) {
      const newBookData = await fetchNextPageDetails(bookData.bookID, bookData.index, "previous");
      setBookData(newBookData.data);
      
      if (!isPlaying) {
        conditionalSpeakText(`Moved to page ${newBookData.data.index}`);
      } else {
        setIsPlaying(true);
        setTimeout(() => audioRef.current?.play(), 100);
      }
    } else {
      conditionalSpeakText("This is the first page of the book");
    }
  }, [bookData, isPlaying, conditionalSpeakText]);
  
  const handlePageChange = async (pageIndex) => {
    const newBookData = await fetchNextPageDetails(bookData.bookID, pageIndex, "same");
    if (newBookData) {
      setBookData(newBookData.data);
      setCurrentSectionIndex(0); // Reset section index on page change
      
      if (!isPlaying) {
        conditionalSpeakText(`Moved to page ${pageIndex}`);
      } else {
        setIsPlaying(true);
        setTimeout(() => audioRef.current?.play(), 100);
      }
      
      setIsDropdownOpen(false); // Close dropdown
    }
  };

  const handleSectionClick = (index) => {
    setCurrentSectionIndex(index); // Jump to the selected section
    
    if (!isPlaying) {
      conditionalSpeakText(`Selected section ${index + 1}`);
    } else {
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    }
  };

  // Handle brightness change
  const handleBrightnessChange = (value) => {
    setBrightness(value);
    if (!isPlaying) {
      conditionalSpeakText(`Brightness set to ${value} percent`);
    }
  };

  // Handle zoom level change
  const handleZoomChange = (value) => {
    setZoomLevel(value);
    if (!isPlaying) {
      conditionalSpeakText(`Zoom level set to ${value} percent`);
    }
  };

  // Handle fullscreen toggle
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    const leftSection = document.querySelector('.left-section');
    if (leftSection) {
      leftSection.classList.toggle('fullscreen-active', !isFullScreen);
    }
    
    if (!isPlaying) {
      conditionalSpeakText(isFullScreen ? "Exited full screen mode" : "Entered full screen mode");
    }
  };


  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    if (!isPlaying && !isDropdownOpen) {
      conditionalSpeakText("Page selection dropdown opened");
    }
  };

  // Handle keydown events
  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key === "ArrowDown") {
        // Ctrl + Down Arrow → Open Dropdown
        event.preventDefault();
        setIsDropdownOpen(true);
        setHighlightedIndex(bookData.index - 1); // Highlight current page
        conditionalSpeakText("Page selection dropdown opened");
      } else if (event.ctrlKey && event.key === "ArrowUp") {
        // Ctrl + Up Arrow → Close Dropdown
        event.preventDefault();
        setIsDropdownOpen(false);
        conditionalSpeakText("Page selection dropdown closed");
      } else if (isDropdownOpen && event.key === "ArrowDown") {
        // Down Arrow → Move Down in Dropdown
        event.preventDefault();
        const newIndex = Math.min(highlightedIndex + 1, (bookData?.total_pages || 1) - 1);
        setHighlightedIndex(newIndex);
        conditionalSpeakText(`Page ${newIndex + 1} highlighted`);
      } else if (isDropdownOpen && event.key === "ArrowUp") {
        // Up Arrow → Move Up in Dropdown
        event.preventDefault();
        const newIndex = Math.max(highlightedIndex - 1, 0);
        setHighlightedIndex(newIndex);
        conditionalSpeakText(`Page ${newIndex + 1} highlighted`);
      } else if (isDropdownOpen && event.key === "Enter") {
        // Enter → Select Highlighted Page
        event.preventDefault();
        handlePageChange(highlightedIndex + 1);
      } else if (event.ctrlKey && event.key === "ArrowRight") {
        if (bookData.index < bookData.total_pages) {
          event.preventDefault();
          handleSkipPageForward();
        } else {
          conditionalSpeakText("This is the last page of the book");
        }
      } else if (event.ctrlKey && event.key === "ArrowLeft") {
        if (bookData.index > 1) {
          event.preventDefault();
          handleSkipPageBackward();
        } else {
          conditionalSpeakText("This is the first page of the book");
        }
      } else if (event.altKey && event.key === "ArrowRight") {
        if (currentSectionIndex < bookData?.sections?.length - 1) {
          event.preventDefault();
          handleSkipSectionForward();
        } else {
          conditionalSpeakText("This is the last section of the page");
        }
      } else if (event.altKey && event.key === "ArrowLeft") {
        if (currentSectionIndex > 0) {
          event.preventDefault();
          handleSkipSectionBackward();
        } else {
          conditionalSpeakText("This is the first section of the page");
        }
      } else if (event.key === " ") {
        event.preventDefault();
        handlePlayPause();
      }
    },
    [
      handlePlayPause,
      handleSkipPageForward,
      handleSkipPageBackward,
      handleSkipSectionForward,
      handleSkipSectionBackward,
      bookData,
      currentSectionIndex,
      isDropdownOpen,
      highlightedIndex,
      conditionalSpeakText
    ]
  );

  // Add event listener for keydown
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isDropdownOpen && highlightedIndex !== -1 && highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex, isDropdownOpen]);

  const handleSaveBookmark = async () => {
    if (isPlaying) {
      // Don't allow bookmark saving during playback
      return;
    }
    
    try {
      const response = await insertBookmark({
        sectionID: currentSection._id,
        index: currentSection.index,
      });
      if (response.status === "success") {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 1000); // Hide message after 1 second
        conditionalSpeakText("Section added to bookmarks");
        console.log("Bookmark saved successfully!");
      } else {
        console.error("Failed to save bookmark:", response.message);
        conditionalSpeakText("Failed to save bookmark");
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
      conditionalSpeakText("Error saving bookmark");
    }
  };

  if (!bookData) {
    return (
      <div className="loading-container">
        <p>Loading book data...</p>
      </div>
    );
  }

  const currentSection = bookData.sections[currentSectionIndex];

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

  const handleProfileClick = () => {
    navigate("/settings", { state: { selectedSection: "account" } });
  };

  return (
    <main className="main-content">
      <div className="sidebar_container">
        <Sidebar activeItem={activeItem} setActiveItem={handleActiveItemChange} resetSearch={resetSearch} disableSpeech={isPlaying} />
      </div>

      <div className="audio_player_container">
        <div className="header_container">
          <Header showSearch={showSearch} showUserProfile={showUserProfile} showArrows={showArrows} pageName={pageName} searchQuery={searchQuery} onSearch={(query) => setSearchQuery(query)} onProfileClick={handleProfileClick} disableSpeech={isPlaying} />
        </div>

        <div className="audio-book-player">
          <div className="left-section">
            <div className="header">
              <div className="arrowSection">
                {/* <div className="arrow"><img src={arrowBack} alt="Back" className="icon" /></div>
                <div className="arrow"><img src={arrowNext} alt="next" className="icon" /></div> */}
              </div>

              <div className="chapterSection">
                <div
                  className="chapterDropdown"
                  onClick={() => !isPlaying && toggleDropdown()}
                  tabIndex={0} // Make dropdown focusable
                  aria-disabled={isPlaying}
                >
                  <span className="chapterNumber">Page {bookData?.index}</span>
                  <img src={downArrow} alt="Dropdown" className={`icon ${isPlaying ? 'disabled' : ''}`} />
                  {isDropdownOpen && !isPlaying && (
                    <ul className="dropdown-menu" ref={dropdownRef}>
                      {Array.from({ length: bookData?.total_pages || 0 }, (_, i) => {
                        const pageNumber = i + 1; // Convert to 1-based index
                        return (
                          <li
                            key={pageNumber}
                            ref={highlightedIndex === i ? highlightedItemRef : null} // Set ref for highlighted item
                            className={`dropdown-item ${
                              bookData.index === pageNumber ? "selected" : ""
                            } ${highlightedIndex === i ? "highlighted" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePageChange(pageNumber);
                            }}
                          >
                            Page {pageNumber}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <div className="saveSection">
                <div 
                  className={`book_player_save_icon ${isPlaying ? 'disabled' : ''}`} 
                  onClick={() => !isPlaying && handleSaveBookmark()} 
                  onMouseEnter={() => setShowTooltip(true)} 
                  onMouseLeave={() => setShowTooltip(false)} 
                  tabIndex={isPlaying ? -1 : 0} // Only focusable when not playing
                  onKeyDown={(e) => { 
                    if (e.key === "Enter" && !isPlaying) { 
                      handleSaveBookmark(); // Trigger bookmark action on Enter key
                    }
                  }}
                  role="button" // Improves accessibility
                  aria-label="Save to Bookmarks"
                  aria-disabled={isPlaying}
                >
                  <img src={saveIcon} alt="Bookmark" className={isPlaying ? 'disabled' : ''} />
                  {showTooltip && <div className="tooltip">Save to Bookmarks</div>}
                </div>
                {showSuccessMessage && <div className="successMessage">Section added to bookmarks!</div>}
              </div>
            </div>

            <div 
              className={`book_context_box ${isFullScreen ? 'fullscreen-active' : ''}`} 
              ref={textContainerRef} 
              style={{filter: `brightness(${brightness}%)`}}
            >
              <div className="book_content_wrapper">
                {bookData?.sections.map((section, index) => (
                  <p 
                    key={index} 
                    className={`book_context ${index === currentSectionIndex ? "highlighted" : ""}`} 
                    ref={index === currentSectionIndex ? activeTextRef : null}  
                    onClick={() => handleSectionClick(index)} 
                    style={{ 
                      fontSize: `${zoomLevel * 0.02}vw`, 
                      color: index === currentSectionIndex ? 'var(--text-primary)' : 'var(--text-grey)' 
                    }}
                  >
                    {section.text}
                  </p>
                ))}
              </div>
                      
              <div 
                className="fullscreen" 
                onClick={() => !isPlaying && toggleFullScreen()}
                tabIndex={isPlaying ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isPlaying) {
                    toggleFullScreen();
                  }
                }}
                role="button"
                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
                aria-disabled={isPlaying}
              >
                <img 
                  src={isFullScreen ? exitFullScreen : fullScreen} 
                  alt={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                  className={isPlaying ? 'disabled' : ''}
                />
              </div>
            </div>

            <audio 
              ref={audioRef} 
              src={bookData?.sections[currentSectionIndex]?.audio} 
              onEnded={handleSectionEnd} 
              onPlay={() => setIsPlaying(true)} 
              onPause={() => setIsPlaying(false)} 
              autoPlay
            />

            <div className="book-player-controls">
              {/* Skip Page Backward */}
              <div 
                className="control-section skip-backward" 
                onClick={bookData.index > 1 ? handleSkipPageBackward : null}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && bookData.index > 1) {
                    handleSkipPageBackward();
                  }
                }}
                role="button"
                aria-label="Skip to previous page"
              >
                <img 
                  src={skipBackward} 
                  alt="Skip Backward" 
                  className={`control-icon ${bookData.index === 1 ? "disabled" : ""}`} 
                />
              </div>
              
              {/* Skip Section Backward */}
              <div 
                className="control-section fast-backward" 
                onClick={currentSectionIndex > 0 ? handleSkipSectionBackward : null}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentSectionIndex > 0) {
                    handleSkipSectionBackward();
                  }
                }}
                role="button"
                aria-label="Skip to previous section"
              >
                <img 
                  src={fastBackward} 
                  alt="Fast Backward" 
                  className={`control-icon ${currentSectionIndex === 0 ? "disabled" : ""}`}
                />
              </div>
              
              {/* Play/Pause */}
              <div 
                className="control-section play-pause"
                onClick={handlePlayPause}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePlayPause();
                  }
                }}
                role="button"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <img 
                  src={isPlaying ? pauseIcon : playIcon} 
                  alt="Play/Pause" 
                  className="control-icon" 
                />
              </div>
              
              {/* Skip Section Forward */}
              <div 
                className="control-section fast-forward" 
                onClick={currentSectionIndex < bookData?.sections?.length - 1 ? handleSkipSectionForward : null}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentSectionIndex < bookData?.sections?.length - 1) {
                    handleSkipSectionForward();
                  }
                }}
                role="button"
                aria-label="Skip to next section"
              >
                <img 
                  src={fastForward} 
                  alt="Fast Forward" 
                  className={`control-icon ${currentSectionIndex === bookData?.sections?.length - 1 ? "disabled" : ""}`}
                />
              </div>
              
              {/* Skip Page Forward */}
              <div 
                className="control-section skip-forward" 
                onClick={bookData.index < bookData.total_pages ? handleSkipPageForward : null}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && bookData.index < bookData.total_pages) {
                    handleSkipPageForward();
                  }
                }}
                role="button"
                aria-label="Skip to next page"
              >
                <img 
                  src={skipForward} 
                  alt="Skip Forward" 
                  className={`control-icon ${bookData.index === bookData.total_pages ? "disabled" : ""}`}
                />
              </div>
              
              <div className="control-section speed-select-container">
                <select 
                  className="speed-select" 
                  value={speed} 
                  onChange={(e) => {
                    const newSpeed = Number(e.target.value);
                    setSpeed(newSpeed);
                    if (!isPlaying) {
                      conditionalSpeakText(`Speed set to ${newSpeed} times`);
                    }
                  }}
                  aria-label="Playback speed"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
            </div>

            <div className="book-player-progress-bar">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={calculatePageProgress()} 
                readOnly
                aria-label="Book progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(calculatePageProgress())}
              />
              <span className="progress-percent">{Math.round(calculatePageProgress())}%</span>
            </div>
            <div className="section_out_of"> Page {bookData.index} of {bookData.total_pages}</div>
          </div>

          <div className="right-section">
            {/* Book Info */}
            <div className="book-player-info">
              <div className="book-player-cover"><img src={bookData.BookDetails.thumbnail} alt="Book Cover" /></div>
                <div className="book-player-details">
                    <h3>{bookData.BookDetails.title}</h3>
                    <h4>{bookData.BookDetails.author_list?.join(", ")}</h4>
                </div>
            </div>

            {/* Brightness and Zoom Controls */}
            <div className="book-player-settings">
              <div className="book-player-slider-container">
                <div className="small-img">
                    <img src={brightnessImg} alt="brightness decrease" />
                </div>
                <ReactSlider 
                  className="book-player-custom-slider" 
                  thumbClassName="book-player-custom-slider-thumb" 
                  trackClassName="book-player-custom-slider-track" 
                  value={brightness} 
                  onChange={handleBrightnessChange} 
                  min={80} 
                  max={120}
                  disabled={isPlaying}
                  ariaLabel="Adjust brightness"
                  ariaValuemin={80}
                  ariaValuemax={120}
                  ariaValuenow={brightness}
                />
                <div className="big-img">
                    <img src={brightnessImg} alt="brightness increase" />
                </div>
              </div>
              
              <div className="book-player-slider-container">
                <div className="small-img">
                    <img src={zoomOut} alt="Zoom out" />
                </div>
                <ReactSlider 
                  className="book-player-custom-slider" 
                  thumbClassName="book-player-custom-slider-thumb" 
                  trackClassName="book-player-custom-slider-track" 
                  value={zoomLevel} 
                  min={80} 
                  max={120} 
                  onChange={handleZoomChange}
                  disabled={isPlaying}
                  ariaLabel="Adjust text size"
                  ariaValuemin={80}
                  ariaValuemax={120}
                  ariaValuenow={zoomLevel}
                />
                <div className="big-img">
                  <img src={zoomIn} alt="Zoom in" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AudioBookPlayer;