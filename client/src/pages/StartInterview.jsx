import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// The StartInterview component with a new, fresh styling
const StartInterview = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState("");
  const [count, setCount] = useState(5);

  // Subjects available for selection
  const subjects = ["DSA", "DBMS", "OOPS", "OS", "CN"];
  
  // Modes available for selection
  const modes = ["Easy", "Medium", "Hard", "Advanced"];

  // State for showing a custom error modal instead of an alert
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Handle the start button click
  const handleStart = () => {
    if (!subject || !mode || count < 1) {
      // Show the custom modal instead of a browser alert
      setShowErrorModal(true);
      return;
    }
    // Navigate to the interview page with the selected options
    navigate("/interview", { state: { subject, mode, count } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-pink-100 to-rose-200 flex items-center justify-center px-4 py-8 font-sans">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatGently {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes glowBorderHover {
          0%, 100% {
            box-shadow: 0 10px 30px rgba(129, 140, 248, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
          }
          50% {
            box-shadow: 0 15px 40px rgba(129, 140, 248, 0.2), 0 0 25px rgba(236, 72, 153, 0.15);
          }
        }

        .card-enhanced {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .card-enhanced:hover {
          animation: floatGently 3s ease-in-out infinite, glowBorderHover 2.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .card-enhanced {
            animation: fadeInUp 0.3s ease-out forwards;
          }
          .card-enhanced:hover {
            animation: none;
            box-shadow: 0 10px 30px rgba(129, 140, 248, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
          }
        }
      `}</style>
      
      {/* Visual and animation enhancements for a cleaner, more elegant card design */}
      <div className="card-enhanced bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 shadow-lg rounded-2xl p-8 sm:p-10 w-full max-w-md border border-purple-200/60 relative overflow-hidden transition-all duration-300">
        {/* Subtle decorative gradient overlay for depth */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 transform -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 transform translate-x-1/3 translate-y-1/3"></div>
        
        <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center tracking-tight">
          🎯 Start Your Interview
        </h2>

        {/* Subject Selection - Updated to use direct subject list */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-800 mb-2">Select Subject</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-white border-1.5 border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-300 focus:border-transparent transition duration-200 pr-10 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l-.707.707L15 19.364l6.707-6.707-.707-.707L15 17.95l-5.707-5.707z"/></svg>
            </div>
          </div>
        </div>

        {/* Mode Selection - Updated dropdowns to Subject and Mode intentionally */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-800 mb-2">Select Mode</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-white border-1.5 border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-300 focus:border-transparent transition duration-200 pr-10 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="">-- Select Mode --</option>
              {modes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l-.707.707L15 19.364l6.707-6.707-.707-.707L15 17.95l-5.707-5.707z"/></svg>
            </div>
          </div>
        </div>

        {/* Number of Questions Input */}
        <div className="mb-7">
          <label className="block text-base font-semibold text-gray-800 mb-2">Number of Questions</label>
          <input
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full p-3 border-1.5 border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-300 focus:border-transparent transition duration-200 text-sm"
          />
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-base hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-purple-300 focus:ring-offset-2"
        >
          🚀 Start Interview
        </button>
      </div>

      {/* Custom Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg border border-red-300">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Invalid Selection</h3>
            <p className="text-gray-700 mb-6">Please make sure to select a valid subject, mode, and question count.</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartInterview;
