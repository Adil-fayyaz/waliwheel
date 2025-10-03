// Profile Page Component
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, LogOut, Loader2, Settings, Car } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

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

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-2xl">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Wali Wheels
          </h1>
          <p className="text-white/70 text-lg">
            Il tuo profilo utente
          </p>
        </div>

        {/* Profile Card */}
        <div className="card-glass animate-slide-up">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName || 'User'}
                className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=22c55e&color=fff&size=96`;
                }}
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mt-4 mb-2">
              {user.displayName || 'Utente'}
            </h2>
            <p className="text-white/60">
              Benvenuto nella tua dashboard
            </p>
          </div>

          {/* User Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-400" />
                Informazioni Personali
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                  <User className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm">Nome</p>
                    <p className="text-white font-medium">
                      {user.displayName || 'Non specificato'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                  <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white font-medium">
                      {user.email || 'Non specificato'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                  <Shield className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm">ID Utente</p>
                    <p className="text-white font-medium font-mono text-sm">
                      {user.uid.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-400" />
                Stato Account
              </h3>
              
              <div className="space-y-3">
                <div className="p-4 glass-effect-dark rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Email Verificata</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.emailVerified 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {user.emailVerified ? 'Verificata' : 'Non verificata'}
                    </span>
                  </div>
                </div>

                <div className="p-4 glass-effect-dark rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Provider</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Google
                    </span>
                  </div>
                </div>

                <div className="p-4 glass-effect-dark rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Stato</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      Attivo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Azioni Rapide
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <button className="btn-secondary flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Impostazioni</span>
              </button>
              
              <button
                onClick={handleLogout}
                disabled={loading}
                className="btn-secondary flex items-center justify-center gap-2 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span>Esci</span>
              </button>
            </div>
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

export default ProfilePage;

