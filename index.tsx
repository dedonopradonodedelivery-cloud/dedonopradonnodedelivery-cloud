
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { AuthProvider } from './contexts/AuthContext';

// CACHE BUSTING:
// Force unregister any existing service workers that might be caching old versions of index.html
// Wrapped in load listener to avoid "invalid state" errors during early page load
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
        console.log('SW unregistered to force update');
      }
    }).catch(function(err) {
      console.warn('Service Worker unregistration warning: ', err);
    });
  }
});

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}
