// Test setup file
import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('./firebase', () => ({
  auth: {
    currentUser: null,
  },
  storage: {},
  googleProvider: {},
  signInWithPopup: jest.fn(),
  signInWithRedirect: jest.fn(),
  getRedirectResult: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateProfile: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  reauthenticateWithPopup: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  EmailAuthProvider: {
    credential: jest.fn(),
  },
  sendPasswordResetEmail: jest.fn(),
  linkWithPopup: jest.fn(),
  unlink: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
  deleteUser: jest.fn(),
  getCurrentUser: jest.fn(),
  getErrorMessage: jest.fn(),
  isFirebaseInitialized: jest.fn(() => true),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/', state: null }),
}));

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_FIREBASE_API_KEY: 'test-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'test-project',
    VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
    VITE_FIREBASE_APP_ID: 'test-app-id',
    DEV: true,
    MODE: 'test'
  }
});

