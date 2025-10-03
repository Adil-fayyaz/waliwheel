// Profile Page Tests
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Profile from '../pages/Profile';

// Mock user data
const mockUser = {
  uid: '123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
  emailVerified: true,
  providerData: [
    { providerId: 'google.com', email: 'test@example.com' }
  ]
};

// Mock Firebase functions
const mockUpdateProfile = jest.fn();
const mockUploadBytes = jest.fn();
const mockGetDownloadURL = jest.fn();

jest.mock('../firebase', () => ({
  ...jest.requireActual('../firebase'),
  updateProfile: mockUpdateProfile,
  uploadBytes: mockUploadBytes,
  getDownloadURL: mockGetDownloadURL,
}));

// Mock AuthContext
const mockAuthContext = {
  user: mockUser,
  updateUserProfile: jest.fn(),
  loading: false,
  error: null,
  clearError: jest.fn(),
};

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }) => children,
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

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile page correctly', () => {
    renderWithProviders(<Profile />);
    
    expect(screen.getByText('Profilo Utente')).toBeInTheDocument();
    expect(screen.getByText('Gestisci le tue informazioni personali')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('shows user information', () => {
    renderWithProviders(<Profile />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('123...')).toBeInTheDocument(); // UID truncated
  });

  test('shows account status', () => {
    renderWithProviders(<Profile />);
    
    expect(screen.getByText('Verificata')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Attivo')).toBeInTheDocument();
  });

  test('enables edit mode when edit button is clicked', () => {
    renderWithProviders(<Profile />);
    
    const editButton = screen.getByText('Modifica Profilo');
    fireEvent.click(editButton);
    
    expect(screen.getByText('Salva')).toBeInTheDocument();
    expect(screen.getByText('Annulla')).toBeInTheDocument();
  });

  test('shows camera and remove buttons in edit mode', () => {
    renderWithProviders(<Profile />);
    
    const editButton = screen.getByText('Modifica Profilo');
    fireEvent.click(editButton);
    
    // Camera button should be present
    const cameraButton = screen.getByRole('button', { name: '' }); // Camera icon
    expect(cameraButton).toBeInTheDocument();
  });

  test('handles profile update', async () => {
    mockAuthContext.updateUserProfile.mockResolvedValue(true);
    
    renderWithProviders(<Profile />);
    
    const editButton = screen.getByText('Modifica Profilo');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Salva');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockAuthContext.updateUserProfile).toHaveBeenCalled();
    });
  });

  test('cancels edit mode', () => {
    renderWithProviders(<Profile />);
    
    const editButton = screen.getByText('Modifica Profilo');
    fireEvent.click(editButton);
    
    const cancelButton = screen.getByText('Annulla');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Modifica Profilo')).toBeInTheDocument();
  });

  test('shows success message after update', async () => {
    mockAuthContext.updateUserProfile.mockResolvedValue(true);
    
    renderWithProviders(<Profile />);
    
    const editButton = screen.getByText('Modifica Profilo');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Salva');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Profilo aggiornato con successo!')).toBeInTheDocument();
    });
  });

  test('shows error message when update fails', async () => {
    mockAuthContext.updateUserProfile.mockResolvedValue(false);
    mockAuthContext.error = 'Update failed';
    
    renderWithProviders(<Profile />);
    
    const editButton = screen.getByText('Modifica Profilo');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Salva');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });

  test('displays user avatar', () => {
    renderWithProviders(<Profile />);
    
    const avatar = screen.getByAltText('Test User');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  test('shows provider information', () => {
    renderWithProviders(<Profile />);
    
    expect(screen.getByText('Google')).toBeInTheDocument();
  });
});

