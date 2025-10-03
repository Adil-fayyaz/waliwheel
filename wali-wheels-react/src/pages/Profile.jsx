// Profile Page Component
import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Camera, Save, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

const Profile = () => {
  const { user, updateUserProfile, loading, error, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setEditData({
      displayName: user.displayName || '',
      photoURL: user.photoURL || ''
    });
    setIsEditing(true);
    clearError();
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      displayName: user.displayName || '',
      photoURL: user.photoURL || ''
    });
    clearError();
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      const success = await updateUserProfile(editData);
      if (success) {
        setIsEditing(false);
        setSuccess('Profilo aggiornato con successo!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Seleziona solo file immagine');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Il file è troppo grande. Massimo 5MB');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create storage reference
      const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}_${file.name}`);
      
      // Upload file
      const uploadTask = uploadBytes(storageRef, file);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      await uploadTask;
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update profile with new photo URL
      setEditData(prev => ({
        ...prev,
        photoURL: downloadURL
      }));

      setSuccess('Foto caricata con successo!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Errore durante il caricamento della foto');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user.photoURL) return;

    try {
      // Delete from storage if it's a Firebase Storage URL
      if (user.photoURL.includes('firebasestorage.googleapis.com')) {
        const photoRef = ref(storage, user.photoURL);
        await deleteObject(photoRef);
      }

      // Update profile to remove photo
      setEditData(prev => ({
        ...prev,
        photoURL: ''
      }));

      setSuccess('Foto rimossa con successo!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Remove photo failed:', error);
      // Still update the profile even if storage deletion fails
      setEditData(prev => ({
        ...prev,
        photoURL: ''
      }));
    }
  };

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
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Profilo Utente
          </h1>
          <p className="text-white/70 text-lg">
            Gestisci le tue informazioni personali
          </p>
        </div>

        {/* Profile Card */}
        <div className="card-glass animate-slide-up">
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
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-300 text-sm font-medium">Errore</p>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={editData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(editData.displayName || 'User')}&background=22c55e&color=fff&size=96`}
                alt={editData.displayName || 'User'}
                className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl"
              />
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-8 h-8 bg-primary-500 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-primary-600 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </button>
                  {editData.photoURL && (
                    <button
                      onClick={handleRemovePhoto}
                      className="w-8 h-8 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-white/60 text-sm mt-2">Caricamento foto...</p>
              </div>
            )}

            <h2 className="text-2xl font-semibold text-white mt-4 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.displayName}
                  onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="bg-transparent border-b border-white/30 text-white text-center text-2xl font-semibold focus:outline-none focus:border-primary-500"
                  placeholder="Nome utente"
                />
              ) : (
                user.displayName || 'Utente'
              )}
            </h2>
            <p className="text-white/60">
              {isEditing ? 'Modifica le tue informazioni' : 'Benvenuto nella tua dashboard'}
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
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">Nome</p>
                    <p className="text-white font-medium">
                      {user.displayName || 'Non specificato'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                  <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white font-medium">
                      {user.email || 'Non specificato'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 glass-effect-dark rounded-xl">
                  <Shield className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <div className="flex-1">
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
                <Shield className="w-5 h-5 text-primary-400" />
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
                    <div className="flex gap-1">
                      {user.providerData.map((provider, index) => (
                        <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {provider.providerId === 'google.com' ? 'Google' : provider.providerId}
                        </span>
                      ))}
                    </div>
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

          {/* Action Buttons */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex gap-4 justify-center">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Salva</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Annulla</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="btn-primary flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Modifica Profilo</span>
                </button>
              )}
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

export default Profile;

