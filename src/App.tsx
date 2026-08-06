import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import BookDetail from './views/BookDetail';
import Clubs from './views/Clubs';
import Library from './views/Library';
import ExchangeChat from './views/ExchangeChat';
import Register from './views/Register';
import Profile from './views/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AddBook from './views/AddBook';
import Landing from './views/Landing';
import SetupProfile from './views/SetupProfile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, needsProfileSetup } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  if (needsProfileSetup && location.pathname !== '/setup-profile') {
    return <Navigate to="/setup-profile" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup-profile" element={<ProtectedRoute><SetupProfile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
          <Route path="/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ExchangeChat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
