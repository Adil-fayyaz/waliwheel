// Navigation Component
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/profile', label: 'Profilo', icon: User },
    { path: '/settings', label: 'Impostazioni', icon: Settings }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white font-bold text-xl hover:text-primary-400 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">W</span>
              </div>
              Wali Wheels
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-500 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=22c55e&color=fff&size=32`}
                alt={user?.displayName || 'User'}
                className="w-8 h-8 rounded-full border-2 border-white/20"
              />
              <div className="hidden lg:block">
                <p className="text-white text-sm font-medium">
                  {user?.displayName || 'Utente'}
                </p>
                <p className="text-white/60 text-xs">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Esci</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              {/* User Info */}
              <div className="flex items-center gap-3 px-3 py-2 mb-4">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=22c55e&color=fff&size=40`}
                  alt={user?.displayName || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-white/20"
                />
                <div>
                  <p className="text-white text-sm font-medium">
                    {user?.displayName || 'Utente'}
                  </p>
                  <p className="text-white/60 text-xs">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-white/70 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Esci</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

