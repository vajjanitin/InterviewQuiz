import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ fallbackLoggedIn = '/dashboard' }) => {
  const navigate = useNavigate();

  const handle = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // decide fallback
      const token = localStorage.getItem('token');
      navigate(token ? fallbackLoggedIn : '/');
    }
  };

  return (
    <div className="p-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Go back"
        onClick={handle}
        onKeyDown={handle}
        className="inline-flex items-center gap-2 text-sm font-medium px-2 py-1 rounded-md cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <span aria-hidden>←</span>
        <span>Back</span>
      </div>
    </div>
  );
};

export default BackButton;
