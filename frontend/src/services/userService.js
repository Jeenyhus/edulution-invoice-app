import api from './api';

class UserService {
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

  async deleteUser(id) {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }
}

export const userService = new UserService(); 