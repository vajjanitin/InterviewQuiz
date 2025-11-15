import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SyncLoader } from "react-spinners";

const ClearData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleClearData = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;

      if (!username) {
        throw new Error("User not logged in or username not found.");
      }

      // This makes a DELETE request to the new backend endpoint
      const response = await axios.delete(`http://localhost:5000/api/results/${username}`);
      
      if (response.status === 200) {
        setMessage(response.data.message);
      } else {
        throw new Error("Failed to clear data.");
      }
    } catch (err) {
      console.error("Error clearing data:", err);
      setError(err.response?.data?.message || err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-indigo-200 w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">Clear Old Results</h2>
        <p className="text-gray-700 mb-6">
          It looks like your previous quiz result data is corrupted. Click the button below to delete it so you can take a new quiz.
        </p>

        {loading && (
          <div className="mt-6 flex flex-col items-center">
            <SyncLoader color="#4F46E5" loading={true} size={10} />
            <p className="mt-4 text-indigo-600 font-semibold">Clearing data...</p>
          </div>
        )}

        {message && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-xl">
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-xl">
            <p>{error}</p>
          </div>
        )}

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleClearData}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-bold text-white transition-colors duration-200 shadow-md ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Clear My Data
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl font-bold text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-100 transition-colors duration-200 shadow-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearData;
