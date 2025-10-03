// App Component Tests
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import App from '../App';

// Mock Firebase functions
const mockOnAuthStateChanged = jest.fn();

jest.mock('../firebase', () => ({
  ...jest.requireActual('../firebase'),
  onAuthStateChanged: mockOnAuthStateChanged,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading screen initially', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByText('Wali Wheels')).toBeInTheDocument();
    expect(screen.getByText('Caricamento in corso...')).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', async () => {
    // Mock no user
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn(); // unsubscribe function
    });

    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Accedi al tuo account')).toBeInTheDocument();
    });
  });

  test('shows home page when user is authenticated', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      emailVerified: true,
      providerData: []
    };

    // Mock authenticated user
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // unsubscribe function
    });

    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Benvenuto nella tua dashboard')).toBeInTheDocument();
    });
  });

  test('shows navigation when user is authenticated', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      emailVerified: true,
      providerData: []
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Profilo')).toBeInTheDocument();
      expect(screen.getByText('Impostazioni')).toBeInTheDocument();
    });
  });

  test('handles Firebase initialization error', async () => {
    // Mock Firebase not initialized
    jest.doMock('../firebase', () => ({
      ...jest.requireActual('../firebase'),
      isFirebaseInitialized: () => false,
    }));

    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/firebase non inizializzato/i)).toBeInTheDocument();
    });
  });
});

