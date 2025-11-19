import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";

// The main Profile component with enhanced styling
const Profile = () => {
  // State for user data and past results
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data and results on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Set user and results data from the API response
        setUser(res.data.user);
        setResults(res.data.results || []);
        // Save the fetched user object to localStorage so other components can access it.
        localStorage.setItem("user", JSON.stringify(res.data.user));

      } catch (err) {
        console.error("Error fetching profile:", err);
        localStorage.clear();
        setError("Session expired or invalid. Please log in again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <SyncLoader color="#4F46E5" loading={true} size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-4xl">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Welcome, {user?.username}!
            </h1>
            <p className="text-lg text-gray-600 mt-2">{user?.email}</p>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate("/start-interview")}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Start New Interview
            </button>
            <button
              onClick={() => navigate("/leaderboard")}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-full shadow-md hover:bg-gray-300 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Past Results Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 pb-2">
            Your Past Interview Results
          </h2>
          {results.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500 italic text-xl">No past results found.</p>
              <p className="text-gray-400 mt-2">Start an interview to see your progress!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div
                  key={result._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  // Now navigates to a specific result ID
                  onClick={() => navigate(`/result/${result._id}`)}
                >
                  <h4 className="text-xl font-semibold text-teal-600 mb-2">{result.subject || "N/A"}</h4>
                  <p className="text-gray-700 text-sm mb-1">
                    <strong className="text-gray-900">Branch:</strong> {result.branch || "N/A"}
                  </p>
                  <p className="text-gray-700 text-sm mb-1">
                    <strong className="text-gray-900">Score:</strong> {result.score} / {result.total || result.answers.length}
                  </p>
                  <p className="text-gray-500 text-xs">
                    <strong className="text-gray-700">Completed on:</strong> {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;