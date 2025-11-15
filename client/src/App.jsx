import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SharedNavbar from './components/SharedNavbar';
import { AuthModalProvider } from './context/AuthModalContext';
import { SessionHistoryProvider } from './context/SessionHistoryContext';

import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import StartInterview from './pages/StartInterview';
import Login from './pages/Login';
import Register from './pages/Register';
import Interview from './pages/Interview';
import SubmitInterview from './pages/SubmitInterview';
import Result from './pages/Result';
import ClearData from './pages/ClearData';
import Leaderboard from './pages/Leaderboard';
import QuizDashboard from './pages/QuizDashboard';
import HomeAfterLogin from './pages/HomeAfterLogin';

const App = () => {
  return (
    <Router>
      <AuthModalProvider>
        <SessionHistoryProvider>
          <SharedNavbar />
          <Routes>
        {/* The new default page is the beautiful HomePage */}
        <Route path="/" element={<HomePage />} />
  <Route path="/quiz-dashboard" element={<QuizDashboard />} />
  <Route path="/home-after-login" element={<HomeAfterLogin />} />
        
        {/* The rest of the routes are arranged according to your flow */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/start-interview" element={<StartInterview />} />
        <Route path="/interview" element={<Interview />} />
  <Route path="/submit-interview" element={<SubmitInterview />} />
  <Route path="/result/:id" element={<Result />} />
  {/* Support immediate client-side results (no server id) */}
  <Route path="/result" element={<Result />} />
        <Route path="/clear-data" element={<ClearData />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </SessionHistoryProvider>
      </AuthModalProvider>
    </Router>
  );
};

export default App;
