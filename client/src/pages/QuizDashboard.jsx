import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuthModal } from "../context/AuthModalContext";

const QuizDashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuthModal();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 dark:bg-[var(--bg)] transition-colors duration-300 px-4 py-20`}>
      {/* Main Content Container */}
      <div className="text-center max-w-5xl mx-auto">
        {/* Feature Cards - 3 columns (matching attached design) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 rounded-xl transition-all duration-200">
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Quick Practice</h3>
            <p className="text-sm text-muted">Short quizzes to warm up and revise anytime.</p>
          </div>

          <div className="card p-6 rounded-xl transition-all duration-200">
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Real Exam Mode</h3>
            <p className="text-sm text-muted">Timed challenges to simulate real test conditions.</p>
          </div>

          <div className="card p-6 rounded-xl transition-all duration-200">
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Track Progress</h3>
            <p className="text-sm text-muted">Save results and compare with the community leaderboard.</p>
          </div>
        </div>

        {/* Start Quiz Button */}
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
  );
};

export default QuizDashboard;
