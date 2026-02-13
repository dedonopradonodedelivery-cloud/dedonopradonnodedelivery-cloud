
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { AuthProvider } from './contexts/AuthContext'; 
import { ThemeProvider } from './contexts/ThemeContext';
import { FeatureProvider } from './contexts/FeatureContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <FeatureProvider>
            <NeighborhoodProvider>
              <App />
            </NeighborhoodProvider>
          </FeatureProvider>
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
