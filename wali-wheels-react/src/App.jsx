// Main App Component
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading, isInitialized } = useAuth();

  // Show loading spinner while checking authentication
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-2xl">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Wali Wheels
          </h2>
          <p className="text-white/60">
            Caricamento in corso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation - only show when authenticated */}
        {user && <Navigation />}
        
        {/* Main Content */}
        <main className={user ? 'pt-16' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <Login />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route 
              path="*" 
              element={<Navigate to={user ? "/" : "/login"} replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
