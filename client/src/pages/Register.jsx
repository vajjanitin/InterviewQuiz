import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });
      setModalMessage(res.data.message);
      setIsSuccess(true);
      setShowModal(true);
    } catch (err) {
      setModalMessage(err.response?.data?.message || "Registration failed");
      setIsSuccess(false);
      setShowModal(true);
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
    if (isSuccess) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#c2f0f7] via-[#ffe4e1] to-[#e2f0cb] px-4 py-10 font-sans">
  {/* Modal width reduced by 25% (180px → 135px) for more compact visual appearance while maintaining responsiveness */}
  <div style={{maxWidth: 135}} className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-rose-600 mb-2 tracking-wider">
          SkillSync
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm font-medium">
          Start your journey with us — Create your account
        </p>

        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="Username"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition placeholder:text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition placeholder:text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition placeholder:text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition shadow-md tracking-wide"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-rose-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Custom Modal for alerts */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg border-2 ${isSuccess ? 'border-green-400' : 'border-red-400'}`}>
            <h3 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {isSuccess ? 'Success' : 'Error'}
            </h3>
            <p className="text-gray-700 mb-6">{modalMessage}</p>
            <button
              onClick={closeModal}
              className={`px-6 py-2 ${isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white font-semibold rounded-full transition-colors duration-200`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
