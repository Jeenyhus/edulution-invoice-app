import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (emailOrToken, password = null) => {
    try {
      let token;
      
      // If password is provided, it's an email/password login
      if (password) {
        const response = await authService.login(emailOrToken, password);
        token = response.token;
      } else {
        // If no password, treat emailOrToken as a token (Google login)
        token = emailOrToken;
      }

      if (!token) {
        throw new Error('No token received');
      }

      // Store token
      localStorage.setItem('token', token);
      
      // Decode and set user
      const decoded = jwtDecode(token);
      setUser(decoded);

      return decoded;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { state: { showLogoutMessage: true } });
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 