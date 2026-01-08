
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Corrigido o caminho de ../App para ./App
import { AuthProvider } from './contexts/AuthContext'; // Importado o provedor de autenticação
import './index.css';

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
