// Login Page Component
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { user, loginWithGoogle, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      clearError();
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    // TODO: Implement email/password login
    console.log('Email login not implemented yet');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-2xl">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Wali Wheels
          </h1>
          <p className="text-white/70 text-lg">
            Accedi al tuo account
          </p>
        </div>

        {/* Login Card */}
        <div className="card-glass animate-slide-up">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-300 text-sm font-medium">Errore</p>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Benvenuto!
            </h2>
            <p className="text-white/60">
              Scegli come accedere al tuo account
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || isLoggingIn}
            className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {loading || isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Accesso in corso...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Accedi con Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-white/60">oppure</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="input-glass w-full"
                placeholder="inserisci@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  className="input-glass w-full pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white/80"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-white/60">Ricordami</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                Password dimenticata?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accedi
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Non hai un account?{' '}
              <button className="text-primary-400 hover:text-primary-300 underline">
                Registrati
              </button>
            </p>
            <p className="text-white/40 text-xs mt-4">
              Cliccando su "Accedi" accetti i nostri{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300 underline">
                Termini di Servizio
              </a>{' '}
              e la{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/40 text-sm">
          <p>© 2024 Wali Wheels. Tutti i diritti riservati.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

