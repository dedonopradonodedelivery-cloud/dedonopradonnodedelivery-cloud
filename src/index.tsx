


import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Corrected import path for App.tsx
import App from '../App.tsx'; 
import { AuthProvider } from './contexts/AuthContext'; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);