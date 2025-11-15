import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuthModal } from "../context/AuthModalContext";

const SharedNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin, openRegister, isAuthenticated, user, logout } = useAuthModal();
  const { isDark, toggleMode, zoom, zoomIn, zoomOut } = useTheme();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const dropdownRef = useRef(null);

  // auth is provided by AuthModalProvider

  // Update dark mode in document and localStorage
  // Theme and zoom are handled by ThemeProvider (useTheme)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getThemeColor = () => {
    // single accent gradient (no swatches)
    return "from-purple-600 to-pink-600";
  };

  return (
    <>
      {/* Apply CSS Variables */}
      <style>{`
        :root {
          --color-primary: #9333ea;
          --color-primary-dark: #7e22ce;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav
        className={`${
          isDark ? "bg-gray-800/70 border-gray-700" : "bg-white/70"
        } backdrop-blur-md shadow-sm sticky top-0 z-40 border-b transition-colors duration-300`}
      >
  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-2 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(isAuthenticated ? "/home-after-login" : "/")}
          >
            <div className={`w-7 h-7 bg-gradient-to-br ${getThemeColor()} rounded-md flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              QuizMaster
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Home link removed per request - logo still navigates home/post-login */}

            {/* Added dark/light mode toggle before Dashboard for global theme switching */}
            <button
              onClick={toggleMode}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {/* theme-toggle: uses CSS crossfade between sun & moon SVGs */}
              <span className="theme-toggle" data-mode={isDark ? 'dark' : 'light'}>
                {/* Sun icon (light mode) */}
                <svg className="icon-sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
                  </g>
                </svg>

                {/* Moon icon (dark mode) */}
                <svg className="icon-moon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
                </svg>
              </span>
            </button>

            {location.pathname !== "/" && (
              <>
                <a
                  href="/profile"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isDark ? "text-gray-300 hover:text-yellow-400" : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Dashboard
                </a>
                <a
                  href="/leaderboard"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isDark ? "text-gray-300 hover:text-yellow-400" : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Leaderboard
                </a>
              </>
            )}

            {/* Profile Dropdown - only show if authenticated */}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-md bg-gradient-to-br ${getThemeColor()}`}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Menu - Removed Settings from user dropdown to simplify options — only Profile and Logout remain */}
                {showDropdown && (
                  <div
                    className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border transition-all duration-200 animate-fadeIn ${
                      isDark
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                    role="menu"
                    aria-orientation="vertical"
                  >
                    {/* Removed username and email display for cleaner dropdown UI */}
                    {/* Menu Items - Profile and Logout only */}
                    <div className="py-2">
                      {/* Profile */}
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset ${
                          isDark
                            ? "hover:bg-gray-700/60 text-gray-200 focus:ring-purple-500"
                            : "hover:bg-gray-50 text-gray-800 focus:ring-purple-400"
                        }`}
                        role="menuitem"
                      >
                        <span className="text-lg">👤</span> Profile
                      </button>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset ${
                          isDark
                            ? "hover:bg-red-900/40 text-red-400 focus:ring-red-500"
                            : "hover:bg-red-50 text-red-600 focus:ring-red-400"
                        }`}
                        role="menuitem"
                      >
                        <span className="text-lg">🚪</span> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Login/Register for non-authenticated */}
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => openLogin()}
                  className={`px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow transition-all duration-200`}
                >
                  Login
                </button>
                <button
                  onClick={() => openRegister()}
                  className={`px-3 py-1 border-2 border-purple-600 font-semibold rounded-full transition-all duration-200 ${
                    isDark
                      ? "bg-gray-800 text-purple-400 hover:bg-purple-900/30"
                      : "bg-white text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Added dark/light mode toggle for mobile */}
            <button
              onClick={toggleMode}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="theme-toggle" data-mode={isDark ? 'dark' : 'light'}>
                <svg className="icon-sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
                  </g>
                </svg>
                <svg className="icon-moon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
                </svg>
              </span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-200 bg-gradient-to-br ${getThemeColor()}`}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`text-2xl transition-colors ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white"
            } border-t transition-colors duration-300`}
          >
            <div className="px-4 py-4 space-y-3">
              {/* Home link removed from mobile menu per request */}
              {location.pathname !== "/" && (
                <>
                  <a
                    href="/profile"
                    className={`block py-2 px-4 rounded font-medium transition-colors ${
                      isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-purple-50 text-gray-700"
                    }`}
                  >
                    Dashboard
                  </a>
                  <a
                    href="/leaderboard"
                    className={`block py-2 px-4 rounded font-medium transition-colors ${
                      isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-purple-50 text-gray-700"
                    }`}
                  >
                    Leaderboard
                  </a>
                </>
              )}
              {/* QUIZMASTER: Added login-based navbar items */}
              {/* Dashboard and Leaderboard shown above */}
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      openLogin();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-4 rounded font-medium bg-gradient-to-r ${getThemeColor()} text-white`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      openRegister();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-4 rounded font-medium border-2 border-purple-600 ${
                      isDark
                        ? "bg-gray-800 text-purple-400"
                        : "bg-white text-purple-600"
                    }`}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default SharedNavbar;
