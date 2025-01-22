import api, { setAuthToken } from './api';

class TaskService {
  constructor() {
    // Set the token when the service is instantiated
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }

  async getTasks() {
    try {
      const response = await api.get('/api/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(data) {
    try {
      const response = await api.post('/api/tasks', data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id, data) {
    try {
      console.log('Sending update request for task:', id);
      console.log('Update data:', data);
      
      const response = await api.put(`/api/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error in taskService.updateTask:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }
  async deleteTask(id) {
    try {
      const response = await api.delete(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
export default taskService;