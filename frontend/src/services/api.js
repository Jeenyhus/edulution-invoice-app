import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api'
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Task service
export const taskService = {
  getTasks: () => api.get('/tasks'),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

// User service
export const userService = {
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData)
};

// Invoice service
export const invoiceService = {
  generateInvoice: (startDate, endDate) => 
    api.get('/invoices', {
      params: {
        startDate,
        endDate
      },
      responseType: 'blob',
      // Add timeout and error handling
      timeout: 30000, // 30 seconds
      validateStatus: function (status) {
        return status >= 200 && status < 300;
      }
    }).catch(error => {
      console.error('Invoice API Error:', error.response || error);
      throw error;
    })
};

export default api;