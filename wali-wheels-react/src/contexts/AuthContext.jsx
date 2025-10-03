// Advanced Authentication Context
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  linkWithPopup,
  unlink,
  fetchSignInMethodsForEmail,
  deleteUser,
  getCurrentUser,
  getErrorMessage,
  isFirebaseInitialized,
  auth,
  googleProvider
} from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Firebase and auth state
  useEffect(() => {
    if (!isFirebaseInitialized()) {
      setError('Firebase non inizializzato correttamente. Controlla la configurazione.');
      setLoading(false);
      return;
    }

    // Handle redirect result first
    const handleInitialAuth = async () => {
      try {
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult) {
          console.log('✅ Redirect authentication successful');
        }
      } catch (error) {
        console.error('❌ Error handling redirect result:', error);
        setError(getErrorMessage(error));
      }
    };

    handleInitialAuth();

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Auth state changed:', user);
      
      if (user) {
        // User is signed in
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerData: user.providerData,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime
          }
        });
        setError(null);
      } else {
        // User is signed out
        setUser(null);
      }
      
      setLoading(false);
      setIsInitialized(true);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Sign in with Google (popup with redirect fallback)
   */
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      try {
        // Try popup first
        result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Popup sign in successful');
      } catch (popupError) {
        console.log('⚠️ Popup failed, trying redirect:', popupError);
        
        // If popup is blocked, use redirect
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          console.log('🔄 Switching to redirect method...');
          await signInWithRedirect(auth, googleProvider);
          return; // Redirect will handle the rest
        }
        throw popupError;
      }

      if (result) {
        console.log('✅ Login successful');
        // User state will be updated by the auth state listener
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await signOut(auth);
      console.log('✅ Logout successful');
      // User state will be updated by the auth state listener
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateUserProfile = useCallback(async (updates) => {
    try {
      setError(null);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Nessun utente autenticato');
      }

      await updateProfile(currentUser, updates);
      console.log('✅ Profile updated successfully');
      
      // Update local state
      setUser(prev => ({
        ...prev,
        ...updates
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Profile update error:', error);
      setError(getErrorMessage(error));
      return false;
    }
  }, []);

  /**
   * Update email with re-authentication
   */
  const updateUserEmail = useCallback(async (newEmail, password) => {
    try {
      setError(null);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Nessun utente autenticato');
      }

      // Re-authenticate if password provided
      if (password) {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
      } else {
        // Try popup re-authentication
        await reauthenticateWithPopup(currentUser, googleProvider);
      }

      await updateEmail(currentUser, newEmail);
      console.log('✅ Email updated successfully');
      
      // Update local state
      setUser(prev => ({
        ...prev,
        email: newEmail
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Email update error:', error);
      setError(getErrorMessage(error));
      return false;
    }
  }, []);

  /**
   * Update password with re-authentication
   */
  const updateUserPassword = useCallback(async (newPassword, currentPassword) => {
    try {
      setError(null);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Nessun utente autenticato');
      }

      // Re-authenticate
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);
      console.log('✅ Password updated successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Password update error:', error);
      setError(getErrorMessage(error));
      return false;
    }
  }, []);

  /**
   * Send password reset email
   */
  const sendPasswordReset = useCallback(async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
      return true;
    } catch (error) {
      console.error('❌ Password reset error:', error);
      setError(getErrorMessage(error));
      return false;
    }
  }, []);

  /**
   * Link additional provider
   */
  const linkProvider = useCallback(async (provider) => {
    try {
      setError(null);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Nessun utente autenticato');
      }

      const result = await linkWithPopup(currentUser, provider);
      console.log('✅ Provider linked successfully');
      
      // Update local state
      setUser(prev => ({
        ...prev,
        providerData: result.user.providerData
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Provider link error:', error);
      setError(getErrorMessage(error));
      return false;
    }
  }, []);

  /**
   * Unlink provider
   */
  const unlinkProvider = useCallback(async (providerId) => {
    try {
      setError(null);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Nessun utente autenticato');
      }

      await unlink(currentUser, providerId);
      console.log('✅ Provider unlinked successfully');
      
      // Update local state
      setUser(prev => ({
        ...prev,
        providerData: currentUser.providerData
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Provider unlink error:', error);
      setError(getErrorMessage(error));
      return false;
    }
  }, []);

  /**
   * Delete user account
   */
  const deleteUserAccount = useCallback(async (password) => {
    try {
      setError(null);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Nessun utente autenticato');
      }

      // Re-authenticate
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      await deleteUser(currentUser);
      console.log('✅ User account deleted successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Account deletion error:', error);
      setError(getErrorMessage(error));
      return false;
    }
  }, []);

  /**
   * Get sign-in methods for email
   */
  const getSignInMethods = useCallback(async (email) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods;
    } catch (error) {
      console.error('❌ Get sign-in methods error:', error);
      setError(getErrorMessage(error));
      return [];
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Export user data
   */
  const exportUserData = useCallback(() => {
    if (!user) return null;
    
    const exportData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerData: user.providerData.map(provider => ({
        providerId: provider.providerId,
        uid: provider.uid,
        displayName: provider.displayName,
        email: provider.email,
        photoURL: provider.photoURL
      })),
      metadata: user.metadata,
      exportDate: new Date().toISOString()
    };
    
    return exportData;
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    sendPasswordReset,
    linkProvider,
    unlinkProvider,
    deleteUserAccount,
    getSignInMethods,
    clearError,
    exportUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};