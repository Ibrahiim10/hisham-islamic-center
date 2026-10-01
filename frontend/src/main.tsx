import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { FeeRefreshProvider } from './context/FeeRefreshContext';
import { ShellProvider } from './context/ShellContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FeeRefreshProvider>
          <ShellProvider>
            <App />
          </ShellProvider>
        </FeeRefreshProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
