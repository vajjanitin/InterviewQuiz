import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SessionHistoryContext = createContext(null);

export const SessionHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const location = useLocation();

  // Track visited pages
  useEffect(() => {
    const pathname = location.pathname;

    setHistory((prev) => {
      // If we're at the end of history (no forward stack), append the new page
      if (currentIndex === prev.length - 1) {
        return [...prev, pathname];
      } else {
        // If user navigates after going back, remove the forward history and append new page
        return [...prev.slice(0, currentIndex + 1), pathname];
      }
    });

    setCurrentIndex((prev) => prev + 1);
  }, [location.pathname]);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const goBack = () => {
    if (canGoBack) {
      setCurrentIndex((prev) => prev - 1);
      // Navigation is handled by the caller using history[currentIndex - 1]
    }
  };

  const goForward = () => {
    if (canGoForward) {
      setCurrentIndex((prev) => prev + 1);
      // Navigation is handled by the caller using history[currentIndex + 1]
    }
  };

  const getPreviousPath = () => {
    if (canGoBack) {
      return history[currentIndex - 1];
    }
    return null;
  };

  const getNextPath = () => {
    if (canGoForward) {
      return history[currentIndex + 1];
    }
    return null;
  };

  return (
    <SessionHistoryContext.Provider
      value={{
        history,
        currentIndex,
        canGoBack,
        canGoForward,
        goBack,
        goForward,
        getPreviousPath,
        getNextPath,
      }}
    >
      {children}
    </SessionHistoryContext.Provider>
  );
};

export const useSessionHistory = () => {
  const ctx = useContext(SessionHistoryContext);
  if (!ctx) {
    throw new Error("useSessionHistory must be used within SessionHistoryProvider");
  }
  return ctx;
};

export default SessionHistoryContext;
