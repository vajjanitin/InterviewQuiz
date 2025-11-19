import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE } from "../config";

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("login"); // 'login' or 'register'

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (e) {}
  }, []);

  const openLogin = () => {
    setMode("login");
    setShowModal(true);
  };
  const openRegister = () => {
    setMode("register");
    setShowModal(true);
  };
  const close = () => setShowModal(false);

  const login = async ({ email, password }) => {
    const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsAuthenticated(true);
      setUser(res.data.user);
      close();
  // QUIZMASTER: This is the post-login home page (no "Why QuizMaster", added Start Quiz button)
  window.location.href = "/home-after-login";
    }
    return res;
  };

  const register = async ({ username, email, password }) => {
    const res = await axios.post(`${API_BASE}/api/auth/register`, { username, email, password });
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsAuthenticated(true);
      setUser(res.data.user);
      close();
  // QUIZMASTER: This is the post-login home page (no "Why QuizMaster", added Start Quiz button)
  window.location.href = "/home-after-login";
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    // Redirect to home after logout
    window.location.href = "/";
  };

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, close, showModal, mode, setMode, login, register, isAuthenticated, user, logout }}>
      {children}

      {/* Modal UI rendered at root of provider */}
      {showModal && <AuthModal mode={mode} onClose={close} onSwitch={(m) => setMode(m)} login={login} register={register} />}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
};

const AuthModal = ({ mode, onClose, onSwitch, login, register }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  // Focus management: trap focus inside modal and restore focus on close
  const modalRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const modal = modalRef.current;
    if (modal) {
      const focusable = modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
    }

    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      // restore focus to the element that opened the modal
      try {
        if (previouslyFocused.current && previouslyFocused.current.focus) previouslyFocused.current.focus();
      } catch (e) {}
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isRegister) {
      if (password !== confirmPassword) return setError("Passwords do not match");
      if (password.length < 6) return setError("Password must be at least 6 characters");
      if (username.length < 3) return setError("Username must be at least 3 characters");
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register({ username, email, password });
      } else {
        await login({ email, password });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/*
        Visual/UX improvements: increased modal width, padding, refined shadow and entrance animation.
        These are purely visual changes to make the auth modal feel roomier and more polished.
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        ref={modalRef}
        className="relative mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-10 transform transition-all duration-200 scale-95 opacity-0"
        style={{ width: '92%', maxWidth: 540, animation: 'authModalIn 320ms ease-out forwards' }}
      >
        <style>{`
          @keyframes authModalIn {
            from { opacity: 0; transform: scale(0.98) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .auth-no-motion { animation: none !important; }
          }
        `}</style>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          aria-label="Close authentication dialog"
        >
          ✕
        </button>

        <h3 id="auth-modal-title" className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{isRegister ? "Create account" : "Sign in"}</h3>
        <p className="text-sm mb-5 text-gray-600 dark:text-gray-300">{isRegister ? "Join our community today" : "Sign in to your account"}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          )}

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button type="submit" disabled={loading} className="w-full py-3 mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold">
            {loading ? (isRegister ? "Creating..." : "Signing in...") : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-3 text-sm text-center text-gray-600 dark:text-gray-300">
          {isRegister ? (
            <button onClick={() => onSwitch("login")} className="underline">Have an account? Sign in</button>
          ) : (
            <button onClick={() => onSwitch("register")} className="underline">New here? Create an account</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModalContext;
