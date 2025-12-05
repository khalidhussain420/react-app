import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Bookmarks from "./pages/Bookmarks";
import ForgotPassword from "./pages/ForgotPassword";
import ViewBookmarks from "./pages/ViewBookmarks";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import BookInfo from "./pages/BookInfoPage";
import BookInformationPage from "./pages/BookInformationPage";
import AudioBookPlayer from "./pages/AudioBookPlayer";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import GenreSelection from "./pages/GenreSelect";
import SearchedBooksPage from "./pages/SearchedBooksPage.js";
import ProtectedRoute from "./Routing/PrivateRouting";
import NotFound from "./components/NotFound.js";
import LandingPage from "./pages/LandingPage.js";
import SearchedBookInfoPage from "./pages/SearchedBooksInfoPage.js";

function NotFoundWrapper() {
  const location = useLocation(); // Get the current location (i.e., URL path)
  return <NotFound location={location} />;
}

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL || "/"}>
      <div className="pagesall">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/genre" element={<GenreSelection />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<LandingPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Dashboard} />}
          />
          <Route
            path="/bookmarks"
            element={<ProtectedRoute element={Bookmarks} />}
          />
          <Route
            path="/view-bookmarks"
            element={<ProtectedRoute element={ViewBookmarks} />}
          />
          <Route
            path="/library"
            element={<ProtectedRoute element={Library} />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute element={Settings} />}
          />
          <Route
            path="/book-info/:genre/:bookId"
            element={<ProtectedRoute element={BookInfo} />}
          />
          <Route
            path="/book-info/:bookId"
            element={<ProtectedRoute element={BookInformationPage} />}
          />
          <Route
            path="/searched-books/:bookId"
            element={<ProtectedRoute element={SearchedBookInfoPage} />}
          />
          <Route
            path="/audiobook-player"
            element={<ProtectedRoute element={AudioBookPlayer} />}
          />
          <Route
            path="/searched-results"
            element={<ProtectedRoute element={SearchedBooksPage} />}
          />
          {/* Catch-All Redirect */}
          <Route path="*" element={<NotFoundWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
