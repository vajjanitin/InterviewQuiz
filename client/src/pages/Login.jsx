import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config";

// Styled Login component with a fresh design
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });
      // Store user data in local storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/profile");
    } catch (err) {
      // Show custom error modal
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setErrorMessage(message);
      setShowErrorModal(true);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-100 to-sky-200 flex items-center justify-center font-sans px-4">
      {/* Use responsive max width so the card looks good on all devices */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 w-full max-w-md border-2 border-emerald-300 relative overflow-hidden">
        {/* Decorative elements for a unique design */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <h2 className="text-5xl font-bold text-center text-emerald-800 mb-2 tracking-wide">
          SkillSync
        </h2>
        <p className="text-center text-gray-600 mb-8 text-base">
          Welcome back 👋 Please sign in to continue.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 bg-gray-50 placeholder-gray-500 text-lg transition-all duration-300"
            />
          </label>

          <label className="block relative">
            <span className="sr-only">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
              className="w-full px-5 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 bg-gray-50 placeholder-gray-500 text-lg transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-300 text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-sm sm:text-base">
          Don&apos;t have an account?{" "}
          <Link
            to="/"
            className="text-emerald-700 font-semibold underline hover:text-emerald-900 transition-colors duration-200"
          >
            Register here
          </Link>
        </p>
      </div>

      {/* Custom Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-xl border-2 border-red-400">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Login Failed</h3>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
