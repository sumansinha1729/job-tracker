// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardPage    from './pages/BoardPage';
import './index.css';

const queryClient = new QueryClient();

// Wrapper that redirects to /login if the user is not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login"
        element={isAuthenticated ? <Navigate to="/board" /> : <LoginPage />} />
      <Route path="/register"
        element={isAuthenticated ? <Navigate to="/board" /> : <RegisterPage />} />
      <Route path="/board"
        element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
      <Route path="*"
        element={<Navigate to={isAuthenticated ? '/board' : '/login'} />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);