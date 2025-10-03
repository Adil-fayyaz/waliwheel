// Firebase Authentication Functions
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from './config';

/**
 * Sign in with Google using popup
 * Falls back to redirect if popup is blocked
 */
export const signInWithGoogle = async () => {
  try {
    console.log('🚀 Starting Google Sign In...');
    
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
        return null; // Redirect will handle the rest
      }
      throw popupError;
    }

    return result;
  } catch (error) {
    console.error('❌ Google Sign In Error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('❌ Sign out error:', error);
    throw error;
  }
};

/**
 * Handle redirect result after Google sign in
 */
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('✅ Redirect result:', result);
      return result;
    }
    return null;
  } catch (error) {
    console.error('❌ Error handling redirect result:', error);
    throw error;
  }
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get error message for display
 */
export const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Accesso annullato dall\'utente';
    case 'auth/popup-blocked':
      return 'Popup bloccato dal browser. Prova a disabilitare il blocco popup.';
    case 'auth/unauthorized-domain':
      return `Dominio non autorizzato: ${window.location.hostname}`;
    case 'auth/network-request-failed':
      return 'Errore di rete. Controlla la connessione internet.';
    case 'auth/too-many-requests':
      return 'Troppi tentativi. Riprova più tardi.';
    case 'auth/user-disabled':
      return 'Account disabilitato. Contatta l\'amministratore.';
    case 'auth/operation-not-allowed':
      return 'Operazione non consentita. Controlla la configurazione Firebase.';
    default:
      return `Errore: ${error.message}`;
  }
};

