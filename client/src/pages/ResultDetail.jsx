import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SyncLoader } from "react-spinners";

// The ResultDetail component with enhanced styling and error handling
const ResultDetail = () => {
  // Use useParams to get the result ID from the URL
  const { id } = useParams();
  
  // State to hold the fetched result data
  const [result, setResult] = useState(null);
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // Helper function to format seconds into a mm:ss string
  const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      return "N/A";
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch the result details on component mount or when the ID changes
  useEffect(() => {
    // Asynchronous function to fetch data
    const fetchResult = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/results/detail/${id}`);
        setResult(response.data);
      } catch (err) {
        // Handle errors gracefully by setting an error state
        console.error("Failed to fetch result:", err);
        setError("Result not found or an error occurred.");
      } finally {
        // Set loading to false once the request is complete
        setLoading(false);
      }
    };
    
    fetchResult();
  }, [id]);

  // Render a loading spinner while the data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <SyncLoader color="#4F46E5" loading={true} size={15} />
      </div>
    );
  }

  // Render an error message if fetching failed
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 p-8">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-center">{error}</p>
        <button
          onClick={() => navigate("/profile")}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
        >
          Go Back to Profile
        </button>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-pink-100 to-rose-200 p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
        {/* Header Section */}
        <div className="text-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-indigo-700">Quiz Result</h1>
          <p className="mt-2 text-lg text-gray-600">Branch: <span className="font-semibold">{result.branch}</span> | Subject: <span className="font-semibold">{result.subject}</span></p>
        </div>

        {/* Score and Time Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-center">
          <div className="bg-green-50 p-6 rounded-2xl shadow-inner border border-green-200">
            <h3 className="text-xl font-semibold text-green-700">Your Score</h3>
            <p className="text-5xl font-extrabold text-green-600 mt-2">
              {result.score} / {result.total || result.answers.length}
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-inner border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-700">Time Taken</h3>
            <p className="text-5xl font-extrabold text-blue-600 mt-2">
              {formatTime(result.timeTaken)}
            </p>
          </div>
        </div>

        {/* Question Breakdown */}
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">Question Breakdown</h3>
        <div className="space-y-6">
          {result.answers.map((a, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                <span className="text-indigo-600 font-bold">Q{i + 1}:</span> {a.question}
              </p>
              <p className="text-gray-700 ml-4 mb-1">
                <strong className="text-gray-900">Your Answer:</strong> <span className={a.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{a.selectedOption || "N/A"}</span>
                {a.isCorrect ? " ✅" : " ❌"}
              </p>
              {!a.isCorrect && (
                <p className="text-gray-700 ml-4">
                  <strong className="text-gray-900">Correct Answer:</strong> <span className="text-green-600 font-medium">{a.correctAnswer}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate("/profile")}
          className="w-full mt-8 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:-translate-y-1"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default ResultDetail;
