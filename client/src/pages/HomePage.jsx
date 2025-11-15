import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const HomePage = () => {
  const { isDark } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on mount (AuthModalProvider handles actual signin)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 dark:bg-[var(--bg)] overflow-hidden transition-colors duration-300`}> 

      {/* Main Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Heading */}
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Master Your Knowledge, One Quiz at a Time.
          </h1>

          {/* Subtitle */}
          <p className={`text-lg md:text-xl mb-12 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Practice questions, track progress, and build confidence with focused, timed quizzes.
          </p>

          {/* Feature highlights (restored per user request) */}
          {/* QUIZMASTER: restored original feature sections per user's request */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card rounded-xl p-6 text-center">
              <h4 className="text-purple-600 font-semibold mb-2">Quick Practice</h4>
              <p className="text-sm text-muted">
                Short quizzes to warm up and revise anytime.
              </p>
            </div>

            <div className="card rounded-xl p-6 text-center">
              <h4 className="text-purple-600 font-semibold mb-2">Real Exam Mode</h4>
              <p className="text-sm text-muted">
                Timed challenges to simulate real test conditions.
              </p>
            </div>

            <div className="card rounded-xl p-6 text-center">
              <h4 className="text-purple-600 font-semibold mb-2">Track Progress</h4>
              <p className="text-sm text-muted">
                Save results and compare with the community leaderboard.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Why QuizMaster Section */}
      <section className="py-8 bg-gradient-to-b from-transparent to-purple-50/30 dark:to-gray-800/20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className={`text-4xl md:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Why QuizMaster?</h3>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Everything you need to excel in your exams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-2xl mb-6">Q</div>
              <h4 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Multiple Quiz Categories</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Wide variety of topics and difficulty levels tailored to help you prepare for any exam.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-700 flex items-center justify-center text-purple-700 dark:text-white font-bold text-2xl mb-6">⏱</div>
              <h4 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Timed Challenges</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Build speed and accuracy under exam-like constraints. Real test conditions for real results.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-xl bg-green-100 dark:bg-green-700 flex items-center justify-center text-green-700 dark:text-white font-bold text-2xl mb-6">🏆</div>
              <h4 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Leaderboard & Progress</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Compare results, compete with others, and track your improvement over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
  <footer className={`backdrop-blur-sm border-t transition-colors duration-300 py-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className={`text-sm mb-4 md:mb-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 QuizMaster. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#about"
                className={`transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}
              >
                About
              </a>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a
                href="#contact"
                className={`transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}
              >
                Contact
              </a>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a
                href="#privacy"
                className={`transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
