import axios from 'axios';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
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
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getCurrentUser: () => api.get('/api/auth/me')
};

// Task service
export const taskService = {
  getTasks: () => api.get('/api/tasks'),
  createTask: (data) => api.post('/api/tasks', data),
  updateTask: (id, data) => api.put(`/api/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`)
};

// User service
export const userService = {
  getUsers: () => api.get('/api/users'),
  createUser: (data) => api.post('/api/users', data),
  updateUser: (id, data) => api.put(`/api/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/users/${id}`)
};

// Invoice service
export const invoiceService = {
  generateInvoice: (userId, startDate, endDate) => 
    api.get(`/api/invoices/${userId}`, {
      params: { startDate, endDate },
      responseType: 'blob'
    })
};

export default api;