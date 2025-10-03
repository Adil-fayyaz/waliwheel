// Home Page Component
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Car, User, Settings, LogOut, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const quickActions = [
    {
      title: 'Profilo',
      description: 'Visualizza e modifica le tue informazioni',
      icon: User,
      action: () => navigate('/profile'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Impostazioni',
      description: 'Gestisci sicurezza e preferenze',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-2xl">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Wali Wheels
          </h1>
          <p className="text-white/70 text-lg">
            Benvenuto nella tua dashboard
          </p>
        </div>

        {/* Welcome Card */}
        <div className="card-glass animate-slide-up mb-8">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=22c55e&color=fff&size=96`}
                alt={user?.displayName || 'User'}
                className="w-20 h-20 rounded-full border-4 border-white/20 shadow-2xl"
              />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Ciao, {user?.displayName || 'Utente'}! 👋
            </h2>
            <p className="text-white/60 mb-6">
              Gestisci il tuo account e le tue preferenze
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/profile')}
                className="btn-primary flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Profilo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="btn-secondary flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>Impostazioni</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className="card-glass cursor-pointer hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="card-glass animate-slide-up">
          <h3 className="text-xl font-semibold text-white mb-6">Informazioni Account</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                <User className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">Nome</p>
                  <p className="text-white font-medium">
                    {user?.displayName || 'Non specificato'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                <Car className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">ID Utente</p>
                  <p className="text-white font-medium font-mono text-sm">
                    {user?.uid?.substring(0, 8)}...
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                <Settings className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white font-medium">
                    {user?.email || 'Non specificato'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                <LogOut className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">Provider</p>
                  <p className="text-white font-medium">
                    {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email/Password'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="btn-secondary text-red-400 hover:text-red-300 hover:bg-red-500/20 flex items-center gap-2 mx-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Esci</span>
            </button>
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

export default Home;

