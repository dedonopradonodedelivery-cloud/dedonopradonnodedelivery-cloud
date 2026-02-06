import React from 'react';
import ReactDOM from 'react-dom/client';
// Fixed: Changed App import to named import
import { App } from './App'; 
import { AuthProvider } from './contexts/AuthContext'; 
import { ThemeProvider } from './contexts/ThemeContext';
import { FeatureProvider } from './contexts/FeatureContext';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <FeatureProvider>
            <App />
          </FeatureProvider>
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}