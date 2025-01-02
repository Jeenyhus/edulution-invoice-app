import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Important: Remove withCredentials if not using cookies
  withCredentials: false
});

// Add a test function to verify connectivity
const testConnection = async () => {
  try {
    const response = await api.get('/test');
    console.log('Server connection test:', response.data);
    return true;
  } catch (error) {
    console.error('Server connection test failed:', error);
    return false;
  }
};

export const taskService = {
  testConnection,
  getTasks: async () => {
    try {
      console.log('Attempting to fetch tasks...');
      const response = await api.get('/tasks');
      console.log('Tasks response:', response.data);
      return response;
    } catch (error) {
      console.error('Error in getTasks:', error);
      throw error;
    }
  },
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

// User service
export const userService = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// Auth service
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout')
};

// Invoice service
export const invoiceService = {
  generateInvoice: (userId, startDate, endDate) => 
    api.get(`/invoices/${userId}`, {
      params: { startDate, endDate },
      responseType: 'blob'
    })
};

export default api;