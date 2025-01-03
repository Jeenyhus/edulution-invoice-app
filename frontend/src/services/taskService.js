import axios from 'axios';

const API_URL = '/api';

const taskService = {
  getTasks: async () => {
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
};

export default taskService; 