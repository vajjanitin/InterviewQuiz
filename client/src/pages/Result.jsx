import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config";
import { SyncLoader } from "react-spinners";

const Result = () => {
  // Use useParams to get the result ID from the URL (optional)
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Corrected GET request to fetch the quiz result by its ID
        if (id) {
          const response = await axios.get(`${API_BASE}/api/results/detail/${id}`);
          const fetchedResult = response.data;
          if (!fetchedResult || !fetchedResult.answers || typeof fetchedResult.score !== 'number') {
            throw new Error("Received invalid quiz data from the server. Data might be missing or corrupted.");
          }
          setResult(fetchedResult);
          setError(null);
        } else {
          // No id provided — attempt to read client-side quizResults saved in localStorage or sessionStorage
          let stored = null;
          try { stored = localStorage.getItem('quizResults'); } catch (e) { stored = null; }
          if (!stored) {
            try { stored = sessionStorage.getItem('quizResults'); } catch (e) { stored = null; }
          }
          if (!stored) throw new Error('No quiz results available locally.');
          const parsed = JSON.parse(stored);
          if (!parsed || !parsed.answers) throw new Error('Local quiz data is invalid.');
          // compute score if not present
          const computedScore = typeof parsed.score === 'number' ? parsed.score : (Array.isArray(parsed.answers) ? parsed.answers.filter(a => a.isCorrect).length : 0);
          const computedTotal = parsed.total || (Array.isArray(parsed.answers) ? parsed.answers.length : 0);
          const clientResult = {
            ...parsed,
            score: computedScore,
            total: computedTotal,
          };
          setResult(clientResult);
          setError(null);
          // Start background POST to server to persist the result (do this after a short delay so UI paints)
          setTimeout(() => postResultToServer(clientResult), 200);
        }
      } catch (err) {
        console.error("Error fetching quiz results:", err);
        if (err.response && err.response.status === 404) {
          setError(`No quiz result found for ID: ${id}. The data may have been cleared or a bad link was used.`);
        } else {
          setError(err.message || "An unexpected error occurred while fetching your results.");
        }
      } finally {
        setLoading(false);
      }
    };

  // Always attempt to fetch results: fetchResults handles both server-id and client-side fallback
  fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
        <SyncLoader color="#4F46E5" loading={true} size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-red-200">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/profile")}
            className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors"
          >
            Go Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }
  
  const totalQuestions = result.total || result.answers.length;

  // Background POST to persist client-side results when no server id was available
  async function postResultToServer(clientResult) {
    try {
      setPosting(true);
      setPostError(null);
      const response = await axios.post(`${API_BASE}/api/results/submit`, clientResult);
      if (response.status === 201) {
        // Replace history to a server-backed result URL
        const serverId = response.data._id;
        // store server id so future visits can fetch canonical data
        localStorage.setItem('quizResultsServerId', serverId);
        // Optionally navigate to the canonical URL (replace so back doesn't go back to /result)
        navigate(`/result/${serverId}`, { replace: true });
      } else {
        throw new Error('Server returned unexpected status on save.');
      }
    } catch (err) {
      console.error('Error posting result to server:', err);
      setPostError(err.response?.data?.message || err.message || 'Failed to save result to server.');
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center p-8 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-4xl relative overflow-hidden">
        {/* Confetti elements */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="confetti" />
        </div>
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-4">
          Interview Result
        </h1>
        <p className="text-center text-xl text-gray-600 mb-8">
          Review your performance below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-10">
          <div className="bg-indigo-50 p-6 rounded-2xl shadow-inner border border-indigo-200">
            <p className="text-lg font-medium text-indigo-800">Subject</p>
            <p className="text-3xl font-bold text-indigo-600">{result.subject || "N/A"}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl shadow-inner border border-green-200">
            <p className="text-lg font-medium text-green-800">Score</p>
            <p className="text-3xl font-bold text-green-600">{result.score} / {totalQuestions}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-inner border border-blue-200">
            <p className="text-lg font-medium text-blue-800">Branch</p>
            <p className="text-3xl font-bold text-blue-600">{result.branch || "N/A"}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl shadow-inner border border-purple-200">
            <p className="text-lg font-medium text-purple-800">Time Taken</p>
            <p className="text-3xl font-bold text-purple-600">{(result.timeTaken / 60).toFixed(2)} min</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-indigo-800 mb-6">Question Breakdown</h2>
        <div className="space-y-6">
          {result.answers.map((answer, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl shadow-md mb-6 transition-all duration-300 ${
                answer.isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
              }`}
            >
              <div className="flex items-start">
                <span className={`text-3xl font-bold mr-4 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {answer.isCorrect ? '✅' : '❌'}
                </span>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900">
                    <span className="font-bold">Question {index + 1}:</span> {answer.question}
                  </p>
                  <p className="text-md text-gray-700 mt-2">
                    <span className="font-bold">Your Answer:</span> {answer.selectedOption || "N/A"}
                  </p>
                  <p className="text-md text-gray-700">
                    <span className="font-bold">Correct Answer:</span> {answer.correctAnswer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          {postError && (
            <div className="mb-4 text-center">
              <p className="text-sm text-red-600 mb-2">Failed to save result to server: {postError}</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => postResultToServer(result)} className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold">Retry Save</button>
                <button onClick={() => navigate('/profile')} className="px-4 py-2 border rounded-full">Back to Profile</button>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
