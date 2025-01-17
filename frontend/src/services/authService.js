import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  }

  async googleLogin(token) {
    try {
      const response = await api.post('/api/auth/google', { token });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 