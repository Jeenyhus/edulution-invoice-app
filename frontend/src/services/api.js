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
  getUsers: async () => {
    const response = await axios.get(`/api/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  createUser: (userData) => api.post('/users', userData),
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  },
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  updateUserStatus: async (userId, disabled) => {
    try {
      const response = await axios.put(`/api/users/${userId}/status`, 
        { disabled },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  }
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

// Add to your existing userService or create a new reportService
export const reportService = {
  getReportData: async (timeRange = 'month') => {
    try {
      const response = await axios.get(`${API_URL}/reports?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  }
};

export default api;