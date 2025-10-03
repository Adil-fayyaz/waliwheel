// Login Page Tests
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login';

// Mock Firebase functions
const mockSignInWithPopup = jest.fn();
const mockSignInWithRedirect = jest.fn();

jest.mock('../firebase', () => ({
  ...jest.requireActual('../firebase'),
  signInWithPopup: mockSignInWithPopup,
  signInWithRedirect: mockSignInWithRedirect,
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

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login page correctly', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Wali Wheels')).toBeInTheDocument();
    expect(screen.getByText('Accedi al tuo account')).toBeInTheDocument();
    expect(screen.getByText('Accedi con Google')).toBeInTheDocument();
    expect(screen.getByText('Benvenuto!')).toBeInTheDocument();
  });

  test('shows Google login button', () => {
    renderWithProviders(<Login />);
    
    const googleButton = screen.getByRole('button', { name: /accedi con google/i });
    expect(googleButton).toBeInTheDocument();
    expect(googleButton).not.toBeDisabled();
  });

  test('shows email and password form', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accedi/i })).toBeInTheDocument();
  });

  test('handles Google login click', async () => {
    mockSignInWithPopup.mockResolvedValue({ user: { uid: '123' } });
    
    renderWithProviders(<Login />);
    
    const googleButton = screen.getByRole('button', { name: /accedi con google/i });
    fireEvent.click(googleButton);
    
    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled();
    });
  });

  test('shows loading state during login', async () => {
    mockSignInWithPopup.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithProviders(<Login />);
    
    const googleButton = screen.getByRole('button', { name: /accedi con google/i });
    fireEvent.click(googleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Accesso in corso...')).toBeInTheDocument();
    });
  });

  test('handles login error', async () => {
    const error = new Error('Login failed');
    error.code = 'auth/popup-blocked';
    mockSignInWithPopup.mockRejectedValue(error);
    
    renderWithProviders(<Login />);
    
    const googleButton = screen.getByRole('button', { name: /accedi con google/i });
    fireEvent.click(googleButton);
    
    await waitFor(() => {
      expect(screen.getByText(/errore/i)).toBeInTheDocument();
    });
  });

  test('shows password visibility toggle', () => {
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('form validation works', () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /accedi/i });
    
    // Try to submit without filling fields
    fireEvent.click(submitButton);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});

