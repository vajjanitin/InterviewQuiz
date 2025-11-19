import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
import { SyncLoader } from 'react-spinners';

// The intermediate component to handle quiz submission to the backend.
const SubmitInterview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasSubmitted = useRef(false); // ✅ Prevent duplicate submissions

  useEffect(() => {
    // This useEffect runs only once when the component mounts.
    const submitQuizResults = async () => {
      // ✅ Check if already submitted
      if (hasSubmitted.current) {
        return;
      }
      
      hasSubmitted.current = true; // ✅ Mark as submitted

      try {
        // Retrieve the quiz results from local storage.
        const quizResults = JSON.parse(localStorage.getItem('quizResults'));
        
        // If no results are found, it means the user shouldn't be on this page.
        if (!quizResults) {
          setError("No quiz results found in local storage.");
          setLoading(false);
          return;
        }

        setLoading(true);

        // Send the quiz results to the backend API endpoint.
        const response = await axios.post(`${API_BASE}/api/results/submit`, quizResults);

        if (response.status === 201) {
          // On successful submission, we can remove the data from local storage.
          localStorage.removeItem('quizResults');
          
          // Navigate to the results page
          navigate(`/result/${response.data._id}`);
        } else {
          throw new Error('Failed to submit quiz results. Server responded with an unexpected status.');
        }
      } catch (err) {
        console.error('Error submitting quiz results:', err);
        setError(err.response?.data?.message || 'An unknown error occurred during submission.');
        hasSubmitted.current = false; // ✅ Allow retry on error
      } finally {
        setLoading(false);
      }
    };
    
    submitQuizResults();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-8 text-center">
        <SyncLoader color="#4F46E5" loading={true} size={15} />
        <h1 className="mt-8 text-3xl font-extrabold text-indigo-700 animate-pulse">
          Submitting Your Interview...
        </h1>
        <p className="mt-4 text-gray-600">Please do not close this window.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-red-200">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Submission Failed!</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/profile")}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition duration-300"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SubmitInterview;