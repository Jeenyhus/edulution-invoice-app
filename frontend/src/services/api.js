import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://edulution-invoice-backend.onrender.com/api',
  timeout: 10000,
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        error: error.response?.data?.error
      });
      throw error;
    }
  },
  getProfile: () => api.get('/api/users/profile')
};

// Task service
export const taskService = {
  getTasks: () => api.get('/api/tasks'),
  createTask: (taskData) => api.post('/api/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/api/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`)
};

// User service
export const userService = {
  getUsers: () => api.get('/api/users'),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (userData) => api.put('/api/users/profile', userData)
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