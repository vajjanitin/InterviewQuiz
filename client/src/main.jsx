import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

// Apply theme class before React mounts to avoid flash
try {
  // Read persisted preference; if none, respect the OS preference (prefers-color-scheme)
  const mode = localStorage.getItem('qm_theme_mode');
  if (mode === 'dark') document.documentElement.classList.add('dark');
  else if (mode === 'light') document.documentElement.classList.remove('dark');
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
