import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://edulution-invoice-app.onrender.com', // Production backend URL as fallback
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout
});

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async googleLogin(token) {
    try {
      const response = await api.post('/api/auth/google', { token });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  }

  logout() {
    localStorage.removeItem('token');
    // Optional: Reset API headers
    delete api.defaults.headers.common['Authorization'];
  }

  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }
}

export const authService = new AuthService();