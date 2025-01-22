import api, { setAuthToken } from './api';

class UserService {
  constructor() {
    // Set the token when the service is instantiated
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }

  async getProfile() {
    const response = await api.get('/api/users/profile');
    return response.data;
  }

  async getUsers() {
    const response = await api.get('/api/users');
    return response.data;
  }

  async updateUser(id, data) {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  }

  async updateUserStatus(id, disabled) {
    const response = await api.put(`/api/users/${id}/status`, { disabled });
    return response.data;
  }

  async deleteUser(id) {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }
}

export const userService = new UserService();