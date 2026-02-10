import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { AuthProvider } from './contexts/AuthContext'; 
import { ThemeProvider } from './contexts/ThemeContext';
import { FeatureProvider } from './contexts/FeatureContext';
// Added NeighborhoodProvider to manage location-based state
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        {/* NeighborhoodProvider added to the top-level context providers */}
        <NeighborhoodProvider>
          <ThemeProvider>
            <FeatureProvider>
              <App />
            </FeatureProvider>
          </ThemeProvider>
        </NeighborhoodProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}