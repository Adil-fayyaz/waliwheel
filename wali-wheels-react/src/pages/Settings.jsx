// Settings Page Component
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  Mail, 
  Lock, 
  Link, 
  Unlink, 
  Trash2, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

const Settings = () => {
  const { 
    user, 
    updateUserEmail, 
    updateUserPassword, 
    sendPasswordReset, 
    linkProvider, 
    unlinkProvider, 
    deleteUserAccount, 
    exportUserData,
    loading, 
    error, 
    clearError 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // Form states
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [resetEmail, setResetEmail] = useState('');

  if (!user) {
    return null;
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      const success = await updateUserEmail(emailForm.newEmail, emailForm.password);
      if (success) {
        setSuccess('Email aggiornata con successo!');
        setEmailForm({ newEmail: '', password: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Email update failed:', error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Le password non coincidono');
      return;
    }
    try {
      const success = await updateUserPassword(passwordForm.newPassword, passwordForm.currentPassword);
      if (success) {
        setSuccess('Password aggiornata con successo!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Password update failed:', error);
    }
  };

  const handleSendPasswordReset = async (e) => {
    e.preventDefault();
    try {
      const success = await sendPasswordReset(resetEmail);
      if (success) {
        setSuccess('Email di reset inviata! Controlla la tua casella di posta.');
        setResetEmail('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  const handleLinkProvider = async (providerId) => {
    try {
      // TODO: Implement provider linking
      console.log('Link provider:', providerId);
    } catch (error) {
      console.error('Link provider failed:', error);
    }
  };

  const handleUnlinkProvider = async (providerId) => {
    try {
      const success = await unlinkProvider(providerId);
      if (success) {
        setSuccess('Provider scollegato con successo!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Unlink provider failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteEmail !== user.email) {
      alert('Email non corretta');
      return;
    }
    try {
      const success = await deleteUserAccount(deletePassword);
      if (success) {
        setSuccess('Account eliminato con successo!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Delete account failed:', error);
    }
  };

  const handleExportData = () => {
    const data = exportUserData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wali-wheels-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess('Dati esportati con successo!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: SettingsIcon },
    { id: 'security', label: 'Sicurezza', icon: Shield },
    { id: 'providers', label: 'Provider', icon: Link },
    { id: 'data', label: 'Dati', icon: Download }
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-2xl">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Impostazioni
          </h1>
          <p className="text-white/70 text-lg">
            Gestisci le tue preferenze e sicurezza
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-300 text-sm font-medium">Errore</p>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Settings Card */}
        <div className="card-glass animate-slide-up">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Informazioni Account</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 glass-effect-dark rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-primary-400" />
                        <span className="text-white font-medium">Email</span>
                      </div>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>

                    <div className="p-4 glass-effect-dark rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <SettingsIcon className="w-5 h-5 text-primary-400" />
                        <span className="text-white font-medium">Nome</span>
                      </div>
                      <p className="text-white/60 text-sm">{user.displayName || 'Non specificato'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 glass-effect-dark rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-primary-400" />
                        <span className="text-white font-medium">ID Utente</span>
                      </div>
                      <p className="text-white/60 text-sm font-mono">{user.uid}</p>
                    </div>

                    <div className="p-4 glass-effect-dark rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-primary-400" />
                        <span className="text-white font-medium">Stato</span>
                      </div>
                      <p className="text-white/60 text-sm">
                        {user.emailVerified ? 'Verificato' : 'Non verificato'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Sicurezza</h3>
                
                {/* Change Email */}
                <div className="p-6 glass-effect-dark rounded-xl">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary-400" />
                    Cambia Email
                  </h4>
                  <form onSubmit={handleUpdateEmail} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Nuova Email
                      </label>
                      <input
                        type="email"
                        value={emailForm.newEmail}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                        className="input-glass w-full"
                        placeholder="nuova@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Password Attuale
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={emailForm.password}
                          onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                          className="input-glass w-full pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white/80"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aggiorna Email'}
                    </button>
                  </form>
                </div>

                {/* Change Password */}
                <div className="p-6 glass-effect-dark rounded-xl">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary-400" />
                    Cambia Password
                  </h4>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Password Attuale
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="input-glass w-full pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white/80"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Nuova Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="input-glass w-full pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white/80"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Conferma Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="input-glass w-full pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white/80"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aggiorna Password'}
                    </button>
                  </form>
                </div>

                {/* Reset Password */}
                <div className="p-6 glass-effect-dark rounded-xl">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary-400" />
                    Reset Password
                  </h4>
                  <form onSubmit={handleSendPasswordReset} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="input-glass w-full"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-secondary disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Invia Email Reset'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Provider Collegati</h3>
                
                <div className="space-y-4">
                  {user.providerData.map((provider, index) => (
                    <div key={index} className="p-4 glass-effect-dark rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            {provider.providerId === 'google.com' ? (
                              <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              </svg>
                            ) : (
                              <Mail className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {provider.providerId === 'google.com' ? 'Google' : 'Email/Password'}
                            </p>
                            <p className="text-white/60 text-sm">{provider.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnlinkProvider(provider.providerId)}
                          className="btn-secondary text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Unlink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Gestione Dati</h3>
                
                {/* Export Data */}
                <div className="p-6 glass-effect-dark rounded-xl">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary-400" />
                    Esporta Dati
                  </h4>
                  <p className="text-white/60 text-sm mb-4">
                    Scarica una copia dei tuoi dati personali in formato JSON.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Esporta Dati</span>
                  </button>
                </div>

                {/* Delete Account */}
                <div className="p-6 glass-effect-dark rounded-xl border border-red-500/30">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    Elimina Account
                  </h4>
                  <p className="text-white/60 text-sm mb-4">
                    Questa azione è irreversibile. Tutti i tuoi dati saranno eliminati permanentemente.
                  </p>
                  
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="btn-secondary text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Elimina Account</span>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-300 text-sm font-medium mb-2">
                          ⚠️ Attenzione: Questa azione è irreversibile!
                        </p>
                        <p className="text-red-200 text-sm">
                          Per confermare, inserisci la tua email e password:
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={deleteEmail}
                          onChange={(e) => setDeleteEmail(e.target.value)}
                          className="input-glass w-full"
                          placeholder="inserisci@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="input-glass w-full"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading || deleteEmail !== user.email}
                          className="btn-secondary text-red-400 hover:text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Conferma Eliminazione'}
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDelete(false);
                            setDeleteEmail('');
                            setDeletePassword('');
                          }}
                          className="btn-secondary"
                        >
                          Annulla
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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

export default Settings;

