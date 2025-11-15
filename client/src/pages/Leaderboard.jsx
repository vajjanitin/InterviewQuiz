import React, { useEffect, useState } from "react";
import axios from "axios";

const branches = ["CSE", "ECE", "Mech"];
const subjects = {
  CSE: ["DSA", "OS", "DBMS", "OOPs", "CN"],
  ECE: ["Digital Electronics", "Signals", "VLSI"],
  Mech: ["Thermodynamics", "Fluid Mechanics", "Machine Design"],
};

const Leaderboard = () => {
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("score");
  const [darkMode] = useState(false);

  const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (branch) params.branch = branch;
      if (subject) params.subject = subject;

      const res = await axios.get("http://localhost:5000/api/results/leaderboard", { params });
      
      const sortedData = res.data.sort((a, b) => {
        if (sortBy === "score") {
          if (b.maxScore !== a.maxScore) return b.maxScore - a.maxScore;
          return a.timeTaken - b.timeTaken;
        } else {
          if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken;
          return b.maxScore - a.maxScore;
        }
      });
      
      setData(sortedData);
    } catch (error) {
      setError("Failed to fetch leaderboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [branch, subject, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-2xl shadow-2xl border-4 border-indigo-100 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-5xl font-extrabold mb-4 text-center text-indigo-800 drop-shadow-md">
          <span role="img" aria-label="trophy" className="mr-3">🏆</span> Leaderboard
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Find the top performers by branch and subject.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-10 justify-center">
          <div className="w-full md:w-1/3">
            <label className="block mb-2 text-md font-semibold text-gray-700">Select Branch</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200"
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value);
                setSubject("");
              }}
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block mb-2 text-md font-semibold text-gray-700">Select Subject</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!branch}
            >
              <option value="">All Subjects</option>
              {branch && subjects[branch].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block mb-2 text-md font-semibold text-gray-700">Sort By</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="score">Score (Highest First)</option>
              <option value="time">Time (Fastest First)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-indigo-500 text-xl font-medium animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-xl font-medium">🚫 {error}</p>
        ) : data.length === 0 ? (
          <p className="text-center text-red-500 text-xl font-medium">🚫 No records found for the selected filters.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full table-auto text-sm text-gray-800 border-collapse">
              <thead>
                <tr className="bg-indigo-600 text-white text-left text-lg font-semibold">
                  <th className="py-4 px-6 rounded-tl-xl">Rank</th>
                  <th className="py-4 px-6">Username</th>
                  <th className="py-4 px-6">Branch</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6 text-center">Highest Score</th>
                  <th className="py-4 px-6 rounded-tr-xl text-center">Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr 
                    key={idx} 
                    className={`
                      border-b border-gray-200 transition duration-300 
                      ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} 
                      hover:bg-indigo-50
                    `}
                  >
                    <td className="py-4 px-6 font-bold text-indigo-700">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                    </td>
                    <td className="py-4 px-6">{item.username}</td>
                    <td className="py-4 px-6">{item.branch}</td>
                    <td className="py-4 px-6">{item.subject}</td>
                    <td className="py-4 px-6 font-bold text-center text-green-600">{item.maxScore}</td>
                    <td className="py-4 px-6 text-center">{formatTime(item.timeTaken)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
