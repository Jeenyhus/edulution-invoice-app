import api from './api';

class TaskService {
  async getTasks() {
    const response = await api.get('/api/tasks');
    return response.data;
  }

  async createTask(data) {
    const response = await api.post('/api/tasks', data);
    return response.data;
  }

  async updateTask(id, data) {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  }

  async deleteTask(id) {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  }
}

export const taskService = new TaskService();
export default taskService; 