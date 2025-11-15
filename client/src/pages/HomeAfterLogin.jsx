import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// QUIZMASTER: This is the post-login home page (no "Why QuizMaster", added Start Quiz button)
const HomeAfterLogin = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50'} overflow-hidden transition-colors duration-300`}>

      {/* Main Hero Section (same as public home) */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-5xl">
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Master Your Knowledge, One Quiz at a Time.
          </h1>

          <p className={`text-lg md:text-xl mb-12 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Practice questions, track progress, and build confidence with focused, timed quizzes.
          </p>

          {/* Feature highlights (same three cards) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
              <h4 className="text-purple-600 font-semibold mb-2">Quick Practice</h4>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Short quizzes to warm up and revise anytime.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
              <h4 className="text-purple-600 font-semibold mb-2">Real Exam Mode</h4>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Timed challenges to simulate real test conditions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
              <h4 className="text-purple-600 font-semibold mb-2">Track Progress</h4>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Save results and compare with the community leaderboard.
              </p>
            </div>
          </div>

          {/* QUIZMASTER: Start Quiz button for post-login page */}
          {/* Route changed to skip QuizCategories page - navigates directly to start interview form */}
          <div className="mt-12">
            <button
              onClick={() => navigate("/start-interview")}
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold shadow-2xl hover:scale-105 transform transition"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Footer (same as public home) */}
      <footer className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50'} backdrop-blur-sm border-t transition-colors duration-300 py-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className={`text-sm mb-4 md:mb-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 QuizMaster. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#about" className={`transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>About</a>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a href="#contact" className={`transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>Contact</a>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a href="#privacy" className={`transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeAfterLogin;
