
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Changed to named import to match the named export in App.tsx
import { App } from './App'; 
import { AuthProvider } from './contexts/AuthContext'; 
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}