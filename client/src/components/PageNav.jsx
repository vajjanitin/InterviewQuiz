import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSessionHistory } from "../context/SessionHistoryContext";

const PageNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { canGoBack, getPreviousPath } = useSessionHistory();

  const pathname = location.pathname;

  // QUIZMASTER: Hide Back button on homepage only
  if (pathname === "/") return null;

  // Hide PageNav on login/register and auth-related pages
  const hideOnPages = ["/login", "/register"];
  if (hideOnPages.includes(pathname)) return null;

  const previousPath = getPreviousPath();

  return (
    <div
      className={`w-full border-b ${
        isDark ? "border-gray-700" : "border-gray-200"
      } bg-transparent`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-2 flex items-center justify-start">
        {/* Left: Back button */}
        <button
          onClick={() => previousPath && navigate(previousPath)}
          disabled={!canGoBack}
          aria-label="Go back"
          className={`px-3 py-1 rounded-md font-medium transition-colors duration-150 ${
            canGoBack
              ? "bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-white hover:shadow"
              : "opacity-40 cursor-not-allowed bg-transparent"
          }`}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default PageNav;
