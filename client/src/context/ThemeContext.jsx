import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Initialize from localStorage or system preference (prefers-color-scheme)
  // Comment: if no stored preference exists, we respect the OS setting.
  const stored = typeof window !== "undefined" ? localStorage.getItem("qm_theme_mode") : null;
  let initialMode;
  if (stored === "dark" || stored === "light") {
    initialMode = stored;
  } else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    initialMode = "dark";
  } else {
    initialMode = "light";
  }

  const [mode, setMode] = useState(initialMode);

  const isDark = mode === "dark";

  const toggleMode = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("qm_theme_mode", next);
      } catch (e) {}
      if (next === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  }, []);

  // Zoom management
  const storedZoom = typeof window !== "undefined" ? parseFloat(localStorage.getItem("qm_zoom")) : NaN;
  const initialZoom = !isNaN(storedZoom) ? storedZoom : 1;
  const [zoom, setZoom] = useState(() => initialZoom);

  useEffect(() => {
    // apply zoom to root font-size
    const clamped = Math.min(1.4, Math.max(0.9, zoom));
    document.documentElement.style.fontSize = `${16 * clamped}px`;
    try {
      localStorage.setItem("qm_zoom", clamped.toString());
    } catch (e) {}
  }, [zoom]);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(1.4, +(z + 0.05).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.9, +(z - 0.05).toFixed(2))), []);

  // Keep document class in sync if mode changes externally
  useEffect(() => {
    if (mode === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, isDark, toggleMode, zoom, setZoom, zoomIn, zoomOut }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export default ThemeContext;
